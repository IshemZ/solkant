/**
 * Type definitions for Google Analytics gtag global function
 */

declare global {
  interface Window {
    gtag?: {
      (command: "event", eventName: string, params?: Record<string, any>): void;
      (command: "config", targetId: string, params?: Record<string, any>): void;
      (command: "set", params: Record<string, any>): void;
      (command: "set", property: string, value: any): void;
      (command: "consent", action: string, params?: Record<string, any>): void;
    };
  }
}

export {};
