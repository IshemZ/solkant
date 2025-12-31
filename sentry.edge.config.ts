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
  } catch (e) {
    // Edge-safe logging
    console.warn("Sentry edge init failed");
  }
}
