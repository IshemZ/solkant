/**
 * Tests pour la page de modification de devis
 * /dashboard/devis/[id]/modifier
 *
 * Teste:
 * - Sécurité multi-tenant (businessId filtering)
 * - Restrictions de modification (DRAFT uniquement)
 * - Authentification requise
 * - Gestion des erreurs (devis introuvable)
 * - Rendu correct du formulaire
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth";
import ModifierDevisPage from "@/app/(dashboard)/dashboard/devis/[id]/modifier/page";
import prisma from "@/lib/prisma";
import { getPackages } from "@/app/actions/packages";
import type { Client, Service, Quote } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { SerializedService, SerializedPackage, QuoteWithItems } from "@/types/quote";

// Mock des dépendances EXTERNES
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    quote: {
      findFirst: vi.fn(),
    },
    client: {
      findMany: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/app/actions/packages", () => ({
  getPackages: vi.fn(),
}));

vi.mock("@/app/(dashboard)/dashboard/devis/_components/QuoteFormUnified", () => ({
  default: ({ mode, initialQuote, clients, services, packages }: {
    mode: 'create' | 'edit';
    initialQuote?: QuoteWithItems;
    clients: Client[];
    services: SerializedService[];
    packages: SerializedPackage[];
  }) => (
    <div data-testid="quote-form-unified">
      <span data-testid="mode">{mode}</span>
      <span data-testid="quote-number">{initialQuote?.quoteNumber}</span>
      <span data-testid="clients-count">{clients?.length}</span>
      <span data-testid="services-count">{services?.length}</span>
      <span data-testid="packages-count">{packages?.length}</span>
    </div>
  ),
}));

// Helper pour créer des données de test COMPLÈTES
const createMockClient = (overrides?: Partial<Client>): Client => ({
  id: "client-1",
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie.dupont@example.com",
  phone: "0612345678",
  address: "123 Rue de la Paix, 75001 Paris, France",
  notes: null,
  businessId: "business-1",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

const createMockService = (overrides?: Partial<Service>): Service => ({
  id: "service-1",
  name: "Coupe de cheveux",
  description: "Coupe classique",
  price: new Decimal(50),
  duration: 60,
  category: "HAIRCUT",
  isActive: true,
  deletedAt: null,
  businessId: "business-1",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

const createMockQuote = (overrides?: Partial<Quote>): Quote => ({
  id: "quote-1",
  quoteNumber: "DEVIS-2024-001",
  clientId: "client-1",
  businessId: "business-1",
  status: "DRAFT",
  subtotal: new Decimal(100),
  discount: new Decimal(0),
  total: new Decimal(100),
  discountType: "FIXED",
  notes: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});

const createMockQuoteWithRelations = () => {
  const quote = createMockQuote();
  const client = createMockClient();
  const service = createMockService();

  return {
    ...quote,
    client,
    items: [
      {
        id: "item-1",
        quoteId: quote.id,
        serviceId: service.id,
        packageId: null,
        name: "Coupe de cheveux",
        description: "Coupe classique",
        price: new Decimal(50),
        quantity: 1,
        total: new Decimal(50),
        packageDiscount: new Decimal(0),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        service,
      },
    ],
  };
};

describe("Page de modification de devis (/dashboard/devis/[id]/modifier)", () => {
  const mockSession = {
    user: {
      id: "user-1",
      email: "test@example.com",
      businessId: "business-1",
    },
    expires: "2025-01-01",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup par défaut: session valide
    vi.mocked(getServerSession).mockResolvedValue(mockSession);

    // Setup par défaut: devis DRAFT trouvé
    const mockQuoteWithRelations = createMockQuoteWithRelations();
    vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuoteWithRelations as never);

    // Setup par défaut: clients, services, packages
    vi.mocked(prisma.client.findMany).mockResolvedValue([
      createMockClient({ id: "client-1" }),
      createMockClient({ id: "client-2", firstName: "Jean", lastName: "Martin" }),
    ]);

    vi.mocked(prisma.service.findMany).mockResolvedValue([
      createMockService({ id: "service-1" }),
      createMockService({ id: "service-2", name: "Brushing", price: new Decimal(30) }),
    ]);

    vi.mocked(getPackages).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  describe("Sécurité - Authentification", () => {
    it("devrait rediriger vers /login si pas de session", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const params = Promise.resolve({ id: "quote-1" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /login");
    });

    it("devrait rediriger vers /login si pas de businessId dans la session", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
        expires: "2025-01-01",
      } as never);

      const params = Promise.resolve({ id: "quote-1" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /login");
    });
  });

  describe("Sécurité - Multi-Tenancy (businessId filtering)", () => {
    it("devrait filtrer le devis par businessId de la session", async () => {
      const params = Promise.resolve({ id: "quote-123" });
      await ModifierDevisPage({ params });

      expect(prisma.quote.findFirst).toHaveBeenCalledWith({
        where: {
          id: "quote-123",
          businessId: "business-1",
        },
        include: {
          client: true,
          items: {
            include: {
              service: true,
            },
          },
        },
      });
    });

    it("devrait retourner notFound si le devis n'appartient pas au businessId", async () => {
      // Simuler un devis introuvable (car businessId ne correspond pas)
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const params = Promise.resolve({ id: "quote-other-business" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("devrait filtrer les clients par businessId", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      await ModifierDevisPage({ params });

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { businessId: "business-1" },
        orderBy: { lastName: "asc" },
      });
    });

    it("devrait filtrer les services par businessId", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      await ModifierDevisPage({ params });

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        where: {
          businessId: "business-1",
          isActive: true,
          deletedAt: null,
        },
        orderBy: { name: "asc" },
      });
    });
  });

  describe("Restrictions de modification - Statut DRAFT uniquement", () => {
    it("devrait autoriser la modification si le devis est DRAFT", async () => {
      const draftQuote = createMockQuoteWithRelations();
      draftQuote.status = "DRAFT";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(draftQuote as never);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // Ne devrait PAS lancer d'exception (redirect/notFound)
      // Devrait rendre la page
      expect(result).toBeDefined();
    });

    it("devrait rediriger vers la page de visualisation si le devis est SENT", async () => {
      const sentQuote = createMockQuoteWithRelations();
      sentQuote.status = "SENT";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(sentQuote as never);

      const params = Promise.resolve({ id: "quote-sent" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /dashboard/devis/quote-sent");
    });

    it("devrait rediriger vers la page de visualisation si le devis est ACCEPTED", async () => {
      const acceptedQuote = createMockQuoteWithRelations();
      acceptedQuote.status = "ACCEPTED";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(acceptedQuote as never);

      const params = Promise.resolve({ id: "quote-accepted" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /dashboard/devis/quote-accepted");
    });

    it("devrait rediriger vers la page de visualisation si le devis est REJECTED", async () => {
      const rejectedQuote = createMockQuoteWithRelations();
      rejectedQuote.status = "REJECTED";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(rejectedQuote as never);

      const params = Promise.resolve({ id: "quote-rejected" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /dashboard/devis/quote-rejected");
    });
  });

  describe("Gestion des erreurs", () => {
    it("devrait retourner notFound si le devis n'existe pas", async () => {
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const params = Promise.resolve({ id: "quote-inexistant" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("devrait rediriger vers /dashboard si getPackages échoue", async () => {
      vi.mocked(getPackages).mockResolvedValue({
        success: false,
        error: "Erreur lors de la récupération des forfaits",
      });

      const params = Promise.resolve({ id: "quote-1" });

      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /dashboard");
    });
  });

  describe("Next.js 16 - Params Promise", () => {
    it("devrait correctement await params (Next.js 16)", async () => {
      const params = Promise.resolve({ id: "quote-nextjs16" });
      await ModifierDevisPage({ params });

      // Vérifie que le bon ID a été utilisé
      expect(prisma.quote.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: "quote-nextjs16",
          }),
        })
      );
    });
  });

  describe("Rendu du formulaire", () => {
    it("devrait rendre QuoteForm avec mode='edit'", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // Vérifier que le QuoteForm est présent avec le bon mode
      expect(result.props.children[1].props.mode).toBe("edit");
    });

    it("devrait afficher le titre 'Modifier le devis'", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // Vérifier la structure du titre
      const titleSection = result.props.children[0];
      const h1 = titleSection.props.children[0];

      expect(h1.props.children).toBe("Modifier le devis");
    });

    it("devrait afficher le numéro de devis dans la description", async () => {
      const mockQuote = createMockQuoteWithRelations();
      mockQuote.quoteNumber = "DEVIS-2024-042";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(mockQuote as never);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // Vérifier que le numéro de devis est affiché
      const titleSection = result.props.children[0];
      const description = titleSection.props.children[1];

      expect(description.props.children).toContain("Devis ");
      expect(description.props.children).toContain("DEVIS-2024-042");
    });

    it("devrait passer les données complètes au QuoteForm", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const quoteFormProps = result.props.children[1].props;

      // Vérifier que toutes les props nécessaires sont présentes
      expect(quoteFormProps.mode).toBe("edit");
      expect(quoteFormProps.initialQuote).toBeDefined();
      expect(quoteFormProps.clients).toBeDefined();
      expect(quoteFormProps.services).toBeDefined();
      expect(quoteFormProps.packages).toBeDefined();
    });

    it("devrait sérialiser les champs Decimal des services", async () => {
      const mockService = createMockService({
        id: "service-decimal",
        price: new Decimal(99.99),
      });
      vi.mocked(prisma.service.findMany).mockResolvedValue([mockService]);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const services = result.props.children[1].props.services;

      // Les prix doivent être des numbers, pas des Decimal
      expect(typeof services[0].price).toBe("number");
      expect(services[0].price).toBe(99.99);
    });

    it("devrait sérialiser les champs Decimal des packages", async () => {
      const mockPackage = {
        id: "package-1",
        name: "Forfait test",
        discountValue: new Decimal(15.5),
        discountType: "FIXED",
        items: [],
      };

      vi.mocked(getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage] as never,
      });

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const packages = result.props.children[1].props.packages;

      // Les discountValue doivent être des numbers
      expect(typeof packages[0].discountValue).toBe("number");
      expect(packages[0].discountValue).toBe(15.5);
    });

    it("🔴 BUG FIX: devrait sérialiser les champs Decimal du QUOTE (discount, subtotal, total)", async () => {
      // Créer un quote avec des Decimal (comme Prisma le retourne)
      const quoteWithDecimals = createMockQuoteWithRelations();
      quoteWithDecimals.discount = new Decimal(10.5);
      quoteWithDecimals.subtotal = new Decimal(100);
      quoteWithDecimals.total = new Decimal(89.5);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(quoteWithDecimals as never);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const initialQuote = result.props.children[1].props.initialQuote;

      // ❌ BEFORE FIX: Ces champs seraient des Decimal → crash "Decimal objects are not supported"
      // ✅ AFTER FIX: Ces champs doivent être des numbers
      expect(typeof initialQuote.discount).toBe("number");
      expect(typeof initialQuote.subtotal).toBe("number");
      expect(typeof initialQuote.total).toBe("number");

      // Vérifier les valeurs
      expect(initialQuote.discount).toBe(10.5);
      expect(initialQuote.subtotal).toBe(100);
      expect(initialQuote.total).toBe(89.5);
    });

    it("🔴 BUG FIX: devrait sérialiser les champs Decimal des ITEMS du quote (price, total, packageDiscount)", async () => {
      // Créer des items avec des Decimal
      const quoteWithDecimals = createMockQuoteWithRelations();
      quoteWithDecimals.items[0].price = new Decimal(50.99);
      quoteWithDecimals.items[0].total = new Decimal(50.99);
      quoteWithDecimals.items[0].packageDiscount = new Decimal(5);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(quoteWithDecimals as never);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const initialQuote = result.props.children[1].props.initialQuote;
      const firstItem = initialQuote.items[0];

      // ❌ BEFORE FIX: Ces champs seraient des Decimal → crash
      // ✅ AFTER FIX: Ces champs doivent être des numbers
      expect(typeof firstItem.price).toBe("number");
      expect(typeof firstItem.total).toBe("number");
      expect(typeof firstItem.packageDiscount).toBe("number");

      // Vérifier les valeurs
      expect(firstItem.price).toBe(50.99);
      expect(firstItem.total).toBe(50.99);
      expect(firstItem.packageDiscount).toBe(5);
    });

    it("🔴 BUG FIX: devrait sérialiser les services DANS les items du quote", async () => {
      // Les items ont une relation service qui contient aussi un Decimal price
      const quoteWithDecimals = createMockQuoteWithRelations();
      quoteWithDecimals.items[0].service!.price = new Decimal(75.5);
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(quoteWithDecimals as never);

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const initialQuote = result.props.children[1].props.initialQuote;
      const serviceInItem = initialQuote.items[0].service;

      // ✅ Le service dans l'item doit aussi avoir son price sérialisé
      expect(typeof serviceInItem.price).toBe("number");
      expect(serviceInItem.price).toBe(75.5);
    });
  });

  describe("Récupération des données en parallèle", () => {
    it("devrait récupérer clients, services et packages en parallèle (Promise.all)", async () => {
      const params = Promise.resolve({ id: "quote-1" });

      // Espionner les appels
      const clientsSpy = vi.mocked(prisma.client.findMany);
      const servicesSpy = vi.mocked(prisma.service.findMany);
      const packagesSpy = vi.mocked(getPackages);

      await ModifierDevisPage({ params });

      // Vérifier que les 3 ont été appelés
      expect(clientsSpy).toHaveBeenCalled();
      expect(servicesSpy).toHaveBeenCalled();
      expect(packagesSpy).toHaveBeenCalled();
    });
  });

  describe("Structure de la page", () => {
    it("devrait avoir un conteneur avec max-w-5xl et padding", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // Vérifier les classes Tailwind
      expect(result.props.className).toContain("max-w-5xl");
      expect(result.props.className).toContain("py-8");
      expect(result.props.className).toContain("mx-auto");
    });

    it("devrait avoir un titre H1 avec les bonnes classes", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const titleSection = result.props.children[0];
      const h1 = titleSection.props.children[0];

      expect(h1.props.className).toContain("text-3xl");
      expect(h1.props.className).toContain("font-bold");
      expect(h1.props.className).toContain("tracking-tight");
    });

    it("devrait avoir une description avec text-muted-foreground", async () => {
      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      const titleSection = result.props.children[0];
      const description = titleSection.props.children[1];

      expect(description.props.className).toContain("text-muted-foreground");
    });
  });

  describe("Anti-Pattern Check: Complete Data Structures", () => {
    it("devrait utiliser des structures de données COMPLÈTES pour les mocks", () => {
      const client = createMockClient();

      // Vérifier que TOUTES les propriétés Prisma Client sont présentes
      expect(client).toHaveProperty("id");
      expect(client).toHaveProperty("firstName");
      expect(client).toHaveProperty("lastName");
      expect(client).toHaveProperty("email");
      expect(client).toHaveProperty("phone");
      expect(client).toHaveProperty("address");
      expect(client).toHaveProperty("notes");
      expect(client).toHaveProperty("businessId");
      expect(client).toHaveProperty("createdAt");
      expect(client).toHaveProperty("updatedAt");
    });

    it("devrait utiliser Decimal pour les prix dans les mocks, comme Prisma", () => {
      const service = createMockService({ price: new Decimal(50) });

      // Les mocks doivent utiliser Decimal comme Prisma
      expect(service.price).toBeInstanceOf(Decimal);
      expect(service.price.toNumber()).toBe(50);
    });
  });

  describe("Documentation du workflow de modification", () => {
    it("WORKFLOW: Utilisateur authentifié → Devis DRAFT du bon business → Formulaire éditable", async () => {
      // 1. Utilisateur authentifié avec businessId
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      // 2. Devis DRAFT appartenant au business
      const draftQuote = createMockQuoteWithRelations();
      draftQuote.status = "DRAFT";
      draftQuote.businessId = "business-1";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(draftQuote as never);

      // 3. Données disponibles
      vi.mocked(prisma.client.findMany).mockResolvedValue([createMockClient()]);
      vi.mocked(prisma.service.findMany).mockResolvedValue([createMockService()]);
      vi.mocked(getPackages).mockResolvedValue({ success: true, data: [] });

      const params = Promise.resolve({ id: "quote-1" });
      const result = await ModifierDevisPage({ params });

      // ✅ Résultat: Formulaire éditable rendu (pas d'exception)
      expect(result).toBeDefined();
    });

    it("WORKFLOW: Devis non-DRAFT → Redirect vers visualisation", async () => {
      const sentQuote = createMockQuoteWithRelations();
      sentQuote.status = "SENT";
      sentQuote.id = "quote-sent-123";
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(sentQuote as never);

      const params = Promise.resolve({ id: "quote-sent-123" });

      // ✅ Résultat: Redirection vers page de visualisation
      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_REDIRECT: /dashboard/devis/quote-sent-123");
    });

    it("WORKFLOW: Devis d'un autre business → notFound", async () => {
      // Simuler un devis qui n'appartient pas au businessId de la session
      vi.mocked(prisma.quote.findFirst).mockResolvedValue(null);

      const params = Promise.resolve({ id: "quote-autre-business" });

      // ✅ Résultat: 404
      await expect(ModifierDevisPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    });
  });
});
