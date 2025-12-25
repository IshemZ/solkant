"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createQuote } from "@/app/actions/quotes";
import DiscountField, { type DiscountType } from "@/components/shared/DiscountField";
import type { Client, Service } from "@prisma/client";

interface QuoteFormProps {
  clients: Client[];
  services: Service[];
}

interface QuoteItem {
  serviceId?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
}

export default function QuoteForm({ clients, services }: QuoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");

  function addServiceItem(serviceId: string) {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const newItem: QuoteItem = {
      serviceId: service.id,
      name: service.name,
      description: service.description || undefined,
      price: service.price,
      quantity: 1,
      total: service.price,
    };

    setItems([...items, newItem]);
  }

  function updateItem(
    index: number,
    field: keyof QuoteItem,
    value: string | number
  ) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate total for this item
    if (field === "price" || field === "quantity") {
      newItems[index].total = newItems[index].price * newItems[index].quantity;
    }

    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  // Calculate totals with proper discount handling
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    return discountType === "PERCENTAGE"
      ? subtotal * (discount / 100)
      : discount;
  }, [discount, discountType, subtotal]);

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedClientId) {
      setError("Veuillez sélectionner un client");
      setIsLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Veuillez ajouter au moins un article");
      setIsLoading(false);
      return;
    }

    const quoteData = {
      clientId: selectedClientId,
      items,
      discount,
      discountType,
      notes: notes || undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
    };

    const result = await createQuote(quoteData);

    if (!result.success) {
      setError(result.error);
      toast.error("Erreur lors de la création du devis");
      setIsLoading(false);
    } else {
      toast.success(`Devis ${result.data.quoteNumber} créé avec succès`);
      router.push(`/dashboard/devis/${result.data.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Client Selection */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Client</h2>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          required
          className="block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
              {client.email && ` - ${client.email}`}
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Articles</h2>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addServiceItem(e.target.value);
                e.target.value = "";
              }
            }}
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
          >
            <option value="">Ajouter un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price.toFixed(2)} €
              </option>
            ))}
          </select>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aucun article ajouté
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-md border border-foreground/10 p-4 sm:grid-cols-12"
              >
                <div className="sm:col-span-4">
                  <label
                    htmlFor={`item-name-${index}`}
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Nom
                  </label>
                  <input
                    id={`item-name-${index}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    aria-label={`Nom du service ${index + 1}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`item-price-${index}`}
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Prix unitaire
                  </label>
                  <input
                    id={`item-price-${index}`}
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    aria-label={`Prix unitaire du service ${index + 1}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`item-quantity-${index}`}
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Quantité
                  </label>
                  <input
                    id={`item-quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    aria-label={`Quantité du service ${index + 1}`}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor={`item-total-${index}`}
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Total
                  </label>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      id={`item-total-${index}`}
                      className="text-sm font-medium text-foreground"
                      role="status"
                      aria-live="polite"
                    >
                      {item.total.toFixed(2)} €
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Supprimer le service ${index + 1}`}
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

                {item.description && (
                  <div className="sm:col-span-12">
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals and options */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Options</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <DiscountField
              value={discount}
              type={discountType}
              subtotal={subtotal}
              onChange={(value, type) => {
                setDiscount(value);
                setDiscountType(type);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="validUntil"
              className="block text-sm font-medium text-foreground"
            >
              Valable jusqu&apos;au
            </label>
            <input
              type="date"
              id="validUntil"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
          </div>
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
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informations supplémentaires..."
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
          />
        </div>

        <div className="mt-6 space-y-2 border-t border-foreground/10 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium text-foreground">
              {subtotal.toFixed(2)} €
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Remise
                {discountType === "PERCENTAGE" && ` (${discount}%)`}
              </span>
              <span className="font-medium text-red-600">
                -{discountAmount.toFixed(2)} €
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-foreground/10 pt-2 text-lg">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">
              {total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-foreground/20 px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          {isLoading ? "Création..." : "Créer le devis"}
        </button>
      </div>
    </form>
  );
}
