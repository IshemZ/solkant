"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_PRICE_ID_PRO } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function createCheckoutSession() {
  try {
    // 1. Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Non authentifié" };
    }

    // 2. Récupérer le Business
    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
    });

    if (!business) {
      return { error: "Business introuvable" };
    }

    // 3. Créer ou récupérer le customer Stripe
    let stripeCustomerId = (business as any).stripeCustomerId as string | null; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: business.name,
        metadata: {
          businessId: business.id,
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Sauvegarder le customerId
      await prisma.business.update({
        where: { id: business.id },
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
        businessId: business.id,
        userId: session.user.id,
      },
      subscription_data: {
        metadata: {
          businessId: business.id,
          userId: session.user.id,
        },
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Erreur création session Checkout:", error);
    return { error: "Erreur lors de la création de la session de paiement" };
  }
}

export async function getSubscriptionStatus() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Non authentifié" };
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
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
    console.error("Erreur récupération abonnement:", error);
    return { error: "Erreur lors de la récupération de l'abonnement" };
  }
}

export async function createCustomerPortalSession() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Non authentifié" };
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
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
    console.error("Erreur création portail client:", error);
    return { error: "Erreur lors de la création du portail client" };
  }
}
