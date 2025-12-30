/**
 * Type definitions for Google Analytics gtag global function
 */

declare global {
  interface Window {
    gtag?: {
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
      (command: "config", targetId: string, params?: Record<string, unknown>): void;
      (command: "set", params: Record<string, unknown>): void;
      (command: "set", property: string, value: unknown): void;
      (command: "consent", action: string, params?: Record<string, unknown>): void;
    };
  }
}

export {};
