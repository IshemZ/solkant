import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import ServiceForm from "../../_components/ServiceForm";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return {
      title: "Accès refusé | Solkant",
      description: "Vous devez être connecté pour accéder à cette page.",
    };
  }

  const service = await prisma.service.findFirst({
    where: {
      id,
      businessId: session.user.businessId,
    },
  });

  if (!service) {
    return {
      title: "Service introuvable | Solkant",
      description: "Ce service n'existe pas ou n'est plus accessible.",
    };
  }

  return {
    title: `Modifier ${service.name} | Solkant`,
    description: `Modification du service ${
      service.name
    } - ${Number(service.price).toFixed(2)} € - ${service.duration} min`,
  };
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    notFound();
  }

  // Récupérer le service avec vérification du tenant
  const service = await prisma.service.findFirst({
    where: {
      id,
      businessId: session.user.businessId,
    },
  });

  if (!service) {
    notFound();
  }

  // Serialize Decimal fields for Client Component
  const serializedService = serializeDecimalFields(service) as unknown as import("@/types/quote").SerializedService;

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le service
        </h1>
        <p className="mt-2 text-muted-foreground">{service.name}</p>
      </div>

      <ServiceForm service={serializedService} mode="edit" />
    </div>
  );
}
