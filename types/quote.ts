import type { Client, Service, Package, PackageItem, Quote, QuoteItem as PrismaQuoteItem } from "@prisma/client";

// Input type for quote items (used in forms)
export interface QuoteItemInput {
  serviceId?: string;
  packageId?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
  packageDiscount?: number;
}

// Serialized types (after Decimal conversion)
export type SerializedService = Omit<Service, 'price'> & {
  price: number;
};

export type SerializedPackageItem = Omit<PackageItem, never> & {
  service: SerializedService | null;
};

export type SerializedPackage = Omit<Package, 'discountValue'> & {
  discountValue: number;
  items: SerializedPackageItem[];
};

// Quote with relations (for edit mode)
export type QuoteWithItems = Quote & {
  items: PrismaQuoteItem[];
  client: Client | null;
};

// Type guards
/**
 * Check if a quote item is from a package
 *
 * @example
 * ```ts
 * if (isPackageItem(item)) {
 *   // item.packageId is string
 *   console.log("This is a package item")
 * } else {
 *   // item.packageId is undefined
 *   console.log("This is a regular service item")
 * }
 * ```
 */
export function isPackageItem(item: QuoteItemInput): item is QuoteItemInput & { packageId: string } {
  return item.packageId !== undefined && item.packageId !== null;
}

/**
 * Check if a quote item is a regular service (not from a package)
 *
 * @example
 * ```ts
 * if (isServiceItem(item)) {
 *   // Can modify price and quantity
 *   console.log("This is a regular service item")
 * }
 * ```
 */
export function isServiceItem(item: QuoteItemInput): item is QuoteItemInput & { serviceId: string } {
  return item.serviceId !== undefined && item.packageId === undefined;
}
