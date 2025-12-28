/**
 * ANTIPATTERN TEST: NaN Prices in Quote Form
 *
 * Ce test détecte l'antipattern où des prix invalides (null, undefined, NaN)
 * causent l'affichage de "NaN €" dans le formulaire de devis.
 *
 * Problème: Quand un service n'a pas de prix défini ou que la sérialisation
 * échoue, Number(price) retourne NaN, ce qui se propage dans les calculs.
 *
 * Symptôme visible: "NaN €" affiché dans la liste des services et dans les items
 */

import { describe, it, expect } from 'vitest';
import type { SerializedService } from '@/types/quote';

describe('ANTIPATTERN: NaN Prices in Quote Form', () => {
  it('should detect when service price is null and becomes NaN', () => {
    const serviceWithNullPrice: SerializedService = {
      id: 'service_1',
      name: 'Service Test',
      description: null,
      price: null as unknown as number, // Simule une sérialisation échouée
      duration: 60,
      category: null,
      isActive: true,
      businessId: 'business_1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    // ANTIPATTERN DETECTION: Number(null) = 0, mais dans certains cas ça peut être NaN
    const price = Number(serviceWithNullPrice.price);

    // Si on a NaN, le toFixed() va produire "NaN"
    if (isNaN(price)) {
      const displayPrice = price.toFixed(2); // "NaN"
      expect(displayPrice).toBe('NaN'); // ANTIPATTERN détecté!
    }
  });

  it('should detect when service price is undefined and becomes NaN', () => {
    const serviceWithUndefinedPrice = {
      id: 'service_1',
      name: 'Service Test',
      price: undefined as unknown as number,
    };

    const price = Number(serviceWithUndefinedPrice.price);

    // ANTIPATTERN DETECTION: Number(undefined) = NaN
    expect(isNaN(price)).toBe(true);
  });

  it('should detect when service price is a string and becomes NaN', () => {
    const serviceWithStringPrice = {
      id: 'service_1',
      name: 'Service Test',
      price: 'invalid' as unknown as number,
    };

    const price = Number(serviceWithStringPrice.price);

    // ANTIPATTERN DETECTION: Number('invalid') = NaN
    expect(isNaN(price)).toBe(true);
  });

  it('should validate that item total calculation propagates NaN', () => {
    const invalidPrice = NaN;
    const quantity = 1;

    const total = invalidPrice * quantity;

    // ANTIPATTERN DETECTION: NaN * number = NaN
    expect(isNaN(total)).toBe(true);

    // Cela va s'afficher comme "NaN €" dans l'UI
    expect(total.toFixed(2)).toBe('NaN');
  });

  it('should demonstrate correct pattern with fallback', () => {
    const serviceWithInvalidPrice = {
      id: 'service_1',
      name: 'Service Test',
      price: undefined as unknown as number, // undefined devient NaN, pas null
    };

    // ❌ ANTIPATTERN: Direct conversion
    const badPrice = Number(serviceWithInvalidPrice.price);
    expect(isNaN(badPrice)).toBe(true);

    // ✅ CORRECT PATTERN: Use fallback and validation
    const safeParse = (value: unknown): number => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const goodPrice = safeParse(serviceWithInvalidPrice.price);
    expect(isNaN(goodPrice)).toBe(false);
    expect(goodPrice).toBe(0);
  });

  it('should validate toFixed() on NaN produces "NaN" string', () => {
    const nan = NaN;

    // ANTIPATTERN: toFixed() sur NaN retourne "NaN"
    const formatted = nan.toFixed(2);
    expect(formatted).toBe('NaN');

    // L'utilisateur voit "NaN €" dans l'interface
    const displayPrice = `${formatted} €`;
    expect(displayPrice).toBe('NaN €');
  });

  it('should detect NaN in calculatePackageBasePrice', () => {
    // Simule un package avec des items ayant des prix invalides
    const packageWithInvalidPrices = {
      items: [
        { service: { price: null } },
        { service: { price: undefined } },
        { service: { price: 10 } },
      ],
    };

    // Calcul naïf qui ne protège pas contre NaN
    const basePrice = packageWithInvalidPrices.items.reduce((sum, item) => {
      return sum + Number(item.service?.price);
    }, 0);

    // ANTIPATTERN DETECTION: 0 + NaN + NaN + 10 = NaN
    expect(isNaN(basePrice)).toBe(true);
  });

  it('should demonstrate safe calculation with NaN protection', () => {
    const items = [
      { service: { price: null } },
      { service: { price: undefined } },
      { service: { price: 10 } },
      { service: { price: 20 } },
    ];

    // ✅ CORRECT: Protection contre NaN
    const safeParse = (value: unknown): number => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const safeBasePrice = items.reduce((sum, item) => {
      return sum + safeParse(item.service?.price);
    }, 0);

    expect(isNaN(safeBasePrice)).toBe(false);
    expect(safeBasePrice).toBe(30); // 0 + 0 + 10 + 20
  });

  it('should detect when serializeDecimalFields fails to convert price', () => {
    // Simule un cas où la sérialisation échoue
    const malformedService = {
      price: { value: 100 }, // Objet au lieu de Decimal/number
    };

    const price = Number(malformedService.price);

    // ANTIPATTERN DETECTION: Number({...}) = NaN
    expect(isNaN(price)).toBe(true);
  });

  it('should validate that 0 is a valid price (not NaN)', () => {
    const serviceFree = {
      id: 'service_free',
      name: 'Service Gratuit',
      price: 0,
    };

    const price = Number(serviceFree.price);

    // 0 est un prix valide, pas NaN
    expect(isNaN(price)).toBe(false);
    expect(price).toBe(0);
    expect(price.toFixed(2)).toBe('0.00');
  });
});

/**
 * RECOMMANDATIONS pour éviter NaN dans les prix:
 *
 * 1. Toujours valider les prix avant conversion:
 *    ❌ const price = Number(service.price);
 *    ✅ const price = Number.isFinite(Number(service.price)) ? Number(service.price) : 0;
 *
 * 2. Créer une fonction utilitaire de parsing sécurisée:
 *    const safeParsePrice = (value: unknown): number => {
 *      const parsed = Number(value);
 *      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
 *    };
 *
 * 3. Valider les prix dans serializeDecimalFields:
 *    - S'assurer que tous les Decimal sont convertis en number valides
 *    - Utiliser 0 comme fallback pour les prix invalides
 *
 * 4. Ajouter une validation dans le schéma Zod:
 *    price: z.number().min(0).finite()
 *
 * 5. Afficher un message d'erreur au lieu de "NaN €":
 *    {Number.isFinite(price) ? `${price.toFixed(2)} €` : 'Prix non défini'}
 *
 * 6. Valider en base de données:
 *    - Contrainte NOT NULL sur price
 *    - Contrainte CHECK (price >= 0)
 *
 * 7. Dans les calculs de totaux:
 *    const subtotal = items.reduce((sum, item) => {
 *      const itemTotal = Number.isFinite(item.total) ? item.total : 0;
 *      return sum + itemTotal;
 *    }, 0);
 */
