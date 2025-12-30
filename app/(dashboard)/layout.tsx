import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardNav from "./dashboard/_components/DashboardNav";
import { SkipLink } from "@/components/shared/SkipLink";

/**
 * Force Dynamic Rendering pour toutes les routes dashboard
 *
 * CRITIQUE: Les routes protégées nécessitent une session utilisateur
 * et ne peuvent PAS être prerenderées statiquement au build.
 *
 * Sans cette config, Next.js tente de prerender au build time,
 * déclenchant la validation des env vars avant que l'app soit lancée.
 */
export const dynamic = "force-dynamic";

// Métadonnées pour toutes les pages dashboard
// Ces pages ne doivent PAS être indexées par les moteurs de recherche (espace membre privé)
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link pour navigation clavier */}
      <SkipLink />

      {/* Header avec navigation - présent sur toutes les pages */}
      <header role="banner">
        <DashboardNav
          userName={session.user?.name}
          userEmail={session.user?.email}
          session={session}
        />
      </header>

      {/* Contenu principal avec ID pour skip link */}
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
