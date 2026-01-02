"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { useAnalytics } from "@/hooks/useAnalytics";

export function ContactForm() {
  const { trackEvent } = useAnalytics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await submitContactForm({
        name,
        email,
        subject,
        message,
      });

      if (result.success) {
        // Track successful contact form submission
        trackEvent("contact_form_submitted", {
          subject,
          name_length: name.length,
          message_length: message.length,
          page_category: "marketing",
        });

        setSuccess(true);
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setError("Veuillez corriger les erreurs ci-dessous");
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Contact form error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          Votre message a été envoyé avec succès. Nous vous répondrons dans les
          plus brefs délais.
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Nom complet
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          placeholder="Votre nom"
          required
          disabled={isLoading}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          placeholder="votre@email.com"
          required
          disabled={isLoading}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Sujet
        </label>
        <select
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          required
          disabled={isLoading}
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="demo">Demande de démonstration</option>
          <option value="support">Support technique</option>
          <option value="pricing">Questions sur les tarifs</option>
          <option value="feature">Suggestion de fonctionnalité</option>
          <option value="other">Autre question</option>
        </select>
        {fieldErrors.subject && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.subject[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
          placeholder="Décrivez votre demande..."
          required
          disabled={isLoading}
        />
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-foreground px-6 py-3 text-base font-semibold text-background hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
