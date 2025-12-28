import { Metadata } from "next";
import { getClients } from "@/app/actions/clients";
import { getServices } from "@/app/actions/services";
import { getPackages } from "@/app/actions/packages";
import QuoteFormNew from "../_components/QuoteFormNew";
import { EmptyState } from "@/components/ui/empty-state";
import { redirect } from "next/navigation";
import { Users, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Nouveau devis | Solkant",
  description: "Créer un nouveau devis",
};

export default async function NewQuotePage() {
  const [clientsResult, servicesResult, packagesResult] = await Promise.all([
    getClients({}),
    getServices({}),
    getPackages({}),
  ]);

  if (!clientsResult.success || !servicesResult.success || !packagesResult.success) {
    redirect("/dashboard");
  }

  const clients = clientsResult.data;
  const services = servicesResult.data;
  const packages = packagesResult.data;

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nouveau devis</h1>
        <p className="mt-2 text-muted-foreground">
          Créez un devis professionnel pour votre client
        </p>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun client"
          description="Vous devez créer au moins un client avant de pouvoir générer un devis."
          actionLabel="Créer un client"
          actionHref="/dashboard/clients/nouveau"
        />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun service"
          description="Vous devez créer au moins un service avant de pouvoir générer un devis."
          actionLabel="Créer un service"
          actionHref="/dashboard/services/nouveau"
        />
      ) : (
        <QuoteFormNew clients={clients} services={services} packages={packages} />
      )}
    </div>
  );
}
