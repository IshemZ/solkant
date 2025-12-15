/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCheckoutSession } from "@/app/actions/stripe";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripe";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === "host") return "localhost:3000";
      return null;
    }),
  })),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    business: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: vi.fn(),
    },
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  STRIPE_PRICE_ID_PRO: "price_test_123",
}));

describe("Stripe Server Actions", () => {
  const mockSession = {
    user: {
      id: "user_123",
      businessId: "business_123",
      email: "test@example.com",
      name: "Test User",
    },
  };

  const mockUser = {
    id: "user_123",
    email: "test@example.com",
    emailVerified: new Date("2024-01-01"),
    name: "Test User",
    password: null,
    image: null,
    verificationToken: null,
    tokenExpiry: null,
    createdAt: new Date(),
    city: null,
    postalCode: null,
    country: null,
    tva: null,
    updatedAt: new Date(),
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
    stripePriceId: null,
    isPro: false,
    subscriptionStatus: "TRIAL" as const,
    subscriptionEndsAt: null,
    trialEndsAt: null,
    createdAt: new Date(),
    city: null,
    postalCode: null,
    country: null,
    tva: null,
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default NEXT_PUBLIC_APP_URL for tests
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  describe("createCheckoutSession", () => {
    it("should create checkout session for new customer", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(mockBusiness);

      const mockCustomer = { id: "cus_test_123" };
      vi.mocked(stripe.customers.create).mockResolvedValue(mockCustomer as any);

      vi.mocked(prisma.business.update).mockResolvedValue({
        ...mockBusiness,
        stripeCustomerId: "cus_test_123",
      });

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/session/test",
      };
      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue(
        mockCheckoutSession as any
      );

      const result = await createCheckoutSession();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe("https://checkout.stripe.com/session/test");
      }

      // Verify customer creation
      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Mon Institut",
        metadata: {
          businessId: "business_123",
          userId: "user_123",
        },
      });

      // Verify customer ID saved to database
      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: "business_123" },
        data: { stripeCustomerId: "cus_test_123" },
      });

      // Verify checkout session creation
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: "cus_test_123",
          mode: "subscription",
          line_items: [
            {
              price: "price_test_123",
              quantity: 1,
            },
          ],
        })
      );
    });

    it("should use existing customer ID", async () => {
      const businessWithStripeId = {
        ...mockBusiness,
        stripeCustomerId: "cus_existing_123",
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(
        businessWithStripeId
      );

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/session/test",
      };
      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue(
        mockCheckoutSession as any
      );

      const result = await createCheckoutSession();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe("https://checkout.stripe.com/session/test");
      }

      // Should NOT create new customer
      expect(stripe.customers.create).not.toHaveBeenCalled();
      expect(prisma.business.update).not.toHaveBeenCalled();

      // Should use existing customer ID
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: "cus_existing_123",
        })
      );
    });

    it("should return error if not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Non autorisé");
      }
      expect(stripe.customers.create).not.toHaveBeenCalled();
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    });

    it("should return error if no email in session", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "user_123",
          businessId: "business_123",
          email: null,
          name: "Test User",
        },
      } as any);

      // Mock user with unverified email
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        emailVerified: null,
      });

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Email non vérifié. Veuillez vérifier votre email.");
        if ("code" in result && result.code) {
          expect(result.code).toBe("EMAIL_NOT_VERIFIED");
        }
      }
      expect(stripe.customers.create).not.toHaveBeenCalled();
    });

    it("should return error if business not found", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(null);

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Business introuvable");
      }
      expect(stripe.customers.create).not.toHaveBeenCalled();
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    });

    it("should handle Stripe customer creation error", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(mockBusiness);
      vi.mocked(stripe.customers.create).mockRejectedValue(
        new Error("Stripe API error")
      );

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Erreur lors de la création de la session de paiement"
        );
      }
    });

    it("should handle Stripe checkout session creation error", async () => {
      const businessWithStripeId = {
        ...mockBusiness,
        stripeCustomerId: "cus_existing_123",
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(
        businessWithStripeId
      );
      vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
        new Error("Stripe session error")
      );

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Erreur lors de la création de la session de paiement"
        );
      }
    });

    it("should include correct URLs in checkout session", async () => {
      const businessWithStripeId = {
        ...mockBusiness,
        stripeCustomerId: "cus_existing_123",
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(
        businessWithStripeId
      );

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/session/test",
      };
      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue(
        mockCheckoutSession as any
      );

      await createCheckoutSession();

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url:
            "http://localhost:3000/dashboard/abonnement?checkout=success",
          cancel_url:
            "http://localhost:3000/dashboard/abonnement?checkout=cancel",
        })
      );
    });

    it("should include metadata in checkout session", async () => {
      const businessWithStripeId = {
        ...mockBusiness,
        stripeCustomerId: "cus_existing_123",
      };

      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(
        businessWithStripeId
      );

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/session/test",
      };
      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue(
        mockCheckoutSession as any
      );

      await createCheckoutSession();

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            businessId: "business_123",
            userId: "user_123",
          },
          subscription_data: {
            metadata: {
              businessId: "business_123",
              userId: "user_123",
            },
          },
        })
      );
    });

    it("should handle database update error when saving customer ID", async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.business.findUnique).mockResolvedValue(mockBusiness);

      const mockCustomer = { id: "cus_test_123" };
      vi.mocked(stripe.customers.create).mockResolvedValue(mockCustomer as any);

      // Database update fails
      vi.mocked(prisma.business.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await createCheckoutSession();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Erreur lors de la création de la session de paiement"
        );
      }
    });
  });
});
