import { Metadata } from "next";
import { getServices } from "@/app/actions/services";
import { getPackages } from "@/app/actions/packages";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import ServicesList from "./_components/ServicesList";
import PackagesList from "./_components/PackagesList";
import ServiceTabs from "./_components/ServiceTabs";

export const metadata: Metadata = {
  title: "Services | Solkant",
  description: "Gérez votre catalogue de services",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || "services";

  const servicesResult = await getServices();
  const packagesResult = await getPackages();

  // Serialize Decimal fields to numbers for client components
  const serializedServices = servicesResult.success ? serializeDecimalFields(servicesResult.data) as any : [];
  const serializedPackages = packagesResult.success ? serializeDecimalFields(packagesResult.data) as any : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez votre catalogue de prestations
          </p>
        </div>
      </div>

      <ServiceTabs />

      {activeTab === "services" ? (
        !servicesResult.success ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {servicesResult.error}
          </div>
        ) : (
          <ServicesList initialServices={serializedServices} />
        )
      ) : (
        !packagesResult.success ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {packagesResult.error}
          </div>
        ) : (
          <PackagesList initialPackages={serializedPackages} />
        )
      )}
    </div>
  );
}
