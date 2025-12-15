import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSessionWithBusiness, getBusinessId, formatAddress } from "@/lib/utils";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

describe("Security Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSessionWithBusiness", () => {
    it("should return session with businessId when authenticated", async () => {
      const mockSession = {
        user: {
          id: "clxxx111111111111111",
          businessId: "clxxx222222222222222",
          email: "test@example.com",
          name: "Test User",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await getSessionWithBusiness();

      expect(result).toEqual(mockSession);
      expect(result?.user.businessId).toBe("clxxx222222222222222");
    });

    it("should return null when not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getSessionWithBusiness();

      expect(result).toBeNull();
    });

    it("should throw error when user has no businessId", async () => {
      const mockSessionWithoutBusiness = {
        user: {
          id: "clxxx111111111111111",
          businessId: null as unknown as string,
          email: "test@example.com",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSessionWithoutBusiness);

      await expect(getSessionWithBusiness()).rejects.toThrow(
        "User is authenticated but has no associated Business"
      );
    });

    it("should throw error when user exists but businessId is undefined", async () => {
      const mockSessionWithUndefined = {
        user: {
          id: "clxxx111111111111111",
          email: "test@example.com",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(
        mockSessionWithUndefined as any
      );

      await expect(getSessionWithBusiness()).rejects.toThrow(
        "User is authenticated but has no associated Business"
      );
    });
  });

  describe("getBusinessId", () => {
    it("should return businessId for authenticated user", async () => {
      const mockSession = {
        user: {
          id: "clxxx111111111111111",
          businessId: "clxxx222222222222222",
          email: "test@example.com",
          name: "Test User",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await getBusinessId();

      expect(result).toBe("clxxx222222222222222");
    });

    it("should throw error when not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      await expect(getBusinessId()).rejects.toThrow(
        "User must be authenticated to access this resource"
      );
    });

    it("should throw error when user has no businessId", async () => {
      const mockSessionWithoutBusiness = {
        user: {
          id: "clxxx111111111111111",
          businessId: null as unknown as string,
          email: "test@example.com",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSessionWithoutBusiness);

      await expect(getBusinessId()).rejects.toThrow(
        "User is authenticated but has no associated Business"
      );
    });
  });

  describe("Multi-tenancy Security", () => {
    it("should ensure different users get different businessIds", async () => {
      const user1Session = {
        user: {
          id: "clxxx111111111111111",
          businessId: "clxxx222222222222222",
          email: "user1@example.com",
        },
      };

      const user2Session = {
        user: {
          id: "clxxx333333333333333",
          businessId: "clxxx444444444444444",
          email: "user2@example.com",
        },
      };

      // User 1 request
      vi.mocked(getServerSession).mockResolvedValue(user1Session);
      const businessId1 = await getBusinessId();

      // User 2 request
      vi.mocked(getServerSession).mockResolvedValue(user2Session);
      const businessId2 = await getBusinessId();

      expect(businessId1).not.toBe(businessId2);
      expect(businessId1).toBe("clxxx222222222222222");
      expect(businessId2).toBe("clxxx444444444444444");
    });

    it("should consistently return same businessId for same user", async () => {
      const mockSession = {
        user: {
          id: "clxxx111111111111111",
          businessId: "clxxx222222222222222",
          email: "test@example.com",
        },
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const businessId1 = await getBusinessId();
      const businessId2 = await getBusinessId();
      const businessId3 = await getBusinessId();

      expect(businessId1).toBe(businessId2);
      expect(businessId2).toBe(businessId3);
      expect(businessId1).toBe("clxxx222222222222222");
    });
  });
});

describe("formatAddress", () => {
  it("should format complete structured address", () => {
    const entity = {
      rue: "123 Rue de Rivoli",
      complement: "Appartement 4B",
      codePostal: "75001",
      ville: "Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue de Rivoli\nAppartement 4B\n75001 Paris");
  });

  it("should format address without complement", () => {
    const entity = {
      rue: "123 Rue de Rivoli",
      codePostal: "75001",
      ville: "Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue de Rivoli\n75001 Paris");
  });

  it("should handle partial structured address (only rue)", () => {
    const entity = {
      rue: "123 Rue de Rivoli",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue de Rivoli");
  });

  it("should handle partial structured address (only postal code and ville)", () => {
    const entity = {
      codePostal: "75001",
      ville: "Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("75001 Paris");
  });

  it("should fallback to legacy address when no structured fields", () => {
    const entity = {
      address: "123 Rue de Rivoli, 75001 Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue de Rivoli, 75001 Paris");
  });

  it("should prefer structured fields over legacy address", () => {
    const entity = {
      rue: "456 Avenue Example",
      codePostal: "75002",
      ville: "Paris",
      address: "Old address", // Should be ignored
    };

    const result = formatAddress(entity);

    expect(result).toBe("456 Avenue Example\n75002 Paris");
  });

  it("should return empty string when no address data", () => {
    const entity = {};

    const result = formatAddress(entity);

    expect(result).toBe("");
  });

  it("should handle null values", () => {
    const entity = {
      rue: null,
      complement: null,
      codePostal: null,
      ville: null,
      address: null,
    };

    const result = formatAddress(entity);

    expect(result).toBe("");
  });

  it("should handle mixed null and undefined values", () => {
    const entity = {
      rue: "123 Rue Example",
      complement: null,
      codePostal: undefined,
      ville: "Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue Example");
  });

  it("should handle only ville without codePostal", () => {
    const entity = {
      rue: "123 Rue Example",
      ville: "Paris",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue Example");
  });

  it("should handle only codePostal without ville", () => {
    const entity = {
      rue: "123 Rue Example",
      codePostal: "75001",
    };

    const result = formatAddress(entity);

    expect(result).toBe("123 Rue Example");
  });
});
