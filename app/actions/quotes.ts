"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createQuoteSchema, type CreateQuoteInput } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";

export async function getQuotes() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Ajouter contexte Sentry pour traçabilité
  Sentry.setContext("business", {
    businessId: session.user.businessId,
    userId: session.user.id,
  });

  try {
    const quotes = await prisma.quote.findMany({
      where: { businessId: session.user.businessId },
      include: {
        client: true,
        items: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: quotes };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getQuotes", businessId: session.user.businessId },
    });
    console.error("Error fetching quotes:", error);
    return { error: "Erreur lors de la récupération des devis" };
  }
}

export async function getQuote(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Ajouter contexte Sentry pour traçabilité
  Sentry.setContext("business", {
    businessId: session.user.businessId,
    userId: session.user.id,
  });

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
      include: {
        client: true,
        business: true,
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!quote) {
      return { error: "Devis introuvable" };
    }

    return { data: quote };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getQuote", businessId: session.user.businessId },
      extra: { quoteId: id },
    });
    console.error("Error fetching quote:", error);
    return { error: "Erreur lors de la récupération du devis" };
  }
}

async function generateQuoteNumber(businessId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DEVIS-${year}-`;

  // Get the last quote number for this year AND business (properly ordered numerically)
  const lastQuote = await prisma.quote.findFirst({
    where: {
      businessId,
      quoteNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: "desc", // Use createdAt for reliable ordering
    },
    select: {
      quoteNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.quoteNumber.split("-").pop() || "0");
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}

/**
 * Create a quote with retry logic to handle race conditions on quoteNumber generation
 * @param input Quote data
 * @param businessId Business ID from session
 * @param maxRetries Maximum number of retry attempts
 */
async function createQuoteWithRetry(
  input: CreateQuoteInput,
  businessId: string,
  maxRetries = 3
): Promise<any> {
  const { items, ...quoteData } = input;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Generate quote number
      const quoteNumber = await generateQuoteNumber(businessId);

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const total = subtotal - (quoteData.discount || 0);

      // Create quote with items in a transaction
      const quote = await prisma.quote.create({
        data: {
          ...quoteData,
          quoteNumber,
          subtotal,
          total,
          businessId,
          items: {
            create: items.map((item) => ({
              serviceId: item.serviceId,
              name: item.name,
              description: item.description,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
            })),
          },
        },
        include: {
          client: true,
          items: true,
        },
      });

      return quote;
    } catch (error: any) {
      // Si c'est une erreur de contrainte unique ET qu'il reste des tentatives
      if (error.code === "P2002" && attempt < maxRetries) {
        // Attendre un délai aléatoire entre 50-200ms avant de réessayer
        await new Promise((resolve) =>
          setTimeout(resolve, 50 + Math.random() * 150)
        );
        continue;
      }
      // Sinon, propager l'erreur
      throw error;
    }
  }

  throw new Error("Failed to create quote after maximum retries");
}

export async function createQuote(input: CreateQuoteInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Ajouter contexte Sentry pour traçabilité
  Sentry.setContext("business", {
    businessId: session.user.businessId,
    userId: session.user.id,
  });

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createQuoteSchema.safeParse(sanitized);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    // Use retry logic to handle race conditions
    const quote = await createQuoteWithRetry(
      validation.data,
      session.user.businessId
    );

    // Log d'audit pour traçabilité
    await auditLog({
      action: AuditAction.QUOTE_CREATED,
      level: AuditLevel.INFO,
      userId: session.user.id,
      businessId: session.user.businessId,
      resourceId: quote.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return { data: quote };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createQuote", businessId: session.user.businessId },
      extra: { input },
    });
    console.error("Error creating quote:", error);
    return { error: "Erreur lors de la création du devis" };
  }
}

export async function deleteQuote(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    // Récupérer les infos du devis avant suppression pour l'audit
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
      select: { quoteNumber: true, clientId: true, total: true },
    });

    if (!quote) {
      return { error: "Devis introuvable" };
    }

    await prisma.quote.delete({
      where: {
        id,
        businessId: session.user.businessId,
      },
    });

    // Log d'audit critique pour suppression
    await auditLog({
      action: AuditAction.QUOTE_DELETED,
      level: AuditLevel.CRITICAL,
      userId: session.user.id,
      businessId: session.user.businessId,
      resourceId: id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteQuote", businessId: session.user.businessId },
      extra: { quoteId: id },
    });
    console.error("Error deleting quote:", error);
    return { error: "Erreur lors de la suppression du devis" };
  }
}
