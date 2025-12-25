"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/layout/SignOutButton";
import MobileNav from "@/components/layout/MobileNav";

interface DashboardNavProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function DashboardNav({
  userName,
  userEmail,
}: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-foreground/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" aria-label="Retour au tableau de bord">
              <h1 className="text-2xl font-bold text-foreground">Solkant</h1>
            </Link>
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Navigation principale"
            >
              <Link
                href="/dashboard/devis/nouveau"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouveau devis
              </Link>
              <Link
                href="/dashboard/clients"
                className={
                  pathname === "/dashboard/clients"
                    ? "text-sm font-semibold text-foreground transition-colors border-b-2 border-foreground pb-1"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
                aria-current={
                  pathname === "/dashboard/clients" ? "page" : undefined
                }
              >
                Clients
              </Link>
              <Link
                href="/dashboard/services"
                className={
                  pathname === "/dashboard/services"
                    ? "text-sm font-semibold text-foreground transition-colors border-b-2 border-foreground pb-1"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
                aria-current={
                  pathname === "/dashboard/services" ? "page" : undefined
                }
              >
                Services
              </Link>
              <Link
                href="/dashboard/devis"
                className={
                  pathname === "/dashboard/devis" ||
                  pathname.startsWith("/dashboard/devis/")
                    ? "text-sm font-semibold text-foreground transition-colors border-b-2 border-foreground pb-1"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
                aria-current={
                  pathname === "/dashboard/devis" ||
                  pathname.startsWith("/dashboard/devis/")
                    ? "page"
                    : undefined
                }
              >
                Mes devis
              </Link>
              <Link
                href="/dashboard/abonnement"
                className={
                  pathname === "/dashboard/abonnement"
                    ? "text-sm font-semibold text-foreground transition-colors border-b-2 border-foreground pb-1"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
                aria-current={
                  pathname === "/dashboard/abonnement" ? "page" : undefined
                }
              >
                Abonnement
              </Link>
              <Link
                href="/dashboard/parametres"
                className={
                  pathname === "/dashboard/parametres"
                    ? "text-sm font-semibold text-foreground transition-colors border-b-2 border-foreground pb-1"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
                aria-current={
                  pathname === "/dashboard/parametres" ? "page" : undefined
                }
              >
                Paramètres
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="hidden sm:inline text-sm text-muted-foreground"
              aria-label={`Connecté en tant que ${userName || userEmail}`}
            >
              {userName || userEmail}
            </span>
            <div className="hidden md:block">
              <SignOutButton />
            </div>
            <MobileNav userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </header>
  );
}
