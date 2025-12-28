/**
 * Client-safe number utilities
 * These functions use only standard JavaScript and can run in both browser and server
 */

/**
 * Parse de manière sécurisée un prix en number
 * Retourne 0 si la valeur est invalide (NaN, null, undefined, négative)
 *
 * @param value - Value to parse as price
 * @returns Parsed number or 0 if invalid
 *
 * @example
 * ```ts
 * safeParsePrice(42) // 42
 * safeParsePrice("99.99") // 99.99
 * safeParsePrice(null) // 0
 * safeParsePrice(-10) // 0
 * safeParsePrice(NaN) // 0
 * ```
 */
export function safeParsePrice(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
