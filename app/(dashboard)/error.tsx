"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { location: "dashboard-error-boundary" },
      contexts: {
        errorBoundary: {
          digest: error.digest,
        },
      },
    });
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Une erreur est survenue
        </h2>

        <p className="mb-6 text-muted-foreground">
          Nous sommes désolés, une erreur inattendue s&apos;est produite lors du
          chargement de cette page.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 rounded-lg bg-muted p-4 text-left">
            <summary className="cursor-pointer font-medium text-sm">
              Détails techniques
            </summary>
            <p className="mt-2 text-xs font-mono text-muted-foreground break-all">
              {error.message}
            </p>
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

        <p className="mt-4 text-sm text-muted-foreground">
          Si le problème persiste,{" "}
          <a
            href="mailto:alaneicos@gmail.com"
            className="underline hover:text-foreground"
          >
            contactez le support
          </a>
        </p>
      </div>
    </div>
  );
}
