"use server";

import prisma from "@/lib/prisma";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { withAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";

/**
 * Escapes CSV field values by wrapping in quotes and escaping internal quotes
 */
function escapeCSVField(field: unknown): string {
  if (field === null || field === undefined) {
    return "";
  }
  const fieldStr = String(field);
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (
    fieldStr.includes(",") ||
    fieldStr.includes('"') ||
    fieldStr.includes("\n")
  ) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }
  return fieldStr;
}

/**
 * Exports all quotes to CSV format for accounting
 * Returns CSV string with all quotes and their line items
 */
export const exportAllQuotes = withAuth(
  async (_input: Record<string, never>, session) => {
    const { businessId, userId } = session;

    // Fetch all quotes with relations for this business only
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

    if (quotes.length === 0) {
      return successResult("");
    }

    // Build CSV with headers
    const csvLines: string[] = [];

    // Add main header row
    csvLines.push(
      [
        "Numéro de Devis",
        "Date de Création",
        "Statut",
        "Client - Prénom",
        "Client - Nom",
        "Client - Email",
        "Client - Téléphone",
        "Sous-total",
        "Réduction",
        "Type Réduction",
        "Total",
        "Date d'Envoi",
        "Valide jusqu'au",
        "Notes",
        "Ligne - Nom du Service",
        "Ligne - Description",
        "Ligne - Prix Unitaire",
        "Ligne - Quantité",
        "Ligne - Total",
      ]
        .map(escapeCSVField)
        .join(",")
    );

    // Add data rows
    quotes.forEach((quote) => {
      if (quote.items.length === 0) {
        // If no items, still add a row for the quote
        csvLines.push(
          [
            escapeCSVField(quote.quoteNumber),
            escapeCSVField(quote.createdAt.toLocaleDateString("fr-FR")),
            escapeCSVField(quote.status),
            escapeCSVField(quote.client?.firstName || ""),
            escapeCSVField(quote.client?.lastName || ""),
            escapeCSVField(quote.client?.email || ""),
            escapeCSVField(quote.client?.phone || ""),
            escapeCSVField(quote.subtotal.toFixed(2)),
            escapeCSVField(quote.discount.toFixed(2)),
            escapeCSVField(quote.discountType),
            escapeCSVField(quote.total.toFixed(2)),
            escapeCSVField(
              quote.sentAt ? quote.sentAt.toLocaleDateString("fr-FR") : ""
            ),
            escapeCSVField(
              quote.validUntil
                ? quote.validUntil.toLocaleDateString("fr-FR")
                : ""
            ),
            escapeCSVField(quote.notes || ""),
            "", // Line item fields empty
            "",
            "",
            "",
            "",
          ].join(",")
        );
      } else {
        // Add a row for each item in the quote
        quote.items.forEach((item, index) => {
          csvLines.push(
            [
              escapeCSVField(index === 0 ? quote.quoteNumber : ""),
              escapeCSVField(
                index === 0 ? quote.createdAt.toLocaleDateString("fr-FR") : ""
              ),
              escapeCSVField(index === 0 ? quote.status : ""),
              escapeCSVField(
                index === 0 ? quote.client?.firstName || "" : ""
              ),
              escapeCSVField(index === 0 ? quote.client?.lastName || "" : ""),
              escapeCSVField(index === 0 ? quote.client?.email || "" : ""),
              escapeCSVField(index === 0 ? quote.client?.phone || "" : ""),
              escapeCSVField(
                index === 0 ? quote.subtotal.toFixed(2) : ""
              ),
              escapeCSVField(index === 0 ? quote.discount.toFixed(2) : ""),
              escapeCSVField(index === 0 ? quote.discountType : ""),
              escapeCSVField(index === 0 ? quote.total.toFixed(2) : ""),
              escapeCSVField(
                index === 0
                  ? quote.sentAt
                    ? quote.sentAt.toLocaleDateString("fr-FR")
                    : ""
                  : ""
              ),
              escapeCSVField(
                index === 0
                  ? quote.validUntil
                    ? quote.validUntil.toLocaleDateString("fr-FR")
                    : ""
                  : ""
              ),
              escapeCSVField(index === 0 ? quote.notes || "" : ""),
              escapeCSVField(item.name),
              escapeCSVField(item.description || ""),
              escapeCSVField(item.price.toFixed(2)),
              escapeCSVField(item.quantity),
              escapeCSVField(item.total.toFixed(2)),
            ].join(",")
          );
        });
      }
    });

    const csvContent = csvLines.join("\n");

    // Log audit trail for export
    await auditLog({
      action: AuditAction.QUOTE_EXPORTED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceType: "Quote",
      metadata: {
        quoteCount: quotes.length,
        totalLineItems: quotes.reduce((sum, q) => sum + q.items.length, 0),
        exportFormat: "CSV",
      },
    });

    return successResult(csvContent);
  },
  "exportAllQuotes"
);
