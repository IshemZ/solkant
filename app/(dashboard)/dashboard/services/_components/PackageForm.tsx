"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPackage, updatePackage } from "@/app/actions/packages";
import { getServices } from "@/app/actions/services";
import type { Package, PackageItem, Service } from "@prisma/client";

interface PackageWithRelations extends Package {
  items: (PackageItem & { service: Service | null })[];
}

interface PackageFormProps {
  initialData?: PackageWithRelations;
  mode: "create" | "edit";
}

interface FormItem {
  serviceId: string;
  quantity: number;
}

export default function PackageForm({ initialData, mode }: PackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [discountType, setDiscountType] = useState<"NONE" | "PERCENTAGE" | "FIXED">(
    initialData?.discountType || "NONE"
  );
  const [discountValue, setDiscountValue] = useState(
    initialData?.discountValue ? Number(initialData.discountValue) : 0
  );
  const [items, setItems] = useState<FormItem[]>(
    initialData?.items.map(item => ({
      serviceId: item.serviceId,
      quantity: item.quantity,
    })) || []
  );

  useEffect(() => {
    async function loadServices() {
      const result = await getServices();
      if (result.success) {
        setServices(result.data || []);
      }
    }
    loadServices();
  }, []);

  function addItem() {
    if (services.length === 0) return;
    setItems([...items, { serviceId: services[0].id, quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: "serviceId" | "quantity", value: string | number) {
    const updated = [...items];
    if (field === "serviceId") {
      updated[index].serviceId = value as string;
    } else {
      updated[index].quantity = value as number;
    }
    setItems(updated);
  }

  function calculateBasePrice(): number {
    return items.reduce((sum, item) => {
      const service = services.find(s => s.id === item.serviceId);
      if (!service) return sum;
      return sum + Number(service.price) * item.quantity;
    }, 0);
  }

  function calculateFinalPrice(): number {
    const basePrice = calculateBasePrice();
    if (discountType === "NONE") return basePrice;
    if (discountType === "PERCENTAGE") {
      return basePrice * (1 - discountValue / 100);
    }
    return basePrice - discountValue;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Vous devez ajouter au moins un service");
      return;
    }

    setLoading(true);

    const data = {
      name,
      description: description || null,
      discountType,
      discountValue,
      items,
    };

    try {
      const result = mode === "create"
        ? await createPackage(data)
        : await updatePackage(initialData!.id, data);

      if (result.success) {
        toast.success(
          mode === "create"
            ? "Forfait créé avec succès"
            : "Forfait modifié avec succès"
        );
        router.push("/dashboard/services?tab=packages");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const basePrice = calculateBasePrice();
  const finalPrice = calculateFinalPrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Informations générales
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Nom du forfait *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Services inclus</h2>
          <button
            type="button"
            onClick={addItem}
            disabled={services.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un service
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-center py-8 text-foreground/60">
            Aucun service ajouté. Cliquez sur &quot;Ajouter un service&quot; pour commencer.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const service = services.find(s => s.id === item.serviceId);
              const itemTotal = service ? Number(service.price) * item.quantity : 0;

              return (
                <div key={index} className="flex items-center gap-4 rounded-md border border-foreground/10 p-4">
                  <div className="flex-1">
                    <label htmlFor={`service-${index}`} className="block text-sm font-medium text-foreground/60 mb-1">
                      Service
                    </label>
                    <select
                      id={`service-${index}`}
                      value={item.serviceId}
                      onChange={(e) => updateItem(index, "serviceId", e.target.value)}
                      className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none"
                    >
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {Number(service.price).toFixed(2)} €
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-foreground/60 mb-1">
                      Quantité
                    </label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="w-32 text-right">
                    <div className="text-sm font-medium text-foreground/60 mb-1">Total</div>
                    <div className="text-foreground font-medium">{itemTotal.toFixed(2)} €</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Réduction</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="discount-type" className="block text-sm font-medium text-foreground mb-1">
              Type de réduction
            </label>
            <select
              id="discount-type"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value as "NONE" | "PERCENTAGE" | "FIXED");
                if (e.target.value === "NONE") setDiscountValue(0);
              }}
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground focus:outline-none"
            >
              <option value="NONE">Aucune réduction</option>
              <option value="PERCENTAGE">Pourcentage</option>
              <option value="FIXED">Montant fixe</option>
            </select>
          </div>

          {discountType !== "NONE" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {discountType === "PERCENTAGE" ? "Pourcentage de réduction" : "Montant de la réduction"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={discountType === "PERCENTAGE" ? "100" : undefined}
                  step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 pr-12 text-foreground focus:border-foreground focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60">
                  {discountType === "PERCENTAGE" ? "%" : "€"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2 border-t border-foreground/10 pt-4">
          <div className="flex justify-between text-foreground">
            <span>Prix de base:</span>
            <span className="font-medium">{basePrice.toFixed(2)} €</span>
          </div>
          {discountType !== "NONE" && (
            <div className="flex justify-between text-foreground/60">
              <span>Réduction:</span>
              <span>
                {discountType === "PERCENTAGE"
                  ? `-${discountValue}%`
                  : `-${discountValue.toFixed(2)} €`}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Prix final:</span>
            <span>{finalPrice.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/services?tab=packages")}
          className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          {loading ? "En cours..." : mode === "create" ? "Créer le forfait" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
