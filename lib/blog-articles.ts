// Liste centralisée des articles de blog
// À déplacer vers une base de données ou CMS dans le futur

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
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
  },
  {
    slug: "choisir-logiciel-devis-institut-beaute",
    title: "Comment choisir le bon logiciel de devis pour votre institut",
    description:
      "Les critères essentiels pour sélectionner un outil de gestion de devis adapté à votre activité d'esthéticienne ou gérante de salon.",
    date: "2024-11-28",
    readTime: "6 min",
    category: "Conseils",
  },
  {
    slug: "optimiser-gestion-clients-institut-beaute",
    title: "5 astuces pour optimiser la gestion de vos clients",
    description:
      "Découvrez comment mieux organiser votre fichier clients, suivre l'historique des prestations et fidéliser votre clientèle.",
    date: "2024-11-25",
    readTime: "5 min",
    category: "Organisation",
  },
];
