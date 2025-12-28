import type { SerializedPackage } from "@/types/quote";
import { safeParsePrice } from "@/lib/number-utils";

/**
 * Calculate the base price of a package from all its services
 *
 * @param pkg - Package with items and services
 * @returns Base price before any discount
 *
 * @example
 * ```ts
 * const pkg = { items: [{ service: { price: 50 }, quantity: 2 }] }
 * const basePrice = calculatePackageBasePrice(pkg) // 100
 * ```
 */
export function calculatePackageBasePrice(pkg: SerializedPackage): number {
  return pkg.items.reduce((sum, item) => {
    const price = safeParsePrice(item.service?.price);
    return sum + price * item.quantity;
  }, 0);
}

/**
 * Calculate the discount amount for a package
 *
 * @param pkg - Package with discount configuration
 * @param basePrice - Base price before discount (optional, will be calculated if not provided)
 * @returns Discount amount
 *
 * @example
 * ```ts
 * // Percentage discount
 * const pkg = { discountType: "PERCENTAGE", discountValue: 10, items: [...] }
 * const discount = calculatePackageDiscount(pkg, 100) // 10
 *
 * // Fixed discount
 * const pkg2 = { discountType: "FIXED", discountValue: 15, items: [...] }
 * const discount2 = calculatePackageDiscount(pkg2, 100) // 15
 * ```
 */
export function calculatePackageDiscount(
  pkg: SerializedPackage,
  basePrice?: number
): number {
  const price = basePrice ?? calculatePackageBasePrice(pkg);
  const discountValue = safeParsePrice(pkg.discountValue);

  if (discountValue <= 0) {
    return 0;
  }

  if (pkg.discountType === "PERCENTAGE") {
    return price * (discountValue / 100);
  }

  // FIXED discount, capped at base price
  return Math.min(discountValue, price);
}

/**
 * Calculate the final price of a package after discount
 *
 * @param pkg - Package with items, services, and discount
 * @returns Final price after discount
 *
 * @example
 * ```ts
 * const pkg = {
 *   items: [{ service: { price: 50 }, quantity: 2 }],
 *   discountType: "PERCENTAGE",
 *   discountValue: 10
 * }
 * const finalPrice = calculatePackageFinalPrice(pkg) // 90
 * ```
 */
export function calculatePackageFinalPrice(pkg: SerializedPackage): number {
  const basePrice = calculatePackageBasePrice(pkg);
  const discount = calculatePackageDiscount(pkg, basePrice);
  return basePrice - discount;
}

/**
 * Create a description of all services included in a package
 *
 * @param pkg - Package with items and services
 * @returns Description string (e.g., "Coupe × 1, Brushing × 2")
 *
 * @example
 * ```ts
 * const pkg = {
 *   items: [
 *     { service: { name: "Coupe" }, quantity: 1 },
 *     { service: { name: "Brushing" }, quantity: 2 }
 *   ]
 * }
 * const desc = createPackageServicesDescription(pkg)
 * // "Coupe × 1, Brushing × 2"
 * ```
 */
export function createPackageServicesDescription(pkg: SerializedPackage): string {
  return pkg.items
    .map((item) => `${item.service?.name || "Service inconnu"} × ${item.quantity}`)
    .join(", ");
}

/**
 * Get package pricing breakdown
 *
 * @param pkg - Package to analyze
 * @returns Object with base price, discount, and final price
 *
 * @example
 * ```ts
 * const pkg = { items: [...], discountType: "PERCENTAGE", discountValue: 10 }
 * const pricing = getPackagePricing(pkg)
 * // { basePrice: 100, discount: 10, finalPrice: 90 }
 * ```
 */
export function getPackagePricing(pkg: SerializedPackage): {
  basePrice: number;
  discount: number;
  finalPrice: number;
} {
  const basePrice = calculatePackageBasePrice(pkg);
  const discount = calculatePackageDiscount(pkg, basePrice);
  const finalPrice = basePrice - discount;

  return { basePrice, discount, finalPrice };
}
