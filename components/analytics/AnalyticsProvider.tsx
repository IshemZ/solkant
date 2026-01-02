"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Global Analytics Provider that configures User ID tracking via GTM
 * when user is authenticated
 *
 * Must be placed inside SessionProvider in app/layout.tsx
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.businessId) {
      return;
    }

    // Attendre que dataLayer soit disponible (chargé par GTM)
    const configureUserId = () => {
      if (globalThis.window?.dataLayer && session.user.businessId) {
        const businessId = session.user.businessId;

        // Push user configuration to dataLayer
        globalThis.window.dataLayer.push({
          event: 'user_authenticated',
          user_id: businessId,
          user_properties: {
            subscription_status: session.user.subscriptionStatus || null,
            is_pro: session.user.isPro || false,
          },
        });

        console.log("[GTM] User ID configured:", businessId);
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
  }, [session, status]);

  return <>{children}</>;
}
