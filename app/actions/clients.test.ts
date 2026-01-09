/**
 * Tests pour les Server Actions Client
 *
 * Teste les opérations CRUD sur les clients avec :
 * - Isolation multi-tenant (businessId)
 * - Validation Zod
 * - Sanitisation XSS
 * - Gestion erreurs
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getServerSession } from "next-auth";

// IMPORTANT: Mocks doivent être déclarés AVANT les imports qui en dépendent
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    client: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
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
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from "./clients";
import { revalidatePath } from "next/cache";

// Import des mocks
import prisma from "@/lib/prisma";
import { createMockClient } from "@/lib/__tests__/helpers/test-data";

describe("Client Actions", () => {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
  });

  describe("getClients", () => {
    it("should return clients filtered by businessId", async () => {
      // ARRANGE
      const mockClients = [
        createMockClient({ businessId: "business-test-123" }),
        createMockClient({ businessId: "business-test-123" }),
      ];

      vi.mocked(prisma.client.findMany).mockResolvedValue(mockClients);

      // ACT
      const result = await getClients();

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: {
          businessId: "business-test-123",
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when no clients found", async () => {
      // ARRANGE
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);

      // ACT
      const result = await getClients();

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it("should handle database errors", async () => {
      // ARRANGE
      vi.mocked(prisma.client.findMany).mockRejectedValue(
        new Error("Database error")
      );

      // ACT
      const result = await getClients();

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("createClient", () => {
    it("should create client with valid input", async () => {
      // ARRANGE
      const validInput = {
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@test.com",
        phone: "0612345678",
        rue: "1 rue Test",
        codePostal: "75001",
        ville: "Paris",
      };

      const createdClient = createMockClient({
        ...validInput,
        businessId: "business-test-123",
      });

      vi.mocked(prisma.client.count).mockResolvedValue(0);
      vi.mocked(prisma.client.create).mockResolvedValue(createdClient);

      // ACT
      const result = await createClient(validInput);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.firstName).toBe("Marie");
        expect(result.data?.lastName).toBe("Dupont");
        expect(result.data?.isFirstClient).toBe(true);
      }

      expect(prisma.client.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/clients");
    });

    it("should reject invalid email", async () => {
      // ARRANGE
      const invalidInput = {
        firstName: "User",
        lastName: "Test",
        email: "invalid-email", // Email invalide
        phone: "0612345678",
        rue: "1 rue Test",
        codePostal: "75001",
        ville: "Paris",
      };

      // ACT
      const result = await createClient(invalidInput as never);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors?.email).toBeDefined();
      }
      expect(prisma.client.create).not.toHaveBeenCalled();
    });

    it("should automatically add businessId from session", async () => {
      // ARRANGE
      const input = {
        firstName: "User",
        lastName: "Test",
        email: "test@test.com",
        phone: "0612345678",
        rue: "1 rue Test",
        codePostal: "75001",
        ville: "Paris",
      };

      const created = createMockClient(input);
      vi.mocked(prisma.client.count).mockResolvedValue(0);
      vi.mocked(prisma.client.create).mockResolvedValue(created);

      // ACT
      await createClient(input);

      // ASSERT - businessId doit être ajouté automatiquement
      expect(prisma.client.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: "business-test-123",
          }),
        })
      );
    });

    it("should create client with only required fields (nom, prénom, téléphone)", async () => {
      // ARRANGE
      const minimalInput = {
        firstName: "Sophie",
        lastName: "Martin",
        phone: "0687654321",
      };

      const createdClient = createMockClient({
        ...minimalInput,
        businessId: "business-test-123",
        email: null,
        rue: null,
        codePostal: null,
        ville: null,
        complement: null,
        notes: null,
      });

      vi.mocked(prisma.client.count).mockResolvedValue(0);
      vi.mocked(prisma.client.create).mockResolvedValue(createdClient);

      // ACT
      const result = await createClient(minimalInput);

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.firstName).toBe("Sophie");
        expect(result.data?.lastName).toBe("Martin");
        expect(result.data?.phone).toBe("0687654321");
        expect(result.data?.isFirstClient).toBe(true);
      }

      expect(prisma.client.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/clients");
    });
  });

  describe("updateClient", () => {
    it("should update client with valid data", async () => {
      // ARRANGE
      const clientId = "client-123";
      const updateData = {
        id: clientId,
        lastName: "Nom Modifié",
        phone: "0699999999",
      };

      const updated = createMockClient({
        id: clientId,
        lastName: "Nom Modifié",
        phone: "0699999999",
        businessId: "business-test-123",
      });

      vi.mocked(prisma.client.update).mockResolvedValue(updated);

      // ACT
      const result = await updateClient(updateData);

      // ASSERT
      expect(result.success).toBe(true);
      expect(prisma.client.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: clientId,
            businessId: "business-test-123",
          }),
        })
      );
    });

    it("should NOT update client from another business", async () => {
      // ARRANGE
      const otherClientId = "client-other-business";
      vi.mocked(prisma.client.update).mockRejectedValue(
        new Error("Record not found")
      );

      // ACT
      const result = await updateClient({
        id: otherClientId,
        lastName: "Hack",
      });

      // ASSERT
      expect(result.success).toBe(false);
    });
  });

  describe("deleteClient", () => {
    it("should delete client with correct businessId", async () => {
      // ARRANGE
      const clientId = "client-123";
      const client = createMockClient({
        id: clientId,
        businessId: "business-test-123",
      });

      // Mock findFirst pour vérifier que le client existe
      vi.mocked(prisma.client.findFirst).mockResolvedValue(client);
      vi.mocked(prisma.client.delete).mockResolvedValue(client);

      // ACT
      const result = await deleteClient({ id: clientId });

      // ASSERT
      expect(result.success).toBe(true);
      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: {
          id: clientId,
          businessId: "business-test-123",
        },
        select: expect.any(Object),
      });
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: {
          id: clientId,
          businessId: "business-test-123",
        },
      });

      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/clients");
    });

    it("should NOT delete client from another business", async () => {
      // ARRANGE
      const otherClientId = "client-other-456";
      vi.mocked(prisma.client.delete).mockRejectedValue(
        new Error("Record not found")
      );

      // ACT
      const result = await deleteClient({ id: otherClientId });

      // ASSERT
      expect(result.success).toBe(false);
    });
  });

  describe("Multi-Tenant Isolation (CRITICAL)", () => {
    it("should NEVER return clients from another business", async () => {
      // ARRANGE
      const business1Clients = [
        createMockClient({ businessId: "business-test-123" }),
        createMockClient({ businessId: "business-test-123" }),
      ];

      vi.mocked(prisma.client.findMany).mockResolvedValue(business1Clients);

      // ACT
      const result = await getClients();

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(
          result.data.every((c) => c.businessId === "business-test-123")
        ).toBe(true);
      }

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            businessId: "business-test-123",
          }),
        })
      );
    });
  });
});
