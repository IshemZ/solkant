import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  try {
    Sentry.init({
      dsn,
      enabled: true,

      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

      environment: process.env.NODE_ENV ?? "development",

      release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

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
    });

    // Lazy Replay (safe)
    if (typeof window !== "undefined") {
      setTimeout(() => {
        try {
          Sentry.addIntegration(
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            })
          );
        } catch (error) {
          // ne jamais casser le client - intentionally silent
          console.warn("Sentry replay integration failed:", error instanceof Error ? error.message : error);
        }
      }, 2000);
    }
  } catch (error) {
    console.warn("Sentry client init failed:", error instanceof Error ? error.message : error);
  }
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
