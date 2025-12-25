"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createService, deleteService } from "@/app/actions/services";
import type { Service } from "@prisma/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

interface ServicesListProps {
  initialServices: Service[];
}

export default function ServicesList({ initialServices }: ServicesListProps) {
  const [services, setServices] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: formData.get("duration")
        ? parseInt(formData.get("duration") as string)
        : undefined,
      category: formData.get("category") as string,
      isActive: true,
    };

    const result = await createService(data);

    if (!result.success) {
      setError(result.error);
      toast.error("Erreur lors de la création du service");
    } else {
      setServices([result.data, ...services]);
      setShowForm(false);
      e.currentTarget.reset();
      toast.success(`Service "${result.data.name}" créé avec succès`);
    }

    setIsLoading(false);
  }

  function openDeleteDialog(id: string) {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!serviceToDelete) return;

    const result = await deleteService(serviceToDelete);
    if (result.success) {
      setServices(services.filter((s) => s.id !== serviceToDelete));
      toast.success("Service supprimé avec succès");
    } else {
      toast.error("Erreur lors de la suppression du service");
    }
    setServiceToDelete(null);
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
          {showForm ? "Annuler" : "Nouveau service"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-foreground/10 bg-background p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Nouveau service
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Nom du service *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-foreground"
              >
                Catégorie
              </label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="Ex: Soins visage, Épilation..."
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-foreground"
              >
                Prix (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-foreground"
              >
                Durée (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                min="0"
                placeholder="Ex: 60"
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isLoading ? "Création..." : "Créer le service"}
            </button>
          </div>
        </form>
      )}

      {services.length === 0 && !showForm ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun service"
          description="Créez votre premier service pour l'ajouter à vos devis."
          actionLabel="Créer un service"
          actionHref="/dashboard/services/nouveau"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-lg border border-foreground/10 bg-background p-6 hover:border-foreground/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {service.name}
                  </h3>
                  {service.category && (
                    <p className="mt-1 text-xs text-foreground/40">
                      {service.category}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="text-primary hover:text-primary/80"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(service.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {service.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  {service.price.toFixed(2)} €
                </span>
                {service.duration && (
                  <span className="text-sm text-muted-foreground">
                    {service.duration} min
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Supprimer le service"
        description="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
