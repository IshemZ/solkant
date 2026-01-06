/**
 * Utility functions for Google Analytics 4 event tracking
 */

/**
 * Parse error message to determine error type for sign_up_error event
 */
export function parseSignUpErrorType(errorMessage: string): string {
  const lowercased = errorMessage.toLowerCase();

  if (
    lowercased.includes("déjà utilisé") ||
    lowercased.includes("already exists") ||
    lowercased.includes("email already")
  ) {
    return "email_exists";
  }

  if (
    lowercased.includes("validation") ||
    lowercased.includes("invalide") ||
    lowercased.includes("invalid")
  ) {
    return "validation_failed";
  }

  if (
    lowercased.includes("oauth") ||
    lowercased.includes("google") ||
    lowercased.includes("provider")
  ) {
    return "oauth_failed";
  }

  if (lowercased.includes("business") || lowercased.includes("creation")) {
    return "business_creation_failed";
  }

  return "server_error"; // Default
}

/**
 * Sanitize error message for GA4 tracking (remove sensitive data)
 */
export function sanitizeErrorMessage(message: string, maxLength = 100): string {
  // Supprimer infos sensibles potentielles
  // Utiliser des regex atomiques avec limites pour éviter le ReDoS
  const sanitized = message
    .replaceAll(/[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,64}/g, "[email]") // Masquer emails avec limites strictes
    .replaceAll(/\b\d{13,19}\b/g, "[number]") // Masquer longs nombres (potentiels tokens)
    .substring(0, maxLength);

  return sanitized;
}

/**
 * Determine page category from pathname
 */
export function getPageCategory(pathname: string): string {
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/auth")) return "auth";
  if (
    [
      "/mentions-legales",
      "/politique-confidentialite",
      "/conditions-generales-vente",
    ].includes(pathname)
  ) {
    return "legal";
  }
  return "marketing"; // Default
}

/**
 * Determine content type from pathname (for blog/guides)
 */
export function getContentType(
  pathname: string
): "article" | "guide" | undefined {
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    return "article";
  }
  if (pathname.includes("/guide") || pathname.endsWith("-guide")) {
    return "guide";
  }
  return undefined;
}
