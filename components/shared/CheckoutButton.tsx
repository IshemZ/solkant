"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckoutButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <Button onClick={handleClick} size="lg" className="w-full">
      Commencer gratuitement
    </Button>
  );
}
