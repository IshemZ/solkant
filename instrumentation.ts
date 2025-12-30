/**
 * Next.js instrumentation file
 * Exécuté au démarrage du serveur (runtime, pas build time)
 *
 * CRITICAL: Les env vars sont validées ICI et non dans les layouts
 * pour éviter les erreurs au build time sur Vercel
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import * as Sentry from "@sentry/nextjs";

type ProcessLike = {
  env?: Record<string, string | undefined>;
} & Record<string, unknown>;

function suppressDeprecationWarnings() {
  // Only run in Node.js runtime, not Edge Runtime
  const proc = (globalThis as unknown as { process?: ProcessLike }).process;
  if (!proc || proc.env?.NEXT_RUNTIME === "edge") return;

  // Additional safety check for Edge runtime compatibility
  const emitWarning = proc["emitWarning"] as
    | ((warning: unknown, ...args: unknown[]) => unknown)
    | undefined;
  if (!emitWarning) return;

  const originalEmitWarning = emitWarning.bind(proc);

  proc["emitWarning"] = function (warning: unknown, ...args: unknown[]) {
    // Filtrer uniquement DEP0169 (url.parse deprecation)
    if (typeof warning === "string" && warning.includes("DEP0169")) {
      return; // Ignorer ce warning spécifique
    }
    return originalEmitWarning(warning, ...args);
  };
}

async function validateEnvironment() {
  const { getEnv, logEnvSummary } = await import("./lib/env");

  try {
    getEnv();
    if (process.env.NODE_ENV === "development") {
      logEnvSummary();
    }
  } catch (error) {
    console.error("❌ Échec de validation des variables d'environnement:");
    console.error(error);

    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, {
        tags: { context: "env-validation" },
      });
      throw error;
    }
  }
}

export async function register() {
  // Node.js runtime (Server Components, API Routes, Server Actions)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    suppressDeprecationWarnings();
    await import("./sentry.server.config");

    // SKIP validation pendant le build
    const isBuilding = process.env.NEXT_PHASE === "phase-production-build";
    if (!isBuilding) {
      await validateEnvironment();
    }
  }

  // Edge runtime (Middleware)
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Capture unhandled errors in Server Components and API Routes
export const onRequestError = Sentry.captureRequestError;
