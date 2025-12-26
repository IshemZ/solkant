import { useState, useMemo, useEffect } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { createQuote } from "@/app/actions/quotes";
import { updateQuote } from "@/app/actions/quotes";
import type { Client } from "@prisma/client";
import type { DiscountType } from "@/components/shared/DiscountField";
import type {
  QuoteItemInput,
  SerializedService,
  SerializedPackage,
  QuoteWithItems,
} from "@/types/quote";
import {
  calculatePackageBasePrice,
  calculatePackageDiscount,
  createPackageServicesDescription,
} from "@/lib/package-utils";

interface UseQuoteFormProps {
  mode: 'create' | 'edit';
  initialQuote?: QuoteWithItems;
  clients: Client[];
  services: SerializedService[];
  packages: SerializedPackage[];
  router: AppRouterInstance;
}

export function useQuoteForm({
  mode,
  initialQuote,
  clients,
  services,
  packages,
  router,
}: UseQuoteFormProps) {

  // Form state
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItemInput[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");

  // Initialize from initialQuote for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialQuote) {
      setSelectedClientId(initialQuote.clientId || "");
      setItems(
        initialQuote.items.map((item) => ({
          serviceId: item.serviceId || undefined,
          name: item.name,
          description: item.description || undefined,
          price: item.price as unknown as number,
          quantity: item.quantity,
          total: item.total as unknown as number,
        }))
      );
      setDiscount(initialQuote.discount as unknown as number);
      setDiscountType(initialQuote.discountType as DiscountType);
      setNotes(initialQuote.notes || "");
    }
  }, []); // Only run once on mount

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients;
    const search = clientSearch.toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(search) ||
        client.lastName.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search)
    );
  }, [clients, clientSearch]);

  // Get selected client object
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  );

  // Clear client selection
  function clearClient() {
    setSelectedClientId("");
    setClientSearch("");
  }

  // Calculate totals in real-time
  const subtotal = useMemo(() => {
    const rawSum = items.reduce((sum, item) => sum + item.total, 0);
    // Round once to 2 decimals to avoid Float display issues (99.99000001)
    // Server will recalculate with Decimal precision
    return Math.round(rawSum * 100) / 100;
  }, [items]);

  // Calculate total package discounts
  const packageDiscountsTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.packageDiscount || 0), 0),
    [items]
  );

  // Calculate subtotal after package discounts
  const subtotalAfterPackageDiscounts = useMemo(
    () => subtotal - packageDiscountsTotal,
    [subtotal, packageDiscountsTotal]
  );

  // Calculate discount amount based on type
  const discountAmount = useMemo(() => {
    return discountType === "PERCENTAGE"
      ? subtotalAfterPackageDiscounts * (discount / 100)
      : discount;
  }, [discount, discountType, subtotalAfterPackageDiscounts]);

  const total = useMemo(
    () => subtotalAfterPackageDiscounts - discountAmount,
    [subtotalAfterPackageDiscounts, discountAmount]
  );

  // Add service item
  function addServiceItem(serviceId: string) {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const newItem: QuoteItemInput = {
      serviceId: service.id,
      name: service.name,
      description: service.description || undefined,
      price: service.price,
      quantity: 1,
      total: service.price,
    };

    setItems([...items, newItem]);
  }

  // Add package item
  function addPackageItem(packageId: string) {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    // Use shared utilities for package calculations
    const basePrice = calculatePackageBasePrice(pkg);
    const packageDiscount = calculatePackageDiscount(pkg, basePrice);
    const servicesDescription = createPackageServicesDescription(pkg);

    const newItem: QuoteItemInput = {
      packageId: pkg.id,
      name: pkg.name,
      description: servicesDescription,
      price: basePrice,
      quantity: 1,
      total: basePrice,
      packageDiscount,
    };

    setItems([...items, newItem]);
  }

  // Update item
  function updateItem(
    index: number,
    field: keyof QuoteItemInput,
    value: string | number
  ) {
    // Block price and quantity modifications for packages
    if (items[index].packageId && (field === "price" || field === "quantity")) {
      return; // Silently ignore modifications
    }

    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate total for this item
    if (field === "price" || field === "quantity") {
      newItems[index].total = newItems[index].price * newItems[index].quantity;
    }

    setItems(newItems);
  }

  // Remove item
  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  // Form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
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

    // Build payload
    const quoteData = {
      clientId: selectedClientId,
      items,
      discount,
      discountType,
      notes: notes || undefined,
      ...(mode === 'create' && validUntil ? { validUntil: new Date(validUntil) } : {}),
    };

    // Call appropriate action
    const result = mode === 'create'
      ? await createQuote(quoteData)
      : await updateQuote(initialQuote!.id, quoteData);

    if (!result.success) {
      setError(result.error);
      toast.error(
        mode === 'create'
          ? "Erreur lors de la création du devis"
          : "Erreur lors de la modification du devis"
      );
      setIsLoading(false);
    } else {
      toast.success(
        mode === 'create'
          ? `Devis ${result.data.quoteNumber} créé avec succès`
          : `Devis ${result.data.quoteNumber} modifié avec succès`
      );
      router.push(`/dashboard/devis/${result.data.id}`);
    }
  }

  return {
    // Client management
    selectedClientId,
    setSelectedClientId,
    selectedClient,
    clientSearch,
    setClientSearch,
    filteredClients,
    clearClient,

    // Items management
    items,
    addServiceItem,
    addPackageItem,
    updateItem,
    removeItem,

    // Pricing (computed)
    subtotal,
    packageDiscountsTotal,
    subtotalAfterPackageDiscounts,
    discountAmount,
    total,

    // Form fields
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    notes,
    setNotes,
    validUntil,
    setValidUntil,

    // Submission
    handleSubmit,
    isLoading,
    error,
  };
}
