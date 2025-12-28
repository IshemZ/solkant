"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deletePackage } from "@/app/actions/packages";
import type { Package, PackageItem, Service } from "@prisma/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Package as PackageIcon } from "lucide-react";

interface PackageWithRelations extends Package {
  items: (PackageItem & { service: Service | null })[];
}

interface PackagesListProps {
  initialPackages: PackageWithRelations[];
}

export default function PackagesList({ initialPackages }: PackagesListProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  function openDeleteDialog(id: string) {
    setPackageToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!packageToDelete) return;

    const result = await deletePackage({ id: packageToDelete });
    if (result.success) {
      setPackages(packages.filter((p) => p.id !== packageToDelete));
      toast.success("Forfait archivé avec succès");
    } else {
      toast.error(result.error);
    }
    setPackageToDelete(null);
  }

  function calculateBasePrice(pkg: PackageWithRelations): number {
    return pkg.items.reduce((sum, item) => {
      const price = item.service?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }

  function calculateFinalPrice(pkg: PackageWithRelations): number {
    const basePrice = calculateBasePrice(pkg);
    if (pkg.discountType === "NONE") return basePrice;
    if (pkg.discountType === "PERCENTAGE") {
      const discountVal = Number(pkg.discountValue);
      return basePrice * (1 - discountVal / 100);
    }
    return basePrice - Number(pkg.discountValue);
  }

  function formatDiscount(pkg: PackageWithRelations): string | null {
    if (pkg.discountType === "NONE") return null;
    if (pkg.discountType === "PERCENTAGE") {
      return `-${pkg.discountValue}%`;
    }
    return `-${Number(pkg.discountValue).toFixed(2)} €`;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/dashboard/services/forfaits/nouveau"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau forfait
        </Link>
      </div>

      {packages.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="Aucun forfait"
          description="Créez votre premier forfait pour proposer des offres groupées à vos clients."
          actionLabel="Créer un forfait"
          actionHref="/dashboard/services/forfaits/nouveau"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const basePrice = calculateBasePrice(pkg);
            const finalPrice = calculateFinalPrice(pkg);
            const discount = formatDiscount(pkg);

            return (
              <div
                key={pkg.id}
                className="rounded-lg border border-foreground/10 bg-background p-6 hover:border-foreground/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                    <p className="mt-1 text-xs text-foreground/40">
                      {pkg.items.length} service{pkg.items.length > 1 ? "s" : ""} inclus
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/services/forfaits/${pkg.id}/edit`}
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
                      onClick={() => openDeleteDialog(pkg.id)}
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

                {pkg.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {pkg.items.map((item) => (
                    <div key={item.id}>
                      {item.service?.name} × {item.quantity}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-foreground">
                      {finalPrice.toFixed(2)} €
                    </span>
                    {discount && basePrice !== finalPrice && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {basePrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                  {discount && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-200">
                      {discount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Archiver le forfait"
        description="Êtes-vous sûr de vouloir archiver ce forfait ? Il ne sera plus disponible pour de nouveaux devis, mais les devis existants seront préservés."
        confirmText="Archiver"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
