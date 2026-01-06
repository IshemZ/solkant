import * as Sentry from "@sentry/nextjs";

function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function initSentryServer(): Promise<void> {
  try {
    await import("./sentry.server.config");
  } catch (error) {
    console.warn("Sentry server config failed:", formatErrorMessage(error));
  }
}

async function initSentryEdge(): Promise<void> {
  try {
    await import("./sentry.edge.config");
  } catch (error) {
    console.warn("Sentry edge config failed:", formatErrorMessage(error));
  }
}

function reportEnvValidationError(error: unknown): void {
  try {
    Sentry.captureException(error, {
      tags: { context: "env-validation" },
    });
  } catch (sentryError) {
    console.warn("Sentry capture failed:", formatErrorMessage(sentryError));
  }
}

async function validateEnv(): Promise<void> {
  const { getEnv, logEnvSummary } = await import("./lib/env");
  getEnv();

  if (process.env.NODE_ENV === "development") {
    logEnvSummary();
  }
}

async function handleEnvValidation(): Promise<void> {
  const isBuilding = process.env.NEXT_PHASE === "phase-production-build";
  if (isBuilding) return;

  try {
    await validateEnv();
  } catch (error) {
    console.error("❌ Env validation failed", error);

    if (process.env.NODE_ENV === "production") {
      reportEnvValidationError(error);
      throw error;
    }
  }
}

async function registerNodejs(): Promise<void> {
  await initSentryServer();
  await handleEnvValidation();
}

export async function register(): Promise<void> {
  const runtime = process.env.NEXT_RUNTIME;

  if (runtime === "nodejs") {
    await registerNodejs();
  }

  if (runtime === "edge") {
    await initSentryEdge();
  }
}

export const onRequestError = Sentry.captureRequestError;
