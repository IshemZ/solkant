import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ouvrir un institut de beauté : toutes les démarches administratives",
  description:
    "Toutes les démarches administratives pour ouvrir un institut de beauté : étapes, documents, conseils et erreurs à éviter. Guide complet pour réussir votre projet.",
  openGraph: {
    title: "Ouvrir un institut de beauté : démarches administratives",
    description:
      "Étapes, documents, conseils et erreurs à éviter pour ouvrir un institut de beauté en toute sérénité.",
    url: "https://solkant.com/blog/ouvrir-institut-beaute-demarches-administratives",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-15T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-ouvrir-institut.png",
        width: 1200,
        height: 630,
        alt: "Ouvrir institut de beauté démarches administratives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ouvrir un institut de beauté : démarches administratives",
    description:
      "Étapes, documents, conseils et erreurs à éviter pour ouvrir un institut de beauté en toute sérénité.",
    images: ["https://solkant.com/images/og/article-ouvrir-institut.png"],
  },
  alternates: {
    canonical:
      "https://solkant.com/blog/ouvrir-institut-beaute-demarches-administratives",
  },
};

export default function ArticleOuvrirInstitutPage() {
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

      {/* Schema.org JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Ouvrir un institut de beauté : toutes les démarches administratives",
            description:
              "Toutes les démarches administratives pour ouvrir un institut de beauté : étapes, documents, conseils et erreurs à éviter. Guide complet pour réussir votre projet.",
            image: "https://solkant.com/images/og/article-ouvrir-institut.png",
            datePublished: "2025-12-15T09:00:00Z",
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
                "https://solkant.com/blog/ouvrir-institut-beaute-demarches-administratives",
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
                name: "Ouvrir institut de beauté démarches administratives",
                item: "https://solkant.com/blog/ouvrir-institut-beaute-demarches-administratives",
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
                name: "Quelles sont les étapes pour ouvrir un institut de beauté ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Étude de marché, choix du statut juridique, démarches administratives (CFE, URSSAF, TVA), obtention des diplômes, assurance, ouverture du compte bancaire professionnel, déclaration à la mairie si besoin.",
                },
              },
              {
                "@type": "Question",
                name: "Quels documents sont nécessaires ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pièce d’identité, justificatif de domicile, diplôme, statuts de la société, attestation d’assurance, bail commercial, déclaration d’ouverture.",
                },
              },
              {
                "@type": "Question",
                name: "Quelles erreurs fréquentes à éviter ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oublier une démarche, négliger l’assurance, choisir un statut juridique inadapté, ne pas anticiper les charges sociales et fiscales.",
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
              Démarches & Création
            </span>
            <span>•</span>
            <time dateTime="2025-12-15">15 décembre 2025</time>
            <span>•</span>
            <span>6 min de lecture</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Ouvrir un institut de beauté : toutes les démarches administratives
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Retrouvez toutes les démarches administratives à suivre pour ouvrir
            votre institut de beauté en toute sérénité : étapes, documents,
            conseils et erreurs à éviter.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Étapes pour ouvrir un institut de beauté
          </h2>
          <ol className="list-decimal ml-6 mb-6">
            <li>Réaliser une étude de marché et un business plan</li>
            <li>
              Choisir le statut juridique adapté (auto-entrepreneur, SARL, etc.)
            </li>
            <li>Effectuer les démarches administratives (CFE, URSSAF, TVA)</li>
            <li>Obtenir les diplômes et autorisations nécessaires</li>
            <li>Souscrire une assurance professionnelle</li>
            <li>Ouvrir un compte bancaire professionnel</li>
            <li>Déclarer l’ouverture à la mairie si besoin</li>
          </ol>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Documents nécessaires
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Pièce d’identité</li>
            <li>Justificatif de domicile</li>
            <li>Diplôme ou attestation de qualification</li>
            <li>Statuts de la société</li>
            <li>Attestation d’assurance</li>
            <li>Bail commercial</li>
            <li>Déclaration d’ouverture</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Conseils pour réussir son ouverture
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Anticiper les charges sociales et fiscales</li>
            <li>Bien choisir son emplacement</li>
            <li>Prévoir une communication efficace</li>
            <li>Se faire accompagner par des experts</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs fréquentes à éviter
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Oublier une démarche administrative</li>
            <li>Négliger l’assurance professionnelle</li>
            <li>Choisir un statut juridique inadapté</li>
            <li>Ne pas anticiper les charges</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">FAQ</h2>
          <dl>
            <dt className="font-semibold">
              Quelles sont les étapes pour ouvrir un institut ?
            </dt>
            <dd className="mb-4">
              Étude de marché, statut juridique, démarches, diplômes, assurance,
              compte bancaire, déclaration.
            </dd>
            <dt className="font-semibold">Documents nécessaires ?</dt>
            <dd className="mb-4">
              Identité, domicile, diplôme, statuts, assurance, bail,
              déclaration.
            </dd>
            <dt className="font-semibold">Erreurs fréquentes ?</dt>
            <dd className="mb-4">
              Oublis, négligence assurance, mauvais statut, charges non
              anticipées.
            </dd>
          </dl>
        </div>
      </article>
    </div>
  );
}
