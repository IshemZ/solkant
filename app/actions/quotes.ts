"use server";

import prisma from "@/lib/prisma";
import { createQuoteSchema, type CreateQuoteInput } from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import type { Quote, QuoteItem, Service, Client, Business } from "@prisma/client";

// Types pour les quotes avec relations
type QuoteWithRelations = Quote & {
  client: Client | null;
  items: (QuoteItem & { service: Service | null })[];
};

type QuoteWithFullRelations = Quote & {
  client: Client | null;
  business: Business;
  items: (QuoteItem & { service: Service | null })[];
};

export async function getQuotes(): Promise<ActionResult<QuoteWithRelations[]>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const quotes = await prisma.quote.findMany({
      where: { businessId },
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

    return successResult(quotes);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getQuotes", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching quotes:", error);
    }

    return errorResult("Erreur lors de la récupération des devis");
  }
}

export async function getQuote(id: string): Promise<ActionResult<QuoteWithFullRelations>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId,
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
      return errorResult("Devis introuvable", "NOT_FOUND");
    }

    return successResult(quote);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getQuote", businessId },
      extra: { quoteId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching quote:", error);
    }

    return errorResult("Erreur lors de la récupération du devis");
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

export async function createQuote(input: CreateQuoteInput): Promise<ActionResult<QuoteWithRelations>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createQuoteSchema.safeParse(sanitized);
  if (!validation.success) {
    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    // Use retry logic to handle race conditions
    const quote = await createQuoteWithRetry(validation.data, businessId);

    // Log d'audit pour traçabilité
    await auditLog({
      action: AuditAction.QUOTE_CREATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: quote.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(quote);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createQuote", businessId },
      extra: { input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error creating quote:", error);
    }

    return errorResult("Erreur lors de la création du devis");
  }
}

export async function deleteQuote(id: string): Promise<ActionResult<void>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  try {
    // Récupérer les infos du devis avant suppression pour l'audit
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId,
      },
      select: { quoteNumber: true, clientId: true, total: true },
    });

    if (!quote) {
      return errorResult("Devis introuvable", "NOT_FOUND");
    }

    await prisma.quote.delete({
      where: {
        id,
        businessId,
      },
    });

    // Log d'audit critique pour suppression
    await auditLog({
      action: AuditAction.QUOTE_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(undefined);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteQuote", businessId },
      extra: { quoteId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting quote:", error);
    }

    return errorResult("Erreur lors de la suppression du devis");
  }
}

/**
 * Envoie un devis par email au client
 * Met à jour le statut à SENT et enregistre la date d'envoi
 */
export async function sendQuote(id: string): Promise<ActionResult<Quote & { client: Client | null; items: QuoteItem[] }>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { userId, businessId } = validatedSession;

  try {
    // Récupérer le devis complet avec toutes les relations
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId,
      },
      include: {
        client: true,
        items: {
          include: {
            service: true,
          },
        },
        business: true,
      },
    });

    if (!quote) {
      return errorResult("Devis introuvable", "NOT_FOUND");
    }

    if (!quote.client?.email) {
      return errorResult("Le client n'a pas d'adresse email", "INVALID_CLIENT");
    }

    // Vérifier que Resend est configuré
    const { resend, isResendConfigured } = await import("@/lib/resend");
    if (!isResendConfigured() || !resend) {
      // Fallback en développement : simuler l'envoi
      if (process.env.NODE_ENV === "development") {
        console.log("\n📧 [SIMULATION] Envoi email devis:");
        console.log(`   → À: ${quote.client.email}`);
        console.log(`   → Devis: ${quote.quoteNumber}`);
        console.log(`   → Client: ${quote.client.firstName} ${quote.client.lastName}`);
        console.log(`   → Total: ${quote.total.toFixed(2)} €\n`);

        // Mettre à jour le devis même en mode simulation
        await prisma.quote.update({
          where: { id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        });

        await auditLog({
          action: AuditAction.QUOTE_SENT,
          level: AuditLevel.INFO,
          userId,
          businessId,
          resourceId: id,
          resourceType: "Quote",
          metadata: {
            quoteNumber: quote.quoteNumber,
            clientEmail: quote.client.email,
            simulation: true,
          },
        });

        revalidatePath("/dashboard/devis");
        // Retourner le quote avec les relations mis à jour
        return successResult({
          ...quote,
          status: "SENT" as const,
          sentAt: new Date(),
        });
      }

      return errorResult(
        "Service d'envoi d'emails non configuré. Veuillez ajouter RESEND_API_KEY dans .env",
        "EMAIL_NOT_CONFIGURED"
      );
    }

    // Générer le contenu de l'email
    const {
      generateQuoteEmail,
      generateQuoteEmailSubject,
    } = await import("@/lib/emails/quote-email");

    const emailHtml = generateQuoteEmail({
      quoteNumber: quote.quoteNumber,
      businessName: quote.business.name,
      businessEmail: quote.business.email || "",
      businessPhone: quote.business.phone || "",
      businessAddress: quote.business.address || "",
      clientName: `${quote.client.firstName} ${quote.client.lastName}`,
      validUntil: quote.validUntil
        ? new Date(quote.validUntil).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Non spécifié",
      items: quote.items.map((item) => ({
        name: item.name,
        description: item.description || undefined,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: quote.subtotal,
      discount: quote.discount,
      total: quote.total,
      notes: quote.notes || undefined,
    });

    const subject = generateQuoteEmailSubject(
      quote.quoteNumber,
      quote.business.name
    );

    // Envoyer l'email via Resend
    const { EMAIL_CONFIG } = await import("@/lib/resend");
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: quote.client.email,
      subject,
      html: emailHtml,
    });

    if (emailError) {
      Sentry.captureException(emailError, {
        tags: { action: "sendQuote", businessId },
        extra: { quoteId: id, clientEmail: quote.client.email },
      });

      return errorResult(
        "Erreur lors de l'envoi de l'email. Veuillez réessayer.",
        "EMAIL_SEND_ERROR"
      );
    }

    // Mettre à jour le devis avec le statut SENT et la date d'envoi
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
      include: {
        client: true,
        items: true,
      },
    });

    // Log d'audit pour traçabilité
    await auditLog({
      action: AuditAction.QUOTE_SENT,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientEmail: quote.client.email,
        emailId: emailData?.id,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(updatedQuote);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "sendQuote", businessId },
      extra: { quoteId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error sending quote:", error);
    }

    return errorResult("Erreur lors de l'envoi du devis");
  }
}
