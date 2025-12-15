"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateBusiness } from "@/app/actions/business";
import type { Business } from "@prisma/client";
import LogoUpload from "./LogoUpload";
import { useRouter } from "next/navigation";

interface BusinessSettingsFormProps {
  business: Business;
}

export default function BusinessSettingsForm({
  business,
}: BusinessSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    // Convertir les chaînes vides en null pour les champs optionnels
    const data = {
      name: formData.get("name") as string,
      address: (formData.get("address") as string) || null, // Legacy field
      rue: (formData.get("rue") as string) || null,
      complement: (formData.get("complement") as string) || null,
      codePostal: (formData.get("codePostal") as string) || null,
      ville: (formData.get("ville") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      siret: (formData.get("siret") as string) || null,
      logo: null, // Pas encore implémenté dans le formulaire
      showInstallmentPayment: formData.get("showInstallmentPayment") === "on",
      pdfFileNamePrefix: (formData.get("pdfFileNamePrefix") as string) || null,
    };

    const result = await updateBusiness(data);

    if (!result.success) {
      setError(result.error || null);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors as Record<string, string[]>);
      }
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Informations mises à jour avec succès");
    }

    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-foreground/10 bg-background p-6"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Logo Upload */}
      <LogoUpload
        currentLogo={business.logo}
        onLogoChange={() => router.refresh()}
      />

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground"
        >
          Nom de l&apos;entreprise *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={business.name}
          required
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email professionnel
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={business.email || ""}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground"
        >
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={business.phone || ""}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.phone[0]}
          </p>
        )}
      </div>

      {/* Legacy Address Display */}
      {business.address && !business.rue && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Ancienne adresse :</p>
          <p className="text-muted-foreground">{business.address}</p>
        </div>
      )}

      {/* Structured Address Fields */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="rue"
            className="block text-sm font-medium text-foreground"
          >
            Rue *
          </label>
          <input
            type="text"
            id="rue"
            name="rue"
            defaultValue={business.rue || ""}
            required
            placeholder="123 Rue de Rivoli"
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
          />
          {fieldErrors.rue && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.rue[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="complement"
            className="block text-sm font-medium text-foreground"
          >
            Complément d&apos;adresse
          </label>
          <input
            type="text"
            id="complement"
            name="complement"
            defaultValue={business.complement || ""}
            placeholder="Bâtiment, appartement, étage (optionnel)"
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
          />
          {fieldErrors.complement && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.complement[0]}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="codePostal"
              className="block text-sm font-medium text-foreground"
            >
              Code postal *
            </label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              defaultValue={business.codePostal || ""}
              required
              placeholder="75001"
              maxLength={5}
              pattern="\d{5}"
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            {fieldErrors.codePostal && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.codePostal[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-medium text-foreground"
            >
              Ville *
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              defaultValue={business.ville || ""}
              required
              placeholder="Paris"
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            {fieldErrors.ville && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.ville[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="siret"
          className="block text-sm font-medium text-foreground"
        >
          SIRET
        </label>
        <input
          type="text"
          id="siret"
          name="siret"
          defaultValue={business.siret || ""}
          placeholder="123 456 789 00010"
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
        {fieldErrors.siret && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.siret[0]}
          </p>
        )}
      </div>

      {/* Options des devis */}
      <div className="border-t border-foreground/10 pt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Options des devis
        </h3>

        <div className="space-y-4">
          {/* Existing checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="showInstallmentPayment"
              name="showInstallmentPayment"
              defaultChecked={business.showInstallmentPayment}
              className="mt-1 h-4 w-4 rounded border-foreground/20 text-foreground focus:ring-foreground/40"
            />
            <div className="flex-1">
              <label
                htmlFor="showInstallmentPayment"
                className="block text-sm font-medium text-foreground cursor-pointer"
              >
                Afficher la mention de paiement en plusieurs fois
              </label>
              <p className="mt-1 text-sm text-foreground/60">
                Affiche &quot;Si paiement en 4× sans frais&quot; en bas du devis
              </p>
            </div>
          </div>

          {/* New field */}
          <div>
            <label
              htmlFor="pdfFileNamePrefix"
              className="block text-sm font-medium text-foreground"
            >
              Nom générique des fichiers PDF
            </label>
            <input
              type="text"
              id="pdfFileNamePrefix"
              name="pdfFileNamePrefix"
              defaultValue={business.pdfFileNamePrefix || ""}
              maxLength={25}
              placeholder="Ex: Devis Laser Diode"
              className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            <p className="mt-1 text-sm text-foreground/60">
              Si défini, les PDF seront nommés &quot;{"{nom générique}"} - {"{Nom}"} {"{Prénom}"}.pdf&quot;.
              Sinon, le numéro de devis sera utilisé.
            </p>
            {fieldErrors.pdfFileNamePrefix && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.pdfFileNamePrefix[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
