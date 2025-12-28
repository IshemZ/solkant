/**
 * Schémas de validation pour la réinitialisation de mot de passe
 *
 * Flux :
 * 1. requestPasswordResetSchema : Demande d'envoi d'OTP par email
 * 2. resetPasswordWithOTPSchema : Validation OTP + définition nouveau mot de passe
 */

import { z } from "zod";

/**
 * Schéma pour demander la réinitialisation de mot de passe
 * Génère un code OTP à 6 chiffres valable 15 minutes
 */
export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .email("Format d'adresse email invalide")
    .toLowerCase()
    .trim(),
});

/**
 * Schéma pour réinitialiser le mot de passe avec un code OTP
 */
export const resetPasswordWithOTPSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'adresse email est requise")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Format d'adresse email invalide"
      )
      .toLowerCase()
      .trim(),
    code: z
      .string()
      .min(1, "Le code de vérification est requis")
      .length(6, "Le code doit contenir 6 chiffres")
      .regex(/^\d+$/, "Le code doit contenir uniquement des chiffres"),
    newPassword: z
      .string()
      .min(1, "Le nouveau mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Types TypeScript exportés
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordWithOTPInput = z.infer<
  typeof resetPasswordWithOTPSchema
>;
