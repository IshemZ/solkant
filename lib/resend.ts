/**
 * Configuration Resend pour l'envoi d'emails transactionnels
 * Utilisé pour l'envoi de devis, confirmations, etc.
 */

import { Resend } from "resend";

// Initialiser le client Resend uniquement si la clé API est configurée
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Configuration par défaut pour les emails
 */
export const EMAIL_CONFIG = {
  from: "Solkant <noreply@solkant.com>", // À personnaliser avec votre domaine vérifié
  replyTo: "support@solkant.com", // À personnaliser
} as const;

/**
 * Types d'emails supportés
 */
export enum EmailType {
  QUOTE_SEND = "quote_send",
  QUOTE_REMINDER = "quote_reminder",
  VERIFICATION = "verification",
  PASSWORD_RESET = "password_reset",
}

/**
 * Helper pour vérifier si Resend est configuré
 */
export function isResendConfigured(): boolean {
  return resend !== null;
}
