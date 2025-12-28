/**
 * Tests pour la validation Zod des clients
 *
 * Exemple de tests pour schémas Zod
 */

import { describe, it, expect } from 'vitest';
import { createClientSchema, updateClientSchema } from './index';

describe('Client Validation Schemas', () => {
  describe('createClientSchema', () => {
    it('should validate correct client data', () => {
      const validData = {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@test.com',
        phone: '0612345678',
        rue: '10 rue Test',
        codePostal: '75001',
        ville: 'Paris',
      };

      const result = createClientSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('Marie');
        expect(result.data.email).toBe('marie.dupont@test.com');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'invalid-email', // ❌ Email invalide
      };

      const result = createClientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        firstName: 'Marie',
        // lastName manquant
      };

      const result = createClientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('lastName'))).toBe(true);
      }
    });

    it('should accept optional fields as undefined', () => {
      const validData = {
        firstName: 'Marie',
        lastName: 'Dupont',
        // phone, email, etc. sont optionnels
      };

      const result = createClientSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should trim whitespace from strings', () => {
      const dataWithSpaces = {
        firstName: '  Marie  ',
        lastName: '  Dupont  ',
        email: '  test@test.com  ',
      };

      const result = createClientSchema.safeParse(dataWithSpaces);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('Marie');
        expect(result.data.lastName).toBe('Dupont');
        expect(result.data.email).toBe('test@test.com');
      }
    });

    it('should validate French phone numbers', () => {
      const validPhones = [
        '0612345678',
        '01 23 45 67 89',
        '06-12-34-56-78',
      ];

      validPhones.forEach(phone => {
        const result = createClientSchema.safeParse({
          firstName: 'Test',
          lastName: 'User',
          phone,
        });

        expect(result.success).toBe(true);
      });
    });

    it('should validate French postal codes', () => {
      const validPostalCodes = ['75001', '13000', '69001'];

      validPostalCodes.forEach(codePostal => {
        const result = createClientSchema.safeParse({
          firstName: 'Test',
          lastName: 'User',
          codePostal,
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe('updateClientSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        phone: '0699999999', // Seulement le téléphone
      };

      const result = updateClientSchema.safeParse(partialData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('0699999999');
      }
    });

    it('should allow empty update', () => {
      const emptyData = {};

      const result = updateClientSchema.safeParse(emptyData);

      expect(result.success).toBe(true);
    });

    it('should validate fields when provided', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const result = updateClientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(i => i.path.includes('email'));
        expect(emailError).toBeDefined();
      }
    });
  });

  describe('Security - XSS Prevention', () => {
    it('should accept data that will be sanitized by action wrapper', () => {
      // Note: La sanitisation XSS est faite par action-wrapper, pas par Zod
      // Zod valide seulement le format
      const dataWithHTML = {
        firstName: '<script>alert("XSS")</script>',
        lastName: 'Dupont',
      };

      const result = createClientSchema.safeParse(dataWithHTML);

      // Zod laisse passer (sanitisation faite après)
      expect(result.success).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should provide field-specific error messages', () => {
      const invalidData = {
        firstName: '',
        email: 'invalid',
        phone: 'abc',
      };

      const result = createClientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.issues.map(i => i.path[0]);
        expect(errorPaths).toContain('firstName');
        expect(errorPaths).toContain('email');
      }
    });
  });
});
