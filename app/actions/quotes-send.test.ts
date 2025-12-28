/**
 * Tests pour l'envoi de devis par email
 * Teste sendQuote() avec Resend
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendQuote } from "@/app/actions/quotes";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    quote: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/audit-logger", () => ({
  auditLog: vi.fn().mockResolvedValue(undefined),
  AuditAction: {
    QUOTE_SENT: "quote.sent",
  },
  AuditLevel: {
    INFO: "INFO",
  },
}));

// Mock Resend
const mockResendSend = vi.fn();
vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: mockResendSend,
    },
  },
  isResendConfigured: vi.fn(() => true),
  EMAIL_CONFIG: {
    from: "Solkant <noreply@solkant.com>",
    replyTo: "support@solkant.com",
  },
}));

vi.mock("@/lib/emails/quote-email", () => ({
  generateQuoteEmail: vi.fn(() => "<html>Mock Email HTML</html>"),
  generateQuoteEmailSubject: vi.fn((num, name) => `Devis ${num} de ${name}`),
}));

describe("sendQuote - Envoi d'emails", () => {
  const mockUser = {
    id: "user_123",
    email: "user@example.com",
    emailVerified: new Date("2024-01-01"),
    name: "Test User",
    password: null,
    image: null,
    verificationToken: null,
    tokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
      email: "user@example.com",
      name: "Test User",
    },
  };

  const mockQuote = {
    id: "quote_123",
    quoteNumber: "DEVIS-2025-001",
    status: "DRAFT" as const,
    validUntil: new Date("2025-12-31"),
    notes: "Notes importantes",
    discount: 10,
    subtotal: 100,
    total: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
    sentAt: null,
    businessId: "business_123",
    clientId: "client_123",
    client: {
      id: "client_123",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "0123456789",
      address: "1 rue de Paris",
      notes: null,
      businessId: "business_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    items: [
      {
        id: "item_1",
        serviceId: "service_1",
        name: "Coupe classique",
        description: "Coupe cheveux homme",
        price: 30,
        quantity: 1,
        total: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        quoteId: "quote_123",
        service: null,
      },
    ],
    business: {
      id: "business_123",
      name: "Mon Institut",
      address: "1 rue de Paris",
      phone: "0123456789",
      email: "contact@institut.fr",
      logo: null,
      siret: "12345678901234",
      primaryColor: "#D4B5A0",
      secondaryColor: "#8B7355",
      userId: "user_123",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      isPro: false,
      subscriptionStatus: "TRIAL" as const,
      subscriptionEndsAt: null,
      trialEndsAt: null,
      createdAt: new Date(),
      city: null,
      postalCode: null,
      country: null,
      tva: null,
      updatedAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    // Mock RESEND_FROM_EMAIL pour les tests
    process.env.RESEND_FROM_EMAIL = "Solkant <noreply@solkant.com>";
  });

  afterEach(() => {
    // Nettoyer les variables d'environnement mockées
    delete process.env.RESEND_FROM_EMAIL;
  });

  describe("✅ Cas de succès", () => {
    it("should send quote email successfully", async () => {
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuote as any);

      const updatedQuote = {
        ...mockQuote,
        status: "SENT" as const,
        sentAt: new Date(),
      };
      vi.mocked(prisma.quote.update).mockResolvedValue(updatedQuote as any);

      // Mock Resend success
      mockResendSend.mockResolvedValue({
        data: { id: "email_123" },
        error: null,
      });

      const result = await sendQuote({ id: "quote_123" });

      // Vérifier succès
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.status).toBe("SENT");
        expect(result.data.sentAt).toBeDefined();
      }

      // Vérifier que findFirst a été appelé avec le bon businessId
      expect(prisma.quote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "quote_123",
          businessId: "business_123",
        },
        include: {
          client: true,
          items: {
            include: {
              service: true,
            },
          },
          business: true,
        },
      });

      // Vérifier que l'email a été envoyé
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.stringContaining("Solkant"), // EMAIL_CONFIG.from value
        to: "jean@example.com",
        subject: "Devis DEVIS-2025-001 de Mon Institut",
        html: expect.any(String),
      });

      // Vérifier que le devis a été mis à jour
      expect(prisma.quote.update).toHaveBeenCalledWith({
        where: { id: "quote_123" },
        data: {
          status: "SENT",
          sentAt: expect.any(Date),
        },
        include: {
          client: true,
          items: true,
        },
      });
    });
  });

  describe("❌ Cas d'erreur", () => {
    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await sendQuote({ id: "quote_123" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }

      expect(prisma.quote.findFirst).not.toHaveBeenCalled();
      expect(mockResendSend).not.toHaveBeenCalled();
    });

    it("should return error if quote not found", async () => {
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const result = await sendQuote({ id: "quote_999" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Devis introuvable");
      }

      expect(mockResendSend).not.toHaveBeenCalled();
    });

    it("should return error if client has no email", async () => {
      const quoteWithoutEmail = {
        ...mockQuote,
        client: {
          ...mockQuote.client,
          email: null,
        },
      };

      vi.mocked(prisma.quote.findFirst).mockResolvedValue(
        quoteWithoutEmail as any
      );

      const result = await sendQuote({ id: "quote_123" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Le client n'a pas d'adresse email");
      }

      expect(mockResendSend).not.toHaveBeenCalled();
    });

    it("should return error if Resend fails", async () => {
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuote as any);

      // Mock Resend error
      mockResendSend.mockResolvedValue({
        data: null,
        error: { message: "Resend API error" },
      });

      const result = await sendQuote({ id: "quote_123" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Erreur lors de l'envoi de l'email. Veuillez réessayer."
        );
      }

      // Ne devrait PAS avoir mis à jour le devis
      expect(prisma.quote.update).not.toHaveBeenCalled();
    });
  });

  describe("🔒 Multi-tenancy Security", () => {
    it("should only send quotes from own business", async () => {
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuote as any);

      await sendQuote({ id: "quote_123" });

      // Vérifier que businessId est filtré
      expect(prisma.quote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "quote_123",
          businessId: "business_123",
        },
        include: {
          client: true,
          items: {
            include: {
              service: true,
            },
          },
          business: true,
        },
      });
    });

    it("should not send quote from another business", async () => {
      // Simuler qu'aucun devis n'est trouvé (car businessId différent)
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const result = await sendQuote({ id: "quote_other_business" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Devis introuvable");
      }

      expect(mockResendSend).not.toHaveBeenCalled();
    });
  });

  describe("🔄 Mode développement (simulation)", () => {
    it("should simulate email sending when Resend not configured", async () => {
      // Mock Resend non configuré
      const { isResendConfigured } = await import("@/lib/resend");
      vi.mocked(isResendConfigured).mockReturnValue(false);

      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuote as any);

      const updatedQuote = {
        ...mockQuote,
        status: "SENT" as const,
        sentAt: new Date(),
      };
      vi.mocked(prisma.quote.update).mockResolvedValue(updatedQuote as any);

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      const result = await sendQuote({ id: "quote_123" });

      // Devrait réussir en mode simulation
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.status).toBe("SENT");
      }

      // Vérifier que console.log a été appelé pour la simulation
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[SIMULATION]")
      );

      // Nettoyer
      consoleLogSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});
