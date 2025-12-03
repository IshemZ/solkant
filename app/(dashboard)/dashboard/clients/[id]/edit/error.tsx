"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EditClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Edit client page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">❌</div>

        <h2 className="mb-3 text-xl font-bold">
          Impossible de charger ce client
        </h2>

        <p className="mb-6 text-sm text-muted-foreground">
          Une erreur s&apos;est produite lors du chargement des informations du
          client. Le client n&apos;existe peut-être pas ou a été supprimé.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-4 rounded bg-muted p-3 text-left">
            <p className="text-xs font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Réessayer
          </button>

          <Link
            href="/dashboard/clients"
            className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Retour aux clients
          </Link>
        </div>
      </div>
    </div>
  );
}
