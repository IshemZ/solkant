/**
 * Next.js instrumentation file
 * Exécuté au démarrage du serveur (une seule fois)
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Server-side only
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logEnvSummary } = await import("./lib/env");
    logEnvSummary();
  }
}
