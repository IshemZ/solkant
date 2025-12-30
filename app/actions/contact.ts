"use server";

import { withValidation } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/contact";

/**
 * Submit contact form
 *
 * Public action (no authentication required) that handles contact form submissions.
 * Currently logs the submission. TODO: Integrate with email service (e.g., Resend, SendGrid).
 *
 * @param input - Contact form data (validated against contactFormSchema)
 * @returns ActionResult with submission confirmation
 */
export const submitContactForm = withValidation(
  async (input: ContactFormInput) => {
    // TODO: Send email notification
    // For now, log the submission (you can integrate with Resend, SendGrid, etc.)
    console.log("[Contact Form Submission]", {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message.substring(0, 100) + "...", // Truncate for logging
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send email to contact@solkant.com using Resend/SendGrid
    // 2. Optionally store in database for tracking
    // 3. Send auto-reply confirmation to user

    // Example with Resend (commented out):
    // const { Resend } = await import('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'Solkant Contact <contact@solkant.com>',
    //   to: 'contact@solkant.com',
    //   replyTo: input.email,
    //   subject: `[Contact Form] ${input.subject}`,
    //   text: `Nom: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
    // });

    return successResult({
      sent: true,
      message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
    });
  },
  "submitContactForm",
  contactFormSchema,
  "Erreur lors de l'envoi du message"
);
