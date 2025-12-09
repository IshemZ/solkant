/**
 * Email Service avec Resend
 * Gère l'envoi d'emails transactionnels (vérification, notifications)
 *
 * @module lib/email
 */

import { Resend } from "resend";
import { getEnv, features } from "./env";

// Initialisation Resend (lazy)
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient && features.emailService) {
    const env = getEnv();
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  if (!resendClient) {
    throw new Error(
      "Resend API Key manquant. Ajoutez RESEND_API_KEY dans .env.local"
    );
  }

  return resendClient;
}

/**
 * Configuration des emails
 */
const EMAIL_CONFIG = {
  from: "Solkant <noreply@solkant.com>", // ⚠️ Remplacer par votre domaine vérifié
  replyTo: "support@solkant.com",
  verificationTokenExpiry: 24 * 60 * 60 * 1000, // 24 heures en ms
} as const;

/**
 * Envoie un email de vérification à un utilisateur
 *
 * @param email - Email du destinataire
 * @param name - Nom de l'utilisateur
 * @param verificationToken - Token de vérification unique
 * @returns Promise avec résultat d'envoi
 *
 * @example
 * ```typescript
 * await sendVerificationEmail(
 *   'user@example.com',
 *   'Marie Dupont',
 *   'abc123def456'
 * );
 * ```
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // En mode développement sans Resend configuré, simuler l'envoi
    if (!features.emailService) {
      console.log("\n📧 [MODE SIMULATION] Email de vérification:");
      console.log(`   À: ${email}`);
      console.log(`   Nom: ${name}`);
      console.log(`   Token: ${verificationToken}`);
      console.log(
        `   Lien: ${getBaseUrl()}/verify-email?token=${verificationToken}\n`
      );
      return { success: true };
    }

    const resend = getResendClient();
    const verificationUrl = `${getBaseUrl()}/verify-email?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: "Confirmez votre adresse email - Solkant",
      html: getVerificationEmailTemplate(name, verificationUrl),
    });

    if (error) {
      console.error("[Resend Error]", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email de vérification envoyé à ${email} (ID: ${data?.id})`);
    return { success: true };
  } catch (error) {
    console.error("[Email Service Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Template HTML pour l'email de vérification
 * Design responsive et accessible
 */
function getVerificationEmailTemplate(
  name: string,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification Email - Solkant</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #D4B5A0 0%, #8B7355 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Solkant</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Bonjour ${escapeHtml(name)} 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Bienvenue sur <strong>Solkant</strong>, votre plateforme de gestion de devis pour salon de beauté !
              </p>

              <p style="margin: 0 0 30px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Pour finaliser votre inscription et accéder à votre espace, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4B5A0 0%, #8B7355 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 8px rgba(139, 115, 85, 0.3);">
                      Confirmer mon email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
              </p>
              
              <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #8B7355; font-size: 13px; text-decoration: underline;">
                  ${verificationUrl}
                </a>
              </p>

              <!-- Info Box -->
              <div style="padding: 16px; background-color: #fff8f0; border-left: 4px solid #D4B5A0; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                  ⏱️ <strong>Ce lien est valable pendant 24 heures.</strong><br>
                  Si vous n'avez pas créé de compte Solkant, vous pouvez ignorer cet email en toute sécurité.
                </p>
              </div>

              <p style="margin: 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Une question ? N'hésitez pas à nous contacter à <a href="mailto:support@solkant.com" style="color: #8B7355; text-decoration: underline;">support@solkant.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #9b9b9b; font-size: 13px;">
                © ${new Date().getFullYear()} Solkant. Tous droits réservés.
              </p>
              <p style="margin: 0; color: #9b9b9b; font-size: 12px;">
                Gestion de devis professionnelle pour salons de beauté
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Envoie un email de réinitialisation de mot de passe (future implémentation)
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  // TODO: Implémenter si besoin
  console.log("Password reset email à implémenter", {
    email,
    name,
    resetToken,
  });
  return { success: false, error: "Non implémenté" };
}

/**
 * Utilitaires
 */

function getBaseUrl(): string {
  // En production, utiliser VERCEL_URL ou domaine custom
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // En développement
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Exporte la configuration pour référence
 */
export { EMAIL_CONFIG };
