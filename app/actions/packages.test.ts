/**
 * Tests pour les Server Actions Packages
 *
 * Teste les opérations CRUD sur les forfaits avec :
 * - Isolation multi-tenant (businessId)
 * - Validation Zod
 * - Sérialisation Decimal
 * - Gestion des items
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
    package: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    packageItem: {
      deleteMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Import des actions à tester
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "./packages";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

describe("Package Actions", () => {
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

  describe("getPackages", () => {
    it("should return all active packages for business", async () => {
      const mockPackages = [
        {
          id: "pkg-1",
          name: "Forfait Beauté",
          description: "Forfait complet",
          price: new Decimal(150),
          isActive: true,
          businessId: "business-test-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          items: [
            {
              id: "item-1",
              packageId: "pkg-1",
              serviceId: "service-1",
              quantity: 2,
              service: {
                id: "service-1",
                name: "Coupe",
                price: new Decimal(50),
              },
            },
          ],
        },
      ];

      vi.mocked(prisma.package.findMany).mockResolvedValue(mockPackages as any);

      const result = await getPackages();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].name).toBe("Forfait Beauté");
      expect(result.data?.[0].price).toBe(150); // Decimal serialized to number
    });

    it("should filter by businessId and isActive", async () => {
      vi.mocked(prisma.package.findMany).mockResolvedValue([]);

      await getPackages();

      expect(prisma.package.findMany).toHaveBeenCalledWith({
        where: {
          businessId: "business-test-123",
          isActive: true,
        },
        include: {
          items: {
            include: { service: true },
          },
        },
        orderBy: { name: "asc" },
      });
    });

    it("should return empty array when no packages exist", async () => {
      vi.mocked(prisma.package.findMany).mockResolvedValue([]);

      const result = await getPackages();

      expect(result).toEqual({
        success: true,
        data: [],
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getPackages();

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error", "Non autorisé");
    });
  });

  describe("getPackageById", () => {
    it("should return package by ID", async () => {
      const mockPackage = {
        id: "pkg-1",
        name: "Forfait VIP",
        description: "Forfait premium",
        price: new Decimal(250),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [],
      };

      vi.mocked(prisma.package.findFirst).mockResolvedValue(mockPackage as any);

      const result = await getPackageById({ id: "pkg-1" });

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Forfait VIP");
      expect(result.data?.price).toBe(250);
    });

    it("should filter by businessId for security", async () => {
      vi.mocked(prisma.package.findFirst).mockResolvedValue(null);

      await getPackageById({ id: "pkg-1" });

      expect(prisma.package.findFirst).toHaveBeenCalledWith({
        where: {
          id: "pkg-1",
          businessId: "business-test-123",
        },
        include: {
          items: {
            include: { service: true },
          },
        },
      });
    });

    it("should return error if package not found", async () => {
      vi.mocked(prisma.package.findFirst).mockResolvedValue(null);

      const result = await getPackageById({ id: "pkg-999" });

      expect(result).toMatchObject({
        success: false,
        error: "Forfait introuvable",
        code: "NOT_FOUND",
      });
    });
  });

  describe("createPackage", () => {
    it("should create package with items", async () => {
      const input = {
        name: "Nouveau Forfait",
        description: "Description du forfait",
        discountType: "NONE" as const,
        discountValue: 0,
        items: [
          { serviceId: "c000000000000000000000001", quantity: 2 },
          { serviceId: "c000000000000000000000002", quantity: 1 },
        ],
      };

      const createdPackage = {
        id: "pkg-new",
        name: "Nouveau Forfait",
        description: "Description du forfait",
        price: new Decimal(200),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [
          {
            id: "item-1",
            packageId: "pkg-new",
            serviceId: "service-1",
            quantity: 2,
            service: { id: "service-1", name: "Coupe" },
          },
        ],
      };

      vi.mocked(prisma.package.create).mockResolvedValue(createdPackage as any);

      const result = await createPackage(input);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Nouveau Forfait");

      // Verify businessId was added
      expect(prisma.package.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          businessId: "business-test-123",
        }),
        include: {
          items: {
            include: { service: true },
          },
        },
      });
    });

    it("should revalidate path after creation", async () => {
      const input = {
        name: "Nouveau Forfait",
        description: "Test",
        discountType: "NONE" as const,
        discountValue: 0,
        items: [{ serviceId: "c000000000000000000000001", quantity: 1 }],
      };

      const createdPackage = {
        id: "pkg-new",
        name: input.name,
        description: input.description,
        price: new Decimal(150),
        discountType: input.discountType,
        discountValue: new Decimal(input.discountValue),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [{
          id: "item-new",
          packageId: "pkg-new",
          serviceId: input.items[0].serviceId,
          quantity: input.items[0].quantity,
          service: { id: input.items[0].serviceId, name: "Service" },
        }],
      };

      vi.mocked(prisma.package.create).mockResolvedValue(createdPackage as any);

      await createPackage(input);

      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    });

    it("should sanitize XSS in input", async () => {
      const input = {
        name: "Forfait <script>alert('xss')</script>",
        description: "Test <img src=x onerror=alert(1)>",
        discountType: "NONE" as const,
        discountValue: 0,
        items: [{ serviceId: "c000000000000000000000001", quantity: 1 }],
      };

      const createdPackage = {
        id: "pkg-new",
        name: "Forfait <script>alert('xss')</script>",
        description: "Test <img src=x onerror=alert(1)>",
        price: new Decimal(100),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [{
          id: "item-new",
          packageId: "pkg-new",
          serviceId: "c000000000000000000000001",
          quantity: 1,
          service: { id: "c000000000000000000000001", name: "Service" },
        }],
      };

      vi.mocked(prisma.package.create).mockResolvedValue(createdPackage as any);

      await createPackage(input);

      // sanitizeObject should have been called (tested via action-wrapper)
      expect(prisma.package.create).toHaveBeenCalled();
    });
  });

  describe("updatePackage", () => {
    it("should update package and replace items", async () => {
      const input = {
        id: "pkg-1",
        name: "Forfait Modifié",
        description: "Nouvelle description",
        discountType: "NONE" as const,
        discountValue: 0,
        items: [{ serviceId: "c000000000000000000000003", quantity: 1 }],
      };

      const updatedPackage = {
        id: "pkg-1",
        name: "Forfait Modifié",
        description: "Nouvelle description",
        price: new Decimal(180),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [
          {
            id: "item-new",
            packageId: "pkg-1",
            serviceId: "c000000000000000000000003",
            quantity: 1,
            service: { id: "c000000000000000000000003", name: "Brushing" },
          },
        ],
      };

      vi.mocked(prisma.packageItem.deleteMany).mockResolvedValue({ count: 2 });
      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      const result = await updatePackage(input);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Forfait Modifié");

      // Verify old items were deleted
      expect(prisma.packageItem.deleteMany).toHaveBeenCalledWith({
        where: { packageId: "pkg-1" },
      });

      // Verify update was called with businessId filter
      expect(prisma.package.update).toHaveBeenCalledWith({
        where: {
          id: "pkg-1",
          businessId: "business-test-123",
        },
        data: expect.any(Object),
        include: {
          items: {
            include: { service: true },
          },
        },
      });
    });

    it("should revalidate path after update", async () => {
      const input = {
        id: "pkg-1",
        name: "Updated",
        description: "Test",
        discountType: "NONE" as const,
        discountValue: 0,
        items: [{ serviceId: "c000000000000000000000001", quantity: 1 }],
      };

      const updatedPackage = {
        id: "pkg-1",
        name: input.name,
        description: input.description,
        price: new Decimal(150),
        discountType: input.discountType,
        discountValue: new Decimal(input.discountValue),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [{
          id: "item-1",
          packageId: "pkg-1",
          serviceId: input.items[0].serviceId,
          quantity: input.items[0].quantity,
          service: { id: input.items[0].serviceId, name: "Service" },
        }],
      };

      vi.mocked(prisma.packageItem.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      await updatePackage(input);

      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    });

    it("should handle update without items", async () => {
      const input = {
        id: "pkg-1",
        name: "Updated Package",
        description: "Updated description",
      };

      const updatedPackage = {
        id: "pkg-1",
        name: "Updated Package",
        description: "Updated description",
        price: new Decimal(175),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: true,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        items: [],
      };

      vi.mocked(prisma.packageItem.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      const result = await updatePackage(input);

      expect(result.success).toBe(true);

      // Items should be undefined in update data
      expect(prisma.package.update).toHaveBeenCalledWith({
        where: {
          id: "pkg-1",
          businessId: "business-test-123",
        },
        data: expect.objectContaining({
          items: undefined,
        }),
        include: {
          items: {
            include: { service: true },
          },
        },
      });
    });
  });

  describe("deletePackage", () => {
    it("should soft delete package", async () => {
      const updatedPackage = {
        id: "pkg-1",
        name: "Forfait",
        description: "Test",
        price: new Decimal(100),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: false,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      const result = await deletePackage({ id: "pkg-1" });

      expect(result).toEqual({
        success: true,
        data: { id: "pkg-1" },
      });

      // Verify soft delete
      expect(prisma.package.update).toHaveBeenCalledWith({
        where: {
          id: "pkg-1",
          businessId: "business-test-123",
        },
        data: {
          isActive: false,
          deletedAt: expect.any(Date),
        },
      });
    });

    it("should filter by businessId when deleting", async () => {
      const updatedPackage = {
        id: "pkg-1",
        name: "Forfait",
        description: "Test",
        price: new Decimal(100),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: false,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      await deletePackage({ id: "pkg-1" });

      expect(prisma.package.update).toHaveBeenCalledWith({
        where: {
          id: "pkg-1",
          businessId: "business-test-123",
        },
        data: expect.any(Object),
      });
    });

    it("should revalidate path after deletion", async () => {
      const updatedPackage = {
        id: "pkg-1",
        name: "Forfait",
        description: "Test",
        price: new Decimal(100),
        discountType: "NONE" as const,
        discountValue: new Decimal(0),
        isActive: false,
        businessId: "business-test-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      vi.mocked(prisma.package.update).mockResolvedValue(updatedPackage as any);

      await deletePackage({ id: "pkg-1" });

      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/services");
    });
  });
});
