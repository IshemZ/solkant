import { Decimal } from '@prisma/client/runtime/library';

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
 * Sérialise récursivement les Decimal en number dans un objet
 * Utilisé pour les retours de Server Actions Next.js
 *
 * ## Quand utiliser serializeDecimalFields ?
 *
 * **TOUJOURS** utiliser pour les retours de Server Actions qui contiennent des modèles Prisma
 * avec des champs Decimal (price, amount, discount, etc.)
 *
 * ### Modèles concernés (ont des champs Decimal) :
 * - `Service` (price: Decimal)
 * - `Package` (discountValue: Decimal)
 * - `Quote` (subtotal, discount, total: Decimal)
 * - `QuoteItem` (price, total: Decimal)
 *
 * ### Modèles NON concernés (pas de Decimal) :
 * - `Client` (aucun champ Decimal)
 * - `Business` (aucun champ Decimal)
 * - `User` (aucun champ Decimal)
 *
 * ### Exemples d'utilisation :
 *
 * ```typescript
 * // ✅ CORRECT - Service a des Decimals
 * export async function getServices() {
 *   const services = await prisma.service.findMany(...)
 *   return successResult(serializeDecimalFields(services))
 * }
 *
 * // ✅ CORRECT - Quote a des Decimals
 * export async function getQuote(id: string) {
 *   const quote = await prisma.quote.findUnique(...)
 *   return successResult(serializeDecimalFields(quote))
 * }
 *
 * // ❌ INUTILE - Client n'a pas de Decimals
 * export async function getClients() {
 *   const clients = await prisma.client.findMany(...)
 *   return successResult(clients) // Pas besoin de serializer
 * }
 * ```
 *
 * ### Pourquoi c'est nécessaire ?
 *
 * Next.js Server Actions ne peuvent pas sérialiser les objets Decimal de Prisma.
 * Cette fonction les convertit en `number` pour la transmission client/serveur.
 *
 * ### Types correspondants :
 *
 * Utilisez les types `Serialized*` pour les données après sérialisation :
 * - `SerializedService` pour Service avec price: number
 * - `SerializedPackage` pour Package avec discountValue: number
 *
 * @param data - Objet à sérialiser (peut être un objet, tableau, ou primitif)
 * @returns Objet sérialisé avec Decimals convertis en numbers
 */
export function serializeDecimalFields<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Decimal) {
    return data.toNumber() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeDecimalFields(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      result[key] = serializeDecimalFields(data[key]);
    }
    return result;
  }

  return data;
}
