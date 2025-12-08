"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";
import { toast } from "sonner";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    // Vérifier si l'utilisateur est connecté
    if (status === "unauthenticated") {
      // Rediriger vers la page de connexion avec callbackUrl
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    try {
      setLoading(true);
      const result = await createCheckoutSession();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Erreur checkout:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || status === "loading"}
      size="lg"
      className="w-full"
    >
      {loading || status === "loading"
        ? "Chargement..."
        : "S'abonner maintenant"}
    </Button>
  );
}
