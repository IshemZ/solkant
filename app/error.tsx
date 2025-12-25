"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

/**
 * Global error boundary for root layout errors
 * Catches errors that occur before dashboard layout is reached
 * (e.g., auth errors, env validation failures)
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { location: "root-error-boundary" },
      contexts: {
        errorBoundary: {
          digest: error.digest,
        },
      },
    });
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Une erreur est survenue
            </h1>

            <p className="mb-6 text-lg text-muted-foreground">
              Nous sommes désolés, une erreur inattendue s&apos;est produite
              lors du chargement de cette page.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 rounded-lg bg-muted p-4 text-left">
                <summary className="cursor-pointer font-medium text-sm">
                  Détails techniques
                </summary>
                <p className="mt-2 text-xs font-mono text-muted-foreground break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
                {error.digest && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID: {error.digest}
                  </p>
                )}
              </details>
            )}

            <button
              onClick={reset}
              className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            >
              Réessayer
            </button>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Si le problème persiste :
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-sm text-foreground underline hover:text-foreground/80"
                >
                  Retour à l&apos;accueil
                </Link>
                <a
                  href="mailto:alaneicos@gmail.com"
                  className="text-sm text-foreground underline hover:text-foreground/80"
                >
                  Contacter le support
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
