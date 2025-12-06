"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_PRICE_ID_PRO } from "@/lib/stripe";
import prisma from "@/lib/prisma";

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
    let stripeCustomerId = business.stripeCustomerId;

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
        data: { stripeCustomerId: customer.id },
      });
    }

    // 4. Créer la session Checkout
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
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
