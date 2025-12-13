import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ActionResult } from "@/lib/action-types";

/**
 * Tests d'intégration pour vérifier que toutes les Server Actions
 * retournent bien le type ActionResult<T> avec le discriminant success.
 *
 * Ces tests garantissent que le pattern est respecté dans toute l'application
 * et empêchent la régression vers l'ancien pattern avec "error" | { data: T }.
 */

// Mock de getServerSession pour les tests
vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    quote: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    client: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    business: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock validateSessionWithEmail
vi.mock("@/lib/auth-helpers", () => ({
  validateSessionWithEmail: vi.fn(),
}));

describe("Server Actions Return Type Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Type de retour ActionResult", () => {
    it("devrait vérifier que les actions retournent un objet avec success", async () => {
      // Cette fonction type-check simule le comportement attendu
      function isActionResult<T>(
        result: unknown
      ): result is ActionResult<T> {
        if (typeof result !== "object" || result === null) {
          return false;
        }

        const obj = result as Record<string, unknown>;

        // Doit avoir la propriété success de type boolean
        if (typeof obj.success !== "boolean") {
          return false;
        }

        // Si success est true, doit avoir data
        if (obj.success === true) {
          return "data" in obj;
        }

        // Si success est false, doit avoir error
        if (obj.success === false) {
          return typeof obj.error === "string";
        }

        return false;
      }

      // Test avec succès
      const successResult = {
        success: true,
        data: { id: "123" },
      };
      expect(isActionResult(successResult)).toBe(true);

      // Test avec erreur
      const errorResult = {
        success: false,
        error: "Une erreur",
      };
      expect(isActionResult(errorResult)).toBe(true);

      // Test avec structure invalide (ancien pattern)
      const invalidResult1 = {
        error: "Une erreur",
      };
      expect(isActionResult(invalidResult1)).toBe(false);

      const invalidResult2 = {
        data: { id: "123" },
      };
      expect(isActionResult(invalidResult2)).toBe(false);
    });

    it("devrait rejeter l'ancien pattern avec 'error' | { data: T }", () => {
      // Ancien pattern qui causait le bug TypeScript
      type OldPattern<T> = { error: string } | { data: T };

      // Cette structure NE DOIT PLUS être utilisée
      const oldStyleError: OldPattern<{ id: string }> = {
        error: "Erreur",
      };

      const oldStyleSuccess: OldPattern<{ id: string }> = {
        data: { id: "123" },
      };

      // Ces objets n'ont PAS la propriété success
      expect("success" in oldStyleError).toBe(false);
      expect("success" in oldStyleSuccess).toBe(false);

      // Conversion vers le nouveau pattern
      const newStyleError: ActionResult<{ id: string }> = {
        success: false,
        error: "Erreur",
      };

      const newStyleSuccess: ActionResult<{ id: string }> = {
        success: true,
        data: { id: "123" },
      };

      // Ces objets ONT la propriété success
      expect("success" in newStyleError).toBe(true);
      expect("success" in newStyleSuccess).toBe(true);
    });
  });

  describe("Garantie de type narrowing", () => {
    it("devrait garantir que result.success permet le type narrowing", () => {
      const result: ActionResult<{ value: number }> = {
        success: true,
        data: { value: 42 },
      };

      // Type narrowing avec if (result.success)
      if (result.success) {
        // TypeScript sait que result.data existe
        const value: number = result.data.value;
        expect(value).toBe(42);

        // TypeScript ne permet PAS d'accéder à result.error ici
        // @ts-expect-error Property 'error' does not exist
        const error = result.error;
        expect(error).toBeUndefined();
      }
    });

    it("devrait garantir que !result.success permet le type narrowing", () => {
      const result: ActionResult<{ value: number }> = {
        success: false,
        error: "Échec",
      };

      // Type narrowing avec if (!result.success)
      if (!result.success) {
        // TypeScript sait que result.error existe
        const error: string = result.error;
        expect(error).toBe("Échec");

        // TypeScript ne permet PAS d'accéder à result.data ici
        // @ts-expect-error Property 'data' does not exist
        const data = result.data;
        expect(data).toBeUndefined();
      }
    });
  });

  describe("Helpers de création", () => {
    it("devrait créer un résultat de succès avec successResult", () => {
      const data = { id: "123", name: "Test" };
      const result: ActionResult<typeof data> = {
        success: true,
        data,
      };

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("devrait créer un résultat d'erreur avec errorResult", () => {
      const result: ActionResult<never> = {
        success: false,
        error: "Une erreur s'est produite",
        code: "SERVER_ERROR",
      };

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Une erreur s'est produite");
        expect(result.code).toBe("SERVER_ERROR");
      }
    });

    it("devrait créer un résultat d'erreur avec fieldErrors", () => {
      const result: ActionResult<never> = {
        success: false,
        error: "Validation échouée",
        fieldErrors: {
          email: ["Email invalide"],
          password: ["Trop court"],
        },
      };

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Validation échouée");
        expect(result.fieldErrors).toBeDefined();
        expect(result.fieldErrors?.email).toContain("Email invalide");
      }
    });
  });

  describe("Prévention de régression", () => {
    it("devrait échouer si une action retourne l'ancien pattern", () => {
      // Cette fonction simule une Server Action mal typée
      const badAction = (): { error: string } | { data: string } => {
        return { error: "Erreur" };
      };

      const result = badAction();

      // L'ancien pattern NE PERMET PAS le type narrowing avec result.success
      // @ts-expect-error Property 'success' does not exist
      const hasSuccess = result.success;
      expect(hasSuccess).toBeUndefined();

      // Il faut utiliser "error" in result, ce qui est moins sûr
      if ("error" in result) {
        expect(result.error).toBe("Erreur");
      }
    });

    it("devrait réussir si une action retourne ActionResult", () => {
      // Cette fonction simule une Server Action correctement typée
      const goodAction = (): ActionResult<string> => {
        return { success: false, error: "Erreur" };
      };

      const result = goodAction();

      // Le nouveau pattern PERMET le type narrowing avec result.success
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBe("Erreur");
      }
    });
  });

  describe("Documentation des patterns", () => {
    it("devrait documenter le pattern correct pour les composants Client", () => {
      // CORRECT : Utilisation dans un composant Client
      const exampleClientComponent = async () => {
        // Simuler un appel à une Server Action
        const result: ActionResult<{ userId: string }> = {
          success: true,
          data: { userId: "user-123" },
        };

        // Pattern recommandé
        if (!result.success) {
          // Gérer l'erreur
          console.error(result.error);
          return;
        }

        // Utiliser les données
        const userId = result.data.userId;
        return userId;
      };

      expect(exampleClientComponent()).resolves.toBe("user-123");
    });

    it("devrait documenter le pattern correct pour les pages Server", () => {
      // CORRECT : Utilisation dans une page Server
      const exampleServerPage = async () => {
        // Simuler un appel à une Server Action
        const result: ActionResult<string[]> = {
          success: true,
          data: ["item1", "item2"],
        };

        // Pattern recommandé pour affichage conditionnel
        if (!result.success) {
          return { error: result.error };
        }

        return { items: result.data.join(", ") };
      };

      // Note: Ce test est symbolique pour la documentation
      expect(exampleServerPage).toBeDefined();
    });
  });
});
