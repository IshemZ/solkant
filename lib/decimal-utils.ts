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

  return discount; // FIXED
}

/**
 * Sérialise récursivement les Decimal en number dans un objet
 * Utilisé pour les retours de Server Actions Next.js
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
