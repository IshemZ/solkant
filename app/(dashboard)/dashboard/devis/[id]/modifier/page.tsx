import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import QuoteFormEdit from "../../_components/QuoteFormEdit";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierDevisPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const businessId = session.user.businessId;

  // Fetch quote with items
  const quote = await prisma.quote.findFirst({
    where: {
      id,
      businessId,
    },
    include: {
      client: true,
      items: true,
    },
  });

  if (!quote) {
    notFound();
  }

  // Only allow editing DRAFT quotes
  if (quote.status !== "DRAFT") {
    redirect(`/dashboard/devis/${id}`);
  }

  // Fetch clients and services for the form
  const [clients, services] = await Promise.all([
    prisma.client.findMany({
      where: { businessId },
      orderBy: { lastName: "asc" },
    }),
    prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier le devis</h1>
        <p className="text-muted-foreground mt-2">Devis {quote.quoteNumber}</p>
      </div>

      <QuoteFormEdit quote={quote} clients={clients} services={services} />
    </div>
  );
}
