"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getPageCategory, getContentType } from "@/lib/analytics/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Global Page View Tracker that enriches automatic page_view events
 * with custom parameters (page_category, user_authenticated, etc.)
 *
 * Must be placed in app/layout.tsx after GoogleAnalytics component
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const pageCategory = getPageCategory(pathname);
    const contentType = getContentType(pathname);

    // Enrichir page_view automatique avec custom parameters
    trackEvent("page_view", {
      page_category: pageCategory,
      user_authenticated: !!session,
      ...(session?.user?.subscriptionStatus && {
        subscription_status: session.user.subscriptionStatus,
      }),
      ...(contentType && { content_type: contentType }),
    });
  }, [pathname, session, trackEvent]);

  return null; // Composant invisible
}
