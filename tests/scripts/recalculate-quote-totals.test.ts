import { describe, it, expect, vi } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';

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

// Import the actual calculation function from the script
import { calculateQuoteTotals } from '../../scripts/recalculate-quote-totals';

describe('calculateQuoteTotals', () => {
  it('should calculate simple quote without discounts', () => {
    const quote: never = {
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
    const quote: never = {
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
    const quote: never = {
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
    const quote: never = {
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
    const quote: never = {
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
