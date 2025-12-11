/**
 * Helper pour mocker les dépendances communes aux Server Actions
 *
 * Depuis l'ajout de validateSessionWithEmail(), tous les Server Actions
 * appellent prisma.user.findUnique() pour vérifier emailVerified.
 * Ce helper centralise tous les mocks nécessaires.
 */

import { vi } from "vitest";
import type { Session } from "next-auth";

/**
 * Mock d'un utilisateur avec email vérifié (comportement par défaut)
 */
export const mockVerifiedUser = {
  id: "user_123",
  email: "test@example.com",
  emailVerified: new Date("2024-01-01"),
  name: "Test User",
  password: null,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock d'un utilisateur avec email NON vérifié
 */
export const mockUnverifiedUser = {
  ...mockVerifiedUser,
  emailVerified: null,
};

/**
 * Mock de session avec businessId
 */
export const mockSessionWithBusiness = {
  user: {
    id: "user_123",
    businessId: "business_123",
    email: "test@example.com",
    name: "Test User",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
} as Session;

/**
 * Mock de session sans businessId (cas rare/erreur)
 */
export const mockSessionWithoutBusiness = {
  user: {
    id: "user_123",
    email: "test@example.com",
    name: "Test User",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
} as Session;

/**
 * Setup les mocks NextAuth + Prisma pour un utilisateur avec email vérifié
 *
 * @param getServerSession - Mock function de getServerSession
 * @param prismaUserFindUnique - Mock function de prisma.user.findUnique
 * @param session - Session à retourner (par défaut: mockSessionWithBusiness)
 * @param user - User à retourner (par défaut: mockVerifiedUser)
 */
export function setupVerifiedUserMocks(
  getServerSession: ReturnType<typeof vi.fn>,
  prismaUserFindUnique: ReturnType<typeof vi.fn>,
  session: Session = mockSessionWithBusiness,
  user = mockVerifiedUser
) {
  getServerSession.mockResolvedValue(session);
  prismaUserFindUnique.mockResolvedValue(user);
}

/**
 * Setup les mocks pour un utilisateur avec email NON vérifié
 */
export function setupUnverifiedUserMocks(
  getServerSession: ReturnType<typeof vi.fn>,
  prismaUserFindUnique: ReturnType<typeof vi.fn>,
  session: Session = mockSessionWithBusiness
) {
  getServerSession.mockResolvedValue(session);
  prismaUserFindUnique.mockResolvedValue(mockUnverifiedUser);
}

/**
 * Setup les mocks pour une session sans businessId (cas d'erreur)
 */
export function setupNoBusinessMocks(
  getServerSession: ReturnType<typeof vi.fn>,
  prismaUserFindUnique: ReturnType<typeof vi.fn>
) {
  getServerSession.mockResolvedValue(mockSessionWithoutBusiness);
  prismaUserFindUnique.mockResolvedValue({
    ...mockVerifiedUser,
    business: null,
  });
}

/**
 * Setup les mocks pour une session non authentifiée
 */
export function setupUnauthenticatedMocks(
  getServerSession: ReturnType<typeof vi.fn>
) {
  getServerSession.mockResolvedValue(null);
}
