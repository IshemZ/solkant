/**
 * Test helpers pour mocker NextAuth sessions
 * Permet de tester facilement les Server Actions avec différents états d'auth
 */

import { vi } from "vitest";
import type { Session } from "next-auth";
import type { Mock } from "vitest";
import { UserRole } from "@prisma/client";

export interface MockSessionOptions {
  userId?: string;
  businessId?: string;
  email?: string;
  name?: string;
  role?: UserRole;
}

interface SessionWithNullBusiness extends Omit<Session, "user"> {
  user: {
    id: string;
    businessId: null;
    email: string;
    name: string;
    role: UserRole;
  };
}

/**
 * Crée une session mock valide pour les tests
 */
export function createMockSession(options: MockSessionOptions = {}): Session {
  const {
    userId = "test_user_123",
    businessId = "test_business_123",
    email = "test@example.com",
    name = "Test User",
    role = UserRole.USER,
  } = options;

  return {
    user: {
      id: userId,
      businessId,
      email,
      name,
      role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
  };
}

/**
 * Crée une session sans businessId (cas d'erreur)
 */
export function createSessionWithoutBusiness(): SessionWithNullBusiness {
  return {
    user: {
      id: "user_without_business",
      businessId: null,
      email: "nobusiness@example.com",
      name: "User Without Business",
      role: UserRole.USER,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Mock getServerSession pour retourner une session authentifiée
 */
export function mockAuthenticatedSession(
  getServerSession: Mock,
  options?: MockSessionOptions
) {
  vi.mocked(getServerSession).mockResolvedValue(createMockSession(options));
}

/**
 * Mock getServerSession pour retourner null (non authentifié)
 */
export function mockUnauthenticatedSession(getServerSession: Mock) {
  vi.mocked(getServerSession).mockResolvedValue(null);
}

/**
 * Mock getServerSession pour retourner une session sans businessId
 */
export function mockSessionWithoutBusiness(getServerSession: Mock) {
  vi.mocked(getServerSession).mockResolvedValue(createSessionWithoutBusiness());
}

/**
 * Crée plusieurs sessions pour différents tenants (tests multi-tenant)
 */
export function createMultiTenantSessions() {
  return {
    tenant1: createMockSession({
      userId: "user_tenant1",
      businessId: "business_tenant1",
      email: "tenant1@example.com",
      name: "Tenant 1 User",
    }),
    tenant2: createMockSession({
      userId: "user_tenant2",
      businessId: "business_tenant2",
      email: "tenant2@example.com",
      name: "Tenant 2 User",
    }),
  };
}

/**
 * Helper pour tester l'isolation entre tenants
 * Vérifie qu'un businessId spécifique a été utilisé dans les calls Prisma
 */
export function assertBusinessIdIsolation(
  prismaCall: Mock,
  expectedBusinessId: string
) {
  const calls = prismaCall.mock.calls;

  if (calls.length === 0) {
    throw new Error("Aucun appel Prisma n'a été effectué");
  }

  for (const call of calls) {
    const args = call[0] as Record<string, unknown>;

    // Vérifie que where.businessId est présent et correct
    if (!args?.where || typeof args.where !== "object") {
      throw new Error(
        `SECURITY FLAW: Appel Prisma sans clause where. Args: ${JSON.stringify(
          args
        )}`
      );
    }

    const where = args.where as Record<string, unknown>;

    if (!where.businessId) {
      throw new Error(
        `SECURITY FLAW: Appel Prisma sans filtrage businessId. Args: ${JSON.stringify(
          args
        )}`
      );
    }

    if (where.businessId !== expectedBusinessId) {
      throw new Error(
        `SECURITY FLAW: Mauvais businessId utilisé. Attendu: ${expectedBusinessId}, Reçu: ${where.businessId}`
      );
    }
  }

  return true;
}
