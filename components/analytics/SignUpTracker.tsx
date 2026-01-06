"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Tracks sign_up event for OAuth (Google) registrations
 *
 * This component checks if there's a pending OAuth sign_up to track
 * (stored in sessionStorage), and tracks it once the user is authenticated
 *
 * Must be placed in app/layout.tsx after SessionProvider
 */
export function SignUpTracker() {
  const { data: session, status } = useSession();
  const { trackEvent } = useAnalytics();
  const trackedRef = useRef(false);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // Check if there's a pending OAuth sign_up to track
    if (
      !trackedRef.current &&
      status === "authenticated" &&
      session?.user?.businessId &&
      globalThis.window !== undefined
    ) {
      const pendingSignUp = sessionStorage.getItem("new_signup");

      if (pendingSignUp === "google") {
        // Track sign_up for OAuth
        trackEvent("sign_up", {
          method: "google",
          user_id: session.user.businessId,
        });

        // Clear flag and mark as tracked
        sessionStorage.removeItem("new_signup");
        trackedRef.current = true;
      }
    }
  }, [session, status, trackEvent]);

  return null; // Composant invisible
}
