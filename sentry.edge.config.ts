import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  try {
    Sentry.init({
      dsn,
      enabled: true,

      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      environment: process.env.NODE_ENV ?? "development",

      release: process.env.SENTRY_RELEASE,

      sendDefaultPii: false,

      initialScope: {
        tags: {
          runtime: "edge",
          project: "solkant",
        },
      },
    });
  } catch (error) {
    // Edge-safe logging - intentionally catching to prevent app crash if Sentry fails
    console.warn("Sentry edge init failed:", error instanceof Error ? error.message : error);
  }
}
