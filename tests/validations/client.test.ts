import { describe, it, expect } from "vitest";
import { createClientSchema, updateClientSchema } from "@/lib/validations";

describe("Client Validation Schema", () => {
  describe("createClientSchema", () => {
    it("should validate correct client data", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "0123456789",
        address: "1 rue de Paris, 75001 Paris",
      };

      const result = createClientSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jean");
        expect(result.data.lastName).toBe("Dupont");
        expect(result.data.email).toBe("jean@example.com");
      }
    });

    it("should trim and normalize data", () => {
      const data = {
        firstName: "  Jean  ",
        lastName: "  Dupont  ",
        email: "  JEAN@EXAMPLE.COM  ",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jean");
        expect(result.data.lastName).toBe("Dupont");
        expect(result.data.email).toBe("jean@example.com");
      }
    });

    it("should require firstName", () => {
      const data = {
        lastName: "Dupont",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const firstNameError = result.error.issues.find(
          (issue) => issue.path[0] === "firstName"
        );
        expect(firstNameError).toBeDefined();
        // Accept both custom and default Zod messages
        expect(firstNameError?.message).toMatch(
          /requis|required|expected string/
        );
      }
    });

    it("should require lastName", () => {
      const data = {
        firstName: "Jean",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const lastNameError = result.error.issues.find(
          (issue) => issue.path[0] === "lastName"
        );
        expect(lastNameError).toBeDefined();
        // Accept both custom and default Zod messages
        expect(lastNameError?.message).toMatch(
          /requis|required|expected string/
        );
      }
    });

    it("should reject invalid email format", () => {
      const data = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "invalid-email",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(
          (issue) => issue.path[0] === "email"
        );
        expect(emailError).toBeDefined();
      }
    });

    it("should accept valid phone numbers", () => {
      const validPhones = [
        "0123456789",
        "01 23 45 67 89",
        "01.23.45.67.89",
        "+33123456789",
        "+33 1 23 45 67 89",
      ];

      validPhones.forEach((phone) => {
        const data = {
          firstName: "Jean",
          lastName: "Dupont",
          phone,
        };

        const result = createClientSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should enforce maximum length on firstName", () => {
      const data = {
        firstName: "A".repeat(51), // Plus de 50 caractères
        lastName: "Dupont",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "firstName"
        );
        expect(error?.message).toContain("50 caractères");
      }
    });

    it("should accept optional fields as undefined", () => {
      const data = {
        firstName: "Jean",
        lastName: "Dupont",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBeUndefined();
        expect(result.data.phone).toBeUndefined();
        expect(result.data.address).toBeUndefined();
        expect(result.data.notes).toBeUndefined();
      }
    });

    it("should enforce maximum length on notes", () => {
      const data = {
        firstName: "Jean",
        lastName: "Dupont",
        notes: "A".repeat(5001), // Plus de 5000 caractères
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "notes"
        );
        expect(error?.message).toContain("5000 caractères");
      }
    });

    it("should handle French characters in names", () => {
      const data = {
        firstName: "François",
        lastName: "Lefèvre",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("François");
        expect(result.data.lastName).toBe("Lefèvre");
      }
    });

    it("should allow hyphens and apostrophes in names", () => {
      const data = {
        firstName: "Jean-Claude",
        lastName: "O'Brien",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe("updateClientSchema", () => {
    it("should validate partial updates", () => {
      const data = {
        firstName: "Marie",
      };

      const result = updateClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Marie");
        expect(result.data.lastName).toBeUndefined();
      }
    });

    it("should allow updating only email", () => {
      const data = {
        email: "newemail@example.com",
      };

      const result = updateClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("newemail@example.com");
      }
    });

    it("should validate email format when provided", () => {
      const data = {
        email: "invalid-email",
      };

      const result = updateClientSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should allow empty update object", () => {
      const data = {};

      const result = updateClientSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe("Edge Cases & Security", () => {
    it("should handle null values correctly", () => {
      const data = {
        firstName: "Jean",
        lastName: "Dupont",
        email: null,
        phone: null,
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should trim whitespace from all string fields", () => {
      const data = {
        firstName: "  Jean  ",
        lastName: "  Dupont  ",
        email: "  test@example.com  ",
        phone: "  0123456789  ",
        address: "  1 rue de Paris  ",
        notes: "  Some notes  ",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jean");
        expect(result.data.lastName).toBe("Dupont");
        expect(result.data.email).toBe("test@example.com");
        expect(result.data.phone).toBe("0123456789");
        expect(result.data.address).toBe("1 rue de Paris");
        expect(result.data.notes).toBe("Some notes");
      }
    });

    it("should reject empty strings after trimming", () => {
      const data = {
        firstName: "   ",
        lastName: "Dupont",
      };

      const result = createClientSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});
