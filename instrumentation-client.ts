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
        } catch {
          // ne jamais casser le client
        }
      }, 2000);
    }
  } catch (e) {
    console.warn("Sentry client init failed", e);
  }
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
