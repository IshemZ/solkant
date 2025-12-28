"use server";

import { stripe, STRIPE_PRICE_ID_PRO } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { withAuth } from "@/lib/action-wrapper";

// Types pour les résultats Stripe
type CheckoutSessionResult = { url: string };
type SubscriptionStatus = {
  plan: "free" | "pro";
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd?: boolean;
};
type CustomerPortalResult = { url: string };

/**
 * Crée une session Stripe Checkout pour l'abonnement Pro
 */
export const createCheckoutSession = withAuth(
  async (_input: Record<string, never>, session): Promise<CheckoutSessionResult> => {
    const { businessId, userId, userEmail } = session;

    // Récupérer le Business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new Error("Business introuvable");
    }

    // Créer ou récupérer le customer Stripe
    let stripeCustomerId = (business as unknown as { stripeCustomerId?: string | null })
      .stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: business.name,
        metadata: {
          businessId,
          userId,
        },
      });
      stripeCustomerId = customer.id;

      // Sauvegarder le customerId
      await prisma.business.update({
        where: { id: businessId },
        data: { stripeCustomerId: customer.id } as unknown as { stripeCustomerId: string },
      });
    }

    // Obtenir l'URL de base
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Créer la session Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRICE_ID_PRO,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/abonnement?checkout=success`,
      cancel_url: `${baseUrl}/dashboard/abonnement?checkout=cancel`,
      metadata: {
        businessId,
        userId,
      },
      subscription_data: {
        metadata: {
          businessId,
          userId,
        },
      },
    });

    if (!checkoutSession.url) {
      throw new Error("URL de session Checkout invalide");
    }

    return { url: checkoutSession.url };
  },
  "createCheckoutSession"
);

/**
 * Récupère le statut de l'abonnement actuel
 */
export const getSubscriptionStatus = withAuth(
  async (_input: Record<string, never>, session): Promise<SubscriptionStatus> => {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    if (!business) {
      throw new Error("Business introuvable");
    }

    // Récupérer les informations de l'abonnement
    const stripeSubscriptionId = (
      business as unknown as {
        stripeSubscriptionId?: string | null;
      }
    ).stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return {
        plan: "free",
        status: "active",
        currentPeriodEnd: null,
      };
    }

    // Récupérer l'abonnement depuis Stripe
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    // Type assertion pour accéder aux propriétés
    const subData = subscription as unknown as {
      status: string;
      current_period_end: number;
      cancel_at_period_end: boolean;
    };

    return {
      plan: "pro",
      status: subData.status,
      currentPeriodEnd: new Date(
        subData.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: subData.cancel_at_period_end,
    };
  },
  "getSubscriptionStatus"
);

/**
 * Crée une session de portail client Stripe pour gérer l'abonnement
 */
export const createCustomerPortalSession = withAuth(
  async (_input: Record<string, never>, session): Promise<CustomerPortalResult> => {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    if (!business) {
      throw new Error("Business introuvable");
    }

    const stripeCustomerId = (business as unknown as { stripeCustomerId?: string | null })
      .stripeCustomerId;

    if (!stripeCustomerId) {
      throw new Error("Aucun compte Stripe trouvé");
    }

    // Obtenir l'URL de base
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Créer une session de portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/dashboard/abonnement`,
    });

    return { url: portalSession.url };
  },
  "createCustomerPortalSession"
);
