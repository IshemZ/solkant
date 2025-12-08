import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getBusinessInfo,
  updateBusiness,
  uploadBusinessLogo,
  deleteBusinessLogo,
} from "@/app/actions/business";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    business: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Business Server Actions", () => {
  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
      email: "test@example.com",
      name: "Test User",
    },
  };

  const mockBusiness = {
    id: "business_123",
    name: "Mon Institut",
    address: "1 rue de Paris",
    phone: "0123456789",
    email: "contact@institut.fr",
    logo: null,
    siret: "12345678901234",
    primaryColor: "#D4B5A0",
    secondaryColor: "#8B7355",
    userId: "user_123",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    isPro: false,
    subscriptionStatus: "TRIAL" as const,
    subscriptionEndsAt: null,
    trialEndsAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBusinessInfo", () => {
    it("should return business info for authenticated user", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(mockBusiness);

      const result = await getBusinessInfo();

      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe("Mon Institut");
      expect(result.error).toBeUndefined();

      expect(prisma.business.findUnique).toHaveBeenCalledWith({
        where: { id: "business_123" },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await getBusinessInfo();

      expect(result.error).toBe("Non autorisé");
      expect(result.data).toBeUndefined();
      expect(prisma.business.findUnique).not.toHaveBeenCalled();
    });

    it("should return error if businessId missing", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user_123",
          businessId: null,
          email: "test@example.com",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getBusinessInfo();

      expect(result.error).toBe("Non autorisé");
      expect(prisma.business.findUnique).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.findUnique).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getBusinessInfo();

      expect(result.error).toBe(
        "Erreur lors de la récupération des informations"
      );
      expect(result.data).toBeUndefined();
    });
  });

  describe("updateBusiness", () => {
    it("should update business with valid data", async () => {
      const updateData = {
        name: "Institut de Beauté",
        address: "2 rue du Commerce",
        phone: "0987654321",
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockResolvedValue({
        ...mockBusiness,
        ...updateData,
      });

      const result = await updateBusiness(updateData);

      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe("Institut de Beauté");
      expect(result.error).toBeUndefined();

      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: "business_123" },
        data: expect.objectContaining(updateData),
      });
    });

    it("should return error for unauthenticated user", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await updateBusiness({ name: "Test" });

      expect(result.error).toBe("Non autorisé");
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      // Nom trop court
      const result = await updateBusiness({ name: "A" });

      expect(result.error).toBe("Données invalides");
      expect(result.fieldErrors).toBeDefined();
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should sanitize XSS attempts", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockResolvedValue(mockBusiness);

      const xssAttempt = {
        name: 'Institut <script>alert("XSS")</script>',
        address: "<img src=x onerror=alert(1)>",
      };

      await updateBusiness(xssAttempt);

      // Verify sanitizeObject is called (XSS should be stripped)
      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: "business_123" },
        data: expect.objectContaining({
          name: expect.not.stringContaining("<script>"),
          address: expect.not.stringContaining("<img"),
        }),
      });
    });

    it("should handle database errors", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await updateBusiness({ name: "Test Business" });

      expect(result.error).toBe("Erreur lors de la mise à jour");
      expect(result.data).toBeUndefined();
    });
  });

  describe("uploadBusinessLogo", () => {
    const validLogoData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";

    it("should upload logo with valid data", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockResolvedValue({
        ...mockBusiness,
        logo: validLogoData,
      });

      const result = await uploadBusinessLogo(validLogoData);

      expect(result.data).toBeDefined();
      expect(result.data?.logo).toBe(validLogoData);
      expect(result.error).toBeUndefined();

      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: "business_123" },
        data: { logo: validLogoData },
      });
    });

    it("should reject non-image data URLs", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await uploadBusinessLogo("data:text/plain;base64,test");

      expect(result.error).toBe("Format d'image invalide");
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should reject oversized images", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      // Create a string > 5MB
      const largeData = "data:image/png;base64," + "a".repeat(6 * 1024 * 1024);

      const result = await uploadBusinessLogo(largeData);

      expect(result.error).toBe("L'image est trop volumineuse (max 5MB)");
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await uploadBusinessLogo(validLogoData);

      expect(result.error).toBe("Non autorisé");
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await uploadBusinessLogo(validLogoData);

      expect(result.error).toBe("Erreur lors de l'upload du logo");
      expect(result.data).toBeUndefined();
    });
  });

  describe("deleteBusinessLogo", () => {
    it("should delete logo successfully", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockResolvedValue({
        ...mockBusiness,
        logo: null,
      });

      const result = await deleteBusinessLogo();

      expect(result.data).toBeDefined();
      expect(result.data?.logo).toBeNull();
      expect(result.error).toBeUndefined();

      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: "business_123" },
        data: { logo: null },
      });
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await deleteBusinessLogo();

      expect(result.error).toBe("Non autorisé");
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.business.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await deleteBusinessLogo();

      expect(result.error).toContain("Erreur");
      expect(result.data).toBeUndefined();
    });
  });
});
