import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/app/actions/services";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    service: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Service Server Actions", () => {
  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
      email: "test@example.com",
      name: "Test User",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getServices", () => {
    it("should return services for authenticated user", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.service.findMany).mockResolvedValue([
        {
          id: "service_1",
          name: "Coupe classique",
          description: "Coupe cheveux homme",
          price: 30,
          duration: 45,
          category: "Coiffure",
          isActive: true,
          businessId: "business_123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await getServices();

      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].name).toBe("Coupe classique");

      // ✅ CRITIQUE: Vérifier filtrage businessId
      expect(prisma.service.findMany).toHaveBeenCalledWith({
        where: { businessId: "business_123" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getServices();

      expect(result.error).toBe("Non autorisé");
      expect(result.data).toBeUndefined();
      expect(prisma.service.findMany).not.toHaveBeenCalled();
    });

    it("should return error if businessId missing", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user_123",
          businessId: null as unknown as string,
          email: "test@example.com",
        },
      });

      const result = await getServices();

      expect(result.error).toBe("Non autorisé");
      expect(prisma.service.findMany).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.service.findMany).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await getServices();

      expect(result.error).toBe("Erreur lors de la récupération des services");
      expect(result.data).toBeUndefined();
    });
  });

  describe("createService", () => {
    it("should create service with valid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const newServiceData = {
        name: "Balayage",
        description: "Coloration balayage",
        price: 120,
        duration: 180,
        category: "Coloration",
        isActive: true,
      };

      const createdService = {
        id: "service_new",
        ...newServiceData,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.service.create).mockResolvedValue(createdService);

      const result = await createService(newServiceData);

      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe("Balayage");
      expect(result.data?.price).toBe(120);

      // ✅ CRITIQUE: Vérifier injection businessId
      expect(prisma.service.create).toHaveBeenCalledWith({
        data: {
          ...newServiceData,
          businessId: "business_123",
        },
      });
    });

    it("should create service with minimal required fields", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const minimalData = {
        name: "Service Simple",
        price: 50,
      };

      const createdService = {
        id: "service_min",
        ...minimalData,
        description: null,
        duration: null,
        category: null,
        isActive: true,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.service.create).mockResolvedValue(createdService);

      const result = await createService(minimalData);

      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe("Service Simple");
    });

    it("should return validation error for invalid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await createService({
        name: "", // Invalide
        price: -10, // Prix négatif invalide
      });

      expect(result.error).toBe("Données invalides");
      expect(result.fieldErrors).toBeDefined();
      expect(prisma.service.create).not.toHaveBeenCalled();
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await createService({
        name: "Test Service",
        price: 50,
      });

      expect(result.error).toBe("Non autorisé");
      expect(prisma.service.create).not.toHaveBeenCalled();
    });
  });

  describe("updateService", () => {
    it("should update service with valid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const updateData = {
        name: "Coupe Premium",
        price: 45,
      };

      const updatedService = {
        id: "service_1",
        ...updateData,
        description: "Coupe cheveux homme",
        duration: 45,
        category: "Coiffure",
        isActive: true,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.service.update).mockResolvedValue(updatedService);

      const result = await updateService("service_1", updateData);

      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe("Coupe Premium");
      expect(result.data?.price).toBe(45);

      // ✅ CRITIQUE: Vérifier filtrage businessId dans update
      expect(prisma.service.update).toHaveBeenCalledWith({
        where: {
          id: "service_1",
          businessId: "business_123",
        },
        data: updateData,
      });
    });

    it("should update only specified fields", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const partialUpdate = {
        price: 60,
      };

      const updatedService = {
        id: "service_1",
        name: "Coupe classique",
        description: "Coupe cheveux homme",
        price: 60, // Updated
        duration: 45,
        category: "Coiffure",
        isActive: true,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.service.update).mockResolvedValue(updatedService);

      const result = await updateService("service_1", partialUpdate);

      expect(result.data?.price).toBe(60);
      expect(prisma.service.update).toHaveBeenCalledWith({
        where: {
          id: "service_1",
          businessId: "business_123",
        },
        data: { price: 60 },
      });
    });

    it("should return validation error for invalid update", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await updateService("service_1", {
        price: -50, // Prix négatif
      });

      expect(result.error).toBe("Données invalides");
      expect(prisma.service.update).not.toHaveBeenCalled();
    });

    it("should return error if service not found or belongs to another business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.service.update).mockRejectedValue(
        new Error("Record not found")
      );

      const result = await updateService("service_other", { name: "Test" });

      expect(result.error).toBe("Erreur lors de la mise à jour du service");
    });
  });

  describe("deleteService - Multi-tenancy Security", () => {
    it("should only delete service from own business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      // Mock findFirst pour vérifier l'existence
      vi.mocked(prisma.service.findFirst).mockResolvedValue({
        id: "service_123",
        name: "Coupe classique",
        description: null,
        price: 30,
        duration: 45,
        category: null,
        isActive: true,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.service.delete).mockResolvedValue({
        id: "service_123",
        name: "Coupe classique",
        description: null,
        price: 30,
        duration: 45,
        category: null,
        isActive: true,
        businessId: "business_123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await deleteService("service_123");

      // ✅ CRITIQUE: Vérifier filtrage businessId dans findFirst
      expect(prisma.service.findFirst).toHaveBeenCalledWith({
        where: {
          id: "service_123",
          businessId: "business_123",
        },
        select: { name: true, price: true },
      });

      // ✅ CRITIQUE: Vérifier filtrage businessId dans delete
      expect(prisma.service.delete).toHaveBeenCalledWith({
        where: {
          id: "service_123",
          businessId: "business_123", // Protection multi-tenant
        },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await deleteService("service_123");

      expect(result.error).toBe("Non autorisé");
      expect(prisma.service.delete).not.toHaveBeenCalled();
    });

    it("should return error if service not found or belongs to another business", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      // Mock findFirst retourne null (service inexistant ou autre business)
      vi.mocked(prisma.service.findFirst).mockResolvedValue(null);

      const result = await deleteService("service_other");

      expect(result.error).toBe("Service introuvable");
      expect(prisma.service.delete).not.toHaveBeenCalled();
    });
  });
});
