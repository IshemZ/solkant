import * as Sentry from "@sentry/nextjs";

export async function register() {
  const runtime = process.env.NEXT_RUNTIME;

  if (runtime === "nodejs") {
    try {
      await import("./sentry.server.config");
    } catch (error) {
      console.warn("Sentry server config failed:", error instanceof Error ? error.message : error);
    }

    const isBuilding = process.env.NEXT_PHASE === "phase-production-build";

    if (!isBuilding) {
      try {
        const { getEnv, logEnvSummary } = await import("./lib/env");
        getEnv();
        if (process.env.NODE_ENV === "development") {
          logEnvSummary();
        }
      } catch (error) {
        console.error("❌ Env validation failed", error);

        if (process.env.NODE_ENV === "production") {
          try {
            Sentry.captureException(error, {
              tags: { context: "env-validation" },
            });
          } catch (sentryError) {
            // Sentry capture failed - intentionally silent to avoid cascade
            console.warn("Sentry capture failed:", sentryError instanceof Error ? sentryError.message : sentryError);
          }
          throw error;
        }
      }
    }
  }

  if (runtime === "edge") {
    try {
      await import("./sentry.edge.config");
    } catch (error) {
      // edge-safe no-op - intentionally silent to prevent edge runtime crash
      console.warn("Sentry edge config failed:", error instanceof Error ? error.message : error);
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
