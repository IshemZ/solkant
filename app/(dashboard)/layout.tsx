import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardNav from "@/components/layout/DashboardNav";
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
        />
      </header>

      {/* Contenu principal avec ID pour skip link */}
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
