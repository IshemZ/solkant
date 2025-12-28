import { Metadata } from "next";
import { getBusinessInfo } from "@/app/actions/business";
import BusinessSettingsForm from "./_components/BusinessSettingsForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Paramètres | Solkant",
  description: "Gérez les informations de votre entreprise",
};

export default async function ParametresPage() {
  const result = await getBusinessInfo();

  if (!result.success || !result.data) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Paramètres de l&apos;entreprise
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configurez les informations qui apparaîtront sur vos devis
        </p>
      </div>

      <BusinessSettingsForm business={result.data} />
    </div>
  );
}
