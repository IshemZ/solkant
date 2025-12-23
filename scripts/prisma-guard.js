#!/usr/bin/env node

/**
 * Guard de sécurité pour les commandes Prisma
 *
 * Ce script intercepte les commandes Prisma dangereuses en production
 * et empêche leur exécution accidentelle.
 *
 * Usage:
 *   Add to package.json:
 *   "prisma:safe": "node scripts/prisma-guard.js"
 */

const { execSync } = require('child_process');

const DANGEROUS_COMMANDS = {
  'migrate reset': {
    severity: 'CRITIQUE',
    description: 'Supprime toutes les données et réinitialise la base de données',
    blockedIn: ['production', 'staging'],
  },
  'db push --force-reset': {
    severity: 'CRITIQUE',
    description: 'Force la réinitialisation du schéma (perte de données)',
    blockedIn: ['production', 'staging'],
  },
  'db push --accept-data-loss': {
    severity: 'CRITIQUE',
    description: 'Accepte la perte de données lors du push',
    blockedIn: ['production'],
  },
  'migrate resolve --rolled-back': {
    severity: 'ÉLEVÉE',
    description: 'Marque une migration comme annulée (peut causer des incohérences)',
    blockedIn: ['production'],
  },
};

const REQUIRES_CONFIRMATION = {
  'migrate deploy': {
    description: 'Applique les migrations en base de données',
    requiresConfirmation: ['production', 'staging'],
  },
  'db push': {
    description: 'Synchronise le schéma sans créer de migration',
    requiresConfirmation: ['production', 'staging'],
  },
};

function getEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isVercel = !!process.env.VERCEL;
  const isProduction = nodeEnv === 'production' || isVercel;
  const isStaging = nodeEnv === 'staging';

  return {
    name: nodeEnv,
    isProduction,
    isStaging,
    isDevelopment: !isProduction && !isStaging,
  };
}

function checkDangerousCommand(command, env) {
  for (const [dangerousCmd, config] of Object.entries(DANGEROUS_COMMANDS)) {
    if (command.includes(dangerousCmd)) {
      const isBlocked = config.blockedIn.includes(env.name) ||
                       (config.blockedIn.includes('production') && env.isProduction) ||
                       (config.blockedIn.includes('staging') && env.isStaging);

      if (isBlocked) {
        console.error('\n╔═══════════════════════════════════════════════════════╗');
        console.error('║                  🚨 COMMANDE BLOQUÉE 🚨                ║');
        console.error('╚═══════════════════════════════════════════════════════╝\n');
        console.error(`Commande: prisma ${dangerousCmd}`);
        console.error(`Sévérité: ${config.severity}`);
        console.error(`Description: ${config.description}`);
        console.error(`Environnement: ${env.name}`);
        console.error(`\nCette commande est bloquée en ${config.blockedIn.join(', ')}.`);
        console.error('\n💡 Suggestions:');
        console.error('  - Utilisez cette commande uniquement en développement');
        console.error('  - Pour la production, utilisez: npm run migrate:prod');
        console.error('  - Contactez l\'équipe DevOps si vous devez vraiment exécuter cette commande\n');
        process.exit(1);
      }
    }
  }
}

function requiresConfirmation(command, env) {
  for (const [cmd, config] of Object.entries(REQUIRES_CONFIRMATION)) {
    if (command.includes(cmd)) {
      const needsConfirmation = config.requiresConfirmation.includes(env.name) ||
                                (config.requiresConfirmation.includes('production') && env.isProduction) ||
                                (config.requiresConfirmation.includes('staging') && env.isStaging);

      if (needsConfirmation) {
        console.warn('\n⚠️  ATTENTION: Cette commande nécessite une confirmation\n');
        console.warn(`Commande: prisma ${cmd}`);
        console.warn(`Description: ${config.description}`);
        console.warn(`Environnement: ${env.name}`);
        console.warn('\n💡 Recommandation: Utilisez plutôt npm run migrate:prod\n');

        const skipConfirm = process.argv.includes('--force') ||
                           process.env.SKIP_PRISMA_GUARD === 'true';

        if (!skipConfirm) {
          console.error('❌ Commande bloquée. Utilisez --force pour passer outre (non recommandé).\n');
          process.exit(1);
        }

        console.warn('⚠️  Confirmation ignorée avec --force. Procédez avec prudence!\n');
      }
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args.join(' ');

  if (!command) {
    console.error('Usage: node scripts/prisma-guard.js <commande prisma>');
    console.error('Example: node scripts/prisma-guard.js migrate deploy');
    process.exit(1);
  }

  const env = getEnvironment();

  console.log(`\n🔒 Prisma Guard - Environnement: ${env.name}\n`);

  // Vérifier les commandes dangereuses
  checkDangerousCommand(command, env);

  // Vérifier si confirmation requise
  requiresConfirmation(command, env);

  // Si tout est OK, exécuter la commande
  try {
    console.log(`✅ Commande autorisée. Exécution: prisma ${command}\n`);
    execSync(`npx prisma ${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Erreur lors de l'exécution de la commande: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkDangerousCommand, requiresConfirmation, getEnvironment };
