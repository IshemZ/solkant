/**
 * ANTIPATTERN TEST: NaN in Input Attributes
 *
 * Ce test détecte l'antipattern où des valeurs NaN sont passées
 * aux attributs HTML des inputs (min, max, step, value).
 *
 * Problème: React affiche un warning:
 * "Received NaN for the `max` attribute. If this is expected, cast the value to a string."
 *
 * Cause commune: Calculs qui retournent NaN au chargement initial ou quand
 * les données ne sont pas encore disponibles.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DiscountField from '@/components/shared/DiscountField';

describe('ANTIPATTERN: NaN in Input Attributes', () => {
  it('should NOT pass NaN to max attribute when subtotal is NaN', () => {
    // Simulate initial load state where subtotal might be NaN
    const subtotalNaN = NaN;

    const { container } = render(
      <DiscountField
        value={0}
        type="FIXED"
        subtotal={subtotalNaN}
        onChange={() => {}}
      />
    );

    // Get the input element
    const input = container.querySelector('input[type="number"]') as HTMLInputElement;

    // ANTIPATTERN DETECTION: max attribute should never be NaN
    const maxAttr = input.getAttribute('max');

    // If max is set, it should be a valid number string
    if (maxAttr !== null) {
      expect(maxAttr).not.toBe('NaN');
      expect(isNaN(Number(maxAttr))).toBe(false);
    }
  });

  it('should NOT pass NaN to max attribute when subtotal is undefined', () => {
    const subtotalUndefined = undefined as unknown as number;

    const { container } = render(
      <DiscountField
        value={0}
        type="FIXED"
        subtotal={subtotalUndefined}
        onChange={() => {}}
      />
    );

    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    const maxAttr = input.getAttribute('max');

    if (maxAttr !== null) {
      expect(maxAttr).not.toBe('NaN');
      expect(isNaN(Number(maxAttr))).toBe(false);
    }
  });

  it('should handle 0 subtotal correctly', () => {
    const { container } = render(
      <DiscountField
        value={0}
        type="FIXED"
        subtotal={0}
        onChange={() => {}}
      />
    );

    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    const maxAttr = input.getAttribute('max');

    // 0 is a valid max value
    expect(maxAttr).toBe('0');
  });

  it('should handle negative subtotal gracefully', () => {
    const { container } = render(
      <DiscountField
        value={0}
        type="FIXED"
        subtotal={-100}
        onChange={() => {}}
      />
    );

    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    const maxAttr = input.getAttribute('max');

    if (maxAttr !== null) {
      expect(isNaN(Number(maxAttr))).toBe(false);
    }
  });

  it('should use 100 as max for PERCENTAGE type (never NaN)', () => {
    const { container } = render(
      <DiscountField
        value={0}
        type="PERCENTAGE"
        subtotal={NaN} // Even with NaN subtotal, PERCENTAGE should use 100
        onChange={() => {}}
      />
    );

    const input = container.querySelector('input[type="number"]') as HTMLInputElement;
    const maxAttr = input.getAttribute('max');

    expect(maxAttr).toBe('100');
    expect(isNaN(Number(maxAttr))).toBe(false);
  });

  it('should detect NaN in price input calculations', () => {
    // Simulate a scenario where parseFloat returns NaN
    const invalidPriceInput = '';
    const parsedPrice = parseFloat(invalidPriceInput);

    // ANTIPATTERN DETECTION: parseFloat('') returns NaN
    expect(isNaN(parsedPrice)).toBe(true);

    // Correct pattern: use fallback
    const safeParsedPrice = parseFloat(invalidPriceInput) || 0;
    expect(isNaN(safeParsedPrice)).toBe(false);
    expect(safeParsedPrice).toBe(0);
  });

  it('should detect NaN in quantity input calculations', () => {
    // Simulate a scenario where parseInt returns NaN
    const invalidQuantityInput = '';
    const parsedQuantity = parseInt(invalidQuantityInput);

    // ANTIPATTERN DETECTION: parseInt('') returns NaN
    expect(isNaN(parsedQuantity)).toBe(true);

    // Correct pattern: use fallback
    const safeParsedQuantity = parseInt(invalidQuantityInput) || 1;
    expect(isNaN(safeParsedQuantity)).toBe(false);
    expect(safeParsedQuantity).toBe(1);
  });

  it('should detect Float arithmetic that produces NaN', () => {
    // Common scenarios that produce NaN
    const scenarios = [
      { calc: 0 / 0, desc: '0 / 0' },
      { calc: Infinity - Infinity, desc: 'Infinity - Infinity' },
      { calc: Math.sqrt(-1), desc: 'sqrt(-1)' },
      { calc: parseFloat('abc'), desc: 'parseFloat(invalid)' },
      { calc: Number(undefined), desc: 'Number(undefined)' },
    ];

    scenarios.forEach(({ calc, desc }) => {
      // ANTIPATTERN DETECTION: These calculations produce NaN
      expect(isNaN(calc)).toBe(true);

      // Log for debugging
      console.warn(`NaN detected in: ${desc} = ${calc}`);
    });
  });

  it('should validate that calculated totals are never NaN', () => {
    // Example from quote calculations
    const items = [
      { price: 10, quantity: 2, total: 20 },
      { price: 15, quantity: 1, total: 15 },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    // Total should NEVER be NaN
    expect(isNaN(subtotal)).toBe(false);
    expect(subtotal).toBe(35);
  });

  it('should validate that discount calculations never produce NaN', () => {
    const subtotal = 100;
    const discountPercentage = 20;

    // PERCENTAGE discount
    const discountAmount = subtotal * (discountPercentage / 100);
    expect(isNaN(discountAmount)).toBe(false);
    expect(discountAmount).toBe(20);

    // FIXED discount
    const fixedDiscount = 15;
    const total = subtotal - fixedDiscount;
    expect(isNaN(total)).toBe(false);
    expect(total).toBe(85);
  });
});

/**
 * RECOMMANDATIONS pour éviter NaN dans les inputs:
 *
 * 1. Toujours utiliser des fallbacks avec parseFloat/parseInt:
 *    ❌ parseFloat(value)
 *    ✅ parseFloat(value) || 0
 *
 * 2. Valider les attributs calculés avant de les passer aux inputs:
 *    ❌ max={subtotal}
 *    ✅ max={isNaN(subtotal) ? undefined : subtotal}
 *
 * 3. Initialiser les états avec des valeurs valides:
 *    ❌ const [subtotal, setSubtotal] = useState<number>();
 *    ✅ const [subtotal, setSubtotal] = useState<number>(0);
 *
 * 4. Utiliser Number.isFinite() pour valider les calculs:
 *    const result = calculation();
 *    if (!Number.isFinite(result)) {
 *      console.error('Invalid calculation result:', result);
 *      return 0;
 *    }
 *
 * 5. Éviter les divisions par zéro:
 *    ❌ const ratio = a / b;
 *    ✅ const ratio = b !== 0 ? a / b : 0;
 */
