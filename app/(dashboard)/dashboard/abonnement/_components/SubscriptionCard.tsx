"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/app/actions/stripe";
import { toast } from "sonner";

interface SubscriptionCardProps {
  type: "upgrade" | "downgrade" | "manage";
}

export default function SubscriptionCard({ type }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);

      if (type === "upgrade") {
        // Créer une session de paiement pour upgrade
        const result = await createCheckoutSession();

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.url) {
          window.location.href = result.url;
        }
      } else if (type === "manage" || type === "downgrade") {
        // Rediriger vers le portail client Stripe
        const result = await createCustomerPortalSession();

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const buttonText = () => {
    if (loading) return "Chargement...";
    if (type === "upgrade") return "Passer au plan Pro";
    if (type === "manage") return "Gérer l'abonnement";
    return "Rétrograder";
  };

  const buttonVariant = type === "upgrade" ? "default" : "outline";

  return (
    <Button
      onClick={handleAction}
      disabled={loading}
      variant={buttonVariant}
      className={type === "upgrade" ? "w-full" : ""}
    >
      {buttonText()}
    </Button>
  );
}
