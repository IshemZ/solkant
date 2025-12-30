/**
 * Configuration i18n pour le support multilingue futur
 * Prépare l'infrastructure pour l'expansion internationale de Solkant
 */

export type Locale = "fr" | "en" | "es" | "de" | "it";

export const defaultLocale: Locale = "fr";

export const locales: Locale[] = ["fr", "en", "es", "de", "it"];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

export const localeRegions: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
};

/**
 * Génère les balises hreflang pour une URL donnée
 * À utiliser dans les métadonnées de page quand le multilingue sera activé
 */
export function generateHreflangLinks(pathname: string): Array<{
  hreflang: string;
  href: string;
}> {
  const baseUrl = "https://solkant.com";

  const links: Array<{ hreflang: string; href: string }> = [
    {
      hreflang: "fr",
      href: `${baseUrl}${pathname}`,
    },
    {
      hreflang: "x-default",
      href: `${baseUrl}${pathname}`,
    },
  ];

  return links;
}

/**
 * Génère les métadonnées alternates pour Next.js metadata
 * Inclut canonical et langues alternatives
 */
export function generateAlternates(pathname: string) {
  const baseUrl = "https://solkant.com";

  return {
    canonical: `${baseUrl}${pathname}`,
    languages: {
      fr: `${baseUrl}${pathname}`,
      "x-default": `${baseUrl}${pathname}`,
    },
  };
}

/**
 * Configuration des marchés cibles pour chaque locale
 * Utile pour Google Search Console et Analytics
 */
export const targetMarkets: Record<
  Locale,
  { countries: string[]; priority: number }
> = {
  fr: {
    countries: ["FR", "BE", "CH", "LU", "MC"],
    priority: 1,
  },
  en: {
    countries: ["US", "GB", "CA", "AU", "IE"],
    priority: 2,
  },
  es: {
    countries: ["ES", "MX", "AR", "CO", "CL"],
    priority: 3,
  },
  de: {
    countries: ["DE", "AT", "CH"],
    priority: 4,
  },
  it: {
    countries: ["IT", "CH"],
    priority: 5,
  },
};

/**
 * Dictionnaire de traductions pour les éléments clés du site
 * À enrichir quand l'expansion multilingue sera mise en place
 */
export const translations: Record<Locale, Record<string, string>> = {
  fr: {
    "site.name": "Solkant",
    "site.tagline":
      "Logiciel de devis pour instituts de beauté et salons d'esthétique",
    "nav.features": "Fonctionnalités",
    "nav.pricing": "Tarifs",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.start": "Commencer",
    "cta.login": "Connexion",
  },
  en: {
    "site.name": "Solkant",
    "site.tagline": "Quote software for beauty salons and spas",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.start": "Get Started",
    "cta.login": "Login",
  },
  es: {
    "site.name": "Solkant",
    "site.tagline":
      "Software de presupuestos para institutos de belleza y spas",
    "nav.features": "Características",
    "nav.pricing": "Precios",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "cta.start": "Empezar",
    "cta.login": "Iniciar sesión",
  },
  de: {
    "site.name": "Solkant",
    "site.tagline": "Angebotssoftware für Schönheitssalons und Spas",
    "nav.features": "Funktionen",
    "nav.pricing": "Preise",
    "nav.blog": "Blog",
    "nav.contact": "Kontakt",
    "cta.start": "Loslegen",
    "cta.login": "Anmelden",
  },
  it: {
    "site.name": "Solkant",
    "site.tagline": "Software preventivi per istituti di bellezza e spa",
    "nav.features": "Caratteristiche",
    "nav.pricing": "Prezzi",
    "nav.blog": "Blog",
    "nav.contact": "Contatto",
    "cta.start": "Inizia",
    "cta.login": "Accedi",
  },
};

/**
 * Helper pour obtenir une traduction
 * Fallback sur français si la clé n'existe pas
 */
export function t(key: string, locale: Locale = defaultLocale): string {
  return translations[locale]?.[key] || translations[defaultLocale][key] || key;
}
