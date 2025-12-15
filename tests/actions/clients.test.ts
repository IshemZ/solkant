import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClients, createClient, deleteClient } from "@/app/actions/clients";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    client: {
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

describe("Client Server Actions", () => {
  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
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

  describe("getClients", () => {
    it("should return clients for authenticated user", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.client.findMany).mockResolvedValue([
        {
          id: "client_1",
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
      ]);

      const result = await getClients();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].firstName).toBe("Jean");
      }

      // ✅ CRITIQUE: Vérifier que le filtrage businessId est appliqué
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { businessId: "business_123" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getClients();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.client.findMany).not.toHaveBeenCalled();
    });

    it("should return error if businessId missing", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user_123",
          businessId: null,
          email: "test@example.com",
        },
      } as any);

      // Mock fallback: user sans business
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        business: null,
      } as any);

      const result = await getClients();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Compte non configuré. Veuillez contacter le support.");
        if ("code" in result && result.code) {
          expect(result.code).toBe("NO_BUSINESS");
        }
      }
      expect(prisma.client.findMany).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.client.findMany).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await getClients();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Erreur lors de la récupération des clients");
      }
    });
  });

  describe("createClient", () => {
    it("should create client with valid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const newClientData = {
        firstName: "Marie",
        lastName: "Martin",
        email: "marie@example.com",
        phone: "0987654321",
      };

      const createdClient = {
        id: "client_new",
        ...newClientData,
        address: null,
        notes: null,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.client.create).mockResolvedValue(createdClient);

      const result = await createClient(newClientData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.firstName).toBe("Marie");
      }

      // ✅ CRITIQUE: Vérifier injection businessId
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...newClientData,
          businessId: "business_123",
        },
      });
    });

    it("should return validation error for invalid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await createClient({
        firstName: "", // Invalide
        lastName: "Test",
      } as any);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("invalide");
        if ("fieldErrors" in result && result.fieldErrors) {
          expect(result.fieldErrors).toBeDefined();
        }
      }
      expect(prisma.client.create).not.toHaveBeenCalled();
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await createClient({
        firstName: "Test",
        lastName: "User",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(prisma.client.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteClient - Multi-tenancy Security", () => {
    it("should only delete client from own business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock findFirst pour vérifier l'existence
      vi.mocked(prisma.client.findFirst).mockResolvedValue({
        id: "client_123",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: null,
        address: null,
        notes: null,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.client.delete).mockResolvedValue({
        id: "client_123",
        firstName: "Jean",
        lastName: "Dupont",
        email: null,
        phone: null,
        address: null,
        notes: null,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await deleteClient("client_123");

      // ✅ CRITIQUE: Vérifier filtrage businessId dans findFirst
      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: {
          id: "client_123",
          businessId: "business_123",
        },
        select: { firstName: true, lastName: true, email: true },
      });

      // ✅ CRITIQUE: Vérifier filtrage businessId dans delete
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: {
          id: "client_123",
          businessId: "business_123", // Protection multi-tenant
        },
      });
    });

    it("should return error if client not found or belongs to another business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      // Mock findFirst retourne null (client inexistant ou autre business)
      vi.mocked(prisma.client.findFirst).mockResolvedValue(null);

      const result = await deleteClient("client_other");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Client introuvable");
      }
      expect(prisma.client.delete).not.toHaveBeenCalled();
    });
  });
});
