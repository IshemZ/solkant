"use client";

import { useSession } from "next-auth/react";

/**
 * Hook for tracking GA4 events via GTM dataLayer
 *
 * @example
 * const { trackEvent } = useAnalytics();
 * trackEvent("sign_up", { method: "credentials" });
 */
export function useAnalytics() {
  const { data: session } = useSession();

  const trackEvent = (
    eventName: string,
    params?: Record<string, string | number | boolean>
  ) => {
    // Server-side or dataLayer not available
    if (!globalThis.window?.dataLayer) {
      return;
    }

    // Check debug_mode directly from URL for reliable detection
    const urlParams = new URLSearchParams(globalThis.window.location.search);
    const debugModeActive = urlParams.get("debug_mode") === "true";

    // Auto-enrichir avec user_id et debug_mode si disponibles
    const enrichedParams = {
      ...params,
      ...(session?.user?.businessId && { user_id: session.user.businessId }),
      ...(debugModeActive && { debug_mode: true }),
    };

    // Push to dataLayer (GTM pattern)
    globalThis.window.dataLayer.push({
      event: eventName,
      ...enrichedParams,
    });

    // Log en console si debug mode
    if (debugModeActive) {
      console.log(`[GTM Debug] Event: ${eventName}`, enrichedParams);
    }
  };

  return { trackEvent };
}
