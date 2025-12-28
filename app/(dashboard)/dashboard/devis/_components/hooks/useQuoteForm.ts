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
import { safeParsePrice } from "@/lib/number-utils";

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
          id: crypto.randomUUID(), // Generate unique ID for React keys
          serviceId: item.serviceId || undefined,
          packageId: item.packageId || undefined,
          name: item.name,
          description: item.description || undefined,
          price: safeParsePrice(item.price),
          quantity: Number(item.quantity) || 1,
          total: safeParsePrice(item.total),
          packageDiscount: safeParsePrice(item.packageDiscount),
        }))
      );
      setDiscount(Number(initialQuote.discount));
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

    const price = safeParsePrice(service.price);
    const quantity = 1;

    const newItem: QuoteItemInput = {
      id: crypto.randomUUID(), // Generate unique ID for React keys
      serviceId: service.id,
      name: service.name,
      description: service.description || undefined,
      price,
      quantity,
      total: price * quantity,
    };

    setItems([...items, newItem]);
  }

  // Add package item
  function addPackageItem(packageId: string) {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    // Use shared utilities for package calculations
    const basePrice = safeParsePrice(calculatePackageBasePrice(pkg));
    const packageDiscount = safeParsePrice(calculatePackageDiscount(pkg, basePrice));
    const servicesDescription = createPackageServicesDescription(pkg);
    const quantity = 1;

    const newItem: QuoteItemInput = {
      id: crypto.randomUUID(), // Generate unique ID for React keys
      packageId: pkg.id,
      name: pkg.name,
      description: servicesDescription,
      price: basePrice,
      quantity,
      total: basePrice * quantity,
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

    // Ensure numeric fields are always stored as numbers, not strings
    if (field === "price" || field === "quantity" || field === "total") {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }

    // Recalculate total for this item
    if (field === "price" || field === "quantity") {
      newItems[index].total = Number(newItems[index].price) * Number(newItems[index].quantity);
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

    // Build payload - strip UI-only id field from items
    const quoteData = {
      clientId: selectedClientId,
      items: items.map(({ id: _id, ...item }) => item), // eslint-disable-line @typescript-eslint/no-unused-vars
      discount,
      discountType,
      notes: notes || undefined,
      ...(mode === 'create' && validUntil ? { validUntil: new Date(validUntil) } : {}),
    };

    // Call appropriate action
    const result = mode === 'create'
      ? await createQuote(quoteData)
      : await updateQuote({ ...quoteData, id: initialQuote!.id });

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
