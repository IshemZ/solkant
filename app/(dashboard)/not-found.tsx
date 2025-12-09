"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-7xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Ressource introuvable
          </h2>
          <p className="text-muted-foreground">
            Cette ressource n&apos;existe pas ou vous n&apos;avez pas
            l&apos;autorisation d&apos;y accéder.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
