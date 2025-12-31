import * as Sentry from "@sentry/nextjs";

export async function register() {
  const runtime = process.env.NEXT_RUNTIME;

  if (runtime === "nodejs") {
    try {
      await import("./sentry.server.config");
    } catch (e) {
      console.warn("Sentry server config failed", e);
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
          } catch {}
          throw error;
        }
      }
    }
  }

  if (runtime === "edge") {
    try {
      await import("./sentry.edge.config");
    } catch {
      // edge-safe no-op
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
