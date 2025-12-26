import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageById, type PackageWithRelations } from "@/app/actions/packages";
import PackageForm from "../../../_components/PackageForm";

export const metadata: Metadata = {
  title: "Modifier le forfait | Solkant",
  description: "Modifier un forfait existant",
};

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPackageById({ id });

  if (!result.success) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link
          href="/dashboard/services?tab=packages"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux forfaits
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Modifier le forfait
        </h1>
        <p className="mt-2 text-muted-foreground">
          Modifiez les informations de votre forfait
        </p>
      </div>

      <PackageForm mode="edit" initialData={result.data as PackageWithRelations} />
    </div>
  );
}
