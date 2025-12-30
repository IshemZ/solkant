import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getQuotes,
  getQuote,
  createQuote,
  deleteQuote,
} from "@/app/actions/quotes";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Decimal } from "@prisma/client/runtime/library";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    quote: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Quote Server Actions", () => {
  const mockSession = {
    user: {
      id: "clxxx11111111111111111111",
      businessId: "clxxx22222222222222222222",
      email: "test@example.com",
      name: "Test User",
    },
  };

  const mockUser = {
    id: "user_123",
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getQuotes", () => {
    it("should return quotes with client and items", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        {
          id: "quote_1",
          quoteNumber: "DEVIS-2024-001",
          clientId: "clxxx33333333333333333333",
          businessId: "clxxx22222222222222222222",
          status: "DRAFT",
          validUntil: new Date("2025-01-15"),
          discount: new Decimal(0),
          subtotal: new Decimal(150),
          total: new Decimal(150),
          discountType: "FIXED",
          notes: null,
          sentAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          client: {
            id: "clxxx33333333333333333333",
            firstName: "Marie",
            lastName: "Dupont",
            email: "marie@example.com",
            phone: "0612345678",
            address: null,
            city: null,
            postalCode: null,
            businessId: "clxxx22222222222222222222",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          items: [
            {
              id: "item_1",
              quoteId: "quote_1",
              serviceId: "clxxx44444444444444444444",
              packageId: null,
              name: "Coupe classique",
              description: null,
              price: new Decimal(30),
              quantity: 1,
              total: new Decimal(30),
              packageDiscount: new Decimal(0),
              createdAt: new Date(),
              updatedAt: new Date(),
              service: {
                id: "clxxx44444444444444444444",
                name: "Coupe classique",
                description: null,
                price: new Decimal(30),
                duration: 45,
                category: null,
                isActive: true,
                deletedAt: null,
                businessId: "clxxx22222222222222222222",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        },
      ]);

      const result = await getQuotes();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].quoteNumber).toBe("DEVIS-2024-001");
        expect(result.data[0].client.firstName).toBe("Marie");
        expect(result.data[0].items).toHaveLength(1);
      }

      // ✅ CRITIQUE: Vérifier filtrage businessId
      expect(prisma.quote.findMany).toHaveBeenCalledWith({
        where: { businessId: "clxxx22222222222222222222" },
        include: {
          client: true,
          items: {
            include: {
              service: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getQuotes();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.quote.findMany).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getQuotes();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Erreur lors de getQuotes");
      }
    });
  });

  describe("getQuote", () => {
    it("should return single quote with full details", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue({
        id: "quote_1",
        quoteNumber: "DEVIS-2024-001",
        clientId: "clxxx33333333333333333333",
        businessId: "clxxx22222222222222222222",
        status: "DRAFT",
        validUntil: new Date("2025-01-15"),
        discount: new Decimal(0),
        discountType: "FIXED",
        subtotal: new Decimal(150),
        total: new Decimal(150),
        notes: "Note de test",
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Marie",
          lastName: "Dupont",
          email: "marie@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        business: {
          id: "clxxx22222222222222222222",
          name: "Mon Salon",
          siret: "12345678901234",
          address: "1 rue de la Paix",
          city: "Paris",
          postalCode: "75001",
          phone: "0123456789",
          email: "contact@monsalon.fr",
          logo: null,
          userId: "clxxx11111111111111111111",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: "item_1",
            quoteId: "quote_1",
            serviceId: "clxxx44444444444444444444",
            name: "Coupe classique",
            description: null,
            price: 30,
            quantity: 1,
            total: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
            service: {
              id: "clxxx44444444444444444444",
              name: "Coupe classique",
              description: null,
              price: 30,
              duration: 45,
              category: null,
              isActive: true,
              businessId: "clxxx22222222222222222222",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      });

      const result = await getQuote({ id: "quote_1" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.quoteNumber).toBe("DEVIS-2024-001");
        expect(result.data.business.name).toBe("Mon Salon");
      }

      // ✅ CRITIQUE: Vérifier filtrage businessId
      expect(prisma.quote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "quote_1",
          businessId: "clxxx22222222222222222222",
        },
        include: {
          client: true,
          business: true,
          items: {
            include: {
              service: true,
            },
          },
        },
      });
    });

    it("should return error if quote not found", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const result = await getQuote({ id: "quote_not_found" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Devis introuvable");
      }
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getQuote({ id: "quote_1" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.quote.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("createQuote - Quote Number Generation", () => {
    it("should generate first quote number DEVIS-2024-001", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock: aucun devis existant pour cette année
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const quoteInput = {
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Coupe classique",
            description: null,
            price: 30,
            quantity: 1,
            total: 30,
          },
        ],
      };

      const createdQuote = {
        id: "quote_new",
        quoteNumber: "DEVIS-2024-001",
        clientId: quoteInput.clientId,
        status: quoteInput.status,
        validUntil: new Date(quoteInput.validUntil),
        discount: quoteInput.discount,
        subtotal: 30,
        total: 30,
        notes: null,
        sentAt: null,
        businessId: "clxxx22222222222222222222",
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Marie",
          lastName: "Dupont",
          email: "marie@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: "item_new",
            quoteId: "quote_new",
            serviceId: "clxxx44444444444444444444",
            name: "Coupe classique",
            description: null,
            price: 30,
            quantity: 1,
            total: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      vi.mocked(prisma.quote.create).mockResolvedValue(createdQuote as never);

      const result = await createQuote(quoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.quoteNumber).toMatch(/^DEVIS-\d{4}-\d{3}$/);
      }
    });

    it("should increment quote number correctly", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock: dernier devis = DEVIS-2024-042
      vi.mocked(prisma.quote.findFirst).mockResolvedValue({
        id: "quote_last",
        quoteNumber: "DEVIS-2024-042",
        clientId: "clxxx33333333333333333333",
        businessId: "clxxx22222222222222222222",
        status: "SENT",
        validUntil: new Date(),
        discount: new Decimal(0),
        discountType: "FIXED",
        subtotal: new Decimal(100),
        total: new Decimal(100),
        notes: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const quoteInput = {
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Test Service",
            description: null,
            price: 50,
            quantity: 1,
            total: 50,
          },
        ],
      };

      const createdQuote = {
        id: "quote_new",
        quoteNumber: "DEVIS-2024-043", // Doit être 043
        ...quoteInput,
        subtotal: 50,
        total: 50,
        notes: null,
        businessId: "clxxx22222222222222222222",
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: "item_new",
            quoteId: "quote_new",
            serviceId: "clxxx44444444444444444444",
            name: "Test Service",
            description: null,
            price: 50,
            quantity: 1,
            total: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      vi.mocked(prisma.quote.create).mockResolvedValue(createdQuote as never);

      const result = await createQuote(quoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quoteNumber).toBe("DEVIS-2024-043");
      }
    });
  });

  describe("createQuote - Total Calculations", () => {
    it("should calculate subtotal from items", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const quoteInput = {
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Coupe",
            description: null,
            price: 30,
            quantity: 1,
            total: 30,
          },
          {
            serviceId: "clxxx55555555555555555555",
            name: "Couleur",
            description: null,
            price: 80,
            quantity: 1,
            total: 80,
          },
          {
            serviceId: "clxxx66666666666666666666",
            name: "Brushing",
            description: null,
            price: 20,
            quantity: 1,
            total: 20,
          },
        ],
      };

      const createdQuote = {
        id: "quote_calc",
        quoteNumber: "DEVIS-2024-001",
        ...quoteInput,
        subtotal: 130, // 30 + 80 + 20
        total: 130,
        notes: null,
        businessId: "clxxx22222222222222222222",
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Marie",
          lastName: "Dupont",
          email: "marie@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: quoteInput.items.map((item, i) => ({
          id: `item_${i}`,
          quoteId: "quote_calc",
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };

      vi.mocked(prisma.quote.create).mockResolvedValue(createdQuote as never);

      const result = await createQuote(quoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subtotal).toBe(130);
        expect(result.data.total).toBe(130);
      }
    });

    it("should apply discount correctly", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const quoteInput = {
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 20, // Remise de 20€
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Service Test",
            description: null,
            price: 100,
            quantity: 1,
            total: 100,
          },
        ],
      };

      const createdQuote = {
        id: "quote_discount",
        quoteNumber: "DEVIS-2024-001",
        ...quoteInput,
        subtotal: 100,
        total: 80, // 100 - 20
        notes: null,
        businessId: "clxxx22222222222222222222",
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: "item_1",
            quoteId: "quote_discount",
            ...quoteInput.items[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      vi.mocked(prisma.quote.create).mockResolvedValue(createdQuote as never);

      const result = await createQuote(quoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subtotal).toBe(100);
        expect(result.data.total).toBe(80);
      }
    });

    it("should handle multiple quantities", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const quoteInput = {
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Extension cils",
            description: null,
            price: 50,
            quantity: 3,
            total: 150,
          },
        ],
      };

      const createdQuote = {
        id: "quote_qty",
        quoteNumber: "DEVIS-2024-001",
        ...quoteInput,
        subtotal: 150,
        total: 150,
        notes: null,
        businessId: "clxxx22222222222222222222",
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: "clxxx33333333333333333333",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "0612345678",
          address: null,
          city: null,
          postalCode: null,
          businessId: "clxxx22222222222222222222",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: "item_1",
            quoteId: "quote_qty",
            ...quoteInput.items[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      vi.mocked(prisma.quote.create).mockResolvedValue(createdQuote as never);

      const result = await createQuote(quoteInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items[0].quantity).toBe(3);
        expect(result.data.items[0].total).toBe(150);
        expect(result.data.subtotal).toBe(150);
      }
    });
  });

  describe("createQuote - Validation", () => {
    it("should return validation error for invalid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await createQuote({
        clientId: "", // Invalide
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("invalide");
        if ("fieldErrors" in result && result.fieldErrors) {
          expect(result.fieldErrors).toBeDefined();
        }
      }
      expect(prisma.quote.create).not.toHaveBeenCalled();
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await createQuote({
        clientId: "clxxx33333333333333333333",
        validUntil: new Date("2025-01-15").toISOString(),
        status: "DRAFT" as const,
        discount: 0,
        discountType: "FIXED" as const,
        items: [
          {
            serviceId: "clxxx44444444444444444444",
            name: "Test",
            description: null,
            price: 50,
            quantity: 1,
            total: 50,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.quote.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteQuote - Multi-tenancy Security", () => {
    it("should only delete quote from own business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock findFirst pour vérifier l'existence
      vi.mocked(prisma.quote.findFirst).mockResolvedValue({
        id: "quote_123",
        quoteNumber: "DEVIS-2024-001",
        clientId: "clxxx33333333333333333333",
        businessId: "clxxx22222222222222222222",
        status: "DRAFT",
        validUntil: new Date(),
        discount: new Decimal(0),
        discountType: "FIXED",
        subtotal: new Decimal(100),
        total: new Decimal(100),
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.quote.delete).mockResolvedValue({
        id: "quote_123",
        quoteNumber: "DEVIS-2024-001",
        clientId: "clxxx33333333333333333333",
        businessId: "clxxx22222222222222222222",
        status: "DRAFT",
        validUntil: new Date(),
        discount: new Decimal(0),
        discountType: "FIXED",
        subtotal: new Decimal(100),
        total: new Decimal(100),
        notes: null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await deleteQuote({ id: "quote_123" });

      expect(result.success).toBe(true);

      // ✅ CRITIQUE: Vérifier filtrage businessId dans findFirst
      expect(prisma.quote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "quote_123",
          businessId: "clxxx22222222222222222222",
        },
        select: { quoteNumber: true, clientId: true, total: true },
      });

      // ✅ CRITIQUE: Vérifier filtrage businessId dans delete
      expect(prisma.quote.delete).toHaveBeenCalledWith({
        where: {
          id: "quote_123",
          businessId: "clxxx22222222222222222222",
        },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await deleteQuote({ id: "quote_123" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.quote.delete).not.toHaveBeenCalled();
    });

    it("should return error if quote not found or belongs to another business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock findFirst retourne null (quote inexistant ou autre business)
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const result = await deleteQuote({ id: "quote_other" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Devis introuvable");
      }
      expect(prisma.quote.delete).not.toHaveBeenCalled();
    });
  });
});
