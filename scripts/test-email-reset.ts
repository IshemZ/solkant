/**
 * Script de test pour déboguer l'envoi d'email de réinitialisation
 * Usage: npx tsx scripts/test-email-reset.ts
 */

// Charger les variables d'environnement depuis .env
import { config } from "dotenv";
config();

import { sendPasswordResetEmail } from "../lib/email";
import { features } from "../lib/env";

async function testEmailReset() {
  console.log("\n🔍 Test d'envoi email réinitialisation mot de passe\n");
  console.log("=".repeat(60));

  // Vérifier la configuration
  console.log("\n📋 Configuration:");
  console.log(`   Email Service activé: ${features.emailService ? "✅ OUI" : "❌ NON (mode simulation)"}`);
  console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? "✅ Définie" : "❌ Non définie"}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);

  console.log("\n" + "=".repeat(60));
  console.log("\n📧 Test d'envoi...\n");

  // Test d'envoi
  const result = await sendPasswordResetEmail(
    "test@example.com",
    "Utilisateur Test",
    "123456"
  );

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Résultat:");
  console.log(`   Succès: ${result.success ? "✅ OUI" : "❌ NON"}`);

  if (result.error) {
    console.log(`   Erreur: ${result.error}`);
  }

  console.log("\n" + "=".repeat(60));

  if (result.success) {
    console.log("\n✅ Test réussi !");

    if (!features.emailService) {
      console.log("\n💡 Mode simulation actif.");
      console.log("   Le code OTP devrait être affiché ci-dessus.");
      console.log("   Pour activer l'envoi réel, décommentez RESEND_API_KEY dans .env");
    }
  } else {
    console.log("\n❌ Test échoué !");
    console.log("\n🔧 Solutions:");
    console.log("   1. Vérifiez que le serveur a été redémarré après modification .env");
    console.log("   2. Si RESEND_API_KEY est définie, vérifiez qu'elle est valide");
    console.log("   3. Commentez RESEND_API_KEY pour utiliser le mode simulation");
  }

  console.log("\n");
}

testEmailReset().catch(console.error);
