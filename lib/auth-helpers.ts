/**
 * Auth Helper Functions
 *
 * Helpers pour la validation de session et vérification d'email dans les Server Actions.
 * Ces fonctions garantissent que seuls les utilisateurs avec email vérifié peuvent accéder aux actions protégées.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserRole } from '@prisma/client';

/**
 * Type retourné par validateSessionWithEmail
 */
export type ValidatedSession = {
  userId: string;
  userEmail: string;
  businessId: string;
};

/**
 * Type d'erreur standardisé
 */
export type AuthError = {
  error: string;
  code?: "UNAUTHORIZED" | "NO_BUSINESS";
};

/**
 * Valide la session utilisateur et vérifie que l'utilisateur a un businessId
 *
 * SÉCURITÉ: Cette fonction doit être appelée au début de TOUTES les Server Actions
 * pour garantir que seuls les utilisateurs authentifiés peuvent effectuer des actions.
 *
 * @returns ValidatedSession si succès, AuthError si échec
 *
 * @example
 * ```typescript
 * export async function createClient(input: CreateClientInput) {
 *   const validatedSession = await validateSessionWithEmail();
 *
 *   if ("error" in validatedSession) {
 *     return validatedSession;
 *   }
 *
 *   const { businessId, userId } = validatedSession;
 *   // ... reste du code
 * }
 * ```
 */
export async function validateSessionWithEmail(): Promise<
  ValidatedSession | AuthError
> {
  try {
    // 1. Vérifier session NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        error: "Non autorisé",
        code: "UNAUTHORIZED",
      };
    }

    // 2. Vérifier que l'utilisateur a un businessId dans la session
    if (!session.user.businessId) {
      // Tenter de récupérer le businessId depuis la BDD (fallback)
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          business: { select: { id: true } },
        },
      });

      if (!user?.business?.id) {
        // Lazy import Sentry to avoid bundling in client components
        const Sentry = await import("@sentry/nextjs");
        Sentry.captureMessage("User sans businessId détecté", {
          level: "error",
          tags: { action: "validateSessionWithEmail" },
          extra: { userId: session.user.id, email: session.user.email },
        });

        return {
          error: "Compte non configuré. Veuillez contacter le support.",
          code: "NO_BUSINESS",
        };
      }

      // Ajouter contexte Sentry (lazy import)
      const Sentry = await import("@sentry/nextjs");
      Sentry.setContext("user", {
        userId: session.user.id,
        businessId: user.business.id,
        email: session.user.email,
      });

      return {
        userId: session.user.id,
        userEmail: session.user.email,
        businessId: user.business.id,
      };
    }

    // 3. Tout est OK - ajouter contexte Sentry pour traçabilité (lazy import)
    const Sentry = await import("@sentry/nextjs");
    Sentry.setContext("user", {
      userId: session.user.id,
      businessId: session.user.businessId,
      email: session.user.email,
    });

    return {
      userId: session.user.id,
      userEmail: session.user.email,
      businessId: session.user.businessId,
    };
  } catch (error) {
    // Logger l'erreur dans Sentry (lazy import)
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      tags: { action: "validateSessionWithEmail" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error in validateSessionWithEmail:", error);
    }

    return {
      error: "Erreur lors de la validation de la session",
      code: "UNAUTHORIZED",
    };
  }
}

/**
 * Valide la session utilisateur (alias de validateSessionWithEmail pour compatibilité)
 *
 * @deprecated Utilisez validateSessionWithEmail à la place
 * @returns ValidatedSession si succès, AuthError si échec
 */
export async function validateSession(): Promise<ValidatedSession | AuthError> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.businessId) {
      return {
        error: "Non autorisé",
        code: "UNAUTHORIZED",
      };
    }

    // Lazy import Sentry to avoid bundling in client components
    const Sentry = await import("@sentry/nextjs");
    Sentry.setContext("user", {
      userId: session.user.id,
      businessId: session.user.businessId,
      email: session.user.email,
    });

    return {
      userId: session.user.id,
      userEmail: session.user.email,
      businessId: session.user.businessId,
    };
  } catch (error) {
    // Lazy import Sentry to avoid bundling in client components
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      tags: { action: "validateSession" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error in validateSession:", error);
    }

    return {
      error: "Erreur lors de la validation de la session",
      code: "UNAUTHORIZED",
    };
  }
}

/**
 * Valide que l'utilisateur connecté est un super admin
 *
 * IMPORTANT: businessId peut être vide pour les super admins (opérations système)
 *
 * @returns ValidatedSession si succès, AuthError si échec
 *
 * @example
 * ```typescript
 * export async function getAllBusinesses() {
 *   const validatedSession = await validateSuperAdmin();
 *
 *   if ("error" in validatedSession) {
 *     return validatedSession;
 *   }
 *
 *   // ... super admin logic (no businessId filter)
 * }
 * ```
 */
export async function validateSuperAdmin(): Promise<ValidatedSession | AuthError> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Non authentifié", code: "UNAUTHORIZED" };
    }

    if (session.user.role !== UserRole.SUPER_ADMIN) {
      return { error: "Accès interdit - Super Admin requis", code: "UNAUTHORIZED" };
    }

    // Lazy import Sentry
    const Sentry = await import("@sentry/nextjs");
    Sentry.setContext("super_admin", {
      userId: session.user.id,
      email: session.user.email,
    });

    return {
      userId: session.user.id,
      userEmail: session.user.email,
      businessId: session.user.businessId || '', // Optionnel pour super admin
    };
  } catch (error) {
    // Lazy import Sentry
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      tags: { action: "validateSuperAdmin" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error in validateSuperAdmin:", error);
    }

    return {
      error: "Erreur lors de la validation de la session",
      code: "UNAUTHORIZED",
    };
  }
}
