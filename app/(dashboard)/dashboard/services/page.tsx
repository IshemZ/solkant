import { Metadata } from "next";
import { getServices } from "@/app/actions/services";
import ServicesList from "./_components/ServicesList";

export const metadata: Metadata = {
  title: "Services | Solkant",
  description: "Gérez votre catalogue de services",
};

export default async function ServicesPage() {
  const result = await getServices();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="mt-2 text-foreground/60">
            Gérez votre catalogue de prestations
          </p>
        </div>
      </div>

      {!result.success ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {result.error}
        </div>
      ) : (
        <ServicesList initialServices={result.data || []} />
      )}
    </div>
  );
}
