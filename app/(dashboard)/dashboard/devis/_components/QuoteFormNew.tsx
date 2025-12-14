"use client";
/** #TODO: Ajouter une feature pour ajouter les forfaits da la partie Articles, propose moi des options sur comment présenter l'ajout de forfaits */
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus, AlertCircle } from "lucide-react";
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

export default function QuoteFormNew({ clients, services }: QuoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");
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

  // Calculate totals in real-time
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );
  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* #TODO: Mettre en valeur la sélection du client au lieu de la barre de recherche, mais garder la recherche*/}

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>
            Sélectionnez le client pour ce devis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Ajoutez les services à inclure dans le devis
              </CardDescription>
            </div>
            <Select onValueChange={addServiceItem}>
              <SelectTrigger className="w-[200px]">
                <Plus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ajouter un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} • {service.price.toFixed(2)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun article ajouté
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Utilisez le bouton ci-dessus pour ajouter des services
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
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Remise (€)"
              id="discount"
              hint="Montant de la réduction"
            >
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </FormField>
            {/* TODO: Pas utile de mettre la case "Valable jusqu'au" Car la mention de validité est gérée autrement : la date de création s'affiche en haut du devis et valable 30 jours mentionné en bas de page */}
            <FormField
              label="Valable jusqu'au"
              id="validUntil"
              hint="Date limite de validité du devis"
            >
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </FormField>
          </div>

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
                <span className="text-muted-foreground">Remise</span>
                <span className="font-medium text-destructive">
                  -{discount.toFixed(2)} €
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
