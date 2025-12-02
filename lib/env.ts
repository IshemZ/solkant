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
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL doit être une URL valide")
    .optional()
    .describe(
      "URL de l'application (auto-détecté en dev, requis en prod: https://devisio.fr)"
    ),

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
      console.error("❌ Invalid environment variables:");
      console.error(JSON.stringify(error.format(), null, 2));

      // Afficher variables manquantes
      const missingVars = error.issues
        .filter((err) => err.code === "invalid_type")
        .map((err) => err.path.join("."));

      if (missingVars.length > 0) {
        console.error("\n📋 Variables manquantes :");
        missingVars.forEach((v: string) => console.error(`  - ${v}`));
      }

      throw new Error(
        "Environment variables validation failed. Check .env.local file."
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
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * Vérifie si une feature optionnelle est activée
 * Basé sur la présence des env vars nécessaires
 */
export const features = {
  /** Google OAuth login disponible */
  get googleOAuth(): boolean {
    const env = getEnv();
    return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  },

  /** Sentry error monitoring activé */
  get sentryMonitoring(): boolean {
    const env = getEnv();
    return !!env.SENTRY_DSN;
  },

  /** Rate limiting activé (Upstash Redis) */
  get rateLimiting(): boolean {
    const env = getEnv();
    return !!(env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN);
  },

  /** Mode production */
  get isProduction(): boolean {
    const env = getEnv();
    return env.NODE_ENV === "production";
  },

  /** Mode development */
  get isDevelopment(): boolean {
    const env = getEnv();
    return env.NODE_ENV === "development";
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
  console.log(`  NEXTAUTH_URL: ${env.NEXTAUTH_URL}`);
  console.log(`  NEXTAUTH_SECRET: ${maskSecret(env.NEXTAUTH_SECRET)}`);

  console.log("\n✨ Optional Features:");
  console.log(`  Google OAuth: ${features.googleOAuth ? "✅" : "❌"}`);
  console.log(
    `  Sentry Monitoring: ${features.sentryMonitoring ? "✅" : "❌"}`
  );
  console.log(`  Rate Limiting: ${features.rateLimiting ? "✅" : "❌"}`);
  console.log("");
}

/**
 * Masque un secret pour logging sécurisé
 * Affiche seulement premiers/derniers caractères
 */
function maskSecret(secret: string): string {
  if (secret.length < 10) return "***";

  // Extraire partie visible (protocole + début + fin)
  const protocol = secret.match(/^[a-z]+:\/\//);
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
  return `# 🔐 Devisio - Environment Variables
# Copier ce fichier vers .env.local et remplir les valeurs

# ===== DATABASE (REQUIRED) =====
# Obtenir sur https://neon.tech
DATABASE_URL="postgres://user:password@host/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://user:password@host/database?sslmode=require"

# ===== AUTH (REQUIRED) =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Générer avec: openssl rand -base64 32

# ===== OAUTH (OPTIONAL) =====
# Google OAuth (optionnel)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""

# ===== MONITORING (OPTIONAL) =====
# Sentry error monitoring
# SENTRY_DSN=""

# ===== RATE LIMITING (OPTIONAL) =====
# Upstash Redis
# UPSTASH_REDIS_URL=""
# UPSTASH_REDIS_TOKEN=""

# ===== ENVIRONMENT =====
NODE_ENV="development"
`;
}
