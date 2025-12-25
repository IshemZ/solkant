/**
 * Type definitions for Google Analytics gtag global function
 */

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set" | "consent",
      targetIdOrAction: string,
      params?: Record<string, any>
    ) => void;
  }
}

export {};
