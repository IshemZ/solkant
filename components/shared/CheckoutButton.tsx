"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { features } from "@/lib/env";

export function CheckoutButton() {
  const router = useRouter();
  const paymentsEnabled = features.stripePayments;

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="w-full"
      title={
        !paymentsEnabled
          ? "Inscription gratuite disponible - Les paiements seront bientôt disponibles"
          : undefined
      }
    >
      Commencer gratuitement
    </Button>
  );
}
