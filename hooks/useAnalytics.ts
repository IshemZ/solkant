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
    if (typeof window === "undefined" || !window.gtag) {
      return;
    }

    // Auto-enrichir avec user_id si disponible
    const enrichedParams = {
      ...params,
      ...(session?.user?.businessId && { user_id: session.user.businessId }),
    };

    window.gtag("event", eventName, enrichedParams);
  };

  return { trackEvent };
}
