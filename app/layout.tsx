import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { SignUpTracker } from "@/components/analytics/SignUpTracker";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

// NOTE: Validation des env vars déplacée dans instrumentation.ts
// pour éviter erreurs au build time sur Vercel
// Les env vars sont validées au runtime via instrumentation.ts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent render blocking
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Prevent render blocking
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solkant.com"),
  title: {
    default: "Solkant – Logiciel de devis pour instituts de beauté",
    template: "%s | Solkant",
  },
  description:
    "Créez des devis professionnels pour votre institut de beauté en quelques clics. Gestion clients, catalogue de services, PDF personnalisés. Essai gratuit sans carte bancaire.",
  keywords: [
    "logiciel devis institut beauté",
    "logiciel devis esthéticienne",
    "gestion institut beauté",
    "devis PDF professionnel",
    "logiciel salon esthétique",
    "gestion clients beauté",
    "devis spa",
  ],
  authors: [{ name: "Solkant" }],
  creator: "Solkant",
  publisher: "Solkant",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://solkant.com",
    siteName: "Solkant",
    title: "Solkant – Logiciel de devis pour instituts de beauté",
    description:
      "Simplifiez la création de devis pour votre institut avec Solkant. Interface simple, PDF élégants, gain de temps garanti.",
    images: [
      {
        url: "/images/og/home.png",
        width: 1200,
        height: 630,
        alt: "Solkant - Créez des devis élégants pour votre institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solkant – Logiciel de devis pour instituts de beauté",
    description:
      "Créez des devis professionnels pour votre institut en quelques clics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // À remplir après inscription dans Search Console
    google: "", // Google Search Console verification code
    // yandex: "", // Si vous ciblez les marchés russes
    // bing: "", // Bing Webmaster Tools
  },
};

// Audit A11y en développement uniquement - DÉSACTIVÉ temporairement
// Cause "window is not defined" en mode Turbopack
// TODO: Réactiver après migration stable
/*
if (process.env.NODE_ENV === "development") {
  logEnvSummary();
  import("@axe-core/react").then((axe) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactDOM = require("react-dom");
    axe.default(React, ReactDOM, 1000);
  });
}
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Schema.org Organization - Données structurées globales */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
              logo: "https://solkant.com/logo.png",
              description:
                "Logiciel SaaS de création de devis pour instituts de beauté, salons d'esthétique et spas. Gestion clients, catalogue de services et génération de PDF professionnels.",
              foundingDate: "2024",
              address: {
                "@type": "PostalAddress",
                addressCountry: "FR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "contact@solkant.com",
                availableLanguage: ["French"],
                url: "https://solkant.com/contact",
              },
              sameAs: [
                // Ajouter ici vos réseaux sociaux quand disponibles
                // "https://www.facebook.com/solkant",
                // "https://www.linkedin.com/company/solkant",
                // "https://twitter.com/solkant",
              ],
              areaServed: {
                "@type": "Country",
                name: "France",
              },
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
            }),
          }}
        />
        <SessionProvider>
          <AnalyticsProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
            <GoogleAnalytics />
            <PageViewTracker />
            <SignUpTracker />
            <CookieBanner />
          </AnalyticsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
