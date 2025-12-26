import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth } from "@/lib/action-wrapper";
import * as authHelpers from "@/lib/auth-helpers";
import * as Sentry from "@sentry/nextjs";

vi.mock("@/lib/auth-helpers");
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setContext: vi.fn(),
}));

describe("withAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when session validation fails", async () => {
    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue({
      error: "Non autorisé",
    });

    const handler = vi.fn();
    const wrapped = withAuth(handler, "testAction");

    const result = await wrapped({ test: "input" });

    expect(result).toEqual({
      success: false,
      error: "Non autorisé",
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it("should call handler with input and session when authenticated", async () => {
    const mockSession = {
      businessId: "biz_123",
      userId: "user_123",
      userEmail: "test@example.com",
    };

    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );

    const handler = vi.fn().mockResolvedValue({
      success: true,
      data: { result: "success" },
    });

    const wrapped = withAuth(handler, "testAction");
    const input = { test: "input" };

    const result = await wrapped(input);

    expect(handler).toHaveBeenCalledWith(input, mockSession);
    expect(result).toEqual({
      success: true,
      data: { result: "success" },
    });
  });

  it("should catch errors and log to Sentry", async () => {
    const mockSession = {
      businessId: "biz_123",
      userId: "user_123",
      userEmail: "test@example.com",
    };

    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );

    const testError = new Error("Test error");
    const handler = vi.fn().mockRejectedValue(testError);

    const wrapped = withAuth(handler, "testAction");

    const result = await wrapped({ test: "input" });

    expect(Sentry.captureException).toHaveBeenCalledWith(testError, {
      tags: { action: "testAction", businessId: "biz_123" },
      extra: { input: { test: "input" } },
    });

    expect(result).toEqual({
      success: false,
      error: "Erreur lors de testAction",
    });
  });
});
