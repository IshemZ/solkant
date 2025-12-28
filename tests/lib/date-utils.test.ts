import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, formatDateISO } from "@/lib/date-utils";

describe("date-utils", () => {
  describe("formatDate", () => {
    it("devrait formater une date au format DD/MM/YYYY", () => {
      const date = new Date("2024-12-02T10:30:00Z");
      expect(formatDate(date)).toBe("02/12/2024");
    });

    it("devrait accepter une string ISO", () => {
      expect(formatDate("2024-12-02T10:30:00Z")).toBe("02/12/2024");
    });

    it("devrait utiliser UTC pour éviter les problèmes de timezone", () => {
      // Test avec différentes heures - le résultat doit être le même
      const date1 = new Date("2024-12-02T00:00:00Z");
      const date2 = new Date("2024-12-02T23:59:59Z");

      expect(formatDate(date1)).toBe("02/12/2024");
      expect(formatDate(date2)).toBe("02/12/2024");
    });

    it("devrait gérer les valeurs null et undefined", () => {
      expect(formatDate(null)).toBe("—");
      expect(formatDate(undefined)).toBe("—");
    });

    it("devrait gérer les dates invalides", () => {
      expect(formatDate("invalid-date")).toBe("—");
      expect(formatDate(new Date("invalid"))).toBe("—");
    });
  });

  describe("formatDateTime", () => {
    it("devrait formater une date avec l'heure", () => {
      const date = new Date("2024-12-02T15:45:00Z");
      expect(formatDateTime(date)).toBe("02/12/2024 15:45");
    });

    it("devrait accepter une string ISO", () => {
      expect(formatDateTime("2024-12-02T08:30:00Z")).toBe("02/12/2024 08:30");
    });

    it("devrait padder les heures et minutes", () => {
      const date = new Date("2024-01-05T03:07:00Z");
      expect(formatDateTime(date)).toBe("05/01/2024 03:07");
    });

    it("devrait gérer les valeurs null et undefined", () => {
      expect(formatDateTime(null)).toBe("—");
      expect(formatDateTime(undefined)).toBe("—");
    });

    it("devrait gérer les dates invalides", () => {
      expect(formatDateTime("invalid-date")).toBe("—");
    });
  });

  describe("formatDateISO", () => {
    it("devrait formater au format YYYY-MM-DD", () => {
      const date = new Date("2024-12-02T10:30:00Z");
      expect(formatDateISO(date)).toBe("2024-12-02");
    });

    it("devrait accepter une string ISO", () => {
      expect(formatDateISO("2024-12-02T10:30:00Z")).toBe("2024-12-02");
    });

    it("devrait fonctionner pour les inputs de formulaire", () => {
      // Format attendu par <input type="date">
      const date = new Date("2024-01-05T00:00:00Z");
      expect(formatDateISO(date)).toBe("2024-01-05");
    });

    it("devrait gérer les valeurs null et undefined", () => {
      expect(formatDateISO(null)).toBe("");
      expect(formatDateISO(undefined)).toBe("");
    });

    it("devrait gérer les dates invalides", () => {
      expect(formatDateISO("invalid-date")).toBe("");
    });
  });

  describe("Cohérence serveur/client", () => {
    it("devrait produire le même résultat quel que soit le timezone local", () => {
      // Simulate même date créée dans différents contextes
      const utcDate = new Date("2024-12-02T12:00:00Z");
      const isoString = "2024-12-02T12:00:00Z";

      expect(formatDate(utcDate)).toBe(formatDate(isoString));
      expect(formatDateTime(utcDate)).toBe(formatDateTime(isoString));
      expect(formatDateISO(utcDate)).toBe(formatDateISO(isoString));
    });
  });
});
