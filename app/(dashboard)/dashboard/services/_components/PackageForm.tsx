"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
} from "@/components/ui";
import { createPackage, updatePackage } from "@/app/actions/packages";
import { getServices } from "@/app/actions/services";
import {
  createPackageSchema,
  type CreatePackageInput,
} from "@/lib/validations";
import type { SerializedPackage, SerializedService } from "@/types/quote";
import { X } from "lucide-react";

interface PackageFormProps {
  initialData?: SerializedPackage;
  mode: "create" | "edit";
}

function getSubmitButtonText(isSubmitting: boolean, isEdit: boolean): string {
  if (isSubmitting) {
    return isEdit ? "Modification..." : "Création...";
  }
  return isEdit ? "Modifier" : "Créer";
}

export default function PackageForm({ initialData, mode }: PackageFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  type PackageInput = z.input<typeof createPackageSchema>;

  const form = useForm<PackageInput>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || null,
      discountType: initialData?.discountType || "NONE",
      discountValue: initialData?.discountValue
        ? Number(initialData.discountValue)
        : 0,
      items:
        initialData?.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
        })) || [],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [services, setServices] = useState<SerializedService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Load services
  useEffect(() => {
    async function loadServices() {
      const result = await getServices();
      if (result.success) {
        setServices(result.data || []);
      } else {
        toast.error("Erreur lors du chargement des services");
      }
      setServicesLoading(false);
    }
    loadServices();
  }, []);

  // Watch form values for price calculation using useWatch for better performance
  const watchedItems = useWatch({ control, name: "items" });
  const watchedDiscountType = useWatch({ control, name: "discountType" });
  const watchedDiscountValue = useWatch({ control, name: "discountValue" });

  // Calculate prices
  function calculateBasePrice(): number {
    if (!watchedItems) return 0;
    return watchedItems.reduce((sum, item) => {
      const service = services.find((s) => s.id === item.serviceId);
      if (!service) return sum;
      return sum + Number(service.price) * item.quantity;
    }, 0);
  }

  function calculateFinalPrice(): number {
    const basePrice = calculateBasePrice();
    if (watchedDiscountType === "NONE") return basePrice;
    if (watchedDiscountType === "PERCENTAGE") {
      return basePrice * (1 - watchedDiscountValue / 100);
    }
    return basePrice - watchedDiscountValue;
  }

  const onSubmit = async (data: PackageInput) => {
    try {
      const result =
        isEdit && initialData
          ? await updatePackage({
              id: initialData.id,
              ...data,
            } as CreatePackageInput & { id: string })
          : await createPackage(data as CreatePackageInput);

      if (!result.success) {
        toast.error(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              setError(key as keyof PackageInput, {
                type: "server",
                message: value[0],
              });
            }
          });
        }
      } else {
        toast.success(
          isEdit ? "Forfait modifié avec succès" : "Forfait créé avec succès"
        );
        router.push("/dashboard/services?tab=packages");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  function addItem() {
    if (services.length === 0) {
      toast.error("Aucun service disponible");
      return;
    }
    append({ serviceId: services[0].id, quantity: 1 });
  }

  const basePrice = calculateBasePrice();
  const finalPrice = calculateFinalPrice();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Renseignez les informations de base du forfait
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <FormField
            label="Nom du forfait"
            id="name"
            required
            error={errors.name?.message}
          >
            <Input
              id="name"
              {...register("name")}
              placeholder="Forfait Soin Complet"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            id="description"
            error={errors.description?.message}
            hint="Décrivez le forfait en détail"
          >
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description détaillée du forfait..."
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Services Included */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services inclus</CardTitle>
              <CardDescription>
                Ajoutez les services qui composent ce forfait
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={addItem}
              disabled={servicesLoading || services.length === 0}
              size="sm"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter un service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {errors.items?.message && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {errors.items.message}
            </div>
          )}

          {fields.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Aucun service ajouté. Cliquez sur &quot;Ajouter un service&quot;
              pour commencer.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => {
                const service = services.find(
                  (s) => s.id === watchedItems?.[index]?.serviceId
                );
                const itemTotal = service
                  ? Number(service.price) *
                    (watchedItems?.[index]?.quantity || 1)
                  : 0;

                return (
                  <div
                    key={field.id}
                    className="flex items-start gap-4 rounded-md border border-foreground/10 p-4"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Service Select */}
                        <FormField
                          label="Service"
                          id={`items.${index}.serviceId`}
                          required
                          error={errors.items?.[index]?.serviceId?.message}
                        >
                          <Controller
                            name={`items.${index}.serviceId`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {services.map((service) => (
                                    <SelectItem
                                      key={service.id}
                                      value={service.id}
                                    >
                                      {service.name} -{" "}
                                      {Number(service.price).toFixed(2)} €
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>

                        {/* Quantity */}
                        <FormField
                          label="Quantité"
                          id={`items.${index}.quantity`}
                          required
                          error={errors.items?.[index]?.quantity?.message}
                        >
                          <Input
                            id={`items.${index}.quantity`}
                            type="number"
                            min="1"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            aria-invalid={!!errors.items?.[index]?.quantity}
                          />
                        </FormField>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Total:{" "}
                        <span className="font-medium text-foreground">
                          {itemTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discount */}
      <Card>
        <CardHeader>
          <CardTitle>Réduction</CardTitle>
          <CardDescription>
            Appliquez une réduction sur le prix de base
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Discount Type */}
          <FormField
            label="Type de réduction"
            id="discountType"
            error={errors.discountType?.message}
          >
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="discountType">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Aucune réduction</SelectItem>
                    <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
                    <SelectItem value="FIXED">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {/* Discount Value */}
          {watchedDiscountType !== "NONE" && (
            <FormField
              label={
                watchedDiscountType === "PERCENTAGE"
                  ? "Pourcentage de réduction"
                  : "Montant de la réduction"
              }
              id="discountValue"
              error={errors.discountValue?.message}
            >
              <div className="relative">
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  max={watchedDiscountType === "PERCENTAGE" ? "100" : undefined}
                  step={watchedDiscountType === "PERCENTAGE" ? "1" : "0.01"}
                  {...register("discountValue", { valueAsNumber: true })}
                  aria-invalid={!!errors.discountValue}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {watchedDiscountType === "PERCENTAGE" ? "%" : "€"}
                </div>
              </div>
            </FormField>
          )}

          {/* Price Summary */}
          <div className="space-y-2 border-t border-foreground/10 pt-4">
            <div className="flex justify-between text-foreground">
              <span>Prix de base:</span>
              <span className="font-medium">{basePrice.toFixed(2)} €</span>
            </div>
            {watchedDiscountType !== "NONE" && (
              <div className="flex justify-between text-muted-foreground">
                <span>Réduction:</span>
                <span>
                  {watchedDiscountType === "PERCENTAGE"
                    ? `-${watchedDiscountValue}%`
                    : `-${watchedDiscountValue.toFixed(2)} €`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Prix final:</span>
              <span>{finalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/services?tab=packages")}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || fields.length === 0}>
          {getSubmitButtonText(isSubmitting, isEdit)}
        </Button>
      </div>
    </form>
  );
}
