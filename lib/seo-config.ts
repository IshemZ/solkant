/**
 * Configuration SEO centralisée pour Solkant
 * Métadonnées partagées, URLs canoniques, OpenGraph, Twitter Cards
 */

export const siteConfig = {
  name: "Solkant",
  url: "https://www.solkant.com",
  description:
    "Logiciel SaaS de création de devis pour instituts de beauté, salons d'esthétique et spas. Gestion clients, catalogue de services et génération de PDF professionnels.",
  locale: "fr_FR",
  ogImage: "https://www.solkant.com/images/og/home.png",
  twitterHandle: "@solkant", // À configurer quand disponible
  email: "contact@solkant.com",
  keywords: [
    "logiciel devis beauté",
    "gestion institut beauté",
    "devis esthétique",
    "logiciel salon beauté",
    "SaaS beauté",
    "gestion clients beauté",
  ],
} as const;

/**
 * Génère les métadonnées OpenGraph complètes pour une page
 */
export function generateOpenGraph({
  title,
  description,
  url,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string;
  description: string;
  url: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}) {
  const ogImage = image || {
    url: siteConfig.ogImage,
    width: 1200,
    height: 630,
    alt: siteConfig.name,
  };

  const baseOg = {
    title,
    description,
    url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type,
    images: [
      {
        url: ogImage.url,
        width: ogImage.width || 1200,
        height: ogImage.height || 630,
        alt: ogImage.alt || title,
      },
    ],
  };

  // Ajouter les champs spécifiques aux articles
  if (type === "article" && (publishedTime || modifiedTime || authors)) {
    return {
      ...baseOg,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    };
  }

  return baseOg;
}

/**
 * Génère les métadonnées Twitter Card complètes
 */
export function generateTwitter({
  title,
  description,
  image,
  card = "summary_large_image",
}: {
  title: string;
  description: string;
  image?: string;
  card?: "summary" | "summary_large_image" | "app" | "player";
}) {
  return {
    card,
    title,
    description,
    ...(image && { images: [image] }),
    // creator: siteConfig.twitterHandle, // À décommenter quand Twitter disponible
  };
}

/**
 * Génère les métadonnées complètes pour une page
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}) {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords: keywords || siteConfig.keywords,
    openGraph: generateOpenGraph({
      title,
      description,
      url,
      image,
      type,
      publishedTime,
      modifiedTime,
      authors,
    }),
    twitter: generateTwitter({
      title,
      description,
      image: image?.url,
    }),
    alternates: {
      canonical: url,
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

/**
 * Génère les données structurées JSON-LD pour un article de blog
 */
export function generateArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * Génère les données structurées JSON-LD pour une FAQ
 */
export function generateFAQJsonLd(
  questions: ReadonlyArray<{ readonly question: string; readonly answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * Génère les données structurées JSON-LD pour un produit/service
 */
export function generateProductJsonLd({
  name,
  description,
  image,
  offers,
}: {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly offers: ReadonlyArray<{
    readonly name: string;
    readonly price: string;
    readonly priceCurrency: string;
    readonly description?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/pricing`,
      ...(offer.description && { description: offer.description }),
    })),
  };
}

/**
 * Génère les données structurées JSON-LD pour fil d'Ariane (Breadcrumb)
 */
export function generateBreadcrumbJsonLd(
  items: ReadonlyArray<{ readonly name: string; readonly url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
