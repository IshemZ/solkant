"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  Quote,
  Client,
  Business,
  QuoteItem,
  Service,
} from "@prisma/client";
import { formatDate } from "@/lib/date-utils";

interface QuoteWithRelations extends Quote {
  client: Client;
  business: Business;
  items: (QuoteItem & { service: Service | null })[];
}

interface QuoteViewProps {
  quote: QuoteWithRelations;
}

export default function QuoteView({ quote }: QuoteViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleDownloadPDF() {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quote.quoteNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSendEmail() {
    if (!quote.client.email) {
      alert("Le client n'a pas d'adresse email");
      return;
    }

    if (!confirm(`Envoyer le devis à ${quote.client.email} ?`)) {
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/send-email`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      alert(`✅ ${data.message}`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/devis"
              className="text-foreground/60 hover:text-foreground"
            >
              ← Retour
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              {quote.quoteNumber}
            </h1>
          </div>
          <p className="mt-2 text-sm text-foreground/60">
            Créé le {formatDate(quote.createdAt)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSendEmail}
            disabled={isSending || !quote.client.email}
            className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !quote.client.email
                ? "Le client n'a pas d'email"
                : "Envoyer par email"
            }
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {isSending ? "Envoi..." : "Envoyer par email"}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isGenerating ? "Génération..." : "Télécharger PDF"}
          </button>
        </div>
      </div>

      {/* Quote preview */}
      <div className="rounded-lg border border-foreground/10 bg-white p-8 shadow-sm">
        {/* Business and client info */}
        <div className="mb-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
              De
            </h2>
            <div className="text-gray-900">
              <p className="font-bold">{quote.business.name}</p>
              {quote.business.address && (
                <p className="text-sm">{quote.business.address}</p>
              )}
              {quote.business.phone && (
                <p className="text-sm">{quote.business.phone}</p>
              )}
              {quote.business.email && (
                <p className="text-sm">{quote.business.email}</p>
              )}
              {quote.business.siret && (
                <p className="mt-2 text-xs text-gray-500">
                  SIRET: {quote.business.siret}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
              Pour
            </h2>
            <div className="text-gray-900">
              <p className="font-bold">
                {quote.client.firstName} {quote.client.lastName}
              </p>
              {quote.client.address && (
                <p className="text-sm">{quote.client.address}</p>
              )}
              {quote.client.phone && (
                <p className="text-sm">{quote.client.phone}</p>
              )}
              {quote.client.email && (
                <p className="text-sm">{quote.client.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="pb-2 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                  Prix unitaire
                </th>
                <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                  Quantité
                </th>
                <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right text-gray-900">
                    {item.price.toFixed(2)} €
                  </td>
                  <td className="py-3 text-right text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {item.total.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium text-gray-900">
                {quote.subtotal.toFixed(2)} €
              </span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remise</span>
                <span className="font-medium text-red-600">
                  -{quote.discount.toFixed(2)} €
                </span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-gray-300 pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {quote.total.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Notes and validity */}
        <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
          {quote.validUntil && (
            <p className="text-sm text-gray-600">
              Devis valable jusqu&apos;au {formatDate(quote.validUntil)}
            </p>
          )}
          {quote.notes && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Notes</p>
              <p className="mt-1 text-sm text-gray-600">{quote.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
