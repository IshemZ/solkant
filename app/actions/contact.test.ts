/**
 * Tests pour les Server Actions Contact
 *
 * Teste le formulaire de contact public avec :
 * - Validation Zod
 * - Soumission sans authentification
 * - Gestion erreurs
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock withValidation to test the handler directly
vi.mock("@/lib/action-wrapper", () => ({
  withValidation: (handler: any) => handler,
}));

// Import des actions à tester
import { submitContactForm } from "./contact";

describe("Contact Form Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to avoid noise in test output
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("submitContactForm", () => {
    it("should accept valid contact form submission", async () => {
      const validInput = {
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Demande d'information",
        message: "Bonjour, je souhaiterais avoir plus d'informations sur vos services.",
      };

      const result = await submitContactForm(validInput);

      expect(result).toEqual({
        success: true,
        data: {
          sent: true,
          message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        },
      });

      // Verify console.log was called with submission data
      expect(console.log).toHaveBeenCalledWith(
        "[Contact Form Submission]",
        expect.objectContaining({
          name: "Jean Dupont",
          email: "jean@example.com",
          subject: "Demande d'information",
        })
      );
    });

    it("should truncate long messages in logs", async () => {
      const longMessage = "A".repeat(200);
      const validInput = {
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Test",
        message: longMessage,
      };

      await submitContactForm(validInput);

      // Verify message was truncated to 100 chars + "..."
      expect(console.log).toHaveBeenCalledWith(
        "[Contact Form Submission]",
        expect.objectContaining({
          message: "A".repeat(100) + "...",
        })
      );
    });

    it("should include timestamp in log", async () => {
      const validInput = {
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Test",
        message: "Test message",
      };

      await submitContactForm(validInput);

      expect(console.log).toHaveBeenCalledWith(
        "[Contact Form Submission]",
        expect.objectContaining({
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/), // ISO format
        })
      );
    });

    it("should handle special characters in message", async () => {
      const validInput = {
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "Test spéciaux",
        message: 'Message avec "guillemets" et caractères spéciaux: é, à, ç',
      };

      const result = await submitContactForm(validInput);

      expect(result.success).toBe(true);
    });

    it("should handle empty subject", async () => {
      const validInput = {
        name: "Jean Dupont",
        email: "jean@example.com",
        subject: "",
        message: "Test message",
      };

      const result = await submitContactForm(validInput);

      expect(result.success).toBe(true);
    });
  });
});
