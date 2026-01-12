/**
 * Tests pour les helpers d'authentification
 *
 * Ces tests vérifient que la validation de session et d'email fonctionne correctement
 * dans tous les cas de figure.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import * as NextAuth from "next-auth";
import prisma from "@/lib/prisma";

// Mock NextAuth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setContext: vi.fn(),
}));

describe("validateSessionWithEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devrait retourner une erreur si aucune session", async () => {
    vi.mocked(NextAuth.getServerSession).mockResolvedValue(null);

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      error: "Non autorisé",
      code: "UNAUTHORIZED",
    });
  });

  it("devrait retourner une erreur si pas d'userId dans la session", async () => {
    vi.mocked(NextAuth.getServerSession).mockResolvedValue({
      user: {
        email: "test@example.com",
      },
      expires: new Date().toISOString(),
    } as never);

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      error: "Non autorisé",
      code: "UNAUTHORIZED",
    });
  });

  it("devrait retourner ValidatedSession si tout est OK", async () => {
    const mockSession = {
      user: {
        id: "user123",
        email: "test@example.com",
        businessId: "biz123",
      },
      expires: new Date().toISOString(),
    };

    vi.mocked(NextAuth.getServerSession).mockResolvedValue(mockSession as never);

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      userId: "user123",
      userEmail: "test@example.com",
      businessId: "biz123",
    });
  });

  it("devrait gérer le cas où businessId est absent de la session (fallback BDD)", async () => {
    const mockSession = {
      user: {
        id: "user123",
        email: "test@example.com",
        // businessId manquant !
      },
      expires: new Date().toISOString(),
    };

    vi.mocked(NextAuth.getServerSession).mockResolvedValue(mockSession as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user123",
      email: "test@example.com",
      emailVerified: new Date(),
      name: "Test User",
      password: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      business: {
        id: "biz456",
        name: "Test Business",
        userId: "user123",
        email: "test@example.com",
        phone: null,
        address: null,
        city: null,
        postalCode: null,
        country: null,
        siret: null,
        tva: null,
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as never);

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      userId: "user123",
      userEmail: "test@example.com",
      businessId: "biz456",
    });
  });

  it("devrait retourner une erreur si pas de businessId et pas de Business en BDD", async () => {
    const mockSession = {
      user: {
        id: "user123",
        email: "test@example.com",
        // businessId manquant !
      },
      expires: new Date().toISOString(),
    };

    vi.mocked(NextAuth.getServerSession).mockResolvedValue(mockSession as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user123",
      email: "test@example.com",
      emailVerified: new Date(),
      name: "Test User",
      password: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      business: null, // ❌ Pas de Business
    } as never);

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      error: "Compte non configuré. Veuillez contacter le support.",
      code: "NO_BUSINESS",
    });
  });

  it("devrait gérer les erreurs Prisma gracieusement", async () => {
    const mockSession = {
      user: {
        id: "user123",
        email: "test@example.com",
        // businessId manquant pour forcer le fallback BDD
      },
      expires: new Date().toISOString(),
    };

    vi.mocked(NextAuth.getServerSession).mockResolvedValue(mockSession as never);
    vi.mocked(prisma.user.findUnique).mockRejectedValue(
      new Error("Database connection failed")
    );

    const result = await validateSessionWithEmail();

    expect(result).toEqual({
      error: "Erreur lors de la validation de la session",
      code: "UNAUTHORIZED",
    });
  });
});
