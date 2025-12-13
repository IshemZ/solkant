"use server";

import { stripe, STRIPE_PRICE_ID_PRO } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";

// Types pour les résultats Stripe
type CheckoutSessionResult = { url: string };
type SubscriptionStatus = {
  plan: "free" | "pro";
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd?: boolean;
};
type CustomerPortalResult = { url: string };

export async function createCheckoutSession(): Promise<ActionResult<CheckoutSessionResult>> {
  try {
    // 1. Vérifier l'authentification ET email vérifié
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    const { businessId, userId, userEmail } = validatedSession;

    // 2. Récupérer le Business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResult("Business introuvable", "NOT_FOUND");
    }

    // 3. Créer ou récupérer le customer Stripe
    let stripeCustomerId = (business as any).stripeCustomerId as string | null; // eslint-disable-line @typescript-eslint/no-explicit-any

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
        data: { stripeCustomerId: customer.id } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });
    }

    // 4. Obtenir l'URL de base
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // 5. Créer la session Checkout
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
      return errorResult("URL de session Checkout invalide", "INVALID_CHECKOUT_URL");
    }

    return successResult({ url: checkoutSession.url });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createCheckoutSession" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur création session Checkout:", error);
    }

    return errorResult("Erreur lors de la création de la session de paiement");
  }
}

export async function getSubscriptionStatus(): Promise<ActionResult<SubscriptionStatus>> {
  try {
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    const { businessId } = validatedSession;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResult("Business introuvable", "NOT_FOUND");
    }

    // Récupérer les informations de l'abonnement
    const stripeSubscriptionId = (
      business as {
        stripeSubscriptionId?: string | null;
      }
    ).stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return successResult({
        plan: "free" as const,
        status: "active",
        currentPeriodEnd: null,
      });
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

    return successResult({
      plan: "pro" as const,
      status: subData.status,
      currentPeriodEnd: new Date(
        subData.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: subData.cancel_at_period_end,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getSubscriptionStatus" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur récupération abonnement:", error);
    }

    return errorResult("Erreur lors de la récupération de l'abonnement");
  }
}

export async function createCustomerPortalSession(): Promise<ActionResult<CustomerPortalResult>> {
  try {
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    const { businessId } = validatedSession;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResult("Business introuvable", "NOT_FOUND");
    }

    const stripeCustomerId = (business as { stripeCustomerId?: string | null })
      .stripeCustomerId;

    if (!stripeCustomerId) {
      return errorResult("Aucun compte Stripe trouvé", "NO_STRIPE_CUSTOMER");
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

    return successResult({ url: portalSession.url });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createCustomerPortalSession" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur création portail client:", error);
    }

    return errorResult("Erreur lors de la création du portail client");
  }
}
