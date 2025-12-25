import { Metadata } from "next";
import Link from "next/link";
import PackageForm from "../../_components/PackageForm";

export const metadata: Metadata = {
  title: "Nouveau forfait | Solkant",
  description: "Créer un nouveau forfait",
};

export default function NewPackagePage() {
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
          Nouveau forfait
        </h1>
        <p className="mt-2 text-muted-foreground">
          Créez un forfait en combinant plusieurs services
        </p>
      </div>

      <PackageForm mode="create" />
    </div>
  );
}
