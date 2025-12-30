"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
  Checkbox,
  FormField,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { createService, updateService } from "@/app/actions/services";
import {
  serviceCategories,
  createServiceSchema,
  type CreateServiceInput,
} from "@/lib/validations";
import type { SerializedService } from "@/types/quote";

interface ServiceFormProps {
  service?: SerializedService;
  mode?: "create" | "edit";
}

function getSubmitButtonText(isSubmitting: boolean, isEdit: boolean): string {
  if (isSubmitting) {
    return isEdit ? "Modification..." : "Création...";
  }
  return isEdit ? "Modifier" : "Créer";
}

export default function ServiceForm({
  service,
  mode = "create",
}: ServiceFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  // Utiliser le type d'input pour le formulaire (avec isActive optionnel grâce au .default())
  type ServiceInput = z.input<typeof createServiceSchema>;

  const form = useForm<ServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || null,
      price: service?.price || 0,
      duration: service?.duration || null,
      category: service?.category || null,
      isActive: service?.isActive ?? true,
    },
    mode: "onChange", // Validation en temps réel
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: ServiceInput) => {
    try {
      // Le schéma Zod applique le .default() lors de la validation
      // Donc data.isActive sera toujours défini après résolution
      const result =
        isEdit && service
          ? await updateService({ id: service.id, ...(data as CreateServiceInput) })
          : await createService(data as CreateServiceInput);

      if (!result.success) {
        toast.error(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              setError(key as keyof ServiceInput, {
                type: "server",
                message: value[0],
              });
            }
          });
        }
      } else {
        toast.success(
          isEdit ? "Service modifié avec succès" : "Service créé avec succès"
        );
        router.push("/dashboard/services");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Modifier le service" : "Nouveau service"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Modifiez les informations du service"
            : "Remplissez les informations du nouveau service"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom */}
          <FormField
            label="Nom du service"
            id="name"
            required
            error={errors.name?.message}
          >
            <Input
              id="name"
              {...register("name")}
              placeholder="Soin visage complet"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            id="description"
            error={errors.description?.message}
            hint="Décrivez le service en détail"
          >
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description détaillée du service..."
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
            />
          </FormField>

          {/* Prix et Durée */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Prix (€)"
              id="price"
              required
              error={errors.price?.message}
              hint="Prix en euros"
            >
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                {...register("price", { valueAsNumber: true })}
                placeholder="50.00"
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "price-error" : "price-hint"}
              />
            </FormField>

            <FormField
              label="Durée (minutes)"
              id="duration"
              error={errors.duration?.message}
              hint="Durée estimée du service"
            >
              <Input
                id="duration"
                type="number"
                min="1"
                max="1440"
                {...register("duration", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? null : Number(v)),
                })}
                placeholder="60"
                aria-invalid={!!errors.duration}
                aria-describedby={
                  errors.duration ? "duration-error" : "duration-hint"
                }
              />
            </FormField>
          </div>

          {/* Catégorie */}
          <FormField
            label="Catégorie"
            id="category"
            error={errors.category?.message}
            hint="Choisissez une catégorie pour mieux organiser vos services"
          >
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value || null)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {/* Service actif */}
          <FormField
            label=""
            id="isActive"
            hint="Les services inactifs ne seront pas proposés aux clients"
          >
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Service actif
                  </label>
                </div>
              )}
            />
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/services")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {getSubmitButtonText(isSubmitting, isEdit)}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
