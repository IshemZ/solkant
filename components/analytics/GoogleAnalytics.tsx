"use client";

import { useEffect, useState } from "react";

export function GoogleAnalytics() {
  const [GA, setGA] = useState<any>(null);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    // Lazy-load Google Analytics après l'hydratation
    // Réduit le bundle initial de ~30-50KB
    const timer = setTimeout(() => {
      import("@next/third-parties/google").then((module) => {
        setGA(() => module.GoogleAnalytics);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [gaId]);

  if (!gaId || !GA) {
    return null;
  }

  return <GA gaId={gaId} />;
}
