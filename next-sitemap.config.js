module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://solkant.com",
  generateRobotsTxt: true,
  exclude: ["/dashboard/*", "/sentry-example-page", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  // Configuration SEO optimisée : priorités et fréquences de mise à jour
  transform: async (config, path) => {
    // Configuration par défaut
    let priority = 0.5;
    let changefreq = "monthly";

    // Page d'accueil - priorité maximale
    if (path === "/") {
      priority = 1.0;
      changefreq = "weekly";
    }
    // Pages principales (conversion)
    else if (path === "/pricing" || path === "/fonctionnalites") {
      priority = 0.9;
      changefreq = "monthly";
    }
    // Blog hub - mise à jour régulière
    else if (path === "/blog") {
      priority = 0.8;
      changefreq = "weekly";
    }
    // Articles de blog - contenu evergreen
    else if (path.startsWith("/blog/")) {
      priority = 0.6;
      changefreq = "monthly";
    }
    // Pages secondaires
    else if (path === "/contact" || path === "/a-propos") {
      priority = 0.5;
      changefreq = "yearly";
    }
    // Pages auth - faible priorité SEO
    else if (path === "/login" || path === "/register") {
      priority = 0.3;
      changefreq = "yearly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
