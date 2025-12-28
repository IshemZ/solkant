/**
 * Security utilities for input sanitization and XSS protection
 *
 * @module lib/security
 */

import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Configuration pour sanitize-html
 * Politique stricte : aucun HTML autorisé par défaut
 */
const DEFAULT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [], // Aucune balise HTML autorisée
  allowedAttributes: {}, // Aucun attribut autorisé
  allowedIframeHostnames: [], // Aucun iframe autorisé
  disallowedTagsMode: "discard", // Supprime les balises dangereuses
};

/**
 * Configuration permissive pour rich text (si nécessaire future)
 * Permet texte formaté basique : gras, italique, listes
 */
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
  allowedAttributes: {},
  allowedIframeHostnames: [],
  disallowedTagsMode: "discard",
};

/**
 * Sanitize user input pour prévenir XSS
 *
 * @param input - String à sanitizer (peut être undefined/null)
 * @param allowRichText - Si true, permet texte formaté basique (défaut: false)
 * @returns String sanitizé (vide si input null/undefined)
 *
 * @example
 * ```typescript
 * // Texte simple (défaut - aucun HTML)
 * sanitizeUserInput('<script>alert("XSS")</script>')
 * // → ""
 *
 * sanitizeUserInput('Nom du client <b>test</b>')
 * // → "Nom du client test"
 *
 * // Rich text (HTML basique autorisé)
 * sanitizeUserInput('Description avec <b>texte gras</b>', true)
 * // → "Description avec <b>texte gras</b>"
 *
 * sanitizeUserInput('Script dans rich text <script>alert()</script>', true)
 * // → "Script dans rich text "
 * ```
 */
export function sanitizeUserInput(
  input: string | null | undefined,
  allowRichText = false
): string {
  if (!input) return "";

  const options = allowRichText ? RICH_TEXT_OPTIONS : DEFAULT_OPTIONS;

  // Sanitize HTML
  const sanitized = sanitizeHtml(input, options);

  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize un objet entier (récursif)
 * Utile pour sanitizer tous les champs texte d'un formulaire
 *
 * @param obj - Objet à sanitizer
 * @param allowRichText - Si true, permet HTML basique
 * @returns Objet avec toutes les strings sanitizées
 *
 * @example
 * ```typescript
 * const formData = {
 *   name: 'Client <script>alert()</script>',
 *   email: 'test@example.com',
 *   notes: 'Notes avec <b>texte</b>',
 *   metadata: {
 *     description: 'Nested <img src=x onerror=alert()>'
 *   }
 * }
 *
 * sanitizeObject(formData)
 * // → {
 * //   name: 'Client ',
 * //   email: 'test@example.com',
 * //   notes: 'Notes avec texte',
 * //   metadata: { description: 'Nested ' }
 * // }
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowRichText = false
): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Sanitize strings
      sanitized[key as keyof T] = sanitizeUserInput(
        value,
        allowRichText
      ) as T[keyof T];
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      // Recursif pour nested objects
      sanitized[key as keyof T] = sanitizeObject(
        value as Record<string, unknown>,
        allowRichText
      ) as T[keyof T];
    } else if (Array.isArray(value)) {
      // Sanitize arrays
      sanitized[key as keyof T] = value.map((item) =>
        typeof item === "string"
          ? sanitizeUserInput(item, allowRichText)
          : item && typeof item === "object"
          ? sanitizeObject(item as Record<string, unknown>, allowRichText)
          : item
      ) as T[keyof T];
    } else {
      // Garder autres types (numbers, booleans, null) tels quels
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized;
}

/**
 * Escape caractères HTML spéciaux pour affichage sécurisé
 * Alternative à sanitization quand on veut AFFICHER le HTML brut
 *
 * @param text - Texte à escape
 * @returns Texte avec caractères HTML escapés
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("XSS")</script>')
 * // → '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 *
 * // Affichage sécurisé dans React :
 * <div>{escapeHtml(userInput)}</div>
 * ```
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Valide et sanitize une URL
 * Bloque javascript:, data:, et autres protocoles dangereux
 *
 * @param url - URL à valider
 * @returns URL sécurisée ou null si invalide
 *
 * @example
 * ```typescript
 * sanitizeUrl('https://example.com')
 * // → 'https://example.com'
 *
 * sanitizeUrl('javascript:alert()')
 * // → null
 *
 * sanitizeUrl('data:text/html,<script>alert()</script>')
 * // → null
 * ```
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  // Protocoles autorisés
  const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];

  try {
    const parsed = new URL(trimmed);

    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn(`Blocked dangerous URL protocol: ${parsed.protocol}`);
      return null;
    }

    return trimmed;
  } catch {
    // URL relative ou invalide
    // Autoriser relatives (ex: "/dashboard/clients")
    if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
      return trimmed;
    }

    console.warn(`Invalid URL: ${trimmed}`);
    return null;
  }
}

/**
 * Tronque un string à une longueur maximale
 * Utile pour prévenir DOS via inputs extrêmement longs
 *
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale (défaut: 10000)
 * @returns Texte tronqué
 *
 * @example
 * ```typescript
 * truncateString('A'.repeat(100000), 1000)
 * // → 'A' x 1000
 * ```
 */
export function truncateString(text: string, maxLength = 10000): string {
  if (text.length <= maxLength) return text;

  console.warn(`Truncated string from ${text.length} to ${maxLength} chars`);
  return text.substring(0, maxLength);
}

/**
 * Valide et sanitize un email
 * Regex basique + sanitization
 *
 * @param email - Email à valider
 * @returns Email sanitizé ou null si invalide
 *
 * @example
 * ```typescript
 * sanitizeEmail('test@example.com')
 * // → 'test@example.com'
 *
 * sanitizeEmail('invalid-email')
 * // → null
 *
 * sanitizeEmail('test+tag@example.com')
 * // → 'test+tag@example.com'
 * ```
 */
export function sanitizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;

  const trimmed = email.trim().toLowerCase();

  // Regex email basique (Zod fait validation stricte après)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return null;
  }

  // Sanitize (enlève HTML si présent)
  return sanitizeUserInput(trimmed, false);
}
