#!/usr/bin/env node

/**
 * Script de migration sécurisé pour la production
 *
 * Sécurités implémentées :
 * 1. Bloque les commandes dangereuses en production
 * 2. Exige une confirmation manuelle
 * 3. Vérifie l'environnement
 * 4. Affiche un résumé des migrations à appliquer
 */

import { execSync } from "node:child_process";
import readline from "node:readline";

// Couleurs pour la console
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Environnement sécurisé avec PATH fixe (répertoires non modifiables uniquement)
const secureEnv = {
  ...process.env,
  PATH: "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ERREUR: ${message}`, "red");
  process.exit(1);
}

function warning(message) {
  log(`⚠️  ATTENTION: ${message}`, "yellow");
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function info(message) {
  log(`ℹ️  ${message}`, "cyan");
}

// Vérifier que nous ne sommes pas en train d'exécuter des commandes dangereuses
function checkDangerousCommands() {
  const dangerousCommands = [
    "prisma migrate reset",
    "prisma db push --force-reset",
    "prisma migrate resolve --rolled-back",
  ];

  const processArgs = process.argv.join(" ");

  for (const cmd of dangerousCommands) {
    if (processArgs.includes(cmd)) {
      error(
        `Commande dangereuse détectée: ${cmd}\nCette commande est bloquée en production.`
      );
    }
  }
}

// Vérifier l'environnement
function checkEnvironment() {
  const nodeEnv = process.env.NODE_ENV;
  const isProduction = nodeEnv === "production";
  const isVercel = !!process.env.VERCEL;

  info(`Environnement: ${nodeEnv || "development"}`);
  info(`Plateforme: ${isVercel ? "Vercel" : "Local"}`);

  if (!process.env.DATABASE_URL) {
    error("DATABASE_URL n'est pas définie");
  }

  if (!process.env.DIRECT_URL && isProduction) {
    warning(
      "DIRECT_URL n'est pas définie (peut causer des problèmes de migration)"
    );
  }

  return { isProduction, isVercel };
}

// Obtenir le statut des migrations
function getMigrationStatus() {
  try {
    info("Vérification du statut des migrations...\n");
    const status = execSync("npx prisma migrate status", {
      encoding: "utf-8",
      stdio: "pipe",
      env: secureEnv,
    });
    console.log(status);
    return status;
  } catch (err) {
    // migrate status retourne un code d'erreur s'il y a des migrations en attente
    console.log(err.stdout || err.message);
    return err.stdout || "";
  }
}

// Demander confirmation à l'utilisateur
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      `${colors.yellow}${question} (tapez 'OUI' pour confirmer): ${colors.reset}`,
      (answer) => {
        rl.close();
        resolve(answer.toUpperCase() === "OUI");
      }
    );
  });
}

// Exécuter les migrations
function runMigrations({ skipConfirmation = false }) {
  try {
    info("Application des migrations...\n");

    execSync("npx prisma migrate deploy", {
      encoding: "utf-8",
      stdio: "inherit",
      env: secureEnv,
    });

    success("Migrations appliquées avec succès !");

    // Vérifier le statut final
    info("\nStatut final des migrations:");
    execSync("npx prisma migrate status", {
      encoding: "utf-8",
      stdio: "inherit",
      env: secureEnv,
    });

    return true;
  } catch (err) {
    error(`Échec de l'application des migrations:\n${err.message}`);
    return false;
  }
}

// Fonction principale
async function main() {
  log(
    "\n╔════════════════════════════════════════════════════════╗",
    "magenta"
  );
  log("║     Script de Migration Sécurisé - Production         ║", "magenta");
  log(
    "╚════════════════════════════════════════════════════════╝\n",
    "magenta"
  );

  // 1. Vérifier les commandes dangereuses
  checkDangerousCommands();

  // 2. Vérifier l'environnement
  const { isProduction, isVercel } = checkEnvironment();

  // 3. Obtenir le statut des migrations
  const status = getMigrationStatus();

  // 4. Vérifier s'il y a des migrations à appliquer
  const hasPendingMigrations =
    status.includes("following migration") ||
    status.includes("not yet been applied");

  if (!hasPendingMigrations) {
    success("Aucune migration en attente. Base de données à jour !");
    process.exit(0);
  }

  // 5. En production ou Vercel, exiger une confirmation manuelle
  const skipConfirmation =
    process.argv.includes("--skip-confirmation") ||
    process.env.SKIP_MIGRATION_CONFIRMATION === "true";

  if ((isProduction || isVercel) && !skipConfirmation) {
    log(
      "\n⚠️  ATTENTION: Vous êtes sur le point d'appliquer des migrations en PRODUCTION!\n",
      "red"
    );
    warning("Assurez-vous d'avoir:");
    console.log("  1. Testé les migrations en développement");
    console.log("  2. Fait une sauvegarde de la base de données");
    console.log("  3. Vérifié que les migrations sont réversibles\n");

    const confirmed = await askConfirmation("Voulez-vous vraiment continuer ?");

    if (!confirmed) {
      warning("Migration annulée par l'utilisateur.");
      process.exit(1);
    }
  }

  // 6. Appliquer les migrations
  const migrationSuccess = runMigrations({ skipConfirmation });

  if (migrationSuccess) {
    log(
      "\n╔════════════════════════════════════════════════════════╗",
      "green"
    );
    log("║          Migrations appliquées avec succès !           ║", "green");
    log(
      "╚════════════════════════════════════════════════════════╝\n",
      "green"
    );
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on("uncaughtException", (err) => {
  error(`Erreur non gérée: ${err.message}`);
});

process.on("unhandledRejection", (err) => {
  error(`Promesse rejetée: ${err.message}`);
});

// Exécuter le script (ESM: le script s'exécute toujours directement)
main().catch((err) => {
  error(`Erreur fatale: ${err.message}`);
});

export { main };
