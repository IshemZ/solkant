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

    const result = await deletePackage(packageToDelete);
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

  function formatDiscount(pkg: PackageWithRelations): string {
    if (pkg.discountType === "NONE") return "Aucune";
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
        <div className="rounded-lg border border-foreground/10 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-foreground/10 bg-foreground/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/60">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/60">Services inclus</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/60">Prix de base</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/60">Réduction</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/60">Prix final</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-foreground/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-foreground">{pkg.name}</div>
                      {pkg.description && <div className="text-sm text-foreground/60">{pkg.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground/80">
                        {pkg.items.map((item, idx) => (
                          <div key={item.id}>
                            {item.service?.name} × {item.quantity}
                            {idx < pkg.items.length - 1 && ", "}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-foreground">{calculateBasePrice(pkg).toFixed(2)} €</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-foreground/60">{formatDiscount(pkg)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-foreground">{calculateFinalPrice(pkg).toFixed(2)} €</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/dashboard/services/forfaits/${pkg.id}/edit`} className="text-foreground/60 hover:text-foreground">
                          Modifier
                        </Link>
                        <button onClick={() => openDeleteDialog(pkg.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
        title="Archiver le forfait"
        description="Êtes-vous sûr de vouloir archiver ce forfait ? Il ne sera plus disponible pour de nouveaux devis, mais les devis existants seront préservés."
        confirmText="Archiver"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
