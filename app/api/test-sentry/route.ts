import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Route API pour tester Sentry
export async function GET() {
  try {
    // Test 1: Log d'info
    console.log("🧪 Test Sentry: Début des tests");

    // Test 2: Capture d'un message
    Sentry.captureMessage("Test Sentry: Message de test", {
      level: "info",
      tags: {
        test: "manual",
        environment: process.env.NODE_ENV,
      },
      extra: {
        timestamp: new Date().toISOString(),
        testType: "manual-verification",
      },
    });

    // Test 3: Simulation d'une erreur
    throw new Error("Test Sentry: Erreur de test volontaire");
  } catch (error) {
    // Cette erreur sera capturée par Sentry
    Sentry.captureException(error, {
      tags: {
        test: "manual",
        errorType: "test-error",
      },
      extra: {
        testDescription: "Erreur volontaire pour vérifier Sentry",
      },
    });

    console.log("✅ Test Sentry: Erreur capturée et envoyée à Sentry");

    return NextResponse.json({
      success: true,
      message: "Test Sentry exécuté avec succès",
      instructions: [
        "1. Vérifie la console du terminal",
        "2. Va sur https://sentry.io",
        "3. Sélectionne ton projet 'devisio'",
        "4. Tu devrais voir 2 événements :",
        "   - Un message 'Test Sentry: Message de test'",
        "   - Une erreur 'Test Sentry: Erreur de test volontaire'",
        "5. Vérifie les tags: test=manual, environment=development",
      ],
    });
  }
}
