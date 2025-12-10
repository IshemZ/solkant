/**
 * Next.js Middleware - Rate Limiting Global
 * Applique les limites de taux sur les routes sensibles
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { features } from "./lib/env";

/**
 * Middleware exécuté avant chaque requête
 * Applique le rate limiting seulement si configuré (Upstash Redis)
 */
export async function middleware(request: NextRequest) {
  // Vérifier si le rate limiting est activé (variables Upstash présentes)
  if (!features.rateLimiting) {
    // Rate limiting désactivé : continuer normalement
    return NextResponse.next();
  }

  // Import dynamique pour éviter l'erreur si variables manquantes
  const { checkRateLimit, authRateLimit, apiRateLimit, pdfRateLimit } =
    await import("./lib/rate-limit");

  const { pathname } = request.nextUrl;

  // 1. Routes d'authentification (strict : 5 req/15min)
  if (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    const result = await checkRateLimit(request, authRateLimit);
    if (!result.success) {
      return result.response;
    }
  }

  // 2. Génération de PDF (modéré : 10 req/min)
  else if (pathname.includes("/pdf")) {
    const result = await checkRateLimit(request, pdfRateLimit);
    if (!result.success) {
      return result.response;
    }
  }

  // 3. API publiques (standard : 20 req/min)
  else if (pathname.startsWith("/api/")) {
    const result = await checkRateLimit(request, apiRateLimit);
    if (!result.success) {
      return result.response;
    }
  }

  // Continuer normalement si aucune limite atteinte
  return NextResponse.next();
}

/**
 * Configuration du matcher
 * Spécifie les routes où le middleware s'applique
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimization d'images)
     * - favicon.ico, robots.txt, sitemap.xml (fichiers publics)
     * - Images et assets publics
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
