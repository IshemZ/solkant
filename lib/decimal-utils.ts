import "server-only";
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Server-only utilities for Prisma Decimal operations
 * For client-safe number utilities, use lib/number-utils.ts
 */

/**
 * Check if value is a Decimal-like object (has Decimal structure)
 * Prisma's Decimal has structure: { s: number, e: number, d: number[] }
 */
function isDecimalLike(value: unknown): value is { s: number; e: number; d: number[] } {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.s === 'number' &&
    typeof obj.e === 'number' &&
    Array.isArray(obj.d)
  );
}

/**
 * Convertit Decimal vers number pour sérialisation Next.js
 */
export function toNumber(value: Decimal | number): number {
  return value instanceof Decimal ? value.toNumber() : value;
}

/**
 * Convertit number/string vers Decimal
 */
export function toDecimal(value: number | string | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

/**
 * Formate un montant Decimal en euros (ex: "123.45 €")
 */
export function formatCurrency(amount: Decimal | number): string {
  const num = toNumber(amount);
  return `${num.toFixed(2)} €`;
}

/**
 * Calcule le subtotal d'une liste d'items
 */
export function calculateSubtotal(
  items: Array<{ price: Decimal | number; quantity: number }>
): Decimal {
  return items.reduce(
    (sum, item) => sum.add(toDecimal(item.price).times(item.quantity)),
    new Decimal(0)
  );
}

/**
 * Calcule le montant de remise
 */
export function calculateDiscount(
  subtotal: Decimal | number,
  discountType: 'PERCENTAGE' | 'FIXED' | 'NONE',
  discountValue: Decimal | number
): Decimal {
  if (discountType === 'NONE') {
    return new Decimal(0);
  }

  const base = toDecimal(subtotal);
  const discount = toDecimal(discountValue);

  if (discountType === 'PERCENTAGE') {
    return base.times(discount).div(100);
  }

  // Ensure FIXED discount cannot exceed subtotal
  return discount.greaterThan(base) ? base : discount;
}

/**
 * Sérialise récursivement les Decimal et Date dans un objet
 * Utilisé pour les retours de Server Actions Next.js
 *
 * ## Quand utiliser serializeDecimalFields ?
 *
 * **TOUJOURS** utiliser pour les retours de Server Actions qui contiennent des modèles Prisma
 * avec des champs Decimal (price, amount, discount, etc.) ou Date (createdAt, updatedAt, etc.)
 *
 * ### Modèles concernés (ont des champs Decimal ou Date) :
 * - `Service` (price: Decimal, createdAt/updatedAt: Date)
 * - `Package` (discountValue: Decimal, createdAt/updatedAt: Date)
 * - `Quote` (subtotal, discount, total: Decimal, createdAt/updatedAt/validUntil: Date)
 * - `QuoteItem` (price, total: Decimal, createdAt/updatedAt: Date)
 * - `Client` (createdAt/updatedAt: Date)
 * - `Business` (createdAt/updatedAt: Date)
 *
 * ### Exemples d'utilisation :
 *
 * ```typescript
 * // ✅ CORRECT - Service a des Decimals et Dates
 * export async function getServices() {
 *   const services = await prisma.service.findMany(...)
 *   return successResult(serializeDecimalFields(services))
 * }
 *
 * // ✅ CORRECT - Quote a des Decimals et Dates
 * export async function getQuote(id: string) {
 *   const quote = await prisma.quote.findUnique(...)
 *   return successResult(serializeDecimalFields(quote))
 * }
 *
 * // ✅ RECOMMANDÉ - Client a des Dates
 * export async function getClients() {
 *   const clients = await prisma.client.findMany(...)
 *   return successResult(serializeDecimalFields(clients))
 * }
 * ```
 *
 * ### Pourquoi c'est nécessaire ?
 *
 * Next.js Server Actions ne peuvent pas sérialiser les objets avec méthode toJSON()
 * (comme Decimal et Date de Prisma). Cette fonction les convertit :
 * - Decimal → number (via toJSON())
 * - Date → string (ISO 8601 via toJSON())
 *
 * ### Types correspondants :
 *
 * Utilisez les types `Serialized*` pour les données après sérialisation :
 * - `SerializedService` pour Service avec price: number
 * - `SerializedPackage` pour Package avec discountValue: number
 *
 * @param data - Objet à sérialiser (peut être un objet, tableau, ou primitif)
 * @returns Objet sérialisé avec Decimals → number et Dates → string
 */
export function serializeDecimalFields<T>(data: T): T {
  // Handle null and undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Decimal-like objects (by structure) - MUST come before instanceof check
  // Prisma returns Decimal objects with structure { s: number, e: number, d: number[] }
  if (isDecimalLike(data)) {
    // The object is a Decimal, it should have a toNumber() method even if instanceof fails
    const obj = data as unknown as { toNumber?: () => number };
    let converted: number;

    if (typeof obj.toNumber === 'function') {
      // Direct conversion using toNumber method
      converted = obj.toNumber();
    } else {
      // Fallback: manual reconstruction from internal structure
      // Formula: sign * (digits as number) * 10^(exponent - digits.length + 1)
      const digitsAsNumber = Number(data.d.join(''));
      const scale = Math.pow(10, data.e - data.d.length + 1);
      converted = data.s * digitsAsNumber * scale;
    }

    return converted as T;
  }

  // Handle Decimal - convert to number
  if (data instanceof Decimal) {
    return data.toNumber() as T;
  }

  // Handle Date - convert to ISO string
  if (data instanceof Date) {
    return data.toISOString() as T;
  }

  // Handle arrays - recursively serialize each element
  if (Array.isArray(data)) {
    return data.map(item => serializeDecimalFields(item)) as T;
  }

  // Handle objects - recursively serialize each property
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip functions (like JSON.stringify does)
      if (typeof value === 'function') {
        continue;
      }
      result[key] = serializeDecimalFields(value);
    }
    return result as T;
  }

  // Primitives (string, number, boolean) - return as-is
  return data;
}
