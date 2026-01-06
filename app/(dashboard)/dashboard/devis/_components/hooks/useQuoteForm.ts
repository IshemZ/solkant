import { useState, useMemo } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { createQuote, updateQuote } from "@/app/actions/quotes";
import type { QuoteWithRelationsAndAnalytics } from "@/app/actions/quotes";
import { useAnalytics } from "@/hooks/useAnalytics";
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
  mode: "create" | "edit";
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
  const { trackEvent } = useAnalytics();

  // Form state - use lazy initialization for edit mode
  const [selectedClientId, setSelectedClientId] = useState(() =>
    mode === "edit" && initialQuote ? initialQuote.clientId || "" : ""
  );

  const [items, setItems] = useState<QuoteItemInput[]>(() =>
    mode === "edit" && initialQuote
      ? initialQuote.items.map((item) => ({
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
      : []
  );

  const [discount, setDiscount] = useState(() =>
    mode === "edit" && initialQuote ? Number(initialQuote.discount) : 0
  );

  const [discountType, setDiscountType] = useState<DiscountType>(() =>
    mode === "edit" && initialQuote
      ? (initialQuote.discountType as DiscountType)
      : "FIXED"
  );

  const [notes, setNotes] = useState(() =>
    mode === "edit" && initialQuote ? initialQuote.notes || "" : ""
  );

  const [validUntil, setValidUntil] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");

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
    const packageDiscount = safeParsePrice(
      calculatePackageDiscount(pkg, basePrice)
    );
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
      newItems[index].total =
        Number(newItems[index].price) * Number(newItems[index].quantity);
    }

    setItems(newItems);
  }

  // Remove item
  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  // Validation helper
  function validateForm(): string | null {
    if (!selectedClientId) return "Veuillez sélectionner un client";
    if (items.length === 0) return "Veuillez ajouter au moins un article";
    return null;
  }

  // Build quote payload - strip UI-only id field from items
  function buildQuotePayload() {
    return {
      clientId: selectedClientId,
      items: items.map(({ id: _id, ...item }) => item),
      discount,
      discountType,
      notes: notes || undefined,
      ...(mode === "create" && validUntil
        ? { validUntil: new Date(validUntil) }
        : {}),
    };
  }

  // Categorize total amount into buckets for analytics
  function getTotalAmountBucket(totalAmount: number): string {
    if (totalAmount < 500) return "<500";
    if (totalAmount <= 1000) return "500-1000";
    return ">1000";
  }

  // Track analytics for successful quote creation
  function trackQuoteCreationAnalytics(
    resultData: QuoteWithRelationsAndAnalytics
  ) {
    trackEvent("create_quote", {
      page_category: "dashboard",
      num_services: items.length,
      total_amount_bucket: getTotalAmountBucket(total),
    });

    if (resultData.isFirstQuote) {
      trackEvent("create_first_quote", { page_category: "dashboard" });
    }
  }

  // Handle submission error
  function handleSubmitError(errorMessage: string) {
    setError(errorMessage);
    const errorToast =
      mode === "create"
        ? "Erreur lors de la création du devis"
        : "Erreur lors de la modification du devis";
    toast.error(errorToast);

    if (mode === "create") {
      trackEvent("dashboard_error", {
        error_type: "quote_creation_failed",
        page_category: "dashboard",
      });
    }
    setIsLoading(false);
  }

  // Handle submission success
  function handleSubmitSuccess(resultData: QuoteWithRelationsAndAnalytics) {
    const successToast =
      mode === "create"
        ? `Devis ${resultData.quoteNumber} créé avec succès`
        : `Devis ${resultData.quoteNumber} modifié avec succès`;
    toast.success(successToast);

    if (mode === "create") {
      trackQuoteCreationAnalytics(resultData);
    }

    router.push(`/dashboard/devis/${resultData.id}`);
  }

  // Form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const quotePayload = buildQuotePayload();
    const result =
      mode === "create"
        ? await createQuote(quotePayload)
        : await updateQuote({ ...quotePayload, id: initialQuote!.id });

    if (!result.success) {
      handleSubmitError(result.error);
    } else {
      handleSubmitSuccess(result.data as QuoteWithRelationsAndAnalytics);
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
