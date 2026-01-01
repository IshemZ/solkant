"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const searchParams = useSearchParams();
  const isDebugMode = searchParams.get("debug_mode") === "true";

  // Initialiser le consent mode AVANT le chargement de GA
  useEffect(() => {
    if (!gaId) return;

    // Définir gtag avant que le script GA se charge
    globalThis.window.dataLayer = globalThis.window.dataLayer || [];
    function gtag(...args: unknown[]) {
      globalThis.window.dataLayer?.push(args);
    }
    globalThis.window.gtag = gtag as typeof globalThis.window.gtag;

    // Configuration du consent mode par défaut (RGPD)
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500, // Attendre 500ms pour le consentement
    });

    // Vérifier si le consentement existe déjà dans localStorage
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent) {
      try {
        const prefs = JSON.parse(savedConsent);
        if (prefs.analytics) {
          gtag("consent", "update", {
            analytics_storage: "granted",
          });
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }

    // Activer le debug mode si présent dans l'URL
    if (isDebugMode) {
      gtag("set", { debug_mode: true });
      console.log("[GA4] Debug mode activé");
    }
  }, [gaId, isDebugMode]);

  if (!gaId) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
