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
    if (!gaId || status === "loading") return;

    // Configure User ID if authenticated
    if (
      status === "authenticated" &&
      session?.user?.businessId &&
      window.gtag
    ) {
      window.gtag("config", gaId, {
        user_id: session.user.businessId,
        user_properties: {
          subscription_status: session.user.subscriptionStatus || null,
          is_pro: session.user.isPro || false,
        },
      });
    }
  }, [session, status, gaId]);

  return <>{children}</>;
}
