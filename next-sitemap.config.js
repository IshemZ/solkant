module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://solkant.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
