"use client";

import { useEffect, useState } from "react";
import type { GoogleAnalytics as GAComponent } from "@next/third-parties/google";

export function GoogleAnalytics() {
  const [GA, setGA] = useState<typeof GAComponent | null>(null);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    // Lazy-load Google Analytics après l'hydratation
    // Réduit le bundle initial de ~30-50KB
    const loadGA = async () => {
      const { GoogleAnalytics: GAComponent } = await import("@next/third-parties/google");
      setGA(GAComponent);
    };

    const timer = setTimeout(loadGA, 1500);
    return () => clearTimeout(timer);
  }, [gaId]);

  if (!gaId || !GA) {
    return null;
  }

  return <GA gaId={gaId} />;
}
