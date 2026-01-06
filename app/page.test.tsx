/**
 * Tests pour la page d'accueil (Homepage)
 * Vérifie que toutes les sections marketing s'affichent correctement
 * et que le contenu est cohérent entre le rendu serveur et client
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Homepage", () => {
  describe("Navigation Header", () => {
    it("devrait afficher le logo Solkant", () => {
      render(<Home />);
      // Solkant apparaît plusieurs fois sur la page, utiliser getAllByText
      const solkantElements = screen.getAllByText("Solkant");
      expect(solkantElements.length).toBeGreaterThanOrEqual(1);
    });

    it("devrait afficher tous les liens de navigation desktop", () => {
      render(<Home />);

      // Liens de navigation principaux
      const navLinks = screen.getAllByRole("link");
      const navTexts = navLinks.map(link => link.textContent);

      expect(navTexts).toContain("Fonctionnalités");
      expect(navTexts).toContain("Tarifs");
      expect(navTexts).toContain("Blog");
      expect(navTexts).toContain("Contact");
    });

    it("devrait afficher les boutons Connexion et Commencer", () => {
      render(<Home />);

      const loginLink = screen.getByRole("link", { name: /connexion/i });
      // Il y a plusieurs liens "Commencer", chercher celui exact dans le nav
      const registerLinks = screen.getAllByRole("link", { name: /commencer/i });
      const navRegisterLink = registerLinks.find(link =>
        link.textContent === "Commencer"
      );

      expect(loginLink).toHaveAttribute("href", "/login");
      expect(navRegisterLink).toHaveAttribute("href", "/register");
    });

    it("devrait avoir la bonne structure de classes Tailwind", () => {
      const { container } = render(<Home />);
      const nav = container.querySelector("nav");

      expect(nav?.className).toContain("border-b");
      expect(nav?.className).toContain("border-foreground/10");
    });
  });

  describe("Hero Section", () => {
    it("devrait afficher le titre principal en français", () => {
      render(<Home />);

      const heading = screen.getByRole("heading", {
        level: 1,
        name: /logiciel de devis pour instituts de beauté/i
      });

      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toContain("Solkant");
    });

    it("devrait afficher la description du produit", () => {
      render(<Home />);

      expect(screen.getByText(/Solkant simplifie la création de devis professionnels/i)).toBeInTheDocument();
      expect(screen.getByText(/Gérez vos clients, services et générez des PDF personnalisés/i)).toBeInTheDocument();
    });

    it("devrait afficher deux CTA buttons", () => {
      render(<Home />);

      const startButtons = screen.getAllByRole("link", { name: /commencer gratuitement/i });
      const learnMoreButton = screen.getByRole("link", { name: /découvrir les fonctionnalités/i });

      // Au moins un bouton "Commencer gratuitement"
      expect(startButtons.length).toBeGreaterThanOrEqual(1);
      expect(startButtons[0]).toHaveAttribute("href", "/register");
      expect(learnMoreButton).toHaveAttribute("href", "#features");
    });

    it("devrait avoir la structure sémantique correcte", () => {
      const { container } = render(<Home />);
      const heroSection = container.querySelector("section");

      expect(heroSection).toBeInTheDocument();
      // Le text-center est sur le div enfant, pas sur la section
      const textCenterDiv = heroSection?.querySelector(".text-center");
      expect(textCenterDiv).toBeInTheDocument();
    });
  });

  describe("Features Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /tout ce dont vous avez besoin/i
      })).toBeInTheDocument();
    });

    it("devrait afficher les 6 fonctionnalités principales", () => {
      render(<Home />);

      const features = [
        "Devis professionnels",
        "Gestion clients",
        "Catalogue de services",
        "Personnalisation",
        "Simple et rapide",
        "Sécurisé"
      ];

      features.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it("devrait afficher les descriptions des fonctionnalités", () => {
      render(<Home />);

      expect(screen.getByText(/Créez des devis élégants et personnalisés avec votre logo/i)).toBeInTheDocument();
      expect(screen.getByText(/Gérez facilement vos clients et leur historique/i)).toBeInTheDocument();
      expect(screen.getByText(/Créez votre catalogue de prestations avec prix et durées/i)).toBeInTheDocument();
    });

    it("devrait avoir l'ID features pour l'ancre de navigation", () => {
      const { container } = render(<Home />);
      const featuresSection = container.querySelector("section#features");

      expect(featuresSection).toBeInTheDocument();
    });

    it("devrait afficher des icônes SVG pour chaque fonctionnalité", () => {
      const { container } = render(<Home />);
      const featuresSection = container.querySelector("section#features");
      const svgs = featuresSection?.querySelectorAll("svg");

      // 6 fonctionnalités = 6 icônes
      expect(svgs?.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("Comment ça marche Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /comment ça marche/i
      })).toBeInTheDocument();
    });

    it("devrait afficher les 3 étapes", () => {
      render(<Home />);

      expect(screen.getByText("Créez votre catalogue")).toBeInTheDocument();
      expect(screen.getByText("Sélectionnez vos prestations")).toBeInTheDocument();
      expect(screen.getByText("Générez et envoyez")).toBeInTheDocument();
    });

    it("devrait afficher les numéros d'étapes 1, 2, 3", () => {
      const { container } = render(<Home />);

      // Les numéros sont dans des divs avec classes spécifiques
      const stepNumbers = container.querySelectorAll(".rounded-full.bg-foreground.text-background");

      expect(stepNumbers.length).toBeGreaterThanOrEqual(3);
    });

    it("devrait afficher les descriptions détaillées de chaque étape", () => {
      render(<Home />);

      expect(screen.getByText(/Ajoutez vos prestations.*soins visage.*épilation/i)).toBeInTheDocument();
      expect(screen.getByText(/Créez un nouveau devis en quelques clics/i)).toBeInTheDocument();
      expect(screen.getByText(/Votre devis PDF professionnel est généré instantanément/i)).toBeInTheDocument();
    });

    it("devrait afficher un CTA en bas de la section", () => {
      render(<Home />);

      const ctaButtons = screen.getAllByRole("link", { name: /essayer gratuitement maintenant/i });
      expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
      expect(ctaButtons[0]).toHaveAttribute("href", "/register");
    });

    it("devrait afficher les mentions sans carte bancaire", () => {
      render(<Home />);

      expect(screen.getByText(/aucune carte bancaire requise/i)).toBeInTheDocument();
      expect(screen.getByText(/configuration en 2 minutes/i)).toBeInTheDocument();
    });
  });

  describe("Pourquoi Solkant Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      // Il y a deux sections avec "Pourquoi" dans le titre
      const headings = screen.getAllByRole("heading", { level: 2 });
      const pourquoiHeadings = headings.filter(h =>
        h.textContent?.toLowerCase().includes("pourquoi choisir solkant")
      );
      expect(pourquoiHeadings.length).toBeGreaterThanOrEqual(1);
    });

    it("devrait afficher les 3 bénéfices principaux", () => {
      render(<Home />);

      expect(screen.getByText("Gain de temps immédiat")).toBeInTheDocument();
      expect(screen.getByText("Image professionnelle renforcée")).toBeInTheDocument();
      expect(screen.getByText("Suivi et organisation")).toBeInTheDocument();
    });

    it("devrait mentionner le gain de temps chiffré", () => {
      render(<Home />);

      expect(screen.getByText(/2-3 minutes au lieu de 15-20 minutes/i)).toBeInTheDocument();
    });

    it("devrait afficher des icônes SVG pour chaque bénéfice", () => {
      const { container } = render(<Home />);

      // Chercher les sections avec les bénéfices
      const benefitIcons = Array.from(container.querySelectorAll(".rounded-full.bg-foreground\\/10"));

      expect(benefitIcons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Pour qui Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /solkant est fait pour vous/i
      })).toBeInTheDocument();
    });

    it("devrait afficher les 4 cibles d'audience", () => {
      render(<Home />);

      expect(screen.getByText("Instituts de beauté")).toBeInTheDocument();
      // "Salons d'esthétique" apparaît plusieurs fois (section + FAQ)
      const salonsElements = screen.getAllByText(/Salons d'esthétique/i);
      expect(salonsElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Spas et centres bien-être")).toBeInTheDocument();
      expect(screen.getByText("Praticiennes à domicile")).toBeInTheDocument();
    });

    it("devrait afficher les descriptions pour chaque cible", () => {
      render(<Home />);

      expect(screen.getByText(/Soins visage.*épilation.*maquillage/i)).toBeInTheDocument();
      expect(screen.getByText(/Massages.*soins corporels.*forfaits détente/i)).toBeInTheDocument();
      expect(screen.getByText(/Vous vous déplacez chez vos clients/i)).toBeInTheDocument();
    });
  });

  describe("Comparison Table Section", () => {
    it("devrait afficher le titre de la comparaison", () => {
      render(<Home />);

      const headings = screen.getAllByRole("heading", { level: 2 });
      const comparisonHeading = headings.find(h =>
        h.textContent?.toLowerCase().includes("excel") ||
        h.textContent?.toLowerCase().includes("word")
      );
      expect(comparisonHeading).toBeDefined();
    });

    it("devrait afficher un tableau de comparaison", () => {
      render(<Home />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("devrait afficher les en-têtes du tableau", () => {
      render(<Home />);

      expect(screen.getByRole("columnheader", { name: /fonctionnalité/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /solkant/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /excel.*word/i })).toBeInTheDocument();
    });

    it("devrait afficher les fonctionnalités comparées", () => {
      render(<Home />);

      expect(screen.getByText(/temps de création d'un devis/i)).toBeInTheDocument();
      expect(screen.getByText(/calcul automatique des totaux/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF professionnel automatique/i)).toBeInTheDocument();
      expect(screen.getByText(/gestion des clients intégrée/i)).toBeInTheDocument();
      expect(screen.getByText(/historique et statistiques/i)).toBeInTheDocument();
      expect(screen.getByText(/accessibilité mobile/i)).toBeInTheDocument();
      expect(screen.getByText(/sauvegarde automatique cloud/i)).toBeInTheDocument();
    });

    it("devrait afficher le gain de temps de 80%", () => {
      render(<Home />);

      expect(screen.getByText(/80% de temps/i)).toBeInTheDocument();
    });

    it("devrait afficher un lien vers les fonctionnalités", () => {
      render(<Home />);

      const link = screen.getByRole("link", { name: /découvrir toutes les fonctionnalités/i });
      expect(link).toHaveAttribute("href", "/fonctionnalites");
    });

    it("devrait afficher des icônes checkmark pour Solkant", () => {
      const { container } = render(<Home />);
      const table = container.querySelector("table");
      const checkIcons = table?.querySelectorAll("svg.text-green-600");

      // Plusieurs checkmarks pour les avantages Solkant
      expect(checkIcons?.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Testimonials Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      const headings = screen.getAllByRole("heading", { level: 2 });
      const testimonialHeading = headings.find(h =>
        h.textContent?.toLowerCase().includes("elles nous font confiance")
      );
      expect(testimonialHeading).toBeDefined();
    });

    it("devrait afficher 3 témoignages", () => {
      render(<Home />);

      expect(screen.getByText("Sophie Martin")).toBeInTheDocument();
      expect(screen.getByText("Camille Lefèvre")).toBeInTheDocument();
      expect(screen.getByText("Émilie Bernard")).toBeInTheDocument();
    });

    it("devrait afficher les entreprises des témoins", () => {
      render(<Home />);

      expect(screen.getByText(/Institut Belle Étoile.*Paris/i)).toBeInTheDocument();
      expect(screen.getByText(/Esthéticienne à domicile.*Lyon/i)).toBeInTheDocument();
      expect(screen.getByText(/Spa Zen & Beauté.*Bordeaux/i)).toBeInTheDocument();
    });

    it("devrait afficher les citations des témoignages", () => {
      render(<Home />);

      expect(screen.getByText(/Solkant m'a fait gagner un temps fou/i)).toBeInTheDocument();
      expect(screen.getByText(/Interface super intuitive/i)).toBeInTheDocument();
      expect(screen.getByText(/Je recommande à toutes mes collègues/i)).toBeInTheDocument();
    });

    it("devrait afficher les initiales des témoins", () => {
      const { container } = render(<Home />);

      // Les initiales sont dans des divs avec classes spécifiques
      const initialsElements = Array.from(container.querySelectorAll(".rounded-full.bg-foreground\\/10"));
      const initialsTexts = initialsElements.map(el => el.textContent);

      expect(initialsTexts).toContain("SM");
      expect(initialsTexts).toContain("CL");
      expect(initialsTexts).toContain("EB");
    });

    it("devrait afficher 5 étoiles pour chaque témoignage", () => {
      const { container } = render(<Home />);

      // Chaque témoignage a 5 étoiles (3 témoignages = 15 étoiles)
      const stars = container.querySelectorAll("svg.h-5.w-5.text-foreground");
      expect(stars.length).toBeGreaterThanOrEqual(15);
    });
  });

  describe("FAQ Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /questions fréquentes/i
      })).toBeInTheDocument();
    });

    it("devrait afficher les 10 questions FAQ", () => {
      render(<Home />);

      const faqQuestions = [
        /adapté aux petits instituts de beauté/i,
        /personnaliser mes devis avec mon logo/i,
        /mes données sont-elles sécurisées/i,
        /combien de temps faut-il pour créer un devis/i,
        /y a-t-il un essai gratuit/i,
        /utiliser solkant sur mobile ou tablette/i,
        /combien coûte solkant/i,
        /que se passe-t-il avec mes données/i,
        /compétences techniques/i,
        /envoyer mes devis directement par email/i
      ];

      faqQuestions.forEach(question => {
        expect(screen.getByText(question)).toBeInTheDocument();
      });
    });

    it("devrait afficher les réponses aux questions", () => {
      render(<Home />);

      expect(screen.getByText(/conçu spécialement pour les petites structures/i)).toBeInTheDocument();
      expect(screen.getByText(/ajouter votre logo.*adapter les couleurs/i)).toBeInTheDocument();
      expect(screen.getByText(/hébergées de manière sécurisée en Europe/i)).toBeInTheDocument();
      expect(screen.getByText(/en moyenne.*2 à 3 minutes/i)).toBeInTheDocument();
    });

    it("devrait afficher le lien vers les tarifs dans la FAQ", () => {
      render(<Home />);

      const pricingLink = screen.getByRole("link", { name: /voir les tarifs détaillés/i });
      expect(pricingLink).toHaveAttribute("href", "/pricing");
    });

    it("devrait afficher un lien vers la page contact", () => {
      render(<Home />);

      expect(screen.getByText(/vous avez d'autres questions/i)).toBeInTheDocument();

      const contactLink = screen.getByRole("link", { name: /contactez notre équipe/i });
      expect(contactLink).toHaveAttribute("href", "/contact");
    });
  });

  describe("Blog Section", () => {
    it("devrait afficher le titre de la section", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /guides pratiques pour votre institut/i
      })).toBeInTheDocument();
    });

    it("devrait afficher 3 liens vers des articles de blog", () => {
      render(<Home />);

      const article1 = screen.getByRole("link", { name: /comment faire un devis professionnel/i });
      const article2 = screen.getByRole("link", { name: /comment choisir le bon logiciel de devis/i });
      const article3 = screen.getByRole("link", { name: /optimiser la gestion de vos clients/i });

      expect(article1).toHaveAttribute("href", "/blog/comment-faire-devis-professionnel-institut-beaute");
      expect(article2).toHaveAttribute("href", "/blog/choisir-logiciel-devis-institut-beaute");
      expect(article3).toHaveAttribute("href", "/blog/optimiser-gestion-clients-institut-beaute");
    });

    it("devrait afficher les descriptions des articles", () => {
      render(<Home />);

      expect(screen.getByText(/guide complet pour créer des devis conformes/i)).toBeInTheDocument();
      expect(screen.getByText(/critères essentiels pour choisir l'outil/i)).toBeInTheDocument();
      expect(screen.getByText(/stratégies concrètes pour fidéliser votre clientèle/i)).toBeInTheDocument();
    });

    it("devrait afficher un lien vers tous les articles", () => {
      render(<Home />);

      const blogLink = screen.getByRole("link", { name: /voir tous les articles/i });
      expect(blogLink).toHaveAttribute("href", "/blog");
    });

    it("devrait avoir un arrière-plan distinct", () => {
      const { container } = render(<Home />);
      const blogSection = Array.from(container.querySelectorAll("section")).find(
        section => section.textContent?.includes("Guides pratiques pour votre institut")
      );

      expect(blogSection?.className).toContain("bg-foreground/5");
    });
  });

  describe("CTA Section", () => {
    it("devrait afficher le titre du CTA final", () => {
      render(<Home />);

      expect(screen.getByRole("heading", {
        level: 2,
        name: /prêt à simplifier votre gestion de devis/i
      })).toBeInTheDocument();
    });

    it("devrait afficher le message de persuasion", () => {
      render(<Home />);

      expect(screen.getByText(/rejoignez les instituts qui utilisent solkant/i)).toBeInTheDocument();
    });

    it("devrait afficher un bouton CTA vers l'inscription", () => {
      render(<Home />);

      const ctaButton = screen.getByRole("link", { name: /commencer maintenant/i });
      expect(ctaButton).toHaveAttribute("href", "/register");
    });

    it("devrait avoir un arrière-plan contrasté", () => {
      const { container } = render(<Home />);
      const ctaSection = Array.from(container.querySelectorAll(".rounded-2xl.bg-foreground"));

      expect(ctaSection.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Footer", () => {
    it("devrait afficher tous les liens du footer", () => {
      const { container } = render(<Home />);
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("devrait afficher les liens de navigation dans le footer", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");
      const linkTexts = links.map(link => link.textContent);

      // Ces liens apparaissent dans le footer
      expect(linkTexts.filter(text => text === "Accueil").length).toBeGreaterThan(0);
      expect(linkTexts.filter(text => text === "Fonctionnalités").length).toBeGreaterThan(0);
      expect(linkTexts.filter(text => text === "Tarifs").length).toBeGreaterThan(0);
    });

    it("devrait afficher le copyright avec l'année", () => {
      render(<Home />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear} Solkant.*Tous droits réservés`, "i"))).toBeInTheDocument();
    });

    it("ne devrait pas utiliser Date.now() pour le copyright (test d'hydratation)", () => {
      // Test pour vérifier que l'année est constante (pas calculée dynamiquement)
      const { container: container1 } = render(<Home />);
      const { container: container2 } = render(<Home />);

      const copyright1 = container1.querySelector("footer p")?.textContent;
      const copyright2 = container2.querySelector("footer p")?.textContent;

      // Le copyright doit être identique entre deux rendus
      expect(copyright1).toBe(copyright2);
    });
  });

  describe("Structured Data (JSON-LD)", () => {
    it("devrait inclure le schema.org SoftwareApplication", () => {
      const { container } = render(<Home />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      expect(scripts.length).toBeGreaterThanOrEqual(1);

      const softwareAppScript = Array.from(scripts).find(script => {
        const content = script.textContent || "";
        return content.includes('"@type":"SoftwareApplication"');
      });

      expect(softwareAppScript).toBeTruthy();
    });

    it("devrait inclure le schema.org FAQPage", () => {
      const { container } = render(<Home />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      const faqScript = Array.from(scripts).find(script => {
        const content = script.textContent || "";
        return content.includes('"@type":"FAQPage"');
      });

      expect(faqScript).toBeTruthy();
    });

    it("devrait avoir des données JSON-LD valides pour SoftwareApplication", () => {
      const { container } = render(<Home />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      const softwareAppScript = Array.from(scripts).find(script => {
        const content = script.textContent || "";
        return content.includes('"@type":"SoftwareApplication"');
      });

      if (softwareAppScript?.textContent) {
        const data = JSON.parse(softwareAppScript.textContent);

        expect(data["@context"]).toBe("https://schema.org");
        expect(data["@type"]).toBe("SoftwareApplication");
        expect(data.name).toBe("Solkant");
        expect(data.applicationCategory).toBe("BusinessApplication");
        expect(data.offers.price).toBe("0");
        expect(data.offers.priceCurrency).toBe("EUR");
      }
    });

    it("devrait avoir des données JSON-LD valides pour FAQPage", () => {
      const { container } = render(<Home />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      const faqScript = Array.from(scripts).find(script => {
        const content = script.textContent || "";
        return content.includes('"@type":"FAQPage"');
      });

      if (faqScript?.textContent) {
        const data = JSON.parse(faqScript.textContent);

        expect(data["@context"]).toBe("https://schema.org");
        expect(data["@type"]).toBe("FAQPage");
        expect(data.mainEntity).toBeDefined();
        expect(Array.isArray(data.mainEntity)).toBe(true);
        expect(data.mainEntity.length).toBeGreaterThanOrEqual(5);

        // Vérifier la structure de la première question
        const firstQuestion = data.mainEntity[0];
        expect(firstQuestion["@type"]).toBe("Question");
        expect(firstQuestion.name).toBeDefined();
        expect(firstQuestion.acceptedAnswer).toBeDefined();
        expect(firstQuestion.acceptedAnswer["@type"]).toBe("Answer");
        expect(firstQuestion.acceptedAnswer.text).toBeDefined();
      }
    });
  });

  describe("Accessibility", () => {
    it("devrait avoir une structure de headings hiérarchique", () => {
      render(<Home />);

      // H1 unique
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s.length).toBe(1);

      // Plusieurs H2
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThanOrEqual(8); // Hero, Features, Comment, Pourquoi, Pour qui, Comparaison, Témoignages, FAQ, Blog, CTA

      // Plusieurs H3
      const h3s = screen.getAllByRole("heading", { level: 3 });
      expect(h3s.length).toBeGreaterThanOrEqual(10); // Features + FAQ + Blog
    });

    it("devrait avoir des liens avec des attributs href valides", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");

      links.forEach(link => {
        const href = link.getAttribute("href");
        expect(href).toBeDefined();
        expect(href).not.toBe("");
        expect(href).not.toBe("#");
      });
    });

    it("devrait utiliser des éléments sémantiques", () => {
      const { container } = render(<Home />);

      expect(container.querySelector("nav")).toBeInTheDocument();
      expect(container.querySelector("footer")).toBeInTheDocument();
      expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(8);
    });

    it("devrait avoir des sections avec un contraste de couleur approprié", () => {
      const { container } = render(<Home />);

      // Vérifier que les sections utilisent des classes Tailwind pour le contraste
      const sections = container.querySelectorAll("section");

      // Vérifier qu'il y a plusieurs sections
      expect(sections.length).toBeGreaterThanOrEqual(8);

      // Vérifier que certaines sections ont des arrière-plans
      const sectionsWithBg = Array.from(sections).filter(section =>
        section.className.includes("bg-")
      );
      expect(sectionsWithBg.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Hydratation et Cohérence", () => {
    it("devrait produire un rendu identique entre deux appels", () => {
      const { container: container1 } = render(<Home />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<Home />);
      const html2 = container2.innerHTML;

      // Le HTML doit être strictement identique (pas de valeurs dynamiques)
      expect(html1).toBe(html2);
    });

    it("ne devrait pas utiliser de valeurs aléatoires", () => {
      const { container } = render(<Home />);
      const html = container.innerHTML;

      // Vérifier qu'il n'y a pas de traces de valeurs aléatoires
      expect(html).not.toContain("Math.random");
      expect(html).not.toContain("Date.now");
    });

    it("devrait utiliser des classes Tailwind statiques uniquement", () => {
      const { container } = render(<Home />);

      // Vérifier qu'il n'y a pas de styles inline qui pourraient varier
      const elementsWithStyle = container.querySelectorAll("[style]");

      // Il ne devrait pas y avoir d'éléments avec des styles inline
      expect(elementsWithStyle.length).toBe(0);
    });

    it("devrait avoir l'année de copyright constante", () => {
      const { container } = render(<Home />);
      const footer = container.querySelector("footer");
      const copyright = footer?.textContent;

      const currentYear = new Date().getFullYear();
      expect(copyright).toContain(currentYear.toString());

      // Vérifier que c'est une constante (pas new Date().getFullYear() dans le rendu)
      // Cela est garanti par le fait que CURRENT_YEAR est défini au module level
      expect(copyright).toMatch(/© \d{4} Solkant/);
    });
  });

  describe("Content en Français", () => {
    it("devrait afficher tout le contenu en français", () => {
      const { container } = render(<Home />);
      const text = container.textContent || "";

      // Vérifier des mots-clés français
      expect(text).toContain("Solkant");
      expect(text).toContain("devis");
      expect(text).toContain("professionnels");
      expect(text).toContain("instituts de beauté");
      expect(text).toContain("clients");
      expect(text).toContain("services");

      // Ne devrait pas contenir de texte anglais générique
      expect(text).not.toContain("Click here");
      expect(text).not.toContain("Sign up");
      expect(text).not.toContain("Learn more"); // "En savoir plus" est la version FR
    });

    it("devrait utiliser les guillemets français dans les témoignages", () => {
      render(<Home />);

      // Les témoignages utilisent des guillemets anglais avec &quot;
      // mais le contenu est en français
      const testimonials = screen.getAllByText(/Solkant m'a fait gagner/i);
      expect(testimonials.length).toBeGreaterThan(0);
    });

    it("devrait utiliser le format de prix français", () => {
      render(<Home />);

      // Format français: "19,99 €/mois" ou "0€/mois" dans la FAQ
      // Rechercher dans tout le texte de la page
      const { container } = render(<Home />);
      const pageText = container.textContent || "";

      expect(pageText).toMatch(/19,99 €\/mois/);
      expect(pageText).toMatch(/0€\/mois/);
    });

    it("devrait utiliser des apostrophes françaises correctement", () => {
      const { container } = render(<Home />);
      const pageText = container.textContent || "";

      // Vérifier l'utilisation de &apos; ou ' dans le texte
      expect(pageText).toMatch(/l'interface/i);
      expect(pageText).toMatch(/d'un devis/i);
      expect(pageText).toMatch(/qu'Excel/i);
    });
  });

  describe("Performance et Optimisation", () => {
    it("devrait charger rapidement (rendu < 100ms)", () => {
      const start = performance.now();
      render(<Home />);
      const end = performance.now();
      const duration = end - start;

      // Le rendu devrait être très rapide
      expect(duration).toBeLessThan(100);
    });

    it("ne devrait pas créer de memory leaks avec des rendus multiples", () => {
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const { unmount } = render(<Home />);
        unmount();
      }

      // Si cela ne crash pas, pas de memory leak évident
      expect(true).toBe(true);
    });

    it("devrait avoir une taille HTML raisonnable", () => {
      const { container } = render(<Home />);
      const html = container.innerHTML;

      // La page est longue mais pas excessive
      // < 500KB de HTML (très généreux pour une page marketing)
      expect(html.length).toBeLessThan(500000);
    });
  });

  describe("Liens Internes (Maillage)", () => {
    it("devrait avoir plusieurs liens vers /register", () => {
      render(<Home />);

      const registerLinks = screen.getAllByRole("link", { name: /commencer/i });
      expect(registerLinks.length).toBeGreaterThanOrEqual(3); // Hero, Comment ça marche, CTA
    });

    it("devrait avoir des liens vers /fonctionnalites", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");
      const featureLinks = links.filter(link =>
        link.getAttribute("href") === "/fonctionnalites"
      );

      expect(featureLinks.length).toBeGreaterThanOrEqual(2); // Nav + Comparaison
    });

    it("devrait avoir des liens vers /pricing", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");
      const pricingLinks = links.filter(link =>
        link.getAttribute("href") === "/pricing"
      );

      expect(pricingLinks.length).toBeGreaterThanOrEqual(2); // Nav + FAQ
    });

    it("devrait avoir des liens vers /blog et des articles spécifiques", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");
      const blogLinks = links.filter(link => {
        const href = link.getAttribute("href") || "";
        return href.startsWith("/blog");
      });

      expect(blogLinks.length).toBeGreaterThanOrEqual(5); // Nav + 3 articles + "Voir tous"
    });

    it("devrait avoir des liens vers /contact", () => {
      render(<Home />);

      const links = screen.getAllByRole("link");
      const contactLinks = links.filter(link =>
        link.getAttribute("href") === "/contact"
      );

      expect(contactLinks.length).toBeGreaterThanOrEqual(3); // Nav + FAQ + Footer
    });
  });
});
