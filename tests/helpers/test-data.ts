import { Session } from 'next-auth';
import { Business, Client, Service, Quote, QuoteItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Test Data Helpers
 * Fournit des données de test réutilisables et cohérentes
 */

// Session utilisateur de test
export const mockSession: Session = {
  user: {
    id: 'user-test-123',
    email: 'test@solkant.com',
    name: 'Test User',
    businessId: 'business-test-123',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Session pour un autre business (tests isolation)
export const mockOtherSession: Session = {
  user: {
    id: 'user-other-456',
    email: 'other@solkant.com',
    name: 'Other User',
    businessId: 'business-other-456',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Business de test
export const mockBusiness: Business = {
  id: 'business-test-123',
  userId: 'user-test-123',
  name: 'Salon Test',
  phone: '0123456789',
  email: 'salon@test.com',
  address: null,
  rue: '1 rue Test',
  codePostal: '75001',
  ville: 'Paris',
  complement: null,
  siret: '12345678901234',
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  logo: null,
  pdfFileNamePrefix: 'DEVIS',
  showInstallmentPayment: false,
  subscriptionStatus: 'TRIAL',
  subscriptionEndsAt: null,
  trialEndsAt: null,
  isPro: false,
  stripePriceId: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Client de test
export const mockClient: Client = {
  id: 'client-test-123',
  businessId: 'business-test-123',
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@test.com',
  phone: '0612345678',
  address: null,
  rue: '10 rue Client',
  codePostal: '75002',
  ville: 'Paris',
  complement: 'Bat A',
  notes: 'Client fidèle',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Service de test
export const mockService: Service = {
  id: 'service-test-123',
  businessId: 'business-test-123',
  name: 'Coupe Cheveux',
  description: 'Coupe classique',
  price: new Decimal(45.0),
  duration: 30,
  category: 'Coiffure',
  isActive: true,
  deletedAt: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Devis de test
export const mockQuote: Quote = {
  id: 'quote-test-123',
  businessId: 'business-test-123',
  clientId: 'client-test-123',
  quoteNumber: 'DEVIS-2025-001',
  status: 'DRAFT',
  validUntil: new Date('2025-12-31'),
  subtotal: new Decimal(45.0),
  discountType: 'FIXED',
  discount: new Decimal(0),
  total: new Decimal(45.0),
  notes: 'Test devis',
  sentAt: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Item de devis de test
export const mockQuoteItem: QuoteItem = {
  id: 'item-test-123',
  quoteId: 'quote-test-123',
  serviceId: 'service-test-123',
  packageId: null,
  name: 'Coupe Cheveux',
  description: 'Coupe classique',
  price: new Decimal(45.0),
  quantity: 1,
  total: new Decimal(45.0),
  packageDiscount: new Decimal(0),
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Helpers pour créer des variations de données
export const createMockClient = (overrides: Partial<Client> = {}): Client => ({
  ...mockClient,
  id: `client-${Date.now()}`,
  ...overrides,
});

export const createMockService = (overrides: Partial<Service> = {}): Service => ({
  ...mockService,
  id: `service-${Date.now()}`,
  ...overrides,
});

export const createMockQuote = (overrides: Partial<Quote> = {}): Quote => ({
  ...mockQuote,
  id: `quote-${Date.now()}`,
  quoteNumber: `DEVIS-2025-${Math.floor(Math.random() * 1000)}`,
  ...overrides,
});
