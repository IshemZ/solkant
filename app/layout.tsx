import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { SignUpTracker } from "@/components/analytics/SignUpTracker";
import { DevAnalyticsHelper } from "@/components/analytics/DevAnalyticsHelper";
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
  metadataBase: new URL("https://www.solkant.com"),
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
    url: "https://www.solkant.com",
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}

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
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        {/* Schema.org Organization - Données structurées globales */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Solkant",
              url: "https://www.solkant.com",
              logo: "https://www.solkant.com/logo.png",
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
                url: "https://www.solkant.com/contact",
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
            {/* GTM handles GA4 loading - no need for separate GoogleAnalytics component */}
            <PageViewTracker />
            <SignUpTracker />
            <CookieBanner />
            {process.env.NODE_ENV === "development" && <DevAnalyticsHelper />}
          </AnalyticsProvider>
        </SessionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
