import { describe, it, expect } from "vitest";
import type { ActionResult } from "@/lib/action-types";

/**
 * Tests pour garantir que le pattern ActionResult<T> fonctionne correctement
 * et que le type narrowing TypeScript est préservé.
 *
 * Ces tests empêchent la régression du bug où TypeScript ne pouvait pas
 * déterminer le type correct lors de l'accès à result.error ou result.data.
 */

describe("ActionResult Type Pattern", () => {
  describe("Type narrowing avec le discriminant success", () => {
    it("devrait permettre d'accéder à result.data quand success est true", () => {
      const result: ActionResult<{ id: string; name: string }> = {
        success: true,
        data: { id: "123", name: "Test" },
      };

      if (result.success) {
        // TypeScript sait que result.data existe ici
        expect(result.data).toEqual({ id: "123", name: "Test" });
        expect(result.data.id).toBe("123");
        expect(result.data.name).toBe("Test");
      } else {
        throw new Error("Ne devrait pas arriver ici");
      }
    });

    it("devrait permettre d'accéder à result.error quand success est false", () => {
      const result: ActionResult<{ id: string; name: string }> = {
        success: false,
        error: "Une erreur s'est produite",
        code: "VALIDATION_ERROR",
      };

      if (!result.success) {
        // TypeScript sait que result.error existe ici
        expect(result.error).toBe("Une erreur s'est produite");
        expect(result.code).toBe("VALIDATION_ERROR");
      } else {
        throw new Error("Ne devrait pas arriver ici");
      }
    });

    it("devrait gérer les fieldErrors optionnels", () => {
      const result: ActionResult<{ id: string }> = {
        success: false,
        error: "Erreur de validation",
        fieldErrors: {
          email: ["Email invalide"],
          password: ["Mot de passe trop court", "Doit contenir un chiffre"],
        },
      };

      if (!result.success) {
        expect(result.error).toBe("Erreur de validation");
        expect(result.fieldErrors).toBeDefined();
        expect(result.fieldErrors?.email).toEqual(["Email invalide"]);
        expect(result.fieldErrors?.password).toHaveLength(2);
      }
    });
  });

  describe("Pattern dans les Server Actions", () => {
    it("devrait simuler une Server Action réussie", async () => {
      // Simule une Server Action qui retourne un succès
      const mockServerAction = async (): Promise<
        ActionResult<{ userId: string }>
      > => {
        return {
          success: true,
          data: { userId: "user-123" },
        };
      };

      const result = await mockServerAction();

      if (!result.success) {
        throw new Error("Action devrait réussir");
      }

      expect(result.data.userId).toBe("user-123");
    });

    it("devrait simuler une Server Action avec erreur", async () => {
      // Simule une Server Action qui retourne une erreur
      const mockServerAction = async (): Promise<
        ActionResult<{ userId: string }>
      > => {
        return {
          success: false,
          error: "Non autorisé",
          code: "UNAUTHORIZED",
        };
      };

      const result = await mockServerAction();

      if (result.success) {
        throw new Error("Action devrait échouer");
      }

      expect(result.error).toBe("Non autorisé");
      expect(result.code).toBe("UNAUTHORIZED");
    });
  });

  describe("Utilisation dans les composants", () => {
    it("devrait gérer le pattern if (!result.success) correctement", () => {
      const successResult: ActionResult<{ message: string }> = {
        success: true,
        data: { message: "Succès" },
      };

      const errorResult: ActionResult<{ message: string }> = {
        success: false,
        error: "Erreur",
      };

      // Pattern utilisé dans les composants
      if (!successResult.success) {
        throw new Error("Ne devrait pas arriver ici");
      }
      expect(successResult.data.message).toBe("Succès");

      if (!errorResult.success) {
        expect(errorResult.error).toBe("Erreur");
      } else {
        throw new Error("Ne devrait pas arriver ici");
      }
    });

    it("devrait gérer le pattern ternaire correctement", () => {
      const successResult: ActionResult<number> = {
        success: true,
        data: 42,
      };

      const errorResult: ActionResult<number> = {
        success: false,
        error: "Échec du calcul",
      };

      // Pattern utilisé dans les rendus JSX
      const successMessage = !successResult.success
        ? successResult.error
        : `Résultat: ${successResult.data}`;

      const errorMessage = !errorResult.success
        ? errorResult.error
        : `Résultat: ${errorResult.data}`;

      expect(successMessage).toBe("Résultat: 42");
      expect(errorMessage).toBe("Échec du calcul");
    });
  });

  describe("Type safety", () => {
    it("ne devrait pas permettre d'accéder à data quand success est false", () => {
      const result: ActionResult<{ value: number }> = {
        success: false,
        error: "Erreur",
      };

      // Ce test compile uniquement si le type narrowing fonctionne
      if (result.success) {
        // @ts-expect-error - Cette ligne ne devrait jamais s'exécuter
        const value = result.data.value;
        expect(value).toBeUndefined(); // Ne devrait jamais arriver ici
      } else {
        // result.error est accessible ici
        expect(result.error).toBe("Erreur");
      }
    });

    it("ne devrait pas permettre d'accéder à error quand success est true", () => {
      const result: ActionResult<string> = {
        success: true,
        data: "test",
      };

      // Ce test compile uniquement si le type narrowing fonctionne
      if (!result.success) {
        // @ts-expect-error - Cette ligne ne devrait jamais s'exécuter
        const error = result.error;
        expect(error).toBeUndefined(); // Ne devrait jamais arriver ici
      } else {
        // result.data est accessible ici
        expect(result.data).toBe("test");
      }
    });
  });

  describe("Cas d'usage réels", () => {
    it("devrait gérer un tableau de données", () => {
      type Client = { id: string; name: string };
      const result: ActionResult<Client[]> = {
        success: true,
        data: [
          { id: "1", name: "Client 1" },
          { id: "2", name: "Client 2" },
        ],
      };

      if (!result.success) {
        throw new Error("Devrait réussir");
      }

      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe("Client 1");
    });

    it("devrait gérer des objets complexes avec relations", () => {
      type Quote = {
        id: string;
        total: number;
        client: { name: string } | null;
      };

      const result: ActionResult<Quote> = {
        success: true,
        data: {
          id: "quote-1",
          total: 1000,
          client: { name: "Client ABC" },
        },
      };

      if (!result.success) {
        throw new Error("Devrait réussir");
      }

      expect(result.data.total).toBe(1000);
      expect(result.data.client?.name).toBe("Client ABC");
    });
  });
});
