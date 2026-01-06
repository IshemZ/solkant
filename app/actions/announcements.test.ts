import { describe, it, expect, vi, beforeEach } from "vitest";
import { markAnnouncementsAsSeen } from "./announcements";
import prisma from "@/lib/prisma";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/action-wrapper", () => ({
  withAuth: (handler: any, actionName: string) => {
    return async (input: any, mockSession?: any) => {
      if (!mockSession) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }
      if (!mockSession.user?.emailVerified) {
        return {
          success: false,
          error: "Email not verified",
        };
      }
      try {
        return await handler(input, mockSession);
      } catch (error) {
        return {
          success: false,
          error: `Erreur lors de ${actionName}`,
        };
      }
    };
  },
}));

describe("markAnnouncementsAsSeen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update lastSeenAnnouncementsAt to current time", async () => {
    const mockSession = {
      user: {
        id: "user-123",
        emailVerified: new Date(),
      },
      businessId: "business-123",
    };

    const now = new Date();
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: "user-123",
      lastSeenAnnouncementsAt: now,
    } as any);

    const result = await markAnnouncementsAsSeen({}, mockSession);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lastSeenAnnouncementsAt).toBeInstanceOf(Date);
    }

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { lastSeenAnnouncementsAt: expect.any(Date) },
      select: { lastSeenAnnouncementsAt: true },
    });
  });

  it("should require authentication", async () => {
    const result = await markAnnouncementsAsSeen({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Unauthorized");
    }
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should require verified email", async () => {
    const mockSession = {
      user: {
        id: "user-123",
        emailVerified: null,
      },
      businessId: "business-123",
    };

    const result = await markAnnouncementsAsSeen({}, mockSession);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Email not verified");
    }
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    const mockSession = {
      user: {
        id: "user-123",
        emailVerified: new Date(),
      },
      businessId: "business-123",
    };

    vi.mocked(prisma.user.update).mockRejectedValue(
      new Error("Database connection failed")
    );

    const result = await markAnnouncementsAsSeen({}, mockSession);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });
});
