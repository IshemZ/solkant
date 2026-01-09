"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
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
import {
  createClientSchema,
  type CreateClientInput,
  type CreateClientResult,
} from "@/lib/validations";
import type { Client } from "@prisma/client";

interface ClientFormProps {
  client?: Client;
  mode?: "create" | "edit";
}

function getSubmitButtonText(isSubmitting: boolean, isEdit: boolean): string {
  if (isSubmitting) {
    return isEdit ? "Modification..." : "Création...";
  }
  return isEdit ? "Modifier" : "Créer";
}

export default function ClientForm({
  client,
  mode = "create",
}: ClientFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const { trackEvent } = useAnalytics();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      firstName: client?.firstName || "",
      lastName: client?.lastName || "",
      email: client?.email || null,
      phone: client?.phone || "",
      address: client?.address || null, // Legacy field
      rue: client?.rue || null,
      complement: client?.complement || null,
      codePostal: client?.codePostal || null,
      ville: client?.ville || null,
      notes: client?.notes || null,
    },
    mode: "onChange", // Validation en temps réel
  });

  /**
   * Auto-parse legacy address on mount if structured fields are empty
   * This provides seamless migration without changing the UI
   */
  useEffect(() => {
    // Only parse if we have a legacy address but no structured address
    if (
      client?.address &&
      !client?.rue &&
      !client?.codePostal &&
      !client?.ville
    ) {
      const address = client.address.trim();

      // Try to find postal code (5 digits)
      const postalCodeMatch = /\b(\d{5})\b/.exec(address);
      const postalCode = postalCodeMatch ? postalCodeMatch[1] : "";

      // Try to extract city (word(s) after postal code)
      let city = "";
      let street = address;

      if (postalCode && postalCodeMatch) {
        const parts = address.split(postalCode);
        street = parts[0].trim();
        city = parts[1]?.trim() || "";
      }

      // Set values silently
      setValue("rue", street || address);
      if (postalCode) {
        setValue("codePostal", postalCode);
      }
      if (city) {
        setValue("ville", city);
      }
    }
  }, [
    client?.address,
    client?.rue,
    client?.codePostal,
    client?.ville,
    setValue,
  ]);

  async function onSubmit(data: CreateClientInput) {
    try {
      // If structured fields are filled, clear legacy address field
      const submitData = { ...data };
      if (submitData.rue || submitData.codePostal || submitData.ville) {
        submitData.address = null;
      }

      const result =
        isEdit && client
          ? await updateClient({ id: client.id, ...submitData })
          : await createClient(submitData);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(
          isEdit ? "Client modifié avec succès" : "Client créé avec succès"
        );

        // Track analytics event for client creation (not for edits)
        if (!isEdit) {
          trackEvent("create_client", {
            page_category: "dashboard",
          });

          // Track first-time activation milestone
          const clientData = result.data as CreateClientResult;
          if (clientData.isFirstClient) {
            trackEvent("create_first_client", {
              page_category: "dashboard",
            });
          }
        }

        router.push("/dashboard/clients");
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error("Une erreur est survenue");

      // Track dashboard error
      trackEvent("dashboard_error", {
        error_type: "client_creation_failed",
        error_message: errorMessage,
        page_category: "dashboard",
      });
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
                autoComplete="given-name"
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
                autoComplete="family-name"
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
              hint="Format : exemple@email.com (optionnel)"
            >
              <Input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                placeholder="exemple@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
              />
            </FormField>

            <FormField
              label="Téléphone"
              id="phone"
              required
              error={errors.phone?.message}
              hint="Format français : 06 12 34 56 78"
            >
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
              />
            </FormField>
          </div>

          {/* Structured Address Fields */}
          <div className="space-y-4">
            <FormField
              label="Rue"
              id="rue"
              error={errors.rue?.message}
              hint="Optionnel"
            >
              <Input
                id="rue"
                {...register("rue")}
                autoComplete="street-address"
                placeholder="123 Rue de Rivoli"
                aria-invalid={!!errors.rue}
                aria-describedby={errors.rue ? "rue-error" : "rue-hint"}
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
                autoComplete="address-line2"
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
                error={errors.codePostal?.message}
                hint="5 chiffres (optionnel)"
              >
                <Input
                  id="codePostal"
                  {...register("codePostal")}
                  autoComplete="postal-code"
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
                error={errors.ville?.message}
                hint="Optionnel"
              >
                <Input
                  id="ville"
                  {...register("ville")}
                  autoComplete="address-level2"
                  placeholder="Paris"
                  aria-invalid={!!errors.ville}
                  aria-describedby={errors.ville ? "ville-error" : "ville-hint"}
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
              {getSubmitButtonText(isSubmitting, isEdit)}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
