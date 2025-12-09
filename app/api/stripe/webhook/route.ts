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

    // ✅ IDEMPOTENCE: Vérifier si l'événement a déjà été traité
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId: event.id },
    });

    if (existingEvent?.processed) {
      console.log(`✅ Événement déjà traité: ${event.id}`);
      return NextResponse.json({ received: true });
    }

    // Enregistrer l'événement (non traité au départ)
    await prisma.webhookEvent.upsert({
      where: { eventId: event.id },
      update: {},
      create: {
        eventId: event.id,
        processed: false,
      },
    });

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

    // ✅ Marquer l'événement comme traité
    await prisma.webhookEvent.update({
      where: { eventId: event.id },
      data: { processed: true },
    });

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
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  console.log(`✅ Abonnement PRO activé pour Business ${businessId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const business = await prisma.business.findUnique({
    where: { stripeSubscriptionId: subscription.id } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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

  // Cast pour accéder à current_period_end
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentPeriodEnd = (subscription as any).current_period_end as
    | number
    | null
    | undefined;

  await prisma.business.update({
    where: { id: business.id },
    data: {
      isPro,
      subscriptionStatus,
      subscriptionEndsAt:
        currentPeriodEnd && typeof currentPeriodEnd === "number"
          ? new Date(currentPeriodEnd * 1000)
          : null,
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  console.log(
    `✅ Abonnement mis à jour pour Business ${business.id}: ${subscription.status}`
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const business = await prisma.business.findUnique({
    where: { stripeSubscriptionId: subscription.id } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  console.log(`✅ Abonnement PRO désactivé pour Business ${business.id}`);
}
