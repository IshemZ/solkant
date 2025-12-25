"use client";

import Link from "next/link";
import { MouseEvent } from "react";

type CTALocation =
  | "hero"
  | "navbar"
  | "footer"
  | "pricing_card"
  | "blog_inline"
  | "features_section";

interface CTARegisterButtonProps {
  location: CTALocation;
  text: string;
  className?: string;
  variant?: "button" | "link";
  children?: React.ReactNode;
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
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Track CTA click event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_cta_register", {
        cta_location: location,
        cta_text: text,
        page_path: window.location.pathname,
        cta_type: variant,
      });
    }
  };

  return (
    <Link href="/auth/register" onClick={handleClick} className={className}>
      {children || text}
    </Link>
  );
}
