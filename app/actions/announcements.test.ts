import { describe, it, expect, vi, beforeEach } from "vitest";
import { markAnnouncementsAsSeen } from "./announcements";
import prisma from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-helpers");

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setContext: vi.fn(),
}));

describe("markAnnouncementsAsSeen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update lastSeenAnnouncementsAt to current time", async () => {
    const mockSession = {
      userId: "user-123",
      userEmail: "test@example.com",
      businessId: "business-123",
    };

    const now = new Date();
    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );
    vi.mocked(prisma.user.update).mockResolvedValue({
      lastSeenAnnouncementsAt: now,
    } as any);

    const result = await markAnnouncementsAsSeen({});

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
    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue({
      error: "Non autorisé",
    });

    const result = await markAnnouncementsAsSeen({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Non autorisé");
    }
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should require verified email", async () => {
    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue({
      error: "Email non vérifié",
    });

    const result = await markAnnouncementsAsSeen({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Email non vérifié");
    }
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    const mockSession = {
      userId: "user-123",
      userEmail: "test@example.com",
      businessId: "business-123",
    };

    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );
    vi.mocked(prisma.user.update).mockRejectedValue(
      new Error("Database connection failed")
    );

    const result = await markAnnouncementsAsSeen({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Erreur lors de markAnnouncementsAsSeen");
    }
  });
});
