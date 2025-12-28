/**
 * Tests pour les Server Actions Service
 *
 * Exemple de structure de colocation pour les tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getServerSession } from 'next-auth';

// IMPORTANT: Mocks doivent être déclarés AVANT les imports qui en dépendent
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    service: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Import des actions
import { getServices, createService, updateService, deleteService } from './services';
import { revalidatePath } from 'next/cache';

// Import des mocks
import prisma from '@/lib/prisma';
import { createMockService } from '@/tests/helpers/test-data';

describe('Service Actions', () => {
  const mockSession = {
    user: {
      id: 'user-test-123',
      businessId: 'biz-123',
      email: 'test@solkant.com',
      name: 'Test User',
    },
  };

  const mockUser = {
    id: 'user-test-123',
    email: 'test@solkant.com',
    emailVerified: new Date('2025-01-01'),
    name: 'Test User',
    password: null,
    image: null,
    verificationToken: null,
    tokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
  });

  describe('getServices', () => {
    it('should return active services for business', async () => {
      // ARRANGE
      const mockServices = [
        createMockService({ businessId: 'biz-123', isActive: true }),
        createMockService({ businessId: 'biz-123', isActive: true }),
      ];

      vi.mocked(prisma.service.findMany).mockResolvedValue(mockServices);

      // ACT
      const result = await getServices();

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        where: {
          businessId: 'biz-123',
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should NOT return services from another business', async () => {
      // ARRANGE
      vi.mocked(prisma.service.findMany).mockResolvedValue([]);

      // ACT
      const result = await getServices();

      // ASSERT
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });
  });

  describe('createService', () => {
    it('should create service with businessId', async () => {
      // ARRANGE
      const input = {
        name: 'Coupe Cheveux',
        description: 'Coupe classique',
        price: 45,
        duration: 30,
        category: 'Coiffure',
      };

      const created = createMockService({
        ...input,
        businessId: 'biz-123',
      });

      vi.mocked(prisma.service.create).mockResolvedValue(created);

      // ACT
      const result = await createService(input);

      // ASSERT
      expect(result.success).toBe(true);
      expect(prisma.service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'biz-123',
          }),
        })
      );

      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/services');
    });

    it('should reject negative price', async () => {
      // ARRANGE
      const invalidInput = {
        name: 'Test',
        price: -10, // Prix invalide
      };

      // ACT
      const result = await createService(invalidInput as any);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors?.price).toBeDefined();
      }
    });
  });

  describe('deleteService (Soft Delete)', () => {
    it('should soft delete service', async () => {
      // ARRANGE
      const serviceId = 'service-123';

      const service = createMockService({
        id: serviceId,
        businessId: 'biz-123',
      });

      const deletedService = createMockService({
        id: serviceId,
        businessId: 'biz-123',
        deletedAt: new Date(),
      });

      // Mock findFirst pour vérifier que le service existe
      vi.mocked(prisma.service.findFirst).mockResolvedValue(service);
      vi.mocked(prisma.service.update).mockResolvedValue(deletedService);

      // ACT
      const result = await deleteService({ id: serviceId });

      // ASSERT
      expect(result.success).toBe(true);
      expect(prisma.service.findFirst).toHaveBeenCalledWith({
        where: {
          id: serviceId,
          businessId: 'biz-123',
        },
        select: expect.any(Object),
      });
      expect(prisma.service.update).toHaveBeenCalledWith({
        where: {
          id: serviceId,
          businessId: 'biz-123',
        },
        data: {
          isActive: false,
          deletedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Multi-Tenant Isolation', () => {
    it('should filter by businessId on all queries', async () => {
      // ARRANGE
      vi.mocked(prisma.service.findMany).mockResolvedValue([]);

      // ACT
      await getServices();

      // ASSERT
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            businessId: 'biz-123',
          }),
        })
      );
    });
  });
});
