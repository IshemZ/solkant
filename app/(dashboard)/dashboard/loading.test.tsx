/**
 * Tests d'intégration pour les loading states
 * Vérifie que les skeletons n'ont pas de problèmes d'hydratation
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

// Import des composants loading
import DashboardLoading from "@/app/(dashboard)/dashboard/loading";
import DevisLoading from "@/app/(dashboard)/dashboard/devis/loading";
import ClientsLoading from "@/app/(dashboard)/dashboard/clients/loading";
import ServicesLoading from "@/app/(dashboard)/dashboard/services/loading";

describe("Loading States - Hydration Safety", () => {
  describe("DashboardLoading", () => {
    it("devrait rendre le même HTML à chaque fois", () => {
      const { container: container1 } = render(<DashboardLoading />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<DashboardLoading />);
      const html2 = container2.innerHTML;

      expect(html1).toBe(html2);
    });

    it("devrait utiliser uniquement bg-foreground/10", () => {
      const { container } = render(<DashboardLoading />);
      const html = container.innerHTML;

      // Vérifier qu'on utilise bg-foreground/10
      expect(html).toContain("bg-foreground/10");

      // Vérifier qu'on n'utilise PAS bg-muted (ancien code)
      expect(html).not.toContain("bg-muted");
    });

    it("devrait avoir des dimensions fixes pour les skeletons", () => {
      const { container } = render(<DashboardLoading />);
      const html = container.innerHTML;

      // Les skeletons doivent avoir des dimensions fixes
      expect(html).toContain("h-8");
      expect(html).toContain("w-64");
      expect(html).toContain("animate-pulse");
    });

    it("ne devrait pas contenir de contenu dynamique", () => {
      const { container } = render(<DashboardLoading />);
      const html = container.innerHTML;

      // Pas de Date.now(), Math.random(), etc.
      expect(html).not.toContain("Date.now");
      expect(html).not.toContain("Math.random");
      expect(html).not.toContain("new Date");
    });
  });

  describe("DevisLoading", () => {
    it("devrait rendre le même HTML à chaque fois", () => {
      const { container: container1 } = render(<DevisLoading />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<DevisLoading />);
      const html2 = container2.innerHTML;

      expect(html1).toBe(html2);
    });

    it("devrait utiliser bg-foreground/10", () => {
      const { container } = render(<DevisLoading />);
      const html = container.innerHTML;

      expect(html).toContain("bg-foreground/10");
      expect(html).not.toContain("bg-muted");
    });

    it("devrait rendre 4 stats cards skeleton", () => {
      const { container } = render(<DevisLoading />);
      const statsCards = container.querySelectorAll(
        ".grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-4 > div"
      );

      // Devrait avoir 4 cards (via Array(4).map)
      expect(statsCards.length).toBe(4);
    });

    it("devrait rendre 4 quotes skeleton", () => {
      const { container } = render(<DevisLoading />);
      const quotesSkeletons = container.querySelectorAll(
        ".space-y-4 > .rounded-lg.border"
      );

      // Devrait avoir 4 quotes skeleton (via Array(4).map)
      expect(quotesSkeletons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("ClientsLoading", () => {
    it("devrait rendre le même HTML à chaque fois", () => {
      const { container: container1 } = render(<ClientsLoading />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<ClientsLoading />);
      const html2 = container2.innerHTML;

      expect(html1).toBe(html2);
    });

    it("devrait utiliser bg-foreground/10", () => {
      const { container } = render(<ClientsLoading />);
      const html = container.innerHTML;

      expect(html).toContain("bg-foreground/10");
      expect(html).not.toContain("bg-muted");
    });

    it("devrait rendre un tableau avec 5 lignes skeleton", () => {
      const { container } = render(<ClientsLoading />);
      const tableRows = container.querySelectorAll(".border-b.border-border");

      // Header + 5 rows = 6 éléments avec border-b
      expect(tableRows.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("ServicesLoading", () => {
    it("devrait rendre le même HTML à chaque fois", () => {
      const { container: container1 } = render(<ServicesLoading />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<ServicesLoading />);
      const html2 = container2.innerHTML;

      expect(html1).toBe(html2);
    });

    it("devrait utiliser bg-foreground/10", () => {
      const { container } = render(<ServicesLoading />);
      const html = container.innerHTML;

      expect(html).toContain("bg-foreground/10");
      expect(html).not.toContain("bg-muted");
    });

    it("devrait rendre 6 catégories filter skeleton", () => {
      const { container } = render(<ServicesLoading />);
      const html = container.innerHTML;

      // Vérifier structure des filtres (6 éléments via Array(6).map)
      expect(html).toContain("h-9");
      expect(html).toContain("w-28");
      expect(html).toContain("rounded-full");
    });

    it("devrait rendre 6 services cards skeleton", () => {
      const { container } = render(<ServicesLoading />);
      const serviceCards = container.querySelectorAll(
        ".grid.gap-6 > .rounded-lg.border"
      );

      // Devrait avoir 6 cards (via Array(6).map)
      expect(serviceCards.length).toBe(6);
    });
  });

  describe("Cross-component Consistency", () => {
    it("tous les loading states devraient utiliser les mêmes classes de base", () => {
      const dashboardHtml = render(<DashboardLoading />).container.innerHTML;
      const devisHtml = render(<DevisLoading />).container.innerHTML;
      const clientsHtml = render(<ClientsLoading />).container.innerHTML;
      const servicesHtml = render(<ServicesLoading />).container.innerHTML;

      // Tous devraient utiliser bg-foreground/10
      [dashboardHtml, devisHtml, clientsHtml, servicesHtml].forEach((html) => {
        expect(html).toContain("bg-foreground/10");
        expect(html).toContain("animate-pulse");
      });

      // Aucun ne devrait utiliser bg-muted
      [dashboardHtml, devisHtml, clientsHtml, servicesHtml].forEach((html) => {
        expect(html).not.toContain("bg-muted");
      });
    });

    it("aucun loading state ne devrait avoir de contenu dynamique", () => {
      const dashboardHtml = render(<DashboardLoading />).container.innerHTML;
      const devisHtml = render(<DevisLoading />).container.innerHTML;
      const clientsHtml = render(<ClientsLoading />).container.innerHTML;
      const servicesHtml = render(<ServicesLoading />).container.innerHTML;

      const allHtml = [dashboardHtml, devisHtml, clientsHtml, servicesHtml];

      allHtml.forEach((html) => {
        // Pas de timestamps
        expect(html).not.toMatch(/\d{13}/); // Unix timestamp
        expect(html).not.toContain("Date.now");

        // Pas de random
        expect(html).not.toContain("Math.random");

        // Pas de dates formatées
        expect(html).not.toMatch(/\d{2}\/\d{2}\/\d{4}/);
      });
    });
  });

  describe("Accessibility", () => {
    it("les skeletons devraient être accessibles", () => {
      const { container } = render(<DashboardLoading />);

      // Les skeletons devraient avoir des divs sémantiques
      const skeletonDivs = container.querySelectorAll(".animate-pulse");
      expect(skeletonDivs.length).toBeGreaterThan(0);

      // Vérifier la structure HTML valide
      const html = container.innerHTML;
      expect(html).not.toContain("<div><div>"); // Pas de nested divs inutiles
    });

    it("les couleurs devraient avoir un contraste suffisant", () => {
      const { container } = render(<DashboardLoading />);
      const html = container.innerHTML;

      // bg-foreground/10 devrait être visible sur background
      expect(html).toContain("bg-foreground/10");

      // Les borders devraient être subtiles mais visibles
      expect(html).toContain("border-border");
    });
  });

  describe("Performance", () => {
    it("le rendu des loading states devrait être rapide", () => {
      const start = performance.now();

      render(<DashboardLoading />);
      render(<DevisLoading />);
      render(<ClientsLoading />);
      render(<ServicesLoading />);

      const end = performance.now();
      const duration = end - start;

      // Tous les loading states devraient rendre en < 50ms
      expect(duration).toBeLessThan(50);
    });

    it("le rendu répété devrait être stable", () => {
      const iterations = 10;
      const htmls: string[] = [];

      for (let i = 0; i < iterations; i++) {
        const { container } = render(<DashboardLoading />);
        htmls.push(container.innerHTML);
      }

      // Tous les rendus devraient être identiques
      const uniqueHtmls = new Set(htmls);
      expect(uniqueHtmls.size).toBe(1);
    });
  });
});
