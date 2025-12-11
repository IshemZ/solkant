"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Input,
  Textarea,
  FormField,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { createClient, updateClient } from "@/app/actions/clients";
import { createClientSchema, type CreateClientInput } from "@/lib/validations";
import type { Client } from "@prisma/client";

interface ClientFormProps {
  client?: Client;
  mode?: "create" | "edit";
}

export default function ClientForm({
  client,
  mode = "create",
}: ClientFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      firstName: client?.firstName || "",
      lastName: client?.lastName || "",
      email: client?.email || null,
      phone: client?.phone || null,
      address: client?.address || null,
      notes: client?.notes || null,
    },
    mode: "onChange", // Validation en temps réel
  });

  async function onSubmit(data: CreateClientInput) {
    try {
      const result =
        isEdit && client
          ? await updateClient(client.id, data)
          : await createClient(data);

      if ("error" in result) {
        toast.error(result.error);
        if ("fieldErrors" in result && result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              setError(key as keyof CreateClientInput, {
                type: "server",
                message: value[0],
              });
            }
          });
        }
      } else {
        toast.success(
          isEdit ? "Client modifié avec succès" : "Client créé avec succès"
        );
        router.push("/dashboard/clients");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Modifier le client" : "Nouveau client"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Modifiez les informations du client"
            : "Remplissez les informations du nouveau client"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Prénom et Nom */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Prénom"
              id="firstName"
              required
              error={errors.firstName?.message}
            >
              <Input
                id="firstName"
                {...register("firstName")}
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
              />
            </FormField>

            <FormField
              label="Nom"
              id="lastName"
              required
              error={errors.lastName?.message}
            >
              <Input
                id="lastName"
                {...register("lastName")}
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
              />
            </FormField>
          </div>

          {/* Email et Téléphone */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Email"
              id="email"
              error={errors.email?.message}
              hint="Format : exemple@email.com"
            >
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="exemple@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
              />
            </FormField>

            <FormField
              label="Téléphone"
              id="phone"
              error={errors.phone?.message}
              hint="Format français : 06 12 34 56 78"
            >
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="06 12 34 56 78"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
              />
            </FormField>
          </div>

          {/* Adresse */}
          <FormField
            label="Adresse"
            id="address"
            error={errors.address?.message}
          >
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Rue Exemple, 75001 Paris"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
          </FormField>

          {/* Notes */}
          <FormField
            label="Notes"
            id="notes"
            error={errors.notes?.message}
            hint="Informations supplémentaires sur le client"
          >
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Notes, préférences, historique..."
              rows={4}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? "notes-error" : "notes-hint"}
            />
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/clients")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Modification..."
                  : "Création..."
                : isEdit
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
