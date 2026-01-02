"use client";

import { useSession } from "next-auth/react";

/**
 * Hook for tracking GA4 events with automatic user_id enrichment
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
    // Server-side or gtag not loaded
    if (!globalThis.window?.gtag) {
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

    globalThis.window.gtag("event", eventName, enrichedParams);

    // Log en console si debug mode
    if (debugModeActive) {
      console.log(`[GA4 Debug] Event: ${eventName}`, enrichedParams);
    }
  };

  return { trackEvent };
}
