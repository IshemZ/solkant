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

      ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "Non-Error promise rejection captured",
      ],

      beforeSend(event) {
        if (event.user) {
          delete event.user.email;
          delete event.user.username;
          delete (event.user as any).ip_address;
        }
        if (event.request && (event.request as any).data) {
          (event.request as any).data = "[redacted]";
        }
        return event;
      },

      initialScope: {
        tags: {
          runtime: "nodejs",
          project: "solkant",
        },
      },
    });
  } catch (e) {
    console.warn("Sentry server init failed", e);
  }
}
