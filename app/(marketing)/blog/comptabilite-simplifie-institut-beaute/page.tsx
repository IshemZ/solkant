import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comptabilité d'institut de beauté : guide simplifié pour débutants",
  description:
    "Guide simplifié pour comprendre la comptabilité d’un institut de beauté : obligations, astuces, erreurs à éviter et outils pour débutants.",
  openGraph: {
    title: "Comptabilité institut de beauté débutants",
    description:
      "Obligations, astuces, erreurs à éviter et outils pour gérer la comptabilité d’un institut de beauté.",
    url: "https://solkant.com/blog/comptabilite-institut-beaute-debutants",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-12T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-comptabilite.png",
        width: 1200,
        height: 630,
        alt: "Comptabilité institut de beauté débutants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comptabilité institut de beauté débutants",
    description:
      "Obligations, astuces, erreurs à éviter et outils pour gérer la comptabilité d’un institut de beauté.",
    images: ["https://solkant.com/images/og/article-comptabilite.png"],
  },
  alternates: {
    canonical:
      "https://solkant.com/blog/comptabilite-institut-beaute-debutants",
  },
};

export default function ArticleComptabiliteInstitutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Solkant
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/fonctionnalites"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Tarifs
                </Link>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-foreground hover:text-foreground"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>

      {/* Schema.org JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Comptabilité d'institut de beauté : guide simplifié pour débutants",
            description:
              "Guide simplifié pour comprendre la comptabilité d’un institut de beauté : obligations, astuces, erreurs à éviter et outils pour débutants.",
            image: "https://solkant.com/images/og/article-comptabilite.png",
            datePublished: "2025-12-12T09:00:00Z",
            dateModified: "2025-12-23T10:00:00Z",
            author: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
              logo: {
                "@type": "ImageObject",
                url: "https://solkant.com/images/og/home.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://solkant.com/blog/comptabilite-institut-beaute-debutants",
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://solkant.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://solkant.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Comptabilité institut de beauté débutants",
                item: "https://solkant.com/blog/comptabilite-institut-beaute-debutants",
              },
            ],
          }),
        }}
      />

      {/* FAQ Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Quelles sont les obligations comptables d’un institut de beauté ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tenue d’un livre de recettes, conservation des factures, déclaration de TVA, respect des délais de conservation, édition de devis et factures conformes.",
                },
              },
              {
                "@type": "Question",
                name: "Quels outils pour faciliter la comptabilité ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tableur Excel, logiciel de comptabilité, application mobile, accompagnement d’un expert-comptable.",
                },
              },
              {
                "@type": "Question",
                name: "Quelles erreurs fréquentes à éviter ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oublier de déclarer une recette, perdre une facture, ne pas archiver les documents, négliger la TVA ou les mentions légales.",
                },
              },
            ],
          }),
        }}
      />

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour au blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="font-medium text-foreground">
              Comptabilité & Débutants
            </span>
            <span>•</span>
            <time dateTime="2025-12-12">12 décembre 2025</time>
            <span>•</span>
            <span>4 min de lecture</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Comptabilité d&apos;institut de beauté : guide simplifié pour débutants
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Un guide simplifié pour comprendre la comptabilité de votre institut
            de beauté, destiné aux débutants et aux gérants qui souhaitent mieux
            gérer leurs finances et éviter les erreurs courantes.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Obligations comptables d’un institut de beauté
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Tenue d’un livre de recettes</li>
            <li>Conservation des factures et justificatifs</li>
            <li>Déclaration de TVA (si assujetti)</li>
            <li>Respect des délais de conservation (6 à 10 ans)</li>
            <li>Édition de devis et factures conformes</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Outils pour faciliter la comptabilité
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Tableur Excel ou Google Sheets</li>
            <li>Logiciel de comptabilité dédié</li>
            <li>Application mobile de gestion</li>
            <li>Accompagnement d’un expert-comptable</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Astuces pour bien gérer sa comptabilité
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Archiver tous les documents dès leur réception</li>
            <li>Faire un point mensuel sur les recettes et dépenses</li>
            <li>Vérifier la conformité des devis et factures</li>
            <li>Ne pas négliger la TVA et les déclarations sociales</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs fréquentes à éviter
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Oublier de déclarer une recette</li>
            <li>Perdre une facture ou un justificatif</li>
            <li>Ne pas archiver les documents</li>
            <li>Négliger la TVA ou les mentions légales</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">FAQ</h2>
          <dl>
            <dt className="font-semibold">
              Quelles sont les obligations comptables ?
            </dt>
            <dd className="mb-4">
              Livre de recettes, factures, TVA, conservation, conformité.
            </dd>
            <dt className="font-semibold">Quels outils utiliser ?</dt>
            <dd className="mb-4">
              Tableur, logiciel, application, expert-comptable.
            </dd>
            <dt className="font-semibold">Erreurs fréquentes ?</dt>
            <dd className="mb-4">
              Oublis de recettes, perte de documents, négligence TVA.
            </dd>
          </dl>
        </div>
      </article>
      </main>
    </div>
  );
}
