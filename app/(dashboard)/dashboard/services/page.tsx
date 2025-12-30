import { Metadata } from "next";
import { getServices } from "@/app/actions/services";
import { getPackages } from "@/app/actions/packages";
import ServicesList from "./_components/ServicesList";
import PackagesList from "./_components/PackagesList";
import ServiceTabs from "./_components/ServiceTabs";

export const metadata: Metadata = {
  title: "Services | Solkant",
  description: "Gérez votre catalogue de services",
};

function renderTabContent(
  activeTab: string,
  servicesResult: any,
  packagesResult: any,
  services: any[],
  packages: any[]
) {
  if (activeTab === "services") {
    if (!servicesResult.success) {
      return (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {servicesResult.error}
        </div>
      );
    }
    return <ServicesList initialServices={services} />;
  }

  if (!packagesResult.success) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
        {packagesResult.error}
      </div>
    );
  }
  return <PackagesList initialPackages={packages} />;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || "services";

  const servicesResult = await getServices();
  const packagesResult = await getPackages();

  // Server actions already serialize Decimal fields, no need to do it again
  const services = servicesResult.success ? servicesResult.data : [];
  const packages = packagesResult.success ? packagesResult.data : [];

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

      {renderTabContent(activeTab, servicesResult, packagesResult, services, packages)}
    </div>
  );
}
