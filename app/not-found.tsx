"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-9xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight">
            Page introuvable
          </h2>
          <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              contactez-nous
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
