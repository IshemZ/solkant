/**
 * Server Actions pour l'authentification et la vérification email
 * Gère la génération et validation des tokens de vérification
 *
 * @module app/actions/auth
 */

"use server";

import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomInt } from "node:crypto";
import * as Sentry from "@sentry/nextjs";
import {
  type ActionResult,
  successResult,
  errorResult,
} from "@/lib/action-types";

/**
 * Génère un code OTP à 6 chiffres et envoie l'email de réinitialisation
 *
 * @security
 * - Retourne succès même si email n'existe pas (protection contre l'énumération)
 * - Token valide 15 minutes
 * - Invalide les anciens tokens non utilisés
 *
 * Note: Pas de session requise (password reset public)
 */
export async function requestPasswordReset(input: {
  email: string;
}): Promise<ActionResult<void>> {
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
      return successResult(undefined);
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

    // Générer un code OTP à 6 chiffres (cryptographiquement sécurisé)
    const code = randomInt(100000, 1000000).toString();

    // Créer le token avec expiration de 15 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const createdToken = await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        code,
        expiresAt,
      },
    });

    // Envoyer l'email avec le code OTP
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name || "Utilisateur",
      code
    );

    if (!emailResult.success) {
      // Rollback : invalider le token si l'envoi échoue
      await prisma.passwordResetToken.update({
        where: { id: createdToken.id },
        data: { used: true },
      });

      Sentry.captureException(new Error("Échec envoi email réinitialisation"), {
        extra: { email: user.email, emailError: emailResult.error },
      });

      return errorResult(
        "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer.",
        "EMAIL_SEND_ERROR"
      );
    }

    // Logger en développement pour faciliter le test
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[DEV] Code OTP pour ${user.email}: ${code} (expire dans 15 min)`
      );
    }

    return successResult(undefined);
  } catch (error) {
    console.error("[requestPasswordReset]", error);
    Sentry.captureException(error, {
      tags: { action: "requestPasswordReset" },
      extra: { email: input.email },
    });
    return errorResult("Une erreur est survenue. Veuillez réessayer.");
  }
}

/**
 * Réinitialise le mot de passe avec un code OTP
 *
 * @security
 * - Vérifie la validité temporelle du code (15 min)
 * - Invalide le code après utilisation
 * - Hash bcrypt du nouveau mot de passe
 *
 * Note: Pas de session requise (password reset public)
 */
export async function resetPasswordWithOTP(input: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult<void>> {
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
      return errorResult(
        "Code invalide ou expiré. Veuillez demander un nouveau code.",
        "INVALID_OR_EXPIRED_TOKEN"
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {
      return errorResult("Utilisateur introuvable.", "NOT_FOUND");
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

    return successResult(undefined);
  } catch (error) {
    console.error("[resetPasswordWithOTP]", error);
    Sentry.captureException(error, {
      tags: { action: "resetPasswordWithOTP" },
      extra: { email: input.email },
    });
    return errorResult("Une erreur est survenue. Veuillez réessayer.");
  }
}
