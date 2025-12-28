"use server";

import prisma from "@/lib/prisma";
import {
  createQuoteSchema,
  updateQuoteSchema,
  type CreateQuoteInput,
  type UpdateQuoteInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import type { Quote, QuoteItem, Service, Client, Business } from "@prisma/client";
import { formatAddress } from "@/lib/utils";
import { Decimal } from '@prisma/client/runtime/library';
import {
  toDecimal,
  calculateDiscount,
  serializeDecimalFields
} from '@/lib/decimal-utils';
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { BusinessError } from "@/lib/errors";
import { z } from "zod";

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

export const getQuotes = withAuth(
  async (_input: void, session): Promise<ActionResult<import('@/types/quote').SerializedQuoteWithRelations[]>> => {
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

    const serialized = serializeDecimalFields(quotes);
    return successResult(serialized as unknown as import('@/types/quote').SerializedQuoteWithRelations[]);
  },
  "getQuotes"
);

export const getQuote = withAuth(
  async (input: { id: string }, session): Promise<ActionResult<QuoteWithFullRelations>> => {
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

    return successResult(serializeDecimalFields(quote));
  },
  "getQuote"
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

      // Calculate totals with Decimal precision
      const subtotal = items.reduce(
        (sum, item) => sum.add(toDecimal(item.total)),
        new Decimal(0)
      );

      // Calculate total package discounts
      const packageDiscountsTotal = items.reduce(
        (sum, item) => sum.add(toDecimal(item.packageDiscount || 0)),
        new Decimal(0)
      );

      // Calculate subtotal after package discounts
      const subtotalAfterPackageDiscounts = subtotal.minus(packageDiscountsTotal);

      // Calculate discount amount based on type (applied on subtotal AFTER package discounts)
      const discountType = quoteData.discountType || 'FIXED';
      const discountValue = quoteData.discount || 0;

      const discountAmount = calculateDiscount(
        subtotalAfterPackageDiscounts,
        discountType,
        discountValue
      );

      const total = subtotalAfterPackageDiscounts.minus(discountAmount);

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
              packageId: item.packageId,
              name: item.name,
              description: item.description,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
              packageDiscount: item.packageDiscount || 0,
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

export const createQuote = withAuthAndValidation(
  async (input: CreateQuoteInput, session): Promise<ActionResult<QuoteWithRelations>> => {
    // Sanitize input
    const sanitized = sanitizeObject(input);

    // Use retry logic to handle race conditions
    const quote = await createQuoteWithRetry(sanitized, session.businessId);

    // Log d'audit pour traçabilité
    await auditLog({
      action: AuditAction.QUOTE_CREATED,
      level: AuditLevel.INFO,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: quote.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(serializeDecimalFields(quote));
  },
  "createQuote",
  createQuoteSchema
);

export const deleteQuote = withAuth(
  async (input: { id: string }, session): Promise<ActionResult<void>> => {
    // Récupérer les infos du devis avant suppression pour l'audit
    const quote = await prisma.quote.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      select: { quoteNumber: true, clientId: true, total: true },
    });

    if (!quote) {
      throw new BusinessError("Devis introuvable");
    }

    await prisma.quote.delete({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
    });

    // Log d'audit critique pour suppression
    await auditLog({
      action: AuditAction.QUOTE_DELETED,
      level: AuditLevel.CRITICAL,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: input.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientId: quote.clientId,
        total: quote.total,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(undefined);
  },
  "deleteQuote"
);

/**
 * Met à jour un devis existant
 * IMPORTANT : Seuls les devis avec le statut DRAFT peuvent être modifiés
 */
const updateQuoteWithIdSchema = z.intersection(
  updateQuoteSchema,
  z.object({ id: z.string().min(1) })
);

export const updateQuote = withAuthAndValidation(
  async (input: UpdateQuoteInput & { id: string }, session): Promise<ActionResult<QuoteWithRelations>> => {
    // Sanitize input
    const sanitized = sanitizeObject(input);

    // Vérifier que le devis existe et est en statut DRAFT
    const existingQuote = await prisma.quote.findFirst({
      where: {
        id: sanitized.id,
        businessId: session.businessId,
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

    const { id, items, ...quoteData } = sanitized;

    // Si des items sont fournis, calculer les nouveaux totaux
    let subtotal: Decimal | undefined;
    let total: Decimal | undefined;

    if (items && items.length > 0) {
      subtotal = items.reduce(
        (sum, item) => sum.add(toDecimal(item.total)),
        new Decimal(0)
      );

      // Calculate total package discounts
      const packageDiscountsTotal = items.reduce(
        (sum, item) => sum.add(toDecimal(item.packageDiscount || 0)),
        new Decimal(0)
      );

      // Calculate subtotal after package discounts
      const subtotalAfterPackageDiscounts = subtotal.minus(packageDiscountsTotal);

      // Calculate discount amount based on type (applied on subtotal AFTER package discounts)
      // Use existing values as fallback if not provided in update
      const discountType = quoteData.discountType || existingQuote.discountType;
      const discountValue = quoteData.discount !== undefined
        ? quoteData.discount
        : existingQuote.discount;

      const discountAmount = calculateDiscount(
        subtotalAfterPackageDiscounts,
        discountType,
        discountValue
      );

      total = subtotalAfterPackageDiscounts.minus(discountAmount);
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
          businessId: session.businessId,
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
                  packageId: item.packageId,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  quantity: item.quantity,
                  total: item.total,
                  packageDiscount: item.packageDiscount || 0,
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
      userId: session.userId,
      businessId: session.businessId,
      resourceId: id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: existingQuote.quoteNumber,
        changes: Object.keys(quoteData),
      },
    });

    revalidatePath("/dashboard/devis");
    revalidatePath(`/dashboard/devis/${id}`);

    return successResult(serializeDecimalFields(updatedQuote));
  },
  "updateQuote",
  updateQuoteWithIdSchema
);

/**
 * Envoie un devis par email au client
 * Met à jour le statut à SENT et enregistre la date d'envoi
 */
export const sendQuote = withAuth(
  async (input: { id: string }, session): Promise<ActionResult<Quote & { client: Client | null; items: QuoteItem[] }>> => {
    // Import Sentry for email-specific error handling
    const Sentry = await import("@sentry/nextjs");

    // Récupérer le devis complet avec toutes les relations
    const quote = await prisma.quote.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
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
        console.log(`   → Client: ${quote.client.firstName} ${quote.client.lastName}`);
        console.log(`   → Total: ${Number(quote.total).toFixed(2)} €\n`);

        // Mettre à jour le devis même en mode simulation
        await prisma.quote.update({
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
          userId: session.userId,
          businessId: session.businessId,
          resourceId: input.id,
          resourceType: "Quote",
          metadata: {
            quoteNumber: quote.quoteNumber,
            clientEmail: quote.client.email,
            simulation: true,
          },
        });

        revalidatePath("/dashboard/devis");
        // Retourner le quote avec les relations mis à jour
        return successResult(serializeDecimalFields({
          ...quote,
          status: "SENT" as const,
          sentAt: new Date(),
        }));
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
        price: item.price as any,
        total: item.total as any,
      })),
      subtotal: quote.subtotal as any,
      discount: quote.discount as any,
      total: quote.total as any,
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
        tags: { action: "sendQuote", businessId: session.businessId },
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
      userId: session.userId,
      businessId: session.businessId,
      resourceId: input.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: quote.quoteNumber,
        clientEmail: quote.client.email,
        emailId: emailData?.id,
      },
    });

    revalidatePath("/dashboard/devis");
    return successResult(serializeDecimalFields(updatedQuote));
  },
  "sendQuote"
);
