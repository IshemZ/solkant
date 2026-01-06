"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";
import { toast } from "sonner";
import { features } from "@/lib/env";

export function CheckoutButton() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const paymentsEnabled = features.stripePayments;

  const handleClick = async () => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/abonnement");
      return;
    }

    // Si l'utilisateur est connecté, créer une session Stripe
    if (status === "authenticated") {
      try {
        setLoading(true);

        const result = await createCheckoutSession({});

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        if (result.data.url) {
          globalThis.location.href = result.data.url;
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonText = () => {
    if (loading) return "Chargement...";
    if (status === "loading") return "Chargement...";
    if (!paymentsEnabled) return "Commencer gratuitement";
    if (status === "unauthenticated") return "Commencer gratuitement";
    return "Passer au plan Pro";
  };

  const isDisabled = loading || status === "loading" || !paymentsEnabled;

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="w-full"
      disabled={isDisabled}
      title={
        paymentsEnabled
          ? undefined
          : "Inscription gratuite disponible - Les paiements seront bientôt disponibles"
      }
    >
      {buttonText()}
    </Button>
  );
}
