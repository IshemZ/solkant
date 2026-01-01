"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";

type CTALocation =
  | "hero"
  | "navbar"
  | "footer"
  | "pricing_card"
  | "blog_inline"
  | "features_section";

interface CTARegisterButtonProps {
  readonly location: CTALocation;
  readonly text: string;
  readonly className?: string;
  readonly variant?: "button" | "link";
  readonly children?: React.ReactNode;
}

/**
 * Reusable CTA button for registration with automatic GA4 tracking
 *
 * @example
 * <CTARegisterButton
 *   location="hero"
 *   text="Essayer gratuitement"
 *   variant="button"
 *   className="btn-primary"
 * />
 */
export function CTARegisterButton({
  location,
  text,
  className,
  variant = "button",
  children,
}: CTARegisterButtonProps) {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    // Track CTA click event
    trackEvent("click_cta_register", {
      cta_location: location,
      cta_text: text,
      page_path: globalThis.window?.location?.pathname,
      cta_type: variant,
    });
  };

  return (
    <Link href="/auth/register" onClick={handleClick} className={className}>
      {children || text}
    </Link>
  );
}
