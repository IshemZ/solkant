import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getEnv, logEnvSummary } from "@/lib/env";

// Validate environment variables at startup (server-side only)
getEnv();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devisio - Créez des devis élégants pour votre institut",
  description:
    "Devisio simplifie la création de devis professionnels pour les instituts de beauté. Gérez vos clients, services et générez des PDF personnalisés.",
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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
