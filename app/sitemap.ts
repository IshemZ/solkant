import { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://solkant.com";
  const currentDate = new Date().toISOString();

  // Pages statiques principales (marketing)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/fonctionnalites`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Pages légales (faible priorité)
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/conditions-generales-vente`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Articles de blog (dynamique depuis blogArticles)
  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.modifiedTime || article.publishedTime,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Pages piliers (haute priorité SEO)
  const pillarPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/logiciel-devis-institut-beaute`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gestion-institut-beaute-guide`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.95,
    },
  ];

  // IMPORTANT: Pages auth et dashboard sont EXCLUES (pas dans le sitemap)
  // Elles seront bloquées via robots.txt et meta noindex

  return [...staticPages, ...legalPages, ...pillarPages, ...blogPages];
}
