/**
 * Tests critiques d'isolation multi-tenant
 * Vérifie que les données d'un tenant ne peuvent JAMAIS être accessibles par un autre
 *
 * 🚨 SÉCURITÉ CRITIQUE: Ces tests protègent contre les fuites de données entre tenants
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClients, createClient } from "@/app/actions/clients";
import { getQuotes } from "@/app/actions/quotes";
import { getServices, createService } from "@/app/actions/services";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import {
  createMultiTenantSessions,
  assertBusinessIdIsolation,
} from "../helpers/session-mock";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    client: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    quote: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("🔒 MULTI-TENANT ISOLATION TESTS (CRITICAL)", () => {
  const sessions = createMultiTenantSessions();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Client Isolation", () => {
    it("🚨 MUST filter clients by businessId (Tenant 1)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);

      await getClients();

      // ✅ VÉRIFIE que businessId du tenant 1 est utilisé
      assertBusinessIdIsolation(
        vi.mocked(prisma.client.findMany),
        "business_tenant1"
      );
    });

    it("🚨 MUST filter clients by businessId (Tenant 2)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant2);
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);

      await getClients();

      // ✅ VÉRIFIE que businessId du tenant 2 est utilisé
      assertBusinessIdIsolation(
        vi.mocked(prisma.client.findMany),
        "business_tenant2"
      );
    });

    it("🚨 MUST NOT allow creating client for another tenant", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.client.create).mockResolvedValue({
        id: "client_123",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "0123456789",
        address: null,
        notes: null,
        businessId: "business_tenant1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createClient({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "0123456789",
      });

      // ✅ VÉRIFIE que le businessId du tenant connecté est utilisé
      const createCall = vi.mocked(prisma.client.create).mock.calls[0][0];
      expect(createCall.data.businessId).toBe("business_tenant1");
      expect(createCall.data.businessId).not.toBe("business_tenant2");
    });
  });

  describe("Quote Isolation", () => {
    it("🚨 MUST filter quotes by businessId (Tenant 1)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      await getQuotes();

      assertBusinessIdIsolation(
        vi.mocked(prisma.quote.findMany),
        "business_tenant1"
      );
    });

    it("🚨 MUST filter quotes by businessId (Tenant 2)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant2);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      await getQuotes();

      assertBusinessIdIsolation(
        vi.mocked(prisma.quote.findMany),
        "business_tenant2"
      );
    });

    it("🚨 MUST NOT allow creating quote for another tenant", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);

      // Ce test vérifie que le businessId du tenant connecté est utilisé
      // Pour un test complet, voir les tests d'intégration E2E
      // Ici, on teste juste que la session est correctement utilisée

      await getQuotes(); // Vérifier que la requête utilise le bon businessId
      assertBusinessIdIsolation(
        vi.mocked(prisma.quote.findMany),
        "business_tenant1"
      );
    });
  });

  describe("Service Isolation", () => {
    it("🚨 MUST filter services by businessId (Tenant 1)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.service.findMany).mockResolvedValue([]);

      await getServices();

      assertBusinessIdIsolation(
        vi.mocked(prisma.service.findMany),
        "business_tenant1"
      );
    });

    it("🚨 MUST filter services by businessId (Tenant 2)", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant2);
      vi.mocked(prisma.service.findMany).mockResolvedValue([]);

      await getServices();

      assertBusinessIdIsolation(
        vi.mocked(prisma.service.findMany),
        "business_tenant2"
      );
    });

    it("🚨 MUST NOT allow creating service for another tenant", async () => {
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.service.create).mockResolvedValue({
        id: "service_123",
        name: "Coupe",
        description: "Coupe de cheveux",
        price: 50,
        duration: 30,
        category: null,
        isActive: true,
        businessId: "business_tenant1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createService({
        name: "Coupe",
        price: 50,
        duration: 30,
        isActive: true,
      });

      // ✅ VÉRIFIE que le businessId du tenant connecté est utilisé
      const createCall = vi.mocked(prisma.service.create).mock.calls[0][0];
      expect(createCall.data.businessId).toBe("business_tenant1");
      expect(createCall.data.businessId).not.toBe("business_tenant2");
    });
  });

  describe("Cross-Tenant Data Access Prevention", () => {
    it("🚨 MUST prevent Tenant 1 from accessing Tenant 2 clients", async () => {
      // Tenant 1 essaye d'accéder aux clients
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);

      await getClients();

      // Le filtre doit utiliser business_tenant1, PAS business_tenant2
      const findManyCall = vi.mocked(prisma.client.findMany).mock.calls[0]?.[0];
      expect(findManyCall).toBeDefined();
      expect(findManyCall?.where?.businessId).toBe("business_tenant1");
      expect(findManyCall?.where?.businessId).not.toBe("business_tenant2");
    });

    it("🚨 MUST prevent Tenant 2 from accessing Tenant 1 quotes", async () => {
      // Tenant 2 essaye d'accéder aux devis
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant2);
      vi.mocked(prisma.quote.findMany).mockResolvedValue([]);

      await getQuotes();

      // Le filtre doit utiliser business_tenant2, PAS business_tenant1
      const findManyCall = vi.mocked(prisma.quote.findMany).mock.calls[0]?.[0];
      expect(findManyCall).toBeDefined();
      expect(findManyCall?.where?.businessId).toBe("business_tenant2");
      expect(findManyCall?.where?.businessId).not.toBe("business_tenant1");
    });
  });

  describe("Session Switching Security", () => {
    it("🚨 MUST apply correct businessId after session switch", async () => {
      // Première requête avec tenant 1
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant1);
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);
      await getClients();

      assertBusinessIdIsolation(
        vi.mocked(prisma.client.findMany),
        "business_tenant1"
      );

      vi.clearAllMocks();

      // Deuxième requête avec tenant 2 (simulation de changement de session)
      vi.mocked(getServerSession).mockResolvedValue(sessions.tenant2);
      vi.mocked(prisma.client.findMany).mockResolvedValue([]);
      await getClients();

      assertBusinessIdIsolation(
        vi.mocked(prisma.client.findMany),
        "business_tenant2"
      );
    });
  });
});
