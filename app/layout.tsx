import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

// NOTE: Validation des env vars déplacée dans instrumentation.ts
// pour éviter erreurs au build time sur Vercel
// Les env vars sont validées au runtime via instrumentation.ts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solkant",
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
          {children}
          <Toaster position="top-right" richColors closeButton />
          <GoogleAnalytics />
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}
