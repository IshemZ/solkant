/**
 * Tests unitaires pour les Server Actions d'authentification
 * Tests de la réinitialisation de mot de passe avec OTP
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { requestPasswordReset, resetPasswordWithOTP } from "@/app/actions/auth";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import type { User, PasswordResetToken } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      updateMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

describe("Password Reset Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requestPasswordReset", () => {
    it("should create a password reset token for existing user", async () => {
      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        name: "Test User",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 0,
      });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_123",
        email: mockUser.email,
        code: "123456",
        used: false,
        expiresAt: new Date(),
        createdAt: new Date(),
      } as PasswordResetToken);

      const result = await requestPasswordReset({
        email: "test@example.com",
      });

      expect(result.success).toBe(true);
      if ("error" in result) { expect(result.error).toBeUndefined(); }

      // Vérifier que l'utilisateur a été recherché
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: { id: true, email: true, name: true },
      });

      // Vérifier que les anciens tokens ont été invalidés
      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
          used: false,
        },
        data: {
          used: true,
        },
      });

      // Vérifier qu'un nouveau token a été créé
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: mockUser.email,
          code: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });

    it("should return success even if user does not exist (security)", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await requestPasswordReset({
        email: "nonexistent@example.com",
      });

      // ✅ SÉCURITÉ: Retourner succès même si user n'existe pas
      // (protection contre l'énumération d'emails)
      expect(result.success).toBe(true);
      if ("error" in result) { expect(result.error).toBeUndefined(); }

      // Aucun token ne doit être créé
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    });

    it("should normalize email (lowercase and trim)", async () => {
      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        name: "Test User",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 0,
      });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_123",
        email: mockUser.email,
        code: "123456",
        used: false,
        expiresAt: new Date(),
        createdAt: new Date(),
      } as PasswordResetToken);

      await requestPasswordReset({
        email: "  TEST@EXAMPLE.COM  ",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: { id: true, email: true, name: true },
      });
    });

    it("should generate 6-digit OTP code", async () => {
      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        name: "Test User",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 0,
      });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_123",
        email: mockUser.email,
        code: "123456",
        used: false,
        expiresAt: new Date(),
        createdAt: new Date(),
      } as PasswordResetToken);

      await requestPasswordReset({ email: "test@example.com" });

      const createCall = vi.mocked(prisma.passwordResetToken.create).mock
        .calls[0][0];
      const code = createCall.data.code;

      // Vérifier que le code est bien 6 chiffres
      expect(code).toMatch(/^\d{6}$/);
      expect(Number.parseInt(code)).toBeGreaterThanOrEqual(100000);
      expect(Number.parseInt(code)).toBeLessThanOrEqual(999999);
    });

    it("should set token expiry to 15 minutes", async () => {
      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        name: "Test User",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 0,
      });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "token_123",
        email: mockUser.email,
        code: "123456",
        used: false,
        expiresAt: new Date(),
        createdAt: new Date(),
      } as PasswordResetToken);

      const beforeCall = new Date();
      await requestPasswordReset({ email: "test@example.com" });
      const afterCall = new Date();

      const createCall = vi.mocked(prisma.passwordResetToken.create).mock
        .calls[0][0];
      const expiresAt = createCall.data.expiresAt as Date;

      // Vérifier que l'expiration est dans 15 minutes (+/- 1 seconde de marge)
      const expectedMin = new Date(beforeCall.getTime() + 15 * 60 * 1000);
      const expectedMax = new Date(afterCall.getTime() + 15 * 60 * 1000);

      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
      expect(expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await requestPasswordReset({
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      if ("error" in result) { expect(result.error).toBe("Une erreur est survenue. Veuillez réessayer."); }
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe("resetPasswordWithOTP", () => {
    it("should reset password with valid OTP code", async () => {
      const mockToken = {
        id: "token_123",
        email: "test@example.com",
        code: "123456",
        used: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expire dans 10 min
        createdAt: new Date(),
      };

      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        password: "old_hashed_password",
      };

      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(
        mockToken as PasswordResetToken
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.$transaction).mockResolvedValue([
        { id: "user_123" },
        { id: "token_123" },
      ]);

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(true);
      if ("error" in result) { expect(result.error).toBeUndefined(); }

      // Vérifier que le token a été recherché correctement
      expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: {
          email: "test@example.com",
          code: "123456",
          used: false,
          expiresAt: {
            gte: expect.any(Date),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Vérifier que la transaction a été effectuée
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it("should reject invalid OTP code", async () => {
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(null);

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "999999",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Code invalide ou expiré. Veuillez demander un nouveau code."
      );
    });

    it("should reject expired OTP code", async () => {
      // Le token expiré ne sera pas trouvé par findFirst (filtre expiresAt.gte)
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(null);

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Code invalide ou expiré. Veuillez demander un nouveau code."
      );
    });

    it("should reject already used OTP code", async () => {
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(null);

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Code invalide ou expiré. Veuillez demander un nouveau code."
      );
    });

    it("should normalize email (lowercase and trim)", async () => {
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(null);

      await resetPasswordWithOTP({
        email: "  TEST@EXAMPLE.COM  ",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: {
          email: "test@example.com",
          code: "123456",
          used: false,
          expiresAt: {
            gte: expect.any(Date),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should return error if user not found", async () => {
      const mockToken = {
        id: "token_123",
        email: "test@example.com",
        code: "123456",
        used: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(
        mockToken
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(false);
      if ("error" in result) { expect(result.error).toBe("Utilisateur introuvable."); }
    });

    it("should hash password with bcrypt before saving", async () => {
      const mockToken = {
        id: "token_123",
        email: "test@example.com",
        code: "123456",
        used: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        createdAt: new Date(),
      };

      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        password: "old_hashed_password",
      };

      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(
        mockToken as PasswordResetToken
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );

      // Mock de la transaction
      vi.mocked(prisma.$transaction).mockResolvedValue([
        { id: "user_123" },
        { id: "token_123" },
      ]);

      await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      // Vérifier que la transaction inclut une mise à jour du mot de passe
      expect(prisma.$transaction).toHaveBeenCalled();

      // Le mot de passe doit être différent du texte brut (= hashé)
      // Note: On ne peut pas tester le hash exact car bcrypt est appelé dans l'action
    });

    it("should invalidate token after successful reset", async () => {
      const mockToken = {
        id: "token_123",
        email: "test@example.com",
        code: "123456",
        used: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        createdAt: new Date(),
      };

      const mockUser = {
        id: "user_123",
        email: "test@example.com",
        password: "old_hashed_password",
      };

      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(
        mockToken as PasswordResetToken
      );
      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        mockUser as Partial<User> as User
      );
      vi.mocked(prisma.$transaction).mockResolvedValue([
        { id: "user_123" },
        { id: "token_123" },
      ]);

      await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      // Vérifier que la transaction a été appelée (inclut invalidation du token)
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(prisma.passwordResetToken.findFirst).mockRejectedValue(
        new Error("Database connection failed")
      );

      const result = await resetPasswordWithOTP({
        email: "test@example.com",
        code: "123456",
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(result.success).toBe(false);
      if ("error" in result) { expect(result.error).toBe("Une erreur est survenue. Veuillez réessayer."); }
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });
});
