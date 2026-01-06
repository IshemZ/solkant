import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis vs Facture : différences et obligations légales pour instituts",
  description:
    "Comprenez les différences entre devis et facture, et les obligations légales à respecter dans votre institut de beauté. Guide complet pour éviter les erreurs et rester conforme.",
  openGraph: {
    title: "Devis vs Facture : obligations légales institut de beauté",
    description:
      "Différences, mentions obligatoires, conseils et erreurs à éviter pour instituts de beauté.",
    url: "https://www.solkant.com/blog/devis-vs-facture-obligations-legales",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-05T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://www.solkant.com/images/og/article-devis-facture.png",
        width: 1200,
        height: 630,
        alt: "Devis vs Facture institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devis vs Facture : obligations légales institut de beauté",
    description:
      "Différences, mentions obligatoires, conseils et erreurs à éviter pour instituts de beauté.",
    images: ["https://www.solkant.com/images/og/article-devis-facture.png"],
  },
  alternates: {
    canonical: "https://www.solkant.com/blog/devis-vs-facture-obligations-legales",
  },
};

export default function ArticleDevisFacturePage() {
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
              "Devis vs Facture : différences et obligations légales pour instituts",
            description:
              "Comprenez les différences entre devis et facture, et les obligations légales à respecter dans votre institut de beauté. Guide complet pour éviter les erreurs et rester conforme.",
            image: "https://www.solkant.com/images/og/article-devis-facture.png",
            datePublished: "2025-12-05T09:00:00Z",
            dateModified: "2025-12-23T10:00:00Z",
            author: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://www.solkant.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://www.solkant.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.solkant.com/images/og/home.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://www.solkant.com/blog/devis-vs-facture-obligations-legales",
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
                item: "https://www.solkant.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.solkant.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Devis vs Facture : obligations légales",
                item: "https://www.solkant.com/blog/devis-vs-facture-obligations-legales",
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
                name: "Quelles sont les différences entre un devis et une facture ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Le devis est une proposition de prestation et de prix, la facture est le document officiel après réalisation et paiement. Le devis engage le professionnel après acceptation, la facture atteste la transaction.",
                },
              },
              {
                "@type": "Question",
                name: "Quelles mentions obligatoires sur un devis et une facture ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Devis : nom, coordonnées, client, date, prestations, prix, durée, mentions légales. Facture : numéro, date, prestations, prix, TVA, conditions de paiement, mentions légales.",
                },
              },
              {
                "@type": "Question",
                name: "Quels risques en cas d'erreur ou d'oubli ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Des erreurs ou oublis peuvent entraîner des litiges, des sanctions fiscales ou la nullité du document. Vérifiez toujours la conformité.",
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
              Légal & Pratique
            </span>
            <span>•</span>
            <time dateTime="2025-12-05">5 décembre 2025</time>
            <span>•</span>
            <span>5 min de lecture</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Devis vs Facture : différences et obligations légales pour instituts
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Comprenez les différences entre devis et facture, et les obligations
            légales à respecter dans votre institut de beauté. Évitez les
            erreurs courantes et restez conforme.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Devis vs Facture : définitions et rôles
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>
              <strong>Devis</strong> : proposition de prestation et de prix,
              engage le professionnel après acceptation du client.
            </li>
            <li>
              <strong>Facture</strong> : document officiel après réalisation et
              paiement, atteste la transaction.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Mentions obligatoires sur devis et facture
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>
              <strong>Devis</strong> : nom, coordonnées, client, date,
              prestations, prix, durée, mentions légales.
            </li>
            <li>
              <strong>Facture</strong> : numéro, date, prestations, prix, TVA,
              conditions de paiement, mentions légales.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Obligations légales et risques
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>
              Respectez les mentions obligatoires pour éviter litiges et
              sanctions
            </li>
            <li>Conservez les devis et factures (archivage légal)</li>
            <li>Vérifiez la conformité fiscale et sociale</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs courantes à éviter
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Oublier une mention obligatoire</li>
            <li>Numérotation incorrecte des factures</li>
            <li>Absence de preuve d’acceptation du devis</li>
            <li>Non-respect des délais de conservation</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">FAQ</h2>
          <dl>
            <dt className="font-semibold">
              Quelles sont les différences entre un devis et une facture ?
            </dt>
            <dd className="mb-4">
              Le devis est une proposition, la facture atteste la transaction
              après prestation et paiement.
            </dd>
            <dt className="font-semibold">Quelles mentions obligatoires ?</dt>
            <dd className="mb-4">
              Devis : nom, coordonnées, client, date, prestations, prix, durée,
              mentions légales. Facture : numéro, date, prestations, prix, TVA,
              paiement, mentions légales.
            </dd>
            <dt className="font-semibold">Quels risques en cas d’erreur ?</dt>
            <dd className="mb-4">
              Litiges, sanctions fiscales, nullité du document. Vérifiez
              toujours la conformité.
            </dd>
          </dl>
        </div>
      </article>
      </main>
    </div>
  );
}
