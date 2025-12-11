"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient, deleteClient } from "@/app/actions/clients";
import type { Client } from "@prisma/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface ClientsListProps {
  initialClients: Client[];
}

export default function ClientsList({ initialClients }: ClientsListProps) {
  const [clients, setClients] = useState(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      notes: formData.get("notes") as string,
    };

    const result = await createClient(data);

    if (result.error) {
      setError(result.error);
      toast.error("Erreur lors de la création du client");
    } else if ("data" in result) {
      setClients([result.data, ...clients]);
      setShowForm(false);
      e.currentTarget.reset();
      toast.success(
        `Client ${result.data.firstName} ${result.data.lastName} créé avec succès`
      );
    }

    setIsLoading(false);
  }

  function openDeleteDialog(id: string) {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!clientToDelete) return;

    const result = await deleteClient(clientToDelete);
    if (result.success) {
      setClients(clients.filter((c) => c.id !== clientToDelete));
      toast.success("Client supprimé avec succès");
    } else {
      toast.error("Erreur lors de la suppression du client");
    }
    setClientToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
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
          {showForm ? "Annuler" : "Nouveau client"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-foreground/10 bg-background p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Nouveau client
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground"
              >
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground"
              >
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground"
              >
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground"
            >
              Adresse
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-foreground"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isLoading ? "Création..." : "Créer le client"}
            </button>
          </div>
        </form>
      )}

      {clients.length === 0 && !showForm ? (
        <EmptyState
          icon={Users}
          title="Aucun client"
          description="Créez votre premier client pour commencer à générer des devis."
          actionLabel="Créer un client"
          actionHref="/dashboard/clients/nouveau"
        />
      ) : (
        <div className="rounded-lg border border-foreground/10 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-foreground/10 bg-foreground/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-foreground/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-foreground">
                        {client.firstName} {client.lastName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">
                      {client.email || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">
                      {client.phone || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/dashboard/clients/${client.id}/edit`}
                          className="text-primary hover:text-primary/80"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(client.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
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
        title="Supprimer le client"
        description="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
