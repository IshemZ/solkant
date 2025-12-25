"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import type {
  Quote,
  Client,
  Business,
  QuoteItem,
  Service,
} from "@prisma/client";
import { formatDate } from "@/lib/date-utils";
import { deleteQuote } from "@/app/actions/quotes";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface QuoteWithRelations extends Quote {
  client: Client | null;
  business: Business;
  items: (QuoteItem & { service: Service | null })[];
}

interface QuoteViewProps {
  quote: QuoteWithRelations;
}

export default function QuoteView({ quote }: QuoteViewProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function handleDownloadPDF() {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      // Extraire le nom du fichier depuis le header Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${quote.quoteNumber}.pdf`; // Fallback par défaut

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
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
    if (!quote.client || !quote.client.email) {
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

  async function handleDelete() {
    const result = await deleteQuote(quote.id);
    if (result.success) {
      toast.success("Devis supprimé avec succès");
      router.push("/dashboard/devis");
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
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
              className="text-muted-foreground hover:text-foreground"
            >
              ← Retour
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              {quote.quoteNumber}
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Créé le {formatDate(quote.createdAt)}
          </p>
        </div>

        <div className="flex gap-3">
          {quote.status === "DRAFT" ? (
            <>
              {/* Action principale: Modifier */}
              <Link
                href={`/dashboard/devis/${quote.id}/modifier`}
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </Link>

              {/* Action destructive: Supprimer */}
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>

              {/* Action secondaire: Télécharger PDF */}
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Génération..." : "Télécharger PDF"}
              </button>
            </>
          ) : (
            <>
              {/* Action principale: Télécharger PDF */}
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Génération..." : "Télécharger PDF"}
              </button>

              {/* Action secondaire: Envoyer à nouveau */}
              <button
                onClick={handleSendEmail}
                disabled={isSending || !quote.client || !quote.client.email}
                className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !quote.client || !quote.client.email
                    ? "Le client n'a pas d'email"
                    : "Envoyer par email"
                }
              >
                <Mail className="h-4 w-4" />
                {isSending ? "Envoi..." : "Envoyer à nouveau"}
              </button>
            </>
          )}
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
              {quote.client ? (
                <>
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
                </>
              ) : (
                <p className="text-sm italic text-gray-500">Client supprimé</p>
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer le devis"
        description="Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
