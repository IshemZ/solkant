import { Metadata } from "next";
import { getClients } from "@/app/actions/clients";
import { getServices } from "@/app/actions/services";
import { getPackages } from "@/app/actions/packages";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import QuoteForm from "../_components/QuoteFormUnified";
import { EmptyState } from "@/components/ui/empty-state";
import { redirect } from "next/navigation";
import { Users, Briefcase } from "lucide-react";
import type { SerializedService, SerializedPackage } from "@/types/quote";
import type { Client } from "@prisma/client";

export const metadata: Metadata = {
  title: "Nouveau devis | Solkant",
  description: "Créer un nouveau devis",
};

function getPageContent(
  clients: Client[],
  services: SerializedService[],
  packages: SerializedPackage[]
) {
  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun client"
        description="Vous devez créer au moins un client avant de pouvoir générer un devis."
        actionLabel="Créer un client"
        actionHref="/dashboard/clients/nouveau"
      />
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucun service"
        description="Vous devez créer au moins un service avant de pouvoir générer un devis."
        actionLabel="Créer un service"
        actionHref="/dashboard/services/nouveau"
      />
    );
  }

  return <QuoteForm mode="create" clients={clients} services={services} packages={packages} />;
}

export default async function NewQuotePage() {
  const [clientsResult, servicesResult, packagesResult] = await Promise.all([
    getClients(),
    getServices(),
    getPackages(),
  ]);

  if (!clientsResult.success || !servicesResult.success || !packagesResult.success) {
    redirect("/dashboard");
  }

  const clients = clientsResult.data;
  const services = servicesResult.data;
  const packages = packagesResult.data;

  // Serialize Decimal fields to numbers for client component
  const serializedServices = serializeDecimalFields(services) as SerializedService[];
  const serializedPackages = serializeDecimalFields(packages) as SerializedPackage[];

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nouveau devis</h1>
        <p className="mt-2 text-muted-foreground">
          Créez un devis professionnel pour votre client
        </p>
      </div>

      {getPageContent(clients, serializedServices, serializedPackages)}
    </div>
  );
}
