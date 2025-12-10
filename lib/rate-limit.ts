/**
 * Rate Limiting avec Upstash Redis
 * Limite les requêtes pour prévenir abus et attaques DDoS
 *
 * @module lib/rate-limit
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getEnv } from "./env";

/**
 * Instance Redis Upstash (singleton)
 * Initialisé seulement si les variables d'environnement sont présentes
 */
let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const env = getEnv();
    if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
      throw new Error(
        "Rate limiting non configuré : UPSTASH_REDIS_URL et UPSTASH_REDIS_TOKEN requis"
      );
    }

    redis = new Redis({
      url: env.UPSTASH_REDIS_URL,
      token: env.UPSTASH_REDIS_TOKEN,
    });
  }

  return redis;
}

/**
 * Rate limiters par type d'endpoint
 * Stratégie : Sliding window pour distribution équitable
 */

/**
 * Rate limiter pour authentification (login, register)
 * 5 tentatives par 15 minutes (strict pour prévenir brute force)
 */
export const authRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@devisio/auth",
});

/**
 * Rate limiter pour API publiques générales
 * 20 requêtes par minute (usage normal)
 */
export const apiRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "@devisio/api",
});

/**
 * Rate limiter pour Server Actions (dashboard)
 * 30 requêtes par minute (usage intensif autorisé)
 */
export const actionRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "@devisio/action",
});

/**
 * Rate limiter pour webhooks (Stripe)
 * 100 requêtes par minute (haute fréquence)
 */
export const webhookRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@devisio/webhook",
});

/**
 * Rate limiter pour génération de PDF
 * 10 PDFs par minute (opération coûteuse)
 */
export const pdfRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "@devisio/pdf",
});

/**
 * Helper pour récupérer l'IP du client
 * Compatible avec Vercel, Cloudflare, etc.
 */
export function getClientIp(request: Request): string {
  // Headers possibles (dans l'ordre de préférence)
  const headers = [
    "x-real-ip", // Nginx
    "x-forwarded-for", // Standard proxy
    "cf-connecting-ip", // Cloudflare
    "x-vercel-forwarded-for", // Vercel
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for peut contenir plusieurs IPs séparées par virgule
      return value.split(",")[0].trim();
    }
  }

  // Fallback : IP anonyme (ne devrait jamais arriver en production)
  return "anonymous";
}

/**
 * Helper pour vérifier le rate limit et retourner une réponse standardisée
 *
 * @example
 * ```typescript
 * import { checkRateLimit, authRateLimit } from '@/lib/rate-limit'
 *
 * export async function POST(request: Request) {
 *   const rateLimitResult = await checkRateLimit(request, authRateLimit)
 *   if (!rateLimitResult.success) {
 *     return rateLimitResult.response
 *   }
 *
 *   // Continue avec la logique normale
 * }
 * ```
 */
export async function checkRateLimit(
  request: Request,
  limiter: Ratelimit
): Promise<
  | { success: true }
  | { success: false; response: Response; remaining: number; reset: number }
> {
  const ip = getClientIp(request);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return {
      success: false,
      remaining,
      reset,
      response: new Response(
        JSON.stringify({
          error: "Trop de requêtes",
          message: `Limite de ${limit} requêtes atteinte. Réessayez dans ${Math.ceil(
            (reset - Date.now()) / 1000
          )} secondes.`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
