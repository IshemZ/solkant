"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getPageCategory, getContentType } from "@/lib/analytics/utils";

/**
 * Global Page View Tracker that enriches automatic page_view events
 * with custom parameters (page_category, user_authenticated, etc.)
 *
 * Must be placed in app/layout.tsx after GoogleAnalytics component
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (!window.gtag) return;

    const pageCategory = getPageCategory(pathname);
    const contentType = getContentType(pathname);

    // Enrichir page_view automatique avec custom parameters
    window.gtag("event", "page_view", {
      page_category: pageCategory,
      user_authenticated: !!session,
      subscription_status: session?.user?.subscriptionStatus || null,
      ...(contentType && { content_type: contentType }),
    });
  }, [pathname, session]);

  return null; // Composant invisible
}
