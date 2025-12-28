import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPackages } from "@/app/actions/packages";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import QuoteForm from "../../_components/QuoteFormUnified";

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

  // Fetch clients, services, and packages for the form
  const [clients, services, packagesResult] = await Promise.all([
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
    getPackages({}),
  ]);

  // Check if packages fetch was successful
  if (!packagesResult.success) {
    redirect("/dashboard");
  }

  const packages = packagesResult.data;

  // Serialize Decimal fields to numbers for client component
  const serializedQuote = serializeDecimalFields(quote) as any;
  const serializedServices = serializeDecimalFields(services) as any;
  const serializedPackages = serializeDecimalFields(packages) as any;

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Modifier le devis</h1>
        <p className="mt-2 text-muted-foreground">Devis {quote.quoteNumber}</p>
      </div>

      <QuoteForm mode="edit" initialQuote={serializedQuote} clients={clients} services={serializedServices} packages={serializedPackages} />
    </div>
  );
}
