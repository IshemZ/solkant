/**
 * Server Actions pour l'authentification et la vérification email
 * Gère la génération et validation des tokens de vérification
 *
 * @module app/actions/auth
 */

"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import * as Sentry from "@sentry/nextjs";

/**
 * Configuration des tokens de vérification
 */
const TOKEN_CONFIG = {
  length: 32, // 32 bytes = 64 caractères hex
  expiryHours: 24, // Validité de 24 heures
} as const;

/**
 * Génère un token de vérification unique et cryptographiquement sécurisé
 *
 * @returns Token hexadécimal de 64 caractères
 */
function generateSecureToken(): string {
  return randomBytes(TOKEN_CONFIG.length).toString("hex");
}

/**
 * Calcule la date d'expiration du token
 *
 * @returns Date d'expiration (24h dans le futur)
 */
function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + TOKEN_CONFIG.expiryHours);
  return expiry;
}

/**
 * Génère un nouveau token de vérification et envoie l'email
 * Peut être utilisé pour renvoyer un email de vérification
 *
 * @param userId - ID de l'utilisateur
 * @returns Résultat de l'opération
 *
 * @example
 * ```typescript
 * const result = await generateVerificationToken('user_123');
 * if (result.success) {
 *   console.log('Email envoyé !');
 * }
 * ```
 */
export async function generateVerificationToken(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    if (user.emailVerified) {
      return { success: false, error: "Email déjà vérifié" };
    }

    // Générer nouveau token
    const verificationToken = generateSecureToken();
    const tokenExpiry = getTokenExpiry();

    // Sauvegarder le token (avec upsert pour gérer les réenvois)
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken,
        tokenExpiry,
      },
    });

    // Envoyer l'email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.name || "Utilisateur",
      verificationToken
    );

    if (!emailResult.success) {
      // Rollback : supprimer le token si l'envoi échoue
      await prisma.user.update({
        where: { id: userId },
        data: {
          verificationToken: null,
          tokenExpiry: null,
        },
      });

      Sentry.captureException(new Error("Échec envoi email vérification"), {
        extra: { userId, emailError: emailResult.error },
      });

      return {
        success: false,
        error:
          "Impossible d'envoyer l'email de vérification. Veuillez réessayer.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[generateVerificationToken]", error);
    Sentry.captureException(error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

/**
 * Vérifie un token de vérification email et marque l'email comme vérifié
 *
 * ⚠️ SÉCURITÉ CRITIQUE :
 * - Vérifie l'expiration du token
 * - Invalide le token après utilisation (one-time use)
 * - Rate limiting recommandé au niveau route
 *
 * @param token - Token de vérification reçu par email
 * @returns Résultat avec userId si succès
 *
 * @example
 * ```typescript
 * const result = await verifyEmailToken(token);
 * if (result.success) {
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function verifyEmailToken(token: string): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
}> {
  try {
    if (!token || token.length !== 64) {
      return { success: false, error: "Token invalide" };
    }

    // Rechercher l'utilisateur avec ce token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        tokenExpiry: true,
        business: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Token invalide ou déjà utilisé",
      };
    }

    // Vérifier si déjà vérifié
    if (user.emailVerified) {
      return {
        success: false,
        error: "Email déjà vérifié. Vous pouvez vous connecter.",
      };
    }

    // Vérifier l'expiration
    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
      return {
        success: false,
        error:
          "Ce lien a expiré. Veuillez demander un nouveau lien de vérification.",
      };
    }

    // ✅ Token valide : marquer l'email comme vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Invalider le token (one-time use)
        tokenExpiry: null,
      },
    });

    console.log(`✅ Email vérifié pour utilisateur: ${user.id}`);

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error("[verifyEmailToken]", error);
    Sentry.captureException(error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

/**
 * Renvoie un email de vérification pour l'utilisateur connecté
 * Utile si l'email précédent a expiré ou n'a pas été reçu
 *
 * ⚠️ RATE LIMITING : Limiter à 1 envoi toutes les 5 minutes par utilisateur
 *
 * @returns Résultat de l'opération
 */
export async function resendVerificationEmail(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Non authentifié" };
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        tokenExpiry: true,
      },
    });

    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    if (user.emailVerified) {
      return { success: false, error: "Email déjà vérifié" };
    }

    // Rate limiting basique : vérifier si un token récent existe déjà
    if (user.tokenExpiry && user.tokenExpiry > new Date()) {
      const minutesRemaining = Math.ceil(
        (user.tokenExpiry.getTime() - Date.now()) / (1000 * 60)
      );

      // Permettre renvoi seulement si le dernier token expire dans plus de 23h
      // (donc envoyé il y a plus de 1h)
      if (minutesRemaining > 23 * 60) {
        return {
          success: false,
          error: `Veuillez patienter avant de renvoyer un email. Un lien valide a déjà été envoyé.`,
        };
      }
    }

    // Générer et envoyer nouveau token
    return await generateVerificationToken(user.id);
  } catch (error) {
    console.error("[resendVerificationEmail]", error);
    Sentry.captureException(error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

/**
 * Vérifie si l'utilisateur actuel a vérifié son email
 * Utile pour afficher des bannières de rappel
 *
 * @returns État de vérification
 */
export async function checkEmailVerificationStatus(): Promise<{
  isVerified: boolean;
  email: string | null;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { isVerified: false, email: null };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        email: true,
        emailVerified: true,
      },
    });

    return {
      isVerified: !!user?.emailVerified,
      email: user?.email || null,
    };
  } catch (error) {
    console.error("[checkEmailVerificationStatus]", error);
    return { isVerified: false, email: null };
  }
}

/**
 * Génère un code OTP à 6 chiffres et envoie l'email de réinitialisation
 *
 * @param email - Email de l'utilisateur
 * @returns Résultat de l'opération
 *
 * @security
 * - Retourne succès même si email n'existe pas (protection contre l'énumération)
 * - Token valide 15 minutes
 * - Invalide les anciens tokens non utilisés
 *
 * @example
 * ```typescript
 * const result = await requestPasswordReset({ email: 'user@example.com' });
 * if (result.success) {
 *   // Email envoyé (ou pas, mais on ne révèle pas l'information)
 * }
 * ```
 */
export async function requestPasswordReset(input: {
  email: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { email } = input;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true },
    });

    // IMPORTANT : Retourner succès même si utilisateur n'existe pas
    // (protection contre l'énumération d'emails)
    if (!user) {
      // Simuler un délai pour éviter le timing attack
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    }

    // Invalider tous les anciens tokens non utilisés pour cet email
    await prisma.passwordResetToken.updateMany({
      where: {
        email: user.email,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Générer un code OTP à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer le token avec expiration de 15 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        code,
        expiresAt,
      },
    });

    // TODO: Envoyer l'email avec le code OTP
    // Pour l'instant, logger en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[DEV] Code OTP pour ${user.email}: ${code} (expire dans 15 min)`
      );
    }

    // En production, utiliser sendEmail de lib/email.ts
    // await sendEmail({
    //   to: user.email,
    //   subject: "Réinitialisation de votre mot de passe - Solkant",
    //   html: `Votre code de vérification : <strong>${code}</strong>`,
    // });

    return { success: true };
  } catch (error) {
    console.error("[requestPasswordReset]", error);
    Sentry.captureException(error, {
      tags: { action: "requestPasswordReset" },
      extra: { email: input.email },
    });
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

/**
 * Réinitialise le mot de passe avec un code OTP
 *
 * @param input - Email, code OTP et nouveau mot de passe
 * @returns Résultat de l'opération
 *
 * @security
 * - Vérifie la validité temporelle du code (15 min)
 * - Invalide le code après utilisation
 * - Hash bcrypt du nouveau mot de passe
 *
 * @example
 * ```typescript
 * const result = await resetPasswordWithOTP({
 *   email: 'user@example.com',
 *   code: '123456',
 *   newPassword: 'NewPass123',
 *   confirmPassword: 'NewPass123'
 * });
 * ```
 */
export async function resetPasswordWithOTP(input: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, code, newPassword } = input;

    // Récupérer le token valide
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        code,
        used: false,
        expiresAt: {
          gte: new Date(), // Token non expiré
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!token) {
      return {
        success: false,
        error: "Code invalide ou expiré. Veuillez demander un nouveau code.",
      };
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {
      return {
        success: false,
        error: "Utilisateur introuvable.",
      };
    }

    // Hasher le nouveau mot de passe
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe et invalider le token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { used: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("[resetPasswordWithOTP]", error);
    Sentry.captureException(error, {
      tags: { action: "resetPasswordWithOTP" },
      extra: { email: input.email },
    });
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}
