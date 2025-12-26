"use client";

import { useRouter } from "next/navigation";
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
import DiscountField from "@/components/shared/DiscountField";
import { useQuoteForm } from "./hooks/useQuoteForm";
import { calculatePackageBasePrice } from "@/lib/package-utils";
import type { Client } from "@prisma/client";
import type {
  SerializedService,
  SerializedPackage,
  QuoteWithItems,
} from "@/types/quote";

interface QuoteFormProps {
  mode: 'create' | 'edit';
  clients: Client[];
  services: SerializedService[];
  packages: SerializedPackage[];
  initialQuote?: QuoteWithItems;
}

export default function QuoteForm({
  mode,
  clients,
  services,
  packages,
  initialQuote,
}: QuoteFormProps) {
  const router = useRouter();

  const {
    selectedClientId,
    setSelectedClientId,
    selectedClient,
    clientSearch,
    setClientSearch,
    filteredClients,
    clearClient,
    items,
    addServiceItem,
    addPackageItem,
    updateItem,
    removeItem,
    subtotal,
    packageDiscountsTotal,
    subtotalAfterPackageDiscounts,
    discountAmount,
    total,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    notes,
    setNotes,
    validUntil,
    setValidUntil,
    handleSubmit,
    isLoading,
    error,
  } = useQuoteForm({ mode, initialQuote, clients, services, packages, router });

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
                        {service.name} • {Number(service.price).toFixed(2)} €
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
                    packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} • {calculatePackageBasePrice(pkg).toFixed(2)} €
                      </SelectItem>
                    ))
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
                        {item.packageId ? (
                          <div className="flex items-center gap-2 px-3 py-2 text-sm">
                            <PackageIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{Number(item.price).toFixed(2)} €</span>
                          </div>
                        ) : (
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
                        )}
                      </TableCell>
                      <TableCell>
                        {item.packageId ? (
                          <div className="px-3 py-2 text-sm font-medium text-center">
                            1
                          </div>
                        ) : (
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
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(item.total).toFixed(2)} €
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

          {mode === 'create' && (
            <FormField
              label="Valable jusqu'au"
              id="validUntil"
              hint="Date limite de validité du devis"
            >
              <Input
                type="date"
                id="validUntil"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </FormField>
          )}

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
            {packageDiscountsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remises forfaits</span>
                <span className="font-medium text-green-600">
                  -{packageDiscountsTotal.toFixed(2)} €
                </span>
              </div>
            )}
            {packageDiscountsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total après remises</span>
                <span className="font-medium">{subtotalAfterPackageDiscounts.toFixed(2)} €</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Remise globale
                  {discountType === "PERCENTAGE" && ` (${discount}%)`}
                </span>
                <span className="font-medium text-destructive">
                  -{discountAmount.toFixed(2)} €
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-semibold">
              <span>Total TTC</span>
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
          onClick={() =>
            mode === 'create'
              ? router.push("/dashboard/devis")
              : router.push(`/dashboard/devis/${initialQuote!.id}`)
          }
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading || items.length === 0}>
          {isLoading
            ? mode === 'create'
              ? "Création..."
              : "Enregistrement..."
            : mode === 'create'
            ? "Créer le devis"
            : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
