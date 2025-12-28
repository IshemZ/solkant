import { describe, it, expect } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import {
  toNumber,
  toDecimal,
  formatCurrency,
  calculateSubtotal,
  calculateDiscount,
  serializeDecimalFields,
  safeParsePrice
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

  describe('safeParsePrice', () => {
    it('should parse valid number correctly', () => {
      expect(safeParsePrice(100)).toBe(100);
      expect(safeParsePrice(50.99)).toBe(50.99);
      expect(safeParsePrice(0)).toBe(0);
    });

    it('should parse valid string number correctly', () => {
      expect(safeParsePrice('100')).toBe(100);
      expect(safeParsePrice('50.99')).toBe(50.99);
    });

    it('should return 0 for null', () => {
      expect(safeParsePrice(null)).toBe(0);
    });

    it('should return 0 for undefined', () => {
      expect(safeParsePrice(undefined)).toBe(0);
    });

    it('should return 0 for NaN', () => {
      expect(safeParsePrice(NaN)).toBe(0);
    });

    it('should return 0 for invalid string', () => {
      expect(safeParsePrice('invalid')).toBe(0);
      expect(safeParsePrice('abc')).toBe(0);
    });

    it('should return 0 for negative numbers', () => {
      expect(safeParsePrice(-10)).toBe(0);
      expect(safeParsePrice(-0.01)).toBe(0);
    });

    it('should return 0 for Infinity', () => {
      expect(safeParsePrice(Infinity)).toBe(0);
      expect(safeParsePrice(-Infinity)).toBe(0);
    });

    it('should parse Decimal correctly', () => {
      const decimal = new Decimal('99.99');
      expect(safeParsePrice(decimal)).toBe(99.99);
    });

    it('should handle objects gracefully', () => {
      expect(safeParsePrice({})).toBe(0);
      expect(safeParsePrice({ price: 100 })).toBe(0);
    });
  });

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
  });
});
