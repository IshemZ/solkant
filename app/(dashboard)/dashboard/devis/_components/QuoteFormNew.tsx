"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus, AlertCircle, Package as PackageIcon } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
} from "@/components/ui";
import { createQuote } from "@/app/actions/quotes";
import DiscountField, { type DiscountType } from "@/components/shared/DiscountField";
import type { Client, Service, Package, PackageItem } from "@prisma/client";

interface PackageWithRelations extends Package {
  items: (PackageItem & { service: Service | null })[];
}

interface QuoteFormProps {
  clients: Client[];
  services: Service[];
  packages: PackageWithRelations[];
}

interface QuoteItem {
  serviceId?: string;
  packageId?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
  packageDiscount?: number; // NEW: Montant de la remise du forfait
}

export default function QuoteFormNew({
  clients,
  services,
  packages,
}: QuoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [notes, setNotes] = useState("");
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

  // Calculate totals in real-time
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  // NEW: Calculate total package discounts
  const packageDiscountsTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.packageDiscount || 0), 0),
    [items]
  );

  // NEW: Calculate subtotal after package discounts
  const subtotalAfterPackageDiscounts = useMemo(
    () => subtotal - packageDiscountsTotal,
    [subtotal, packageDiscountsTotal]
  );

  const discountAmount = useMemo(() => {
    return discountType === "PERCENTAGE"
      ? subtotalAfterPackageDiscounts * (discount / 100)
      : discount;
  }, [discount, discountType, subtotalAfterPackageDiscounts]);

  const total = useMemo(
    () => subtotalAfterPackageDiscounts - discountAmount,
    [subtotalAfterPackageDiscounts, discountAmount]
  );

  // Clear client selection
  function clearClient() {
    setSelectedClientId("");
    setClientSearch("");
  }

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

  function addPackageItem(packageId: string) {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    // Calculate base price from all services in the package
    const basePrice = pkg.items.reduce((sum, item) => {
      const price = item.service?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    // Calculate package discount separately
    let packageDiscount = 0;

    if (pkg.discountType === "PERCENTAGE" && Number(pkg.discountValue) > 0) {
      const discountValue = Number(pkg.discountValue);
      packageDiscount = basePrice * (discountValue / 100);
    } else if (pkg.discountType === "FIXED" && Number(pkg.discountValue) > 0) {
      packageDiscount = Math.min(Number(pkg.discountValue), basePrice); // Limit to basePrice
    }

    // Create description with included services
    const servicesDescription = pkg.items
      .map((item) => `${item.service?.name} × ${item.quantity}`)
      .join(", ");

    const newItem: QuoteItem = {
      packageId: pkg.id,
      name: pkg.name,
      description: servicesDescription,
      price: basePrice, // Use FULL price, not discounted
      quantity: 1,
      total: basePrice,
      packageDiscount: packageDiscount, // Store discount separately
    };

    setItems([...items, newItem]);
  }

  function updateItem(
    index: number,
    field: keyof QuoteItem,
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

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>
            Sélectionnez le client pour ce devis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search input - always visible, smaller when client selected */}
          {selectedClient ? (
            <Input
              id="clientSearch"
              placeholder="Rechercher..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="h-9 text-sm"
            />
          ) : (
            <FormField
              label="Rechercher un client"
              id="clientSearch"
              hint="Tapez le nom, prénom ou email"
            >
              <Input
                id="clientSearch"
                placeholder="Rechercher..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </FormField>
          )}

          {/* Selected client card - only shown when client is selected */}
          {selectedClient && (
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearClient}
                className="absolute top-2 right-2 h-8 w-8 p-0"
                aria-label="Retirer la sélection du client"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="pr-8">
                <p className="font-semibold text-lg">
                  {selectedClient.firstName} {selectedClient.lastName}
                </p>
                {selectedClient.email && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedClient.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dropdown - only shown when NO client is selected */}
          {!selectedClient && (
            <FormField label="Client" id="client" required>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {filteredClients.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Aucun client trouvé
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                        {client.email && ` • ${client.email}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormField>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Ajoutez des services ou des forfaits à inclure dans le devis
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={addServiceItem}>
                <SelectTrigger className="w-[200px]">
                  <Plus className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ajouter un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Aucun service disponible
                    </div>
                  ) : (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} • {service.price.toFixed(2)} €
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select onValueChange={addPackageItem}>
                <SelectTrigger className="w-[200px]">
                  <PackageIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ajouter un forfait" />
                </SelectTrigger>
                <SelectContent>
                  {packages.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Aucun forfait disponible
                    </div>
                  ) : (
                    packages.map((pkg) => {
                      // Calculate base price (without discount)
                      const basePrice = pkg.items.reduce((sum, item) => {
                        const price = item.service?.price || 0;
                        return sum + price * item.quantity;
                      }, 0);
                      return (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} • {basePrice.toFixed(2)} €
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun article ajouté
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Utilisez les boutons ci-dessus pour ajouter des services ou des
                forfaits
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="w-[120px]">Prix unit.</TableHead>
                    <TableHead className="w-[100px]">Qté</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Total
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-1">
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateItem(index, "name", e.target.value)
                            }
                            className="font-medium"
                          />
                          {item.description && (
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
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
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
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
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.total.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options & Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Options et total</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DiscountField
            value={discount}
            type={discountType}
            subtotal={subtotal}
            onChange={(value, type) => {
              setDiscount(value);
              setDiscountType(type);
            }}
          />

          <FormField
            label="Notes"
            id="notes"
            hint="Informations supplémentaires sur le devis"
          >
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conditions particulières, remarques..."
            />
          </FormField>

          {/* Totals */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{subtotal.toFixed(2)} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Remise
                  {discountType === "PERCENTAGE" && ` (${discount}%)`}
                </span>
                <span className="font-medium text-destructive">
                  -{discountAmount.toFixed(2)} €
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/devis")}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading || items.length === 0}>
          {isLoading ? "Création..." : "Créer le devis"}
        </Button>
      </div>
    </form>
  );
}
