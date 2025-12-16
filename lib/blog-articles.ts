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
  // NOUVEAUX ARTICLES SATELLITES (Section 3 - Renforcement des piliers)
  {
    slug: "devis-en-ligne-vs-papier-institut-beaute",
    title: "Devis en ligne vs devis papier : quel choix pour votre institut de beauté ?",
    description:
      "Découvrez les avantages et inconvénients du devis papier et du devis numérique pour instituts de beauté. Comparatif complet pour faire le bon choix en 2025.",
    date: "2025-01-10",
    readTime: "7 min",
    category: "Comparatif",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-10T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Devis en ligne vs papier institut beauté",
    },
    keywords: [
      "devis en ligne",
      "devis papier",
      "digitalisation",
      "comparatif",
    ],
  },
  {
    slug: "cout-logiciel-devis-petit-institut",
    title: "Combien coûte vraiment un logiciel de devis pour petit institut ?",
    description:
      "Découvrez le vrai coût d'un logiciel de devis pour institut de beauté : abonnements, fonctionnalités, retour sur investissement. Comparatif complet 2025.",
    date: "2025-01-12",
    readTime: "8 min",
    category: "Budget",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-12T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Coût logiciel devis institut beauté",
    },
    keywords: [
      "prix logiciel devis",
      "budget institut",
      "ROI",
      "abonnement",
    ],
  },
  {
    slug: "modele-devis-gratuit-institut-beaute",
    title: "Modèle de devis gratuit pour institut de beauté (Word + conseils)",
    description:
      "Téléchargez un modèle de devis gratuit personnalisable pour votre institut. Guide complet des mentions obligatoires et bonnes pratiques 2025.",
    date: "2025-01-14",
    readTime: "6 min",
    category: "Ressources",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-14T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Modèle devis gratuit institut beauté",
    },
    keywords: [
      "modèle devis gratuit",
      "template devis",
      "exemple devis beauté",
    ],
  },
  {
    slug: "fideliser-clientes-institut-beaute-strategies",
    title: "7 stratégies éprouvées pour fidéliser vos clientes d'institut de beauté",
    description:
      "Découvrez comment transformer vos clientes occasionnelles en clientes fidèles avec 7 stratégies concrètes et actionnables. Guide complet fidélisation 2025.",
    date: "2025-01-15",
    readTime: "9 min",
    category: "Fidélisation",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-15T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Fidéliser clientes institut beauté",
    },
    keywords: [
      "fidélisation clients",
      "rétention",
      "programme fidélité",
      "relation client",
    ],
  },
  {
    slug: "envoyer-devis-par-email-bonnes-pratiques",
    title: "Comment envoyer un devis par email : le guide complet 2025",
    description:
      "Objet d'email, timing d'envoi, relances efficaces : découvrez toutes les bonnes pratiques pour maximiser l'acceptation de vos devis envoyés par email.",
    date: "2025-01-17",
    readTime: "7 min",
    category: "Guides",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-17T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Envoyer devis par email bonnes pratiques",
    },
    keywords: [
      "envoyer devis email",
      "objet email devis",
      "relance devis",
    ],
  },
  {
    slug: "difference-devis-facture-institut-beaute",
    title: "Devis vs Facture : différences et obligations légales pour instituts",
    description:
      "Quelle est la différence entre un devis et une facture ? Quand sont-ils obligatoires ? Guide juridique complet pour gérer correctement vos documents commerciaux.",
    date: "2025-01-19",
    readTime: "6 min",
    category: "Juridique",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-19T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Différence devis facture institut beauté",
    },
    keywords: [
      "devis vs facture",
      "différence devis facture",
      "obligations légales",
    ],
  },
  {
    slug: "organiser-planning-rendez-vous-institut",
    title: "Comment organiser efficacement le planning de votre institut de beauté",
    description:
      "Optimisez votre planning pour éviter les trous dans l'agenda, réduire les no-shows et maximiser votre chiffre d'affaires. Méthodes et outils 2025.",
    date: "2025-01-21",
    readTime: "8 min",
    category: "Organisation",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-21T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Organiser planning institut beauté",
    },
    keywords: [
      "planning institut",
      "organisation rendez-vous",
      "agenda beauté",
    ],
  },
  {
    slug: "comptabilite-simplifie-institut-beaute",
    title: "Comptabilité d'institut de beauté : guide simplifié pour débutants",
    description:
      "TVA, déclarations, facturation, charges : découvrez les bases de la comptabilité pour instituts de beauté en micro-entreprise ou société. Guide pratique 2025.",
    date: "2025-01-23",
    readTime: "10 min",
    category: "Comptabilité",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-23T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Comptabilité institut beauté",
    },
    keywords: [
      "comptabilité institut",
      "TVA esthétique",
      "micro-entreprise beauté",
    ],
  },
  {
    slug: "ouvrir-institut-beaute-demarches-administratives",
    title: "Ouvrir un institut de beauté : toutes les démarches administratives",
    description:
      "SIRET, assurances, déclarations, local : checklist complète des démarches pour ouvrir votre institut de beauté en 2025. Guide étape par étape.",
    date: "2025-01-25",
    readTime: "12 min",
    category: "Création",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-25T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Ouvrir institut beauté démarches",
    },
    keywords: [
      "ouvrir institut beauté",
      "créer salon esthétique",
      "démarches administratives",
    ],
  },
  {
    slug: "fixer-tarifs-prestations-institut-beaute",
    title: "Comment fixer vos tarifs de prestations en institut de beauté ?",
    description:
      "Méthode complète pour calculer vos prix : coûts réels, positionnement, concurrence, psychologie des prix. Guide pratique pour instituts débutants et confirmés.",
    date: "2025-01-27",
    readTime: "9 min",
    category: "Stratégie",
    author: {
      name: "Solkant",
      role: "Équipe éditoriale",
    },
    publishedTime: "2025-01-27T09:00:00Z",
    image: {
      url: "https://solkant.com/images/og/blog.png",
      alt: "Fixer tarifs institut beauté",
    },
    keywords: [
      "fixer prix institut",
      "tarifs prestations beauté",
      "stratégie pricing",
    ],
  },
];
