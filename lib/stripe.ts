import Stripe from "stripe";
import { getEnv } from "./env";

const env = getEnv();

if (!env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY manquante dans les variables d'environnement"
  );
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const STRIPE_PRICE_ID_PRO = env.STRIPE_PRICE_ID_PRO || "";
