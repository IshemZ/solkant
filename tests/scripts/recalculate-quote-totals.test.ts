import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import type { Quote, QuoteItem, Package } from '@prisma/client';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  default: {
    quote: {
      findMany: vi.fn(),
      update: vi.fn()
    },
    $disconnect: vi.fn()
  }
}));

type QuoteWithRelations = Quote & {
  items: Array<QuoteItem & {
    package: Package | null;
  }>;
};

// Import the calculation function (will be exported from script)
function calculateQuoteTotals(quote: QuoteWithRelations) {
  // Calculate subtotal
  const subtotal = quote.items.reduce(
    (sum, item) => sum.add(new Decimal(item.total)),
    new Decimal(0)
  );

  // Calculate package discounts
  const packageDiscountsTotal = quote.items.reduce((sum, item) => {
    if (!item.packageId || !item.package) return sum;

    const basePrice = new Decimal(item.price);
    let discount = new Decimal(0);

    if (item.package.discountType === 'PERCENTAGE') {
      discount = basePrice.times(item.package.discountValue).div(100);
    } else if (item.package.discountType === 'FIXED') {
      discount = new Decimal(item.package.discountValue);
    }

    return sum.add(discount);
  }, new Decimal(0));

  // Subtotal after package discounts
  const subtotalAfterPackageDiscounts = subtotal.minus(packageDiscountsTotal);

  // Calculate global discount
  const discountValue = new Decimal(quote.discount);
  const discountAmount = quote.discountType === 'PERCENTAGE'
    ? subtotalAfterPackageDiscounts.times(discountValue).div(100)
    : discountValue;

  // Final total
  const total = subtotalAfterPackageDiscounts.minus(discountAmount);

  return {
    newSubtotal: subtotal,
    newTotal: total
  };
}

describe('calculateQuoteTotals', () => {
  it('should calculate simple quote without discounts', () => {
    const quote: any = {
      id: '1',
      discount: 0,
      discountType: 'FIXED',
      items: [
        { price: 10.50, quantity: 2, total: 21.00, packageId: null, package: null },
        { price: 25.00, quantity: 1, total: 25.00, packageId: null, package: null }
      ]
    };

    const result = calculateQuoteTotals(quote);
    expect(result.newSubtotal.toNumber()).toBe(46.00);
    expect(result.newTotal.toNumber()).toBe(46.00);
  });

  it('should calculate quote with PERCENTAGE discount', () => {
    const quote: any = {
      id: '2',
      discount: 10,
      discountType: 'PERCENTAGE',
      items: [
        { price: 100, quantity: 1, total: 100, packageId: null, package: null }
      ]
    };

    const result = calculateQuoteTotals(quote);
    expect(result.newSubtotal.toNumber()).toBe(100);
    expect(result.newTotal.toNumber()).toBe(90); // 100 - 10%
  });

  it('should calculate quote with FIXED discount', () => {
    const quote: any = {
      id: '3',
      discount: 15,
      discountType: 'FIXED',
      items: [
        { price: 100, quantity: 1, total: 100, packageId: null, package: null }
      ]
    };

    const result = calculateQuoteTotals(quote);
    expect(result.newTotal.toNumber()).toBe(85); // 100 - 15
  });

  it('should calculate quote with package PERCENTAGE discount', () => {
    const quote: any = {
      id: '4',
      discount: 0,
      discountType: 'FIXED',
      items: [
        {
          price: 100,
          quantity: 1,
          total: 100,
          packageId: 'pkg1',
          package: {
            discountType: 'PERCENTAGE',
            discountValue: new Decimal(20)
          }
        }
      ]
    };

    const result = calculateQuoteTotals(quote);
    expect(result.newSubtotal.toNumber()).toBe(100);
    expect(result.newTotal.toNumber()).toBe(80); // 100 - 20%
  });

  it('should handle Float rounding errors correctly', () => {
    // Famous Float bug: 0.1 + 0.2 !== 0.3
    const quote: any = {
      id: '5',
      discount: 0,
      discountType: 'FIXED',
      items: [
        { price: 33.33, quantity: 3, total: 99.99, packageId: null, package: null }
      ]
    };

    const result = calculateQuoteTotals(quote);
    expect(result.newSubtotal.toNumber()).toBe(99.99); // Exact, no Float drift
    expect(result.newTotal.toNumber()).toBe(99.99);
  });
});
