"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteService } from "@/app/actions/services";
import type { Service } from "@prisma/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

interface ServicesListProps {
  initialServices: Service[];
}

export default function ServicesList({ initialServices }: ServicesListProps) {
  const [services, setServices] = useState(initialServices);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  function openDeleteDialog(id: string) {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!serviceToDelete) return;

    const result = await deleteService({ id: serviceToDelete });
    if (result.success) {
      setServices(services.filter((s) => s.id !== serviceToDelete));
      toast.success("Service archivé avec succès");
    } else {
      toast.error("Erreur lors de l'archivage du service");
    }
    setServiceToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/dashboard/services/nouveau"
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
          Nouveau service
        </Link>
      </div>

      {services.length === 0 ? (
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
        title="Archiver le service"
        description="Êtes-vous sûr de vouloir archiver ce service ? Il ne sera plus disponible pour de nouveaux devis, mais les devis existants seront préservés."
        confirmText="Archiver"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
