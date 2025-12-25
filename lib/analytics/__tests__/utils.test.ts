import { describe, it, expect } from "vitest";
import {
  parseSignUpErrorType,
  sanitizeErrorMessage,
  getPageCategory,
  getContentType,
} from "../utils";

describe("parseSignUpErrorType", () => {
  it("should detect email_exists error (French)", () => {
    expect(parseSignUpErrorType("Email déjà utilisé")).toBe("email_exists");
  });

  it("should detect email_exists error (English)", () => {
    expect(parseSignUpErrorType("User already exists")).toBe("email_exists");
    expect(parseSignUpErrorType("Email already taken")).toBe("email_exists");
  });

  it("should detect validation_failed error (French)", () => {
    expect(parseSignUpErrorType("Validation échouée")).toBe(
      "validation_failed"
    );
    expect(parseSignUpErrorType("Mot de passe invalide")).toBe(
      "validation_failed"
    );
  });

  it("should detect validation_failed error (English)", () => {
    expect(parseSignUpErrorType("Invalid password format")).toBe(
      "validation_failed"
    );
    expect(parseSignUpErrorType("Validation error")).toBe("validation_failed");
  });

  it("should detect oauth_failed error", () => {
    expect(parseSignUpErrorType("OAuth authentication failed")).toBe(
      "oauth_failed"
    );
    expect(parseSignUpErrorType("Google provider error")).toBe("oauth_failed");
  });

  it("should detect business_creation_failed error", () => {
    expect(parseSignUpErrorType("Business creation failed")).toBe(
      "business_creation_failed"
    );
  });

  it("should default to server_error", () => {
    expect(parseSignUpErrorType("Unknown error")).toBe("server_error");
    expect(parseSignUpErrorType("Database connection timeout")).toBe(
      "server_error"
    );
  });
});

describe("sanitizeErrorMessage", () => {
  it("should mask email addresses", () => {
    const result = sanitizeErrorMessage("User test@example.com already exists");
    expect(result).toBe("User [email] already exists");
  });

  it("should mask multiple email addresses", () => {
    const result = sanitizeErrorMessage(
      "user@test.com and admin@example.org"
    );
    expect(result).toBe("[email] and [email]");
  });

  it("should mask long numbers (potential tokens)", () => {
    const result = sanitizeErrorMessage("Token 1234567890123456 expired");
    expect(result).toBe("Token [number] expired");
  });

  it("should truncate to maxLength", () => {
    const longMessage = "a".repeat(200);
    const result = sanitizeErrorMessage(longMessage, 50);
    expect(result.length).toBe(50);
  });

  it("should truncate to default 100 chars", () => {
    const longMessage = "b".repeat(200);
    const result = sanitizeErrorMessage(longMessage);
    expect(result.length).toBe(100);
  });

  it("should not modify short messages without sensitive data", () => {
    const result = sanitizeErrorMessage("Simple error message");
    expect(result).toBe("Simple error message");
  });
});

describe("getPageCategory", () => {
  it("should return 'blog' for blog paths", () => {
    expect(getPageCategory("/blog")).toBe("blog");
    expect(getPageCategory("/blog/article-1")).toBe("blog");
  });

  it("should return 'dashboard' for dashboard paths", () => {
    expect(getPageCategory("/dashboard")).toBe("dashboard");
    expect(getPageCategory("/dashboard/devis")).toBe("dashboard");
  });

  it("should return 'auth' for auth paths", () => {
    expect(getPageCategory("/auth/login")).toBe("auth");
    expect(getPageCategory("/auth/register")).toBe("auth");
  });

  it("should return 'legal' for legal pages", () => {
    expect(getPageCategory("/mentions-legales")).toBe("legal");
    expect(getPageCategory("/politique-confidentialite")).toBe("legal");
    expect(getPageCategory("/conditions-generales-vente")).toBe("legal");
  });

  it("should return 'marketing' for other pages", () => {
    expect(getPageCategory("/")).toBe("marketing");
    expect(getPageCategory("/fonctionnalites")).toBe("marketing");
    expect(getPageCategory("/pricing")).toBe("marketing");
  });
});

describe("getContentType", () => {
  it("should return 'article' for blog posts", () => {
    expect(getContentType("/blog/comment-faire-devis")).toBe("article");
  });

  it("should return undefined for blog homepage", () => {
    expect(getContentType("/blog")).toBeUndefined();
  });

  it("should return 'guide' for guide pages", () => {
    expect(getContentType("/gestion-institut-beaute-guide")).toBe("guide");
    expect(getContentType("/logiciel-devis-institut-beaute/guide")).toBe(
      "guide"
    );
  });

  it("should return undefined for non-content pages", () => {
    expect(getContentType("/")).toBeUndefined();
    expect(getContentType("/dashboard")).toBeUndefined();
  });
});
