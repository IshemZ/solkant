import { describe, it, expect } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import {
  toNumber,
  toDecimal,
  formatCurrency,
  calculateSubtotal,
  calculateDiscount,
  serializeDecimalFields
} from '@/lib/decimal-utils';

describe('decimal-utils', () => {
  describe('toNumber', () => {
    it('should convert Decimal to number', () => {
      const decimal = new Decimal('123.45');
      expect(toNumber(decimal)).toBe(123.45);
    });

    it('should return number as-is', () => {
      expect(toNumber(99.99)).toBe(99.99);
    });
  });

  describe('toDecimal', () => {
    it('should convert number to Decimal', () => {
      const result = toDecimal(123.45);
      expect(result).toBeInstanceOf(Decimal);
      expect(result.toNumber()).toBe(123.45);
    });

    it('should convert string to Decimal', () => {
      const result = toDecimal('99.99');
      expect(result).toBeInstanceOf(Decimal);
      expect(result.toNumber()).toBe(99.99);
    });

    it('should return Decimal as-is', () => {
      const decimal = new Decimal('50.00');
      const result = toDecimal(decimal);
      expect(result).toBe(decimal);
    });
  });

  describe('formatCurrency', () => {
    it('should format Decimal as currency', () => {
      const decimal = new Decimal('123.45');
      expect(formatCurrency(decimal)).toBe('123.45 €');
    });

    it('should format number as currency', () => {
      expect(formatCurrency(99.99)).toBe('99.99 €');
    });

    it('should format with 2 decimals', () => {
      expect(formatCurrency(100)).toBe('100.00 €');
    });
  });

  describe('calculateSubtotal', () => {
    it('should sum item totals correctly', () => {
      const items = [
        { price: new Decimal('10.50'), quantity: 2 },
        { price: new Decimal('25.00'), quantity: 1 }
      ];
      const result = calculateSubtotal(items);
      expect(result.toNumber()).toBe(46.00);
    });

    it('should handle number prices', () => {
      const items = [
        { price: 33.33, quantity: 3 }
      ];
      const result = calculateSubtotal(items);
      expect(result.toNumber()).toBe(99.99);
    });

    it('should return zero for empty array', () => {
      const result = calculateSubtotal([]);
      expect(result.toNumber()).toBe(0);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate PERCENTAGE discount', () => {
      const result = calculateDiscount(100, 'PERCENTAGE', 20);
      expect(result.toNumber()).toBe(20);
    });

    it('should calculate FIXED discount', () => {
      const result = calculateDiscount(100, 'FIXED', 15);
      expect(result.toNumber()).toBe(15);
    });

    it('should return zero for NONE discount', () => {
      const result = calculateDiscount(100, 'NONE', 0);
      expect(result.toNumber()).toBe(0);
    });

    it('should handle Decimal inputs', () => {
      const result = calculateDiscount(
        new Decimal('100.00'),
        'PERCENTAGE',
        new Decimal('10')
      );
      expect(result.toNumber()).toBe(10);
    });

    it('should cap FIXED discount at subtotal', () => {
      const result = calculateDiscount(50, 'FIXED', 100);
      expect(result.toNumber()).toBe(50); // Should cap at subtotal
    });
  });

  // TODO: safeParsePrice was removed from decimal-utils
  // Re-enable these tests if safeParsePrice is re-added
  // describe('safeParsePrice', () => {
  //   it('should parse valid number correctly', () => {
  //     expect(safeParsePrice(100)).toBe(100);
  //     expect(safeParsePrice(50.99)).toBe(50.99);
  //     expect(safeParsePrice(0)).toBe(0);
  //   });

  //   it('should parse valid string number correctly', () => {
  //     expect(safeParsePrice('100')).toBe(100);
  //     expect(safeParsePrice('50.99')).toBe(50.99);
  //   });

  //   it('should return 0 for null', () => {
  //     expect(safeParsePrice(null)).toBe(0);
  //   });

  //   it('should return 0 for undefined', () => {
  //     expect(safeParsePrice(undefined)).toBe(0);
  //   });

  //   it('should return 0 for NaN', () => {
  //     expect(safeParsePrice(NaN)).toBe(0);
  //   });

  //   it('should return 0 for invalid string', () => {
  //     expect(safeParsePrice('invalid')).toBe(0);
  //     expect(safeParsePrice('abc')).toBe(0);
  //   });

  //   it('should return 0 for negative numbers', () => {
  //     expect(safeParsePrice(-10)).toBe(0);
  //     expect(safeParsePrice(-0.01)).toBe(0);
  //   });

  //   it('should return 0 for Infinity', () => {
  //     expect(safeParsePrice(Infinity)).toBe(0);
  //     expect(safeParsePrice(-Infinity)).toBe(0);
  //   });

  //   it('should parse Decimal correctly', () => {
  //     const decimal = new Decimal('99.99');
  //     expect(safeParsePrice(decimal)).toBe(99.99);
  //   });

  //   it('should handle objects gracefully', () => {
  //     expect(safeParsePrice({})).toBe(0);
  //     expect(safeParsePrice({ price: 100 })).toBe(0);
  //   });
  // });

  describe('serializeDecimalFields', () => {
    it('should convert Decimal to number', () => {
      const data = { price: new Decimal('99.99') };
      const result = serializeDecimalFields(data);
      expect(result.price).toBe(99.99);
    });

    it('should handle nested objects', () => {
      const data = {
        price: new Decimal('50.00'),
        item: { total: new Decimal('100.00') }
      };
      const result = serializeDecimalFields(data);
      expect(result.price).toBe(50);
      expect(result.item.total).toBe(100);
    });

    it('should handle arrays', () => {
      const data = {
        items: [
          { price: new Decimal('10.00') },
          { price: new Decimal('20.00') }
        ]
      };
      const result = serializeDecimalFields(data);
      expect(result.items[0].price).toBe(10);
      expect(result.items[1].price).toBe(20);
    });

    it('should handle null and undefined', () => {
      expect(serializeDecimalFields(null)).toBe(null);
      expect(serializeDecimalFields(undefined)).toBe(undefined);
    });

    it('should preserve non-Decimal values', () => {
      const data = { name: 'Test', count: 5, active: true };
      const result = serializeDecimalFields(data);
      expect(result).toEqual(data);
    });

    // Regression test for NaN price bug (2025-12-28)
    // Prisma sometimes returns Decimal objects with internal structure { s, e, d }
    // that fail instanceof Decimal checks, causing Number(price) to return NaN
    it('should convert Decimal-like objects with internal structure to number', () => {
      // Simulate Prisma returning a Decimal object with internal structure
      // Even if instanceof Decimal fails, these objects still have toNumber()
      const decimal = new Decimal('60');
      const decimalLikeObject = {
        s: decimal.s,
        e: decimal.e,
        d: decimal.d,
        toNumber: () => 60  // Prisma Decimals have this method
      };

      const data = { price: decimalLikeObject };
      const result = serializeDecimalFields(data);

      // Should convert to valid number, not NaN
      expect(typeof result.price).toBe('number');
      expect(Number.isFinite(result.price)).toBe(true);
      expect(Number.isNaN(result.price)).toBe(false);
      expect(result.price).toBe(60);
    });

    it('should handle Decimal-like objects in nested structures', () => {
      const decimal50 = new Decimal('50');
      const decimal30 = new Decimal('30');
      const decimal90 = new Decimal('90');

      const data = {
        service: {
          name: 'Test Service',
          price: { s: decimal50.s, e: decimal50.e, d: decimal50.d, toNumber: () => 50 },
        },
        items: [
          {
            service: {
              price: { s: decimal30.s, e: decimal30.e, d: decimal30.d, toNumber: () => 30 }
            }
          },
          {
            service: {
              price: { s: decimal90.s, e: decimal90.e, d: decimal90.d, toNumber: () => 90 }
            }
          }
        ]
      };

      const result = serializeDecimalFields(data);

      expect(result.service.price).toBe(50);
      expect(result.items[0].service.price).toBe(30);
      expect(result.items[1].service.price).toBe(90);

      // Verify no NaN values
      expect(Number.isNaN(result.service.price)).toBe(false);
      expect(Number.isNaN(result.items[0].service.price)).toBe(false);
      expect(Number.isNaN(result.items[1].service.price)).toBe(false);
    });

    it('should handle Decimal-like object with decimal places', () => {
      // Decimal representation of 123.45
      const decimal = new Decimal('123.45');
      const decimalLikeObject = {
        s: decimal.s,
        e: decimal.e,
        d: decimal.d,
        toNumber: () => 123.45
      };

      const data = { price: decimalLikeObject };
      const result = serializeDecimalFields(data);

      expect(typeof result.price).toBe('number');
      expect(Number.isNaN(result.price)).toBe(false);
      expect(result.price).toBe(123.45);
    });

    it('should prevent NaN when displaying prices with Number().toFixed()', () => {
      // This simulates the exact bug: ServicesList.tsx line 137
      const decimal60 = new Decimal('60');
      const service = {
        id: 'service_1',
        name: 'Test Service',
        price: { s: decimal60.s, e: decimal60.e, d: decimal60.d, toNumber: () => 60 }
      };

      const serialized = serializeDecimalFields(service);

      // This is what ServicesList.tsx does:
      const displayPrice = Number(serialized.price).toFixed(2);

      // Should display "60.00 €", not "NaN €"
      expect(displayPrice).toBe('60.00');
      expect(displayPrice).not.toBe('NaN');
    });
  });
});
