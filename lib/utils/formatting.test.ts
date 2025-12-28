/**
 * Tests pour les utilitaires de formatage
 *
 * Exemple de tests utils avec locale française
 */

import { describe, it, expect } from 'vitest';

/**
 * Fonctions utilitaires à tester (exemples)
 * À adapter selon vos utils réels
 */

// Exemple 1: Formatage prix français
function formatPrice(price: number): string {
  // Arrondir correctement avant toFixed pour éviter les problèmes de précision
  const rounded = Math.round(price * 100) / 100;
  return `${rounded.toFixed(2).replace('.', ',')} €`;
}

// Exemple 2: Formatage date française
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR');
}

// Exemple 3: Formatage téléphone français
function formatPhone(phone: string): string {
  // 0612345678 → 06 12 34 56 78
  return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
}

describe('Formatting Utils', () => {
  describe('formatPrice', () => {
    it('should format with French locale (comma + space + euro)', () => {
      expect(formatPrice(99.99)).toBe('99,99 €');
      expect(formatPrice(1000.5)).toBe('1000,50 €');
      expect(formatPrice(0)).toBe('0,00 €');
    });

    it('should handle decimals correctly', () => {
      expect(formatPrice(10.5)).toBe('10,50 €');
      expect(formatPrice(10.555)).toBe('10,56 €'); // Arrondi
    });
  });

  describe('formatDate', () => {
    it('should format with fr-FR locale', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('15/01/2025');
    });

    it('should handle different dates', () => {
      expect(formatDate(new Date('2025-12-31'))).toBe('31/12/2025');
      expect(formatDate(new Date('2025-06-01'))).toBe('01/06/2025');
    });
  });

  describe('formatPhone', () => {
    it('should format French phone numbers', () => {
      expect(formatPhone('0612345678')).toBe('06 12 34 56 78');
      expect(formatPhone('0123456789')).toBe('01 23 45 67 89');
    });

    it('should handle already formatted numbers', () => {
      const formatted = formatPhone('0612345678').trim();
      expect(formatted).toContain(' ');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      expect(formatPrice(0)).toBe('0,00 €');
    });

    it('should handle very large numbers', () => {
      expect(formatPrice(999999.99)).toBe('999999,99 €');
    });

    it('should handle negative prices', () => {
      expect(formatPrice(-10.50)).toBe('-10,50 €');
    });
  });
});
