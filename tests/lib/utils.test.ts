import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSessionWithBusiness, getBusinessId } from "@/lib/utils";
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
