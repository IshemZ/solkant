"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteQuote } from "@/app/actions/quotes";
import type { Quote, Client, QuoteItem, Service } from "@prisma/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { QuoteStatusBadge } from "./QuoteStatusBadge";

interface QuoteWithRelations extends Quote {
  client: Client | null;
  items: (QuoteItem & { service: Service | null })[];
}

interface QuotesListProps {
  initialQuotes: QuoteWithRelations[];
}

export default function QuotesList({ initialQuotes }: QuotesListProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  function openDeleteDialog(id: string) {
    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!quoteToDelete) return;

    const result = await deleteQuote(quoteToDelete);
    if (result.success) {
      setQuotes(quotes.filter((q) => q.id !== quoteToDelete));
      toast.success("Devis supprimé avec succès");
    } else {
      toast.error("Erreur lors de la suppression du devis");
    }
    setQuoteToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/dashboard/devis/nouveau"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouveau devis
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun devis"
          description="Créez votre premier devis pour vos clients."
          actionLabel="Créer un devis"
          actionHref="/dashboard/devis/nouveau"
        />
      ) : (
        <div className="rounded-lg border border-foreground/10 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-foreground/10 bg-foreground/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-foreground/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/dashboard/devis/${quote.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {quote.quoteNumber}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                      {quote.client
                        ? `${quote.client.firstName} ${quote.client.lastName}`
                        : "Client supprimé"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(quote.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <QuoteStatusBadge status={quote.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-foreground">
                      {quote.total.toFixed(2)} €
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-3">
                        {quote.status === "DRAFT" ? (
                          <>
                            <Link
                              href={`/dashboard/devis/${quote.id}/modifier`}
                              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                            >
                              Modifier
                            </Link>
                            <Link
                              href={`/dashboard/devis/${quote.id}`}
                              className="rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/20 transition-colors"
                            >
                              Voir
                            </Link>
                            <button
                              onClick={() => openDeleteDialog(quote.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Supprimer
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/dashboard/devis/${quote.id}`}
                            className="rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/20 transition-colors"
                          >
                            Voir le détail
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Supprimer le devis"
        description="Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
