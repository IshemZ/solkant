"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import type { SerializedQuoteWithFullRelations } from "@/types/quote";
import { formatDate } from "@/lib/date-utils";
import { deleteQuote } from "@/app/actions/quotes";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import QuotePreview from "./QuotePreview";

interface QuoteViewProps {
  quote: SerializedQuoteWithFullRelations;
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
    const result = await deleteQuote({ id: quote.id });
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

      {/* Quote preview - WYSIWYG matching PDF structure */}
      <QuotePreview quote={quote} />

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
