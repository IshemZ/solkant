import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardStats } from "./_components/DashboardStats";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tableau de bord | Solkant",
  description: "Gérez vos devis et clients",
};

export default async function DashboardPage() {
  // Auth check handled by layout.tsx - session guaranteed to exist
  const session = await getServerSession(authOptions);

  // TypeScript safety: layout.tsx redirects if no session
  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Bienvenue, {session.user?.name?.split(" ")[0] || "Utilisateur"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Voici votre tableau de bord pour gérer vos devis et clients
        </p>
      </div>

      {/* Quick Stats with Suspense */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Actions rapides
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/devis/nouveau"
            className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5"
          >
            <div className="rounded-md bg-foreground p-2 text-background">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Nouveau devis</p>
              <p className="text-sm text-muted-foreground">
                Créer un nouveau devis
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/clients"
            className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5"
          >
            <div className="rounded-md bg-foreground p-2 text-background">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Nouveau client</p>
              <p className="text-sm text-muted-foreground">Ajouter un client</p>
            </div>
          </Link>

          <Link
            href="/dashboard/services"
            className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5"
          >
            <div className="rounded-md bg-foreground p-2 text-background">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Nouveau service</p>
              <p className="text-sm text-muted-foreground">Ajouter un service</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-8 rounded-lg border border-foreground/10 bg-foreground/5 p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Pour commencer
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">
                Configurez votre entreprise
              </p>
              <p className="text-sm text-muted-foreground">
                Ajoutez les informations de votre institut (nom, adresse, logo)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">
                Créez votre catalogue de services
              </p>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos prestations avec prix et durées
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Ajoutez vos clients</p>
              <p className="text-sm text-muted-foreground">
                Enregistrez les informations de vos clients
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
              4
            </div>
            <div>
              <p className="font-medium text-foreground">
                Créez votre premier devis
              </p>
              <p className="text-sm text-muted-foreground">
                Générez un devis professionnel en quelques clics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
