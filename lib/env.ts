/**
 * Environment variables validation with Zod
 * Valide les variables d'environnement au démarrage de l'application
 *
 * @module lib/env
 */

import { z } from "zod";

/**
 * Schema Zod pour variables d'environnement requises
 *
 * Catégories :
 * - Database : Connexions Neon PostgreSQL
 * - Auth : NextAuth JWT et OAuth
 * - Optional : Monitoring et features optionnelles
 */
const envSchema = z.object({
  // ===== DATABASE (REQUIRED) =====
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL doit être une URL valide")
    .refine(
      (url) => url.startsWith("postgres://") || url.startsWith("postgresql://"),
      "DATABASE_URL doit être une connexion Postgres"
    )
    .describe("Neon pooled connection string (pour queries)"),

  DIRECT_URL: z
    .string()
    .url("DIRECT_URL doit être une URL valide")
    .refine(
      (url) => url.startsWith("postgres://") || url.startsWith("postgresql://"),
      "DIRECT_URL doit être une connexion Postgres"
    )
    .describe("Neon direct connection string (pour migrations Prisma)"),

  // ===== AUTH (REQUIRED) =====
  // NOTE: NEXTAUTH_URL est auto-détecté par NextAuth.js (inutile de le définir)
  // Seulement utile en dev local si URL non-standard (autre que localhost:3000)
  // Voir: https://next-auth.js.org/configuration/options#nextauth_url

  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET doit faire au moins 32 caractères")
    .describe(
      "Secret pour JWT encryption (générer avec: openssl rand -base64 32)"
    ),

  // ===== OAUTH (OPTIONAL) =====
  GOOGLE_CLIENT_ID: z
    .string()
    .optional()
    .describe("Google OAuth Client ID (optionnel, pour login Google)"),

  GOOGLE_CLIENT_SECRET: z
    .string()
    .optional()
    .describe("Google OAuth Client Secret"),

  // ===== MONITORING (OPTIONAL) =====
  SENTRY_DSN: z
    .string()
    .url()
    .optional()
    .describe("Sentry DSN pour error monitoring (optionnel)"),

  // ===== EMAIL (OPTIONAL) =====
  RESEND_API_KEY: z
    .string()
    .regex(
      /^re_[a-zA-Z0-9_-]+$/,
      "Format Resend API Key invalide (doit commencer par re_)"
    )
    .optional()
    .describe("Resend API Key pour l'envoi d'emails (optionnel)"),

  // ===== ANALYTICS (OPTIONAL) =====
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(
      /^G-[A-Z0-9]+$/,
      "Format Google Analytics invalide (ex: G-XXXXXXXXXX)"
    )
    .optional()
    .describe(
      "Google Analytics Measurement ID (optionnel, format: G-XXXXXXXXXX)"
    ),

  // ===== STRIPE (OPTIONAL) =====
  ENABLE_PAYMENTS: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .describe(
      "Active les fonctionnalités de paiement Stripe (optionnel, défaut: false)"
    ),

  NEXT_PUBLIC_ENABLE_PAYMENTS: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .describe(
      "Active les paiements côté client (publique, doit matcher ENABLE_PAYMENTS)"
    ),

  STRIPE_SECRET_KEY: z
    .string()
    .regex(
      /^sk_(test|live)_[a-zA-Z0-9]{24,}$/,
      "Format Stripe Secret Key invalide (doit commencer par sk_test_ ou sk_live_)"
    )
    .optional()
    .describe("Stripe Secret Key pour les paiements (optionnel)"),

  STRIPE_WEBHOOK_SECRET: z
    .string()
    .regex(
      /^whsec_[a-zA-Z0-9]{24,}$/,
      "Format Stripe Webhook Secret invalide (doit commencer par whsec_)"
    )
    .optional()
    .describe("Stripe Webhook Secret pour vérifier les événements (optionnel)"),

  STRIPE_PRICE_ID_PRO: z
    .string()
    .regex(
      /^price_[a-zA-Z0-9]{24,}$/,
      "Format Stripe Price ID invalide (doit commencer par price_)"
    )
    .optional()
    .describe("Stripe Price ID pour l'abonnement Pro (optionnel)"),

  // ===== RATE LIMITING (OPTIONAL) =====
  UPSTASH_REDIS_URL: z
    .string()
    .url()
    .optional()
    .describe("Upstash Redis URL pour rate limiting (optionnel)"),

  UPSTASH_REDIS_TOKEN: z.string().optional().describe("Upstash Redis token"),

  // ===== ENVIRONMENT =====
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .describe("Environment actuel"),
});

/**
 * Type TypeScript inféré du schema Zod
 * Utilisable partout dans l'app pour env variables typées
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Valide process.env au démarrage
 *
 * @throws {ZodError} Si variables manquantes ou invalides
 * @returns {Env} Variables d'environnement validées et typées
 *
 * @example
 * ```typescript
 * // Dans un fichier qui s'exécute au démarrage
 * import { validateEnv } from '@/lib/env'
 *
 * const env = validateEnv()
 * console.log(env.DATABASE_URL) // ✅ Typé et validé
 * ```
 */
export function validateEnv(): Env {
  try {
    const validated = envSchema.parse(process.env);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("\n" + "=".repeat(80));
      console.error("❌ ERREUR DE VALIDATION DES VARIABLES D'ENVIRONNEMENT");
      console.error("=".repeat(80) + "\n");

      // Grouper les erreurs par type
      const missingVars: string[] = [];
      const invalidVars: Array<{
        name: string;
        reason: string;
        received: string;
      }> = [];
      const otherErrors: Array<{ name: string; message: string }> = [];

      error.issues.forEach((issue) => {
        const varName = issue.path.join(".");
        const receivedValue = process.env[varName];

        if (issue.code === "invalid_type" && receivedValue === undefined) {
          missingVars.push(varName);
        } else if (issue.message && receivedValue !== undefined) {
          // Variable existe mais invalide
          invalidVars.push({
            name: varName,
            reason: issue.message,
            received: receivedValue
              ? `"${String(receivedValue).substring(0, 40)}..."`
              : "vide",
          });
        } else {
          otherErrors.push({
            name: varName,
            message: issue.message,
          });
        }
      });

      // Afficher variables manquantes
      if (missingVars.length > 0) {
        console.error("📋 VARIABLES MANQUANTES :");
        console.error("-".repeat(80));
        missingVars.forEach((v: string) => {
          // Accès sécurisé à la description via type assertion
          const schemaKey = v as keyof typeof envSchema.shape;
          const fieldSchema = envSchema.shape[schemaKey];
          const description =
            fieldSchema &&
            typeof fieldSchema === "object" &&
            "description" in fieldSchema
              ? fieldSchema.description
              : "Aucune description disponible";

          console.error(`\n  ❌ ${v}`);
          console.error(`     Description: ${description}`);
        });
        console.error("\n");
      }

      // Afficher variables invalides
      if (invalidVars.length > 0) {
        console.error("⚠️  VARIABLES INVALIDES :");
        console.error("-".repeat(80));
        invalidVars.forEach(({ name, reason, received }) => {
          console.error(`\n  ❌ ${name}`);
          console.error(`     Raison: ${reason}`);
          console.error(`     Valeur reçue: ${received}`);
        });
        console.error("\n");
      }

      // Afficher autres erreurs
      if (otherErrors.length > 0) {
        console.error("🔴 AUTRES ERREURS :");
        console.error("-".repeat(80));
        otherErrors.forEach(({ name, message }) => {
          console.error(`\n  ❌ ${name}: ${message}`);
        });
        console.error("\n");
      }

      // Afficher le JSON formaté complet en mode debug
      console.error("🔍 DÉTAILS COMPLETS (format JSON) :");
      console.error("-".repeat(80));
      console.error(JSON.stringify(error.format(), null, 2));

      // Instructions de correction
      console.error("\n" + "=".repeat(80));
      console.error("💡 COMMENT CORRIGER :");
      console.error("=".repeat(80));
      console.error(
        "\n1. Vérifiez que le fichier .env.local existe à la racine du projet"
      );
      console.error(
        "2. Assurez-vous que toutes les variables requises sont définies"
      );
      console.error(
        "3. Redémarrez le serveur après modification : npm run dev"
      );
      console.error(
        "\n📄 Générer un template : Consultez la fonction generateEnvTemplate()"
      );
      console.error("=".repeat(80) + "\n");

      throw new Error(
        `Validation des variables d'environnement échouée. ${missingVars.length} variable(s) manquante(s), ${invalidVars.length} invalide(s).`
      );
    }
    throw error;
  }
}

/**
 * Exporte env validé (singleton)
 * IMPORTANT : N'importer ce module que côté serveur !
 *
 * @example
 * ```typescript
 * // ✅ Server Component ou API Route
 * import { env } from '@/lib/env'
 * console.log(env.DATABASE_URL)
 *
 * // ❌ Client Component
 * // NE PAS importer env côté client (expose secrets)
 * ```
 */
let cachedEnv: Env | undefined;

export function getEnv(): Env {
  // En mode développement avec Turbopack, s'assurer que les variables sont chargées
  if (typeof globalThis.window === "undefined" && !cachedEnv) {
    // Si on est côté serveur et pas encore validé
    cachedEnv = validateEnv();
  }

  // Fallback : si pas de cache, valider (ne devrait arriver qu'en tests)
  cachedEnv ??= validateEnv();

  return cachedEnv;
}

/**
 * Reset cache pour les tests
 * @internal - Usage interne seulement pour les tests
 */
export function resetEnvCache(): void {
  cachedEnv = undefined;
}

/**
 * Vérifie si une feature optionnelle est activée
 * Basé sur la présence des env vars nécessaires
 *
 * PATTERN: Lazy evaluation pour éviter validation prématurée
 */
export const features = {
  /** Google OAuth login disponible */
  get googleOAuth(): boolean {
    if (typeof globalThis.window !== "undefined") return false; // Côté client
    const env = getEnv();
    return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  },

  /** Sentry error monitoring activé */
  get sentryMonitoring(): boolean {
    if (typeof globalThis.window !== "undefined") return false; // Côté client
    const env = getEnv();
    return !!env.SENTRY_DSN;
  },

  /** Google Analytics activé */
  get googleAnalytics(): boolean {
    // Cette variable est publique, accessible côté client
    return !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  },

  /** Stripe payments activés */
  get stripePayments(): boolean {
    // Côté client : utiliser NEXT_PUBLIC_ENABLE_PAYMENTS
    if (typeof globalThis.window !== "undefined") {
      return process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true";
    }
    // Côté serveur : vérifier toutes les variables
    const env = getEnv();
    return !!(
      env.ENABLE_PAYMENTS &&
      env.STRIPE_SECRET_KEY &&
      env.STRIPE_PRICE_ID_PRO
    );
  },

  /** Rate limiting activé (Upstash Redis) */
  get rateLimiting(): boolean {
    if (typeof globalThis.window !== "undefined") return false; // Côté client
    const env = getEnv();
    return !!(env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN);
  },

  /** Resend email service activé */
  get emailService(): boolean {
    if (typeof globalThis.window !== "undefined") return false; // Côté client
    const env = getEnv();
    return !!env.RESEND_API_KEY;
  },

  /** Mode production */
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },

  /** Mode development */
  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  },
};

/**
 * Affiche un résumé des env vars au démarrage (dev mode)
 * Masque les secrets
 */
export function logEnvSummary(): void {
  const env = getEnv();

  if (env.NODE_ENV !== "development") return;

  console.log("\n🔧 Environment Configuration:");
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  DATABASE_URL: ${maskSecret(env.DATABASE_URL)}`);
  console.log(`  DIRECT_URL: ${maskSecret(env.DIRECT_URL)}`);
  console.log(`  NEXTAUTH_SECRET: ${maskSecret(env.NEXTAUTH_SECRET)}`);
  console.log(
    `  NEXTAUTH_URL: auto-détecté par NextAuth (${
      process.env.NEXTAUTH_URL || "non défini"
    })`
  );

  console.log("\n✨ Optional Features:");
  console.log(`  Google OAuth: ${features.googleOAuth ? "✅" : "❌"}`);
  console.log(
    `  Sentry Monitoring: ${features.sentryMonitoring ? "✅" : "❌"}`
  );
  console.log(`  Google Analytics: ${features.googleAnalytics ? "✅" : "❌"}`);
  console.log(`  Stripe Payments: ${features.stripePayments ? "✅" : "❌"}`);
  console.log(`  Rate Limiting: ${features.rateLimiting ? "✅" : "❌"}`);
  console.log(
    `  Email Service (Resend): ${features.emailService ? "✅" : "❌"}`
  );
  console.log("");
}

/**
 * Masque un secret pour logging sécurisé
 * Affiche seulement premiers/derniers caractères
 */
function maskSecret(secret: string): string {
  if (secret.length < 10) return "***";

  // Extraire partie visible (protocole + début + fin)
  const protocol = /^[a-z]+:\/\//.exec(secret);
  const visible = secret.slice(0, 15) + "..." + secret.slice(-5);

  return protocol ? visible : `${secret.slice(0, 5)}...${secret.slice(-3)}`;
}

/**
 * Génère template .env.local pour documentation
 *
 * @example
 * ```typescript
 * import { generateEnvTemplate } from '@/lib/env'
 *
 * console.log(generateEnvTemplate())
 * // Copier-coller dans .env.local
 * ```
 */
export function generateEnvTemplate(): string {
  return `# 🔐 Solkant - Environment Variables
# Copier ce fichier vers .env.local et remplir les valeurs

# ===== DATABASE (REQUIRED) =====
# Obtenir sur https://neon.tech
DATABASE_URL="postgres://user:password@host/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://user:password@host/database?sslmode=require"

# ===== AUTH (REQUIRED) =====
# NOTE: NEXTAUTH_URL est auto-détecté par NextAuth (pas besoin de le définir)
# Seulement nécessaire si URL custom en dev (ex: ngrok, tunnel)
# NEXTAUTH_URL="http://localhost:3000" # Optionnel
NEXTAUTH_SECRET="" # Générer avec: openssl rand -base64 32

# ===== OAUTH (OPTIONAL) =====
# Google OAuth (optionnel)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""

# ===== MONITORING (OPTIONAL) =====
# Sentry error monitoring
# SENTRY_DSN=""

# ===== ANALYTICS (OPTIONAL) =====
# Google Analytics (obtenir sur https://analytics.google.com)
# NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# ===== STRIPE (OPTIONAL) =====
# Stripe pour les paiements (obtenir sur https://stripe.com)
# Active les paiements uniquement si ENABLE_PAYMENTS=true
# ENABLE_PAYMENTS="false" # Passer à "true" pour activer les paiements
# STRIPE_SECRET_KEY="sk_test_..." # ou sk_live_ pour production
# STRIPE_PRICE_ID_PRO="price_..." # ID du produit abonnement Pro

# ===== RATE LIMITING (OPTIONAL) =====
# Upstash Redis
# UPSTASH_REDIS_URL=""
# UPSTASH_REDIS_TOKEN=""

# ===== ENVIRONMENT =====
NODE_ENV="development"
`;
}
