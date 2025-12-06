import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature Stripe manquante" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET manquante");
      return NextResponse.json(
        { error: "Configuration webhook invalide" },
        { status: 500 }
      );
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Erreur vérification signature webhook:", err);
      return NextResponse.json(
        { error: `Webhook signature invalide: ${err}` },
        { status: 400 }
      );
    }

    // Gérer les différents événements
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Event non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Stripe:", error);
    return NextResponse.json(
      { error: "Erreur traitement webhook" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const businessId = session.metadata?.businessId;
  if (!businessId) {
    console.error("businessId manquant dans les metadata");
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    console.error("subscriptionId manquant");
    return;
  }

  // Activer l'abonnement PRO
  await prisma.business.update({
    where: { id: businessId },
    data: {
      stripeSubscriptionId: subscriptionId,
      isPro: true,
      subscriptionStatus: "ACTIVE",
    },
  });

  console.log(`✅ Abonnement PRO activé pour Business ${businessId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const business = await prisma.business.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!business) {
    console.error(`Business introuvable pour subscription ${subscription.id}`);
    return;
  }

  // Mettre à jour le statut selon Stripe
  const isPro =
    subscription.status === "active" || subscription.status === "trialing";

  let subscriptionStatus:
    | "TRIAL"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELED"
    | "EXPIRED" = "ACTIVE";

  if (subscription.status === "trialing") {
    subscriptionStatus = "TRIAL";
  } else if (subscription.status === "past_due") {
    subscriptionStatus = "PAST_DUE";
  } else if (subscription.status === "canceled") {
    subscriptionStatus = "CANCELED";
  } else if (
    subscription.status === "unpaid" ||
    subscription.status === "incomplete_expired"
  ) {
    subscriptionStatus = "EXPIRED";
  }

  await prisma.business.update({
    where: { id: business.id },
    data: {
      isPro,
      subscriptionStatus,
      subscriptionEndsAt: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });

  console.log(
    `✅ Abonnement mis à jour pour Business ${business.id}: ${subscription.status}`
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const business = await prisma.business.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!business) {
    console.error(`Business introuvable pour subscription ${subscription.id}`);
    return;
  }

  // Désactiver l'abonnement PRO
  await prisma.business.update({
    where: { id: business.id },
    data: {
      isPro: false,
      subscriptionStatus: "CANCELED",
      stripeSubscriptionId: null,
    },
  });

  console.log(`✅ Abonnement PRO désactivé pour Business ${business.id}`);
}
