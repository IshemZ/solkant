// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Initialiser Sentry de base immédiatement (sans Replay pour réduire le bundle initial)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Adjust sample rate based on environment
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // Set environment tag
  environment: process.env.NODE_ENV || "development",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Replay sessions (5% in production) - configuré ici pour lazy-loaded integration
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 0.5,

  // Désactiver PII pour respecter RGPD
  sendDefaultPii: false,

  // Ignorer les erreurs communes non critiques
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "Network request failed",
  ],
});

// Lazy-load Replay Integration après le chargement initial
// Réduit le bundle initial de ~100-150KB
if (typeof window !== "undefined") {
  // Attendre 2 secondes après le chargement pour ne pas bloquer le rendu initial
  setTimeout(() => {
    const replayIntegration = Sentry.replayIntegration({
      maskAllText: true, // Masquer le texte pour RGPD
      blockAllMedia: true, // Bloquer les médias
      // Les sample rates sont configurés globalement dans l'init
    });

    Sentry.addIntegration(replayIntegration);
  }, 2000);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
