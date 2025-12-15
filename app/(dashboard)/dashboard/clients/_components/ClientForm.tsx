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
      address: client?.address || null, // Legacy field
      rue: client?.rue || null,
      complement: client?.complement || null,
      codePostal: client?.codePostal || null,
      ville: client?.ville || null,
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

      if (!result.success) {
        toast.error(result.error);
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

          {/* Legacy Address Display */}
          {client?.address && !client?.rue && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Ancienne adresse :</p>
              <p className="text-muted-foreground">{client.address}</p>
            </div>
          )}

          {/* Structured Address Fields */}
          <div className="space-y-4">
            <FormField
              label="Rue"
              id="rue"
              required
              error={errors.rue?.message}
            >
              <Input
                id="rue"
                {...register("rue")}
                placeholder="123 Rue de Rivoli"
                aria-invalid={!!errors.rue}
                aria-describedby={errors.rue ? "rue-error" : undefined}
              />
            </FormField>

            <FormField
              label="Complément d'adresse"
              id="complement"
              error={errors.complement?.message}
              hint="Bâtiment, appartement, étage (optionnel)"
            >
              <Input
                id="complement"
                {...register("complement")}
                placeholder="Appartement 4B"
                aria-invalid={!!errors.complement}
                aria-describedby={
                  errors.complement ? "complement-error" : "complement-hint"
                }
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Code postal"
                id="codePostal"
                required
                error={errors.codePostal?.message}
                hint="5 chiffres"
              >
                <Input
                  id="codePostal"
                  {...register("codePostal")}
                  placeholder="75001"
                  maxLength={5}
                  pattern="\d{5}"
                  aria-invalid={!!errors.codePostal}
                  aria-describedby={
                    errors.codePostal ? "codePostal-error" : "codePostal-hint"
                  }
                />
              </FormField>

              <FormField
                label="Ville"
                id="ville"
                required
                error={errors.ville?.message}
              >
                <Input
                  id="ville"
                  {...register("ville")}
                  placeholder="Paris"
                  aria-invalid={!!errors.ville}
                  aria-describedby={errors.ville ? "ville-error" : undefined}
                />
              </FormField>
            </div>
          </div>

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
