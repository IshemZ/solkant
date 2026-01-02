"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

    // Activer le debug mode si présent dans l'URL (using window.location for reliable detection)
    if (typeof globalThis.window !== "undefined") {
      const params = new URLSearchParams(globalThis.window.location.search);
      const debugMode = params.get("debug_mode") === "true";
      if (debugMode) {
        gtag("set", { debug_mode: true });
        console.log("[GA4] Debug mode activé");
      }
    }

    // TEST #3: Disable automatic form_submit events to prevent conflicts
    gtag("config", gaId, {
      send_page_view: false, // Let PageViewTracker handle this
      enhanced_measurement: {
        forms: false, // Disable automatic form_submit events
      },
    });
    console.log("[GA4 TEST #3] Automatic form tracking disabled");
  }, [gaId]);

  if (!gaId) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
