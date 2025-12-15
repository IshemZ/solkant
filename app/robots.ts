import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Pages d'authentification (privées)
          "/login",
          "/register",
          "/verify-email",
          "/check-email",
          "/mot-de-passe-oublie",
          "/reinitialiser-mot-de-passe",
          // Dashboard complet (espace membre)
          "/dashboard/*",
          // Routes API (pas de contenu à indexer)
          "/api/*",
          // Routes internes Next.js
          "/_next/*",
          "/static/*",
        ],
      },
      // Bloquer les bots d'IA qui consomment des ressources sans apporter de trafic
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai"],
        disallow: ["/"],
      },
      // Bloquer les scrapers agressifs
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "BLEXBot",
        ],
        crawlDelay: 10, // Ralentir ces bots pour économiser de la bande passante
        disallow: ["/dashboard/*", "/api/*"],
      },
    ],
    sitemap: "https://solkant.com/sitemap.xml",
  };
}
