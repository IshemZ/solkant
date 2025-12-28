"use server";

import prisma from "@/lib/prisma";
import {
  createQuoteSchema,
  updateQuoteSchema,
  type CreateQuoteInput,
  type UpdateQuoteInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import type { Quote, QuoteItem, Service, Client } from "@prisma/client";
import { formatAddress } from "@/lib/utils";
import { z } from "zod";
import { BusinessError } from "@/lib/errors";

// Types pour les quotes avec relations
type QuoteWithRelations = Quote & {
  client: Client | null;
  items: (QuoteItem & { service: Service | null })[];
};

/**
 * Récupère tous les devis du business
 */
export const getQuotes = withAuth(
  async (_input: Record<string, never>, session) => {
    const quotes = await prisma.quote.findMany({
      where: { businessId: session.businessId },
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

    return quotes;
  },
  "getQuotes"
);

/**
 * Récupère un devis spécifique par ID
 */
export const getQuote = withAuthAndValidation(
  async (input: { id: string }, session) => {
    const quote = await prisma.quote.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
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
      throw new BusinessError("Devis introuvable");
    }

    return quote;
  },
  "getQuote",
  z.object({ id: z.string() })
);

/**
 * Génère un numéro de devis unique pour le business
 */
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
 */
async function createQuoteWithRetry(
  input: CreateQuoteInput,
  businessId: string,
  maxRetries = 3
): Promise<QuoteWithRelations> {
  const { items, ...quoteData } = input;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Generate quote number
      const quoteNumber = await generateQuoteNumber(businessId);

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);

      // Calculate discount amount based on type
      const discountType = quoteData.discountType || "FIXED";
      const discountValue = quoteData.discount || 0;
      const discountAmount =
        discountType === "PERCENTAGE"
          ? subtotal * (discountValue / 100)
          : discountValue;

      const total = subtotal - discountAmount;

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
          items: {
            include: {
              service: true,
            },
          },
        },
      });

      return quote;
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      // Si c'est une erreur de contrainte unique ET qu'il reste des tentatives
      if (prismaError.code === "P2002" && attempt < maxRetries) {
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

  throw new BusinessError("Failed to create quote after maximum retries");
}

/**
 * Crée un nouveau devis
 */
export const createQuote = withAuthAndValidation(
  async (input: CreateQuoteInput, session) => {
    const { businessId, userId } = session;

    // Use retry logic to handle race conditions
    const quote = await createQuoteWithRetry(input, businessId);

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
    return quote;
  },
  "createQuote",
  createQuoteSchema
);

/**
 * Supprime un devis
 */
export const deleteQuote = withAuth(
  async (input: { id: string }, session) => {
    const { businessId, userId } = session;

    // Récupérer les infos du devis avant suppression pour l'audit
    const quote = await prisma.quote.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      select: { quoteNumber: true, clientId: true, total: true },
    });

    if (!quote) {
      throw new BusinessError("Devis introuvable");
    }

    await prisma.quote.delete({
      where: {
        id: input.id,
        businessId,
      },
    });

    // Log d'audit critique pour suppression
    await auditLog({
      action: AuditAction.QUOTE_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: input.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
  },
  "deleteQuote",
  { logSuccess: true }
);

/**
 * Met à jour un devis existant
 * IMPORTANT : Seuls les devis avec le statut DRAFT peuvent être modifiés
 */
export const updateQuote = withAuthAndValidation(
  async (input: { id: string } & UpdateQuoteInput, session) => {
    const { id, items, ...quoteData } = input;
    const { businessId, userId } = session;

    // Vérifier que le devis existe et est en statut DRAFT
    const existingQuote = await prisma.quote.findFirst({
      where: {
        id,
        businessId,
      },
      select: {
        status: true,
        quoteNumber: true,
        discount: true,
        discountType: true,
      },
    });

    if (!existingQuote) {
      throw new BusinessError("Devis introuvable");
    }

    if (existingQuote.status !== "DRAFT") {
      throw new BusinessError("Impossible de modifier un devis déjà envoyé");
    }

    // Si des items sont fournis, calculer les nouveaux totaux
    let subtotal: number | undefined;
    let total: number | undefined;

    if (items && items.length > 0) {
      subtotal = items.reduce((sum, item) => sum + item.total, 0);

      // Calculate discount amount based on type
      const discountType = quoteData.discountType || existingQuote.discountType;
      const discountValue =
        quoteData.discount !== undefined
          ? quoteData.discount
          : existingQuote.discount;
      const discountAmount =
        discountType === "PERCENTAGE"
          ? subtotal * (discountValue / 100)
          : discountValue;

      total = subtotal - discountAmount;
    }

    // Mettre à jour le devis dans une transaction
    const updatedQuote = await prisma.$transaction(async (tx) => {
      // Si des items sont fournis, supprimer les anciens et créer les nouveaux
      if (items && items.length > 0) {
        await tx.quoteItem.deleteMany({
          where: { quoteId: id },
        });
      }

      // Mettre à jour le devis
      const quote = await tx.quote.update({
        where: {
          id,
          businessId,
        },
        data: {
          ...quoteData,
          ...(subtotal !== undefined && { subtotal }),
          ...(total !== undefined && { total }),
          ...(items &&
            items.length > 0 && {
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
            }),
        },
        include: {
          client: true,
          items: {
            include: {
              service: true,
            },
          },
        },
      });

      return quote;
    });

    // Log d'audit
    await auditLog({
      action: AuditAction.QUOTE_UPDATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: existingQuote.quoteNumber,
        changes: Object.keys(quoteData),
      },
    });

    revalidatePath("/dashboard/devis");
    revalidatePath(`/dashboard/devis/${id}`);

    return updatedQuote;
  },
  "updateQuote",
  z.object({ id: z.string() }).and(updateQuoteSchema)
);

/**
 * Envoie un devis par email au client
 * Met à jour le statut à SENT et enregistre la date d'envoi
 */
export const sendQuote = withAuth(
  async (input: { id: string }, session) => {
    const { userId, businessId } = session;

    // Récupérer le devis complet avec toutes les relations
    const quote = await prisma.quote.findFirst({
      where: {
        id: input.id,
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
      throw new BusinessError("Devis introuvable");
    }

    if (!quote.client?.email) {
      throw new BusinessError("Le client n'a pas d'adresse email");
    }

    // Vérifier que Resend est configuré
    const { resend, isResendConfigured } = await import("@/lib/resend");
    if (!isResendConfigured() || !resend) {
      // Fallback en développement : simuler l'envoi
      if (process.env.NODE_ENV === "development") {
        console.log("\n📧 [SIMULATION] Envoi email devis:");
        console.log(`   → À: ${quote.client.email}`);
        console.log(`   → Devis: ${quote.quoteNumber}`);
        console.log(
          `   → Client: ${quote.client.firstName} ${quote.client.lastName}`
        );
        console.log(`   → Total: ${quote.total.toFixed(2)} €\n`);

        // Mettre à jour le devis même en mode simulation
        const updatedQuote = await prisma.quote.update({
          where: { id: input.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
          include: {
            client: true,
            items: true,
          },
        });

        await auditLog({
          action: AuditAction.QUOTE_SENT,
          level: AuditLevel.INFO,
          userId,
          businessId,
          resourceId: input.id,
          resourceType: "Quote",
          metadata: {
            quoteNumber: quote.quoteNumber,
            clientEmail: quote.client.email,
            simulation: true,
          },
        });

        revalidatePath("/dashboard/devis");
        return updatedQuote;
      }

      throw new BusinessError(
        "Service d'envoi d'emails non configuré. Veuillez ajouter RESEND_API_KEY dans .env"
      );
    }

    // Générer le contenu de l'email
    const { generateQuoteEmail, generateQuoteEmailSubject } = await import(
      "@/lib/emails/quote-email"
    );

    const emailHtml = generateQuoteEmail({
      quoteNumber: quote.quoteNumber,
      businessName: quote.business.name,
      businessEmail: quote.business.email || "",
      businessPhone: quote.business.phone || "",
      businessAddress: formatAddress(quote.business),
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
        extra: { quoteId: input.id, clientEmail: quote.client.email },
      });

      throw new BusinessError(
        "Erreur lors de l'envoi de l'email. Veuillez réessayer."
      );
    }

    // Mettre à jour le devis avec le statut SENT et la date d'envoi
    const updatedQuote = await prisma.quote.update({
      where: { id: input.id },
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
      resourceId: input.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientEmail: quote.client.email,
        emailId: emailData?.id,
      },
    });

    revalidatePath("/dashboard/devis");
    return updatedQuote;
  },
  "sendQuote",
  { logSuccess: true }
);
