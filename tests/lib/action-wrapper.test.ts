import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import * as authHelpers from "@/lib/auth-helpers";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";

vi.mock("@/lib/auth-helpers");
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setContext: vi.fn(),
}));
vi.mock("@/lib/validations/helpers", () => ({
  formatZodFieldErrors: vi.fn((error: z.ZodError) => {
    const fieldErrors: Record<string, string[]> = {};
    error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    });
    return fieldErrors;
  }),
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

describe("withAuthAndValidation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return validation error when input is invalid", async () => {
    const mockSession = {
      businessId: "biz_123",
      userId: "user_123",
      userEmail: "test@example.com",
    };

    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );

    const schema = z.object({
      name: z.string().min(1, "Name is required"),
    });

    const handler = vi.fn();
    const wrapped = withAuthAndValidation(handler, "testAction", schema);

    const result = await wrapped({ name: "" });

    expect(result).toEqual({
      success: false,
      error: "Données invalides",
      code: "VALIDATION_ERROR",
      fieldErrors: expect.any(Object),
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it("should call handler with validated input and session when valid", async () => {
    const mockSession = {
      businessId: "biz_123",
      userId: "user_123",
      userEmail: "test@example.com",
    };

    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue(
      mockSession
    );

    const schema = z.object({
      name: z.string().min(1),
    });

    const handler = vi.fn().mockResolvedValue({
      success: true,
      data: { result: "success" },
    });

    const wrapped = withAuthAndValidation(handler, "testAction", schema);
    const input = { name: "Test" };

    const result = await wrapped(input);

    expect(handler).toHaveBeenCalledWith(input, mockSession);
    expect(result).toEqual({
      success: true,
      data: { result: "success" },
    });
  });

  it("should return error when session validation fails", async () => {
    vi.mocked(authHelpers.validateSessionWithEmail).mockResolvedValue({
      error: "Non autorisé",
    });

    const schema = z.object({ name: z.string() });
    const handler = vi.fn();
    const wrapped = withAuthAndValidation(handler, "testAction", schema);

    const result = await wrapped({ name: "Test" });

    expect(result).toEqual({
      success: false,
      error: "Non autorisé",
    });
    expect(handler).not.toHaveBeenCalled();
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

    const schema = z.object({ name: z.string() });
    const testError = new Error("Test error");
    const handler = vi.fn().mockRejectedValue(testError);

    const wrapped = withAuthAndValidation(handler, "testAction", schema);

    const result = await wrapped({ name: "Test" });

    expect(Sentry.captureException).toHaveBeenCalledWith(testError, {
      tags: { action: "testAction", businessId: "biz_123" },
      extra: { input: { name: "Test" } },
    });

    expect(result).toEqual({
      success: false,
      error: "Erreur lors de testAction",
    });
  });
});
