"use server";

import { stripe, STRIPE_PRICE_ID_PRO } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { validateSessionWithEmail } from "@/lib/auth-helpers";

export async function createCheckoutSession() {
  try {
    // 1. Vérifier l'authentification ET email vérifié
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return validatedSession;
    }

    const { businessId, userId, userEmail } = validatedSession;

    // 2. Récupérer le Business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return { error: "Business introuvable" };
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
      return { error: "URL de session Checkout invalide" };
    }

    return { url: checkoutSession.url };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createCheckoutSession" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur création session Checkout:", error);
    }

    return { error: "Erreur lors de la création de la session de paiement" };
  }
}

export async function getSubscriptionStatus() {
  try {
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return validatedSession;
    }

    const { businessId } = validatedSession;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return { error: "Business introuvable" };
    }

    // Récupérer les informations de l'abonnement
    const stripeSubscriptionId = (
      business as {
        stripeSubscriptionId?: string | null;
      }
    ).stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return {
        data: {
          plan: "free",
          status: "active",
          currentPeriodEnd: null,
        },
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
      data: {
        plan: "pro",
        status: subData.status,
        currentPeriodEnd: new Date(
          subData.current_period_end * 1000
        ).toISOString(),
        cancelAtPeriodEnd: subData.cancel_at_period_end,
      },
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getSubscriptionStatus" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur récupération abonnement:", error);
    }

    return { error: "Erreur lors de la récupération de l'abonnement" };
  }
}

export async function createCustomerPortalSession() {
  try {
    const validatedSession = await validateSessionWithEmail();

    if ("error" in validatedSession) {
      return validatedSession;
    }

    const { businessId } = validatedSession;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return { error: "Business introuvable" };
    }

    const stripeCustomerId = (business as { stripeCustomerId?: string | null })
      .stripeCustomerId;

    if (!stripeCustomerId) {
      return { error: "Aucun compte Stripe trouvé" };
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
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createCustomerPortalSession" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Erreur création portail client:", error);
    }

    return { error: "Erreur lors de la création du portail client" };
  }
}
