"use client";

import { useEffect } from "react";

/**
 * Component de développement uniquement
 * Active automatiquement les analytics en mode dev pour faciliter les tests
 *
 * IMPORTANT: Ce composant ne s'active QU'EN DÉVELOPPEMENT
 * En production, le cookie consent normal est utilisé (RGPD-compliant)
 */
export function DevAnalyticsHelper() {
  useEffect(() => {
    // Uniquement en développement
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Vérifier si le consentement n'a pas déjà été donné manuellement
    const existingConsent = localStorage.getItem("cookie-consent");

    if (!existingConsent) {
      // Auto-accepter les cookies en dev
      const devConsent = {
        necessary: true,
        analytics: true,
        functional: true,
      };

      localStorage.setItem("cookie-consent", JSON.stringify(devConsent));

      // Activer GA4 immédiatement via dataLayer
      if (globalThis.window?.dataLayer) {
        globalThis.window.dataLayer.push({
          event: 'consent_update',
          consent_analytics: 'granted',
        });
        console.log("🚀 [DEV] Analytics auto-activées pour le développement");
      }
    }
  }, []);

  // Ce composant ne rend rien
  return null;
}
