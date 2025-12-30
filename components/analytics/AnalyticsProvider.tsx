"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Global Analytics Provider that configures User ID tracking
 * when user is authenticated
 *
 * Must be placed inside SessionProvider in app/layout.tsx
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { data: session, status } = useSession();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId || status !== "authenticated" || !session?.user?.businessId) {
      return;
    }

    // Attendre que gtag soit disponible (lazy-loaded dans GoogleAnalytics.tsx)
    const configureUserId = () => {
      if (globalThis.window?.gtag && session.user.businessId) {
        const businessId = session.user.businessId;

        // 1. Set user_id globally for all events
        globalThis.window.gtag("set", { user_id: businessId });

        // 2. Set user properties
        globalThis.window.gtag("set", "user_properties", {
          subscription_status: session.user.subscriptionStatus || null,
          is_pro: session.user.isPro || false,
        });

        console.log("[GA4] User ID configured:", businessId);
        return true;
      }
      return false;
    };

    // Essayer immédiatement
    if (configureUserId()) return;

    // Sinon, attendre avec polling (max 5 secondes)
    const interval = setInterval(() => {
      if (configureUserId()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [session, status, gaId]);

  return <>{children}</>;
}
