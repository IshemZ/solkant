/**
 * Tests pour les Server Actions Export
 *
 * Teste l'export CSV des devis avec :
 * - Formatage CSV correct
 * - Échappement des caractères spéciaux
 * - Isolation multi-tenant (businessId)
 * - Audit logging
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getServerSession } from "next-auth";
import { Decimal } from "@prisma/client/runtime/library";

// IMPORTANT: Mocks doivent être déclarés AVANT les imports qui en dépendent
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    quote: {
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/audit-logger", () => ({
  auditLog: vi.fn(),
  AuditAction: {
    QUOTE_EXPORTED: "QUOTE_EXPORTED",
  },
  AuditLevel: {
    INFO: "INFO",
  },
}));

// Import des actions à tester
import { exportAllQuotes } from "./export";
import prisma from "@/lib/prisma";
import { auditLog } from "@/lib/audit-logger";

describe("Export Actions", () => {
  const mockSession = {
    user: {
      id: "user-test-123",
      businessId: "business-test-123",
      email: "test@solkant.com",
      name: "Test User",
    },
  };

  const mockUser = {
    id: "user-test-123",
    email: "test@solkant.com",
    emailVerified: new Date("2025-01-01"),
    name: "Test User",
    password: null,
    image: null,
    role: "USER" as const,
    verificationToken: null,
    tokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSeenAnnouncementsAt: null,
    business: { id: "business-test-123" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
  });

  describe("exportAllQuotes", () => {
    it("should export quotes to CSV format with headers", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "SENT",
          subtotal: new Decimal(100),
          discount: new Decimal(10),
          discountType: "PERCENT",
          total: new Decimal(90),
          sentAt: new Date("2025-01-11"),
          validUntil: new Date("2025-02-10"),
          notes: "Test note",
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [
            {
              id: "item-1",
              name: "Coupe",
              description: "Coupe classique",
              price: new Decimal(50),
              quantity: 2,
              total: new Decimal(100),
              service: {
                id: "service-1",
                name: "Coupe",
              },
            },
          ],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      expect(result.success).toBe(true);

      const csvContent = result.data as string;
      const lines = csvContent.split("\n");

      // Verify header row
      expect(lines[0]).toContain("Numéro de Devis");
      expect(lines[0]).toContain("Date de Création");
      expect(lines[0]).toContain("Client - Prénom");
      expect(lines[0]).toContain("Ligne - Nom du Service");

      // Verify data row
      expect(lines[1]).toContain("DEV-2025-001");
      expect(lines[1]).toContain("Jean");
      expect(lines[1]).toContain("Dupont");
      expect(lines[1]).toContain("Coupe");
    });

    it("should return empty string when no quotes exist", async () => {
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      const result = await exportAllQuotes({});

      expect(result).toEqual({
        success: true,
        data: "",
      });

      // Audit log should not be called when no quotes
      expect(auditLog).not.toHaveBeenCalled();
    });

    it("should filter by businessId for multi-tenant isolation", async () => {
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      await exportAllQuotes({});

      expect(prisma.quote.findMany).toHaveBeenCalledWith({
        where: { businessId: "business-test-123" },
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
    });

    it("should escape CSV fields with commas", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "SENT",
          subtotal: new Decimal(100),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(100),
          sentAt: null,
          validUntil: null,
          notes: "Note with, commas, inside",
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean-Pierre",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      const csvContent = result.data as string;

      // Fields with commas should be wrapped in quotes
      expect(csvContent).toContain('"Note with, commas, inside"');
    });

    it("should escape CSV fields with quotes", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "SENT",
          subtotal: new Decimal(100),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(100),
          sentAt: null,
          validUntil: null,
          notes: 'Note with "quotes" inside',
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      const csvContent = result.data as string;

      // Quotes should be escaped as double quotes
      expect(csvContent).toContain('Note with ""quotes"" inside');
    });

    it("should handle quotes with no items", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "DRAFT",
          subtotal: new Decimal(0),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(0),
          sentAt: null,
          validUntil: null,
          notes: null,
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      expect(result.success).toBe(true);

      const csvContent = result.data as string;
      const lines = csvContent.split("\n");

      // Should have header + 1 data row
      expect(lines.length).toBe(2);
      expect(lines[1]).toContain("DEV-2025-001");
    });

    it("should handle multiple items per quote", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "SENT",
          subtotal: new Decimal(150),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(150),
          sentAt: new Date("2025-01-11"),
          validUntil: null,
          notes: null,
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [
            {
              id: "item-1",
              name: "Coupe",
              description: "Coupe classique",
              price: new Decimal(50),
              quantity: 1,
              total: new Decimal(50),
              service: { id: "service-1", name: "Coupe" },
            },
            {
              id: "item-2",
              name: "Couleur",
              description: null,
              price: new Decimal(100),
              quantity: 1,
              total: new Decimal(100),
              service: { id: "service-2", name: "Couleur" },
            },
          ],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      const csvContent = result.data as string;
      const lines = csvContent.split("\n");

      // Should have header + 2 data rows (one per item)
      expect(lines.length).toBe(3);
      expect(lines[1]).toContain("Coupe");
      expect(lines[2]).toContain("Couleur");

      // First row should have quote number, second should not
      expect(lines[1]).toContain("DEV-2025-001");
      expect(lines[2]).not.toContain("DEV-2025-001");
    });

    it("should log audit trail after export", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-10"),
          status: "SENT",
          subtotal: new Decimal(100),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(100),
          sentAt: null,
          validUntil: null,
          notes: null,
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [
            {
              id: "item-1",
              name: "Coupe",
              description: null,
              price: new Decimal(50),
              quantity: 2,
              total: new Decimal(100),
              service: { id: "service-1", name: "Coupe" },
            },
          ],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      await exportAllQuotes({});

      expect(auditLog).toHaveBeenCalledWith({
        action: "QUOTE_EXPORTED",
        level: "INFO",
        userId: "user-test-123",
        businessId: "business-test-123",
        resourceType: "Quote",
        metadata: {
          quoteCount: 1,
          totalLineItems: 1,
          exportFormat: "CSV",
        },
      });
    });

    it("should format dates in French locale", async () => {
      const mockQuotes = [
        {
          id: "quote-1",
          quoteNumber: "DEV-2025-001",
          createdAt: new Date("2025-01-15"),
          status: "SENT",
          subtotal: new Decimal(100),
          discount: new Decimal(0),
          discountType: "PERCENT",
          total: new Decimal(100),
          sentAt: new Date("2025-01-16"),
          validUntil: new Date("2025-02-15"),
          notes: null,
          businessId: "business-test-123",
          clientId: "client-1",
          client: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            phone: "0612345678",
          },
          items: [],
        },
      ];

      vi.mocked(prisma.quote.findMany).mockResolvedValue(mockQuotes as any);

      const result = await exportAllQuotes({});

      const csvContent = result.data as string;

      // Dates should be formatted as DD/MM/YYYY (French locale)
      expect(csvContent).toContain("15/01/2025");
      expect(csvContent).toContain("16/01/2025");
      expect(csvContent).toContain("15/02/2025");
    });
  });
});
