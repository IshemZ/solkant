// Liste centralisée des articles de blog
// À déplacer vers une base de données ou CMS dans le futur

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role?: string;
  };
  publishedTime: string; // Format ISO 8601 pour SEO
  modifiedTime?: string; // Format ISO 8601 pour SEO
  image: {
    url: string;
    alt: string;
  };
  keywords?: string[]; // Mots-clés SEO
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "comment-faire-devis-professionnel-institut-beaute",
    title: "Comment faire un devis professionnel pour votre institut de beauté",
    description:
      "Guide complet pour créer des devis clairs, conformes et professionnels qui rassurent vos clients et valorisent votre expertise.",
    date: "2024-12-01",
    readTime: "8 min",
    category: "Guides",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2024-12-01T09:00:00Z",
    modifiedTime: "2024-12-01T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/article-devis.png",
      alt: "Comment faire un devis professionnel pour votre institut de beauté",
    },
    keywords: [
      "devis institut beauté",
      "devis professionnel",
      "salon esthétique",
      "mentions obligatoires devis",
    ],
  },
  {
    slug: "erreurs-eviter-devis-institut-beaute",
    title: "Devis beauté : les 10 erreurs fatales à éviter absolument",
    description:
      "Découvrez les erreurs les plus courantes qui font fuir les clientes et comment les corriger pour maximiser vos conversions.",
    date: "2024-12-06",
    readTime: "7 min",
    category: "Conseils",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2024-12-06T10:00:00Z",
    modifiedTime: "2024-12-06T10:00:00Z",
    image: {
      url: "https://solkant.com/images/og/article-erreurs-devis.png",
      alt: "Les erreurs à éviter dans vos devis beauté",
    },
    keywords: [
      "erreurs devis",
      "devis beauté",
      "conversion clients",
      "gestion institut",
    ],
  },
  {
    slug: "digitaliser-gestion-institut-beaute",
    title:
      "Pourquoi digitaliser la gestion de votre institut de beauté en 2025 ?",
    description:
      "Les 7 raisons essentielles de passer au numérique et comment réussir votre transformation digitale étape par étape.",
    date: "2024-12-06",
    readTime: "9 min",
    category: "Transformation digitale",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2024-12-06T14:00:00Z",
    modifiedTime: "2024-12-06T14:00:00Z",
    image: {
      url: "https://solkant.com/images/og/article-digitalisation.png",
      alt: "Digitaliser la gestion de votre institut de beauté",
    },
    keywords: [
      "digitalisation institut beauté",
      "transformation digitale",
      "logiciel gestion salon",
      "modernisation",
    ],
  },
  {
    slug: "choisir-logiciel-devis-institut-beaute",
    title: "Comment choisir le bon logiciel de devis pour votre institut",
    description:
      "Les critères essentiels pour sélectionner un outil de gestion de devis adapté à votre activité d'esthéticienne ou gérante de salon.",
    date: "2024-11-28",
    readTime: "6 min",
    category: "Conseils",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2024-11-28T09:00:00Z",
    modifiedTime: "2024-11-28T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/article-choisir-logiciel.png",
      alt: "Comment choisir le bon logiciel de devis pour votre institut",
    },
    keywords: [
      "logiciel devis",
      "choisir logiciel",
      "institut beauté",
      "comparatif",
    ],
  },
  {
    slug: "optimiser-gestion-clients-institut-beaute",
    title: "5 astuces pour optimiser la gestion de vos clients",
    description:
      "Découvrez comment mieux organiser votre fichier clients, suivre l'historique des prestations et fidéliser votre clientèle.",
    date: "2024-11-25",
    readTime: "5 min",
    category: "Organisation",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2024-11-25T09:00:00Z",
    modifiedTime: "2024-11-25T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/article-gestion-clients.png",
      alt: "5 astuces pour optimiser la gestion de vos clients",
    },
    keywords: [
      "gestion clients",
      "fichier clients",
      "fidélisation",
      "organisation institut",
    ],
  },
];
