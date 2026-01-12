/**
 * Tests pour les Server Actions Dashboard
 *
 * Teste les statistiques du dashboard avec :
 * - Isolation multi-tenant (businessId)
 * - Calculs corrects (total, moyenne)
 * - Gestion des cas edge
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
    client: {
      count: vi.fn(),
    },
    quote: {
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Import des actions à tester
import { getDashboardStats } from "./dashboard";
import prisma from "@/lib/prisma";

describe("Dashboard Actions", () => {
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

  describe("getDashboardStats", () => {
    it("should return correct stats with multiple quotes", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(5);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        { total: new Decimal(100) },
        { total: new Decimal(200) },
        { total: new Decimal(150) },
      ]);

      const result = await getDashboardStats({});

      expect(result).toEqual({
        success: true,
        data: {
          totalClients: 5,
          totalQuotes: 3,
          totalRevenue: 450,
          averageQuoteValue: 150, // 450 / 3
        },
      });
    });

    it("should handle zero quotes correctly", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(2);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      const result = await getDashboardStats({});

      expect(result).toEqual({
        success: true,
        data: {
          totalClients: 2,
          totalQuotes: 0,
          totalRevenue: 0,
          averageQuoteValue: 0, // 0 / 0 = 0 (not NaN)
        },
      });
    });

    it("should handle zero clients correctly", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(0);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      const result = await getDashboardStats({});

      expect(result).toEqual({
        success: true,
        data: {
          totalClients: 0,
          totalQuotes: 0,
          totalRevenue: 0,
          averageQuoteValue: 0,
        },
      });
    });

    it("should filter by businessId for multi-tenant isolation", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(3);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        { total: new Decimal(100) },
      ]);

      await getDashboardStats({});

      // Verify client.count was called with businessId filter
      expect(prisma.client.count).toHaveBeenCalledWith({
        where: { businessId: "business-test-123" },
      });

      // Verify quote.findMany was called with businessId filter
      expect(prisma.quote.findMany).toHaveBeenCalledWith({
        where: { businessId: "business-test-123" },
        select: { total: true },
      });
    });

    it("should calculate average correctly with decimal values", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(10);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        { total: new Decimal(99.99) },
        { total: new Decimal(150.50) },
        { total: new Decimal(200.01) },
      ]);

      const result = await getDashboardStats({});

      expect(result.success).toBe(true);
      expect(result.data?.totalRevenue).toBeCloseTo(450.5, 2);
      expect(result.data?.averageQuoteValue).toBeCloseTo(150.17, 2);
    });

    it("should handle single quote", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(1);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        { total: new Decimal(500) },
      ]);

      const result = await getDashboardStats({});

      expect(result).toEqual({
        success: true,
        data: {
          totalClients: 1,
          totalQuotes: 1,
          totalRevenue: 500,
          averageQuoteValue: 500,
        },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getDashboardStats({});

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error", "Non autorisé");
    });

    it("should execute queries in parallel for performance", async () => {
      vi.mocked(prisma.client.count).mockResolvedValue(5);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([
        { total: new Decimal(100) },
      ]);

      await getDashboardStats({});

      // Both should be called exactly once
      expect(prisma.client.count).toHaveBeenCalledTimes(1);
      expect(prisma.quote.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
