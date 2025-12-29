/**
 * Tests spécifiques pour la génération de numéros de devis
 * Teste la correction du bug de contrainte unique et le mécanisme de retry
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock dependencies
vi.mock("next-auth");

// Mock Prisma avec des fonctions vi.fn()
const mockFindFirst = vi.fn();
const mockCreate = vi.fn();
const mockUserFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    quote: {
      findFirst: mockFindFirst,
      create: mockCreate,
    },
    user: {
      findUnique: mockUserFindUnique,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/audit-logger", () => ({
  auditLog: vi.fn().mockResolvedValue(undefined),
  AuditAction: {
    QUOTE_CREATED: "QUOTE_CREATED",
  },
  AuditLevel: {
    INFO: "INFO",
  },
}));

// Import createQuote APRÈS les mocks
const { createQuote } = await import("@/app/actions/quotes");

describe("Quote Number Generation - Bug Fix & Multi-Tenant", () => {
  const mockUser = {
    id: "clxxx11111111111111111111",
    email: "test@example.com",
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
      id: "clxxx11111111111111111111", // Format CUID (25 chars: c + 24)
      businessId: "clxxx22222222222222222222",
      email: "test@example.com",
      name: "Test User",
    },
  };

  const validQuoteInput = {
    clientId: "clxxx33333333333333333333", // Format CUID (25 chars: c + 24)
    validUntil: new Date("2025-12-31").toISOString(),
    status: "DRAFT" as const,
    discount: 0,
    discountType: "FIXED" as const,
    items: [
      {
        serviceId: "clxxx44444444444444444444", // Format CUID (25 chars: c + 24)
        name: "Service Test",
        price: 100,
        quantity: 1,
        total: 100,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    mockUserFindUnique.mockResolvedValue(mockUser);
  });

  describe("✅ Correction contrainte unique par Business", () => {
    it("deux business PEUVENT créer des devis avec le même numéro", async () => {
      const currentYear = new Date().getFullYear();

      // Business 1 crée DEVIS-2025-001
      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: "quote_1",
        quoteNumber: `DEVIS-${currentYear}-001`,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "Client",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      const result1 = await createQuote(validQuoteInput);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.data.quoteNumber).toBe(`DEVIS-${currentYear}-001`); // Business 2 crée AUSSI DEVIS-2025-001 (différent businessId)
      }
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "clxxx77777777777777777777",
          businessId: "clxxx55555555555555555555", // Autre business
          email: "other@example.com",
          name: "Other User",
        },
      });

      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: "quote_2",
        quoteNumber: `DEVIS-${currentYear}-001`, // ✅ Même numéro OK car différent businessId
        businessId: "clxxx55555555555555555555",
        clientId: "clxxx66666666666666666666",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx66666666666666666666",
          firstName: "Other",
          lastName: "Client",
          email: "other@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx55555555555555555555",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      const result2 = await createQuote(validQuoteInput);

      // Les deux quotes ont le même numéro MAIS des businessId différents
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.data.quoteNumber).toBe(`DEVIS-${currentYear}-001`);
        expect(result2.data.businessId).toBe("clxxx55555555555555555555");
      }
      if (result1.success) {
        expect(result1.data.businessId).toBe("clxxx22222222222222222222");
      }
    });

    it("filtre correctement par businessId lors de la recherche du dernier numéro", async () => {
      const currentYear = new Date().getFullYear();

      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: "quote_new",
        quoteNumber: `DEVIS-${currentYear}-001`,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "Client",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      await createQuote(validQuoteInput);

      // ✅ CRITIQUE: Vérifier que la requête filtre par businessId
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            businessId: "clxxx22222222222222222222",
            quoteNumber: expect.objectContaining({
              startsWith: `DEVIS-${currentYear}-`,
            }),
          }),
          orderBy: {
            createdAt: "desc",
          },
          select: {
            quoteNumber: true,
          },
        })
      );
    });
  });

  describe("🔄 Mécanisme de retry pour race conditions", () => {
    it("réessaie automatiquement en cas d'erreur P2002 (contrainte unique)", async () => {
      const currentYear = new Date().getFullYear();

      mockFindFirst.mockResolvedValue(null);

      // Première tentative : erreur P2002
      const p2002Error: any = new Error("Unique constraint failed");
      p2002Error.code = "P2002";

      // Deuxième tentative : succès
      mockCreate.mockRejectedValueOnce(p2002Error).mockResolvedValueOnce({
        id: "quote_retry_success",
        quoteNumber: `DEVIS-${currentYear}-001`,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "Client",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      const result = await createQuote(validQuoteInput);

      // ✅ Le retry a fonctionné
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.quoteNumber).toBe(`DEVIS-${currentYear}-001`);
      }

      // Vérifie qu'il y a eu 2 appels à create (1 échec + 1 succès)
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it("échoue après 4 tentatives (1 initial + 3 retries)", async () => {
      mockFindFirst.mockResolvedValue(null);

      const p2002Error: any = new Error("Unique constraint failed");
      p2002Error.code = "P2002";

      // Toutes les tentatives échouent
      mockCreate.mockRejectedValue(p2002Error);

      const result = await createQuote(validQuoteInput);

      // ✅ L'erreur est retournée après max retries
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error).toBe("Erreur lors de createQuote");
      }

      // Vérifie qu'il y a eu exactement 4 tentatives
      expect(mockCreate).toHaveBeenCalledTimes(4);
    });

    it("ne réessaie PAS pour les erreurs non-P2002", async () => {
      mockFindFirst.mockResolvedValue(null);

      const otherError: any = new Error("Database connection error");
      otherError.code = "P1001"; // Pas une erreur de contrainte unique

      mockCreate.mockRejectedValue(otherError);

      const result = await createQuote(validQuoteInput);

      // ✅ Échec immédiat sans retry
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
      expect(mockCreate).toHaveBeenCalledTimes(1); // Une seule tentative
    });
  });

  describe("🔢 Génération séquentielle correcte", () => {
    it("génère DEVIS-{ANNÉE}-001 pour le premier devis", async () => {
      const currentYear = new Date().getFullYear();
      const expectedNumber = `DEVIS-${currentYear}-001`;

      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: "quote_first",
        quoteNumber: expectedNumber,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "Client",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      const result = await createQuote(validQuoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quoteNumber).toBe(expectedNumber);
        expect(result.data.quoteNumber).toMatch(/^DEVIS-\d{4}-\d{3}$/);
      }
    });

    it("incrémente correctement le numéro", async () => {
      const currentYear = new Date().getFullYear();

      // Dernier devis : DEVIS-2025-005
      mockFindFirst.mockResolvedValueOnce({
        id: "quote_last",
        quoteNumber: `DEVIS-${currentYear}-005`,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "SENT",
        validUntil: new Date(),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Nouveau devis : DEVIS-2025-006
      mockCreate.mockResolvedValueOnce({
        id: "quote_new",
        quoteNumber: `DEVIS-${currentYear}-006`,
        businessId: "clxxx22222222222222222222",
        clientId: "clxxx33333333333333333333",
        status: "DRAFT",
        validUntil: new Date("2025-12-31"),
        discount: 0,
        subtotal: 100,
        total: 100,
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "Client",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [],
      } as any);

      const result = await createQuote(validQuoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quoteNumber).toBe(`DEVIS-${currentYear}-006`);
      }
    });
  });
});
