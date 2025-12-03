/**
 * Script de test Sentry
 *
 * Usage:
 *   npx tsx scripts/test-sentry.ts
 *
 * Ce script teste la configuration Sentry en envoyant une erreur de test.
 * Vérifiez ensuite dans le dashboard Sentry que l'erreur apparaît.
 */

import { config } from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import * as Sentry from "@sentry/nextjs";

// Initialiser Sentry comme en production
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: "test-script",
  tracesSampleRate: 1.0,
  enableLogs: true,
  sendDefaultPii: false,
});

async function testSentry() {
  console.log("🧪 Test de l'intégration Sentry...\n");

  if (!process.env.SENTRY_DSN) {
    console.error("❌ SENTRY_DSN non configuré dans .env.local");
    console.log('   Ajoutez SENTRY_DSN="your-dsn" dans .env.local');
    process.exit(1);
  }

  console.log(
    "✅ SENTRY_DSN configuré:",
    process.env.SENTRY_DSN.substring(0, 40) + "..."
  );

  try {
    // Test 1: Erreur simple
    console.log("\n📤 Envoi d'une erreur de test...");

    Sentry.captureException(new Error("Test Sentry depuis script de test"), {
      tags: {
        test: "script-test",
        environment: "development",
      },
      extra: {
        message: "Ceci est un test de l'intégration Sentry",
        timestamp: new Date().toISOString(),
      },
    });

    // Test 2: Message personnalisé
    Sentry.captureMessage("Test Sentry: Message personnalisé", {
      level: "info",
      tags: { test: "message-test" },
    });

    // Attendre que Sentry envoie les erreurs
    console.log("⏳ Envoi en cours...");
    await Sentry.flush(2000);

    console.log("\n✅ Test terminé !");
    console.log("\n📊 Vérifiez dans le dashboard Sentry:");
    console.log("   https://sentry.io/organizations/your-org/issues/");
    console.log("\n💡 Vous devriez voir 2 erreurs:");
    console.log('   1. "Test Sentry depuis script de test" (Error)');
    console.log('   2. "Test Sentry: Message personnalisé" (Info)');
  } catch (error) {
    console.error("\n❌ Erreur lors du test:", error);
    process.exit(1);
  }
}

testSentry();
