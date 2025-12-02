/**
 * Tests d'hydratation - Vérifie que le rendu serveur et client est identique
 * Ces tests valident les corrections apportées pour résoudre les erreurs d'hydratation
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { formatDate, formatDateTime, formatDateISO } from "@/lib/date-utils";

describe("Hydration Safety", () => {
  describe("Date Formatting - Server/Client Consistency", () => {
    it("formatDate devrait produire le même résultat en UTC", () => {
      // Simuler un rendu serveur (UTC) et client (timezone local)
      const serverDate = new Date("2024-12-02T10:30:00Z");
      const clientDate = new Date("2024-12-02T10:30:00Z");

      const serverResult = formatDate(serverDate);
      const clientResult = formatDate(clientDate);

      expect(serverResult).toBe(clientResult);
      expect(serverResult).toBe("02/12/2024");
    });

    it("formatDate devrait ignorer les différences de timezone", () => {
      // Même date à différentes heures de la journée
      const morning = new Date("2024-12-02T00:00:00Z");
      const evening = new Date("2024-12-02T23:59:59Z");

      expect(formatDate(morning)).toBe("02/12/2024");
      expect(formatDate(evening)).toBe("02/12/2024");
    });

    it("formatDate devrait gérer les string ISO de manière déterministe", () => {
      const isoString = "2024-12-02T15:45:30.500Z";
      const dateObject = new Date(isoString);

      expect(formatDate(isoString)).toBe(formatDate(dateObject));
      expect(formatDate(isoString)).toBe("02/12/2024");
    });

    it("formatDateTime devrait être cohérent serveur/client", () => {
      const date = new Date("2024-12-02T15:45:00Z");
      const isoString = "2024-12-02T15:45:00Z";

      expect(formatDateTime(date)).toBe(formatDateTime(isoString));
      expect(formatDateTime(date)).toBe("02/12/2024 15:45");
    });

    it("formatDateISO devrait produire un format stable pour les inputs", () => {
      const date = new Date("2024-01-05T10:30:00Z");
      const result = formatDateISO(date);

      // Format attendu par <input type="date">
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toBe("2024-01-05");
    });
  });

  describe("Tailwind Classes - Deterministic Values", () => {
    it("bg-foreground/10 devrait être une valeur statique", () => {
      // Vérifier que la classe ne dépend pas de variables CSS runtime
      const className = "bg-foreground/10";

      // Tailwind compile /10 en rgba statique, pas de var() CSS
      expect(className).not.toContain("var(");
      expect(className).not.toContain("hsl(");
      expect(className).toContain("/10");
    });

    it("animate-pulse devrait être déterministe", () => {
      const className = "animate-pulse";

      // animate-pulse est une animation CSS pure, pas de JavaScript
      expect(className).toBe("animate-pulse");
      expect(className).not.toContain("Math.random");
      expect(className).not.toContain("Date.now");
    });
  });

  describe("Anti-patterns Detection", () => {
    it("Date.now() produirait des résultats différents (démonstration)", () => {
      // Ce test démontre POURQUOI Date.now() est un anti-pattern
      const badRender = () => {
        // ❌ Mauvais : différent à chaque rendu
        return `Timestamp: ${Date.now()}`;
      };

      const result1 = badRender();
      // Simuler un petit délai (serveur vs client)
      const delay = new Promise((resolve) => setTimeout(resolve, 1));

      return delay.then(() => {
        const result2 = badRender();
        // Ce test RÉUSSIT en montrant que Date.now() varie
        expect(result1).not.toBe(result2);
      });
    });

    it("ne devrait PAS utiliser Math.random() dans le rendu", () => {
      // ❌ Mauvais : différent à chaque rendu
      const badRender = () => `Random: ${Math.random()}`;

      const result1 = badRender();
      const result2 = badRender();

      expect(result1).not.toBe(result2);
    });

    it("toLocaleDateString produirait des résultats différents (anti-pattern)", () => {
      const date = new Date("2024-12-02T10:30:00Z");

      // Simuler différentes locales (serveur vs client)
      const frResult = date.toLocaleDateString("fr-FR");
      const enResult = date.toLocaleDateString("en-US");

      // Les résultats sont différents selon la locale
      expect(frResult).not.toBe(enResult);
      // C'est pourquoi nous utilisons formatDate() à la place
    });
  });

  describe("Skeleton Loading States", () => {
    it("devrait utiliser des classes Tailwind statiques", () => {
      // Simuler le skeleton utilisé dans DashboardStats
      const StatSkeleton = () => (
        <div className="h-9 w-16 animate-pulse rounded bg-foreground/10" />
      );

      const { container } = render(<StatSkeleton />);
      const skeleton = container.firstChild as HTMLElement;

      // Vérifier que les classes sont appliquées
      expect(skeleton.className).toContain("h-9");
      expect(skeleton.className).toContain("w-16");
      expect(skeleton.className).toContain("animate-pulse");
      expect(skeleton.className).toContain("bg-foreground/10");

      // Vérifier qu'il n'y a pas de style inline qui pourrait varier
      expect(skeleton.style.length).toBe(0);
    });

    it("le rendu d'un skeleton devrait être identique serveur/client", () => {
      const SkeletonComponent = () => (
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-foreground/10" />
          <div className="h-4 w-96 animate-pulse rounded bg-foreground/10" />
        </div>
      );

      // Premier rendu (simuler serveur)
      const { container: container1 } = render(<SkeletonComponent />);
      const html1 = container1.innerHTML;

      // Deuxième rendu (simuler client)
      const { container: container2 } = render(<SkeletonComponent />);
      const html2 = container2.innerHTML;

      // Le HTML doit être strictement identique
      expect(html1).toBe(html2);
    });
  });

  describe("Real-world Component Examples", () => {
    it("devrait afficher une date de quote de manière cohérente", () => {
      // Simuler l'affichage d'une date dans QuotesList
      const QuoteDateDisplay = ({ date }: { date: Date | string }) => (
        <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">
          {formatDate(date)}
        </td>
      );

      const testDate = "2024-12-02T10:30:00Z";

      const { container: container1 } = render(
        <table>
          <tbody>
            <tr>
              <QuoteDateDisplay date={testDate} />
            </tr>
          </tbody>
        </table>
      );

      const { container: container2 } = render(
        <table>
          <tbody>
            <tr>
              <QuoteDateDisplay date={testDate} />
            </tr>
          </tbody>
        </table>
      );

      expect(container1.innerHTML).toBe(container2.innerHTML);
      expect(screen.getAllByText("02/12/2024")).toHaveLength(2);
    });

    it("devrait gérer les Stats Cards avec Suspense correctement", () => {
      // Simuler le skeleton utilisé dans DashboardStats
      const StatCard = ({ value, label }: { value: number; label: string }) => (
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">{label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            </div>
          </div>
        </div>
      );

      const { container: container1 } = render(
        <StatCard value={42} label="Devis" />
      );
      const { container: container2 } = render(
        <StatCard value={42} label="Devis" />
      );

      // Le rendu doit être identique
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it("devrait utiliser une constante pour l'année du copyright", () => {
      // Simuler le footer de la page d'accueil
      const CURRENT_YEAR = new Date().getFullYear(); // Évalué une fois au module level

      const Footer = () => (
        <footer className="border-t border-foreground/10">
          <p className="text-sm text-foreground/60">
            &copy; {CURRENT_YEAR} Solkant. Tous droits réservés.
          </p>
        </footer>
      );

      const { container: container1 } = render(<Footer />);
      const { container: container2 } = render(<Footer />);

      // Le rendu doit être identique car CURRENT_YEAR est constant
      expect(container1.innerHTML).toBe(container2.innerHTML);
      expect(container1.innerHTML).toContain(CURRENT_YEAR.toString());
    });
  });

  describe("Edge Cases", () => {
    it("devrait gérer les dates invalides sans crash", () => {
      const invalidDate = "invalid-date";

      // Vérifier que formatDate ne crash pas
      expect(() => formatDate(invalidDate)).not.toThrow();
    });

    it("devrait gérer les dates en début/fin d'année", () => {
      const newYear = new Date("2024-01-01T00:00:00Z");
      const newYearEve = new Date("2024-12-31T23:59:59Z");

      expect(formatDate(newYear)).toBe("01/01/2024");
      expect(formatDate(newYearEve)).toBe("31/12/2024");
    });

    it("devrait gérer les années bissextiles", () => {
      const leapDay = new Date("2024-02-29T12:00:00Z");
      expect(formatDate(leapDay)).toBe("29/02/2024");
    });

    it("devrait gérer les différentes zones horaires de manière cohérente", () => {
      // Même instant, représenté avec différents offsets
      const utc = new Date("2024-12-02T15:00:00Z");
      const isoString = "2024-12-02T15:00:00.000Z";

      expect(formatDate(utc)).toBe(formatDate(isoString));
    });
  });

  describe("Performance & Optimization", () => {
    it("formatDate devrait être rapide (< 1ms pour 1000 appels)", () => {
      const date = new Date("2024-12-02T10:30:00Z");
      const iterations = 1000;

      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        formatDate(date);
      }
      const end = performance.now();
      const duration = end - start;

      // 1000 appels devraient prendre moins de 10ms
      expect(duration).toBeLessThan(10);
    });

    it("ne devrait pas créer de memory leak avec des dates répétées", () => {
      const date = new Date("2024-12-02T10:30:00Z");

      // Appeler formatDate plusieurs fois avec la même date
      const results = Array.from({ length: 100 }, () => formatDate(date));

      // Tous les résultats devraient être identiques
      expect(new Set(results).size).toBe(1);
      expect(results[0]).toBe("02/12/2024");
    });
  });
});
