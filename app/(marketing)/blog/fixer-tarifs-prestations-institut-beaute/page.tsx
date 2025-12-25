import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Comment fixer vos tarifs de prestations en institut de beauté ? pourquoi ?",
  description:
    "Méthodes et conseils pour fixer les tarifs de prestations en institut de beauté : calculs, erreurs à éviter, astuces pour rentabilité et satisfaction client.",
  openGraph: {
    title: "Fixer tarifs prestations institut de beauté",
    description:
      "Méthodes, calculs, erreurs à éviter et astuces pour fixer les tarifs de prestations en institut de beauté.",
    url: "https://solkant.com/blog/fixer-tarifs-prestations-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-18T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-tarifs.png",
        width: 1200,
        height: 630,
        alt: "Fixer tarifs prestations institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixer tarifs prestations institut de beauté",
    description:
      "Méthodes, calculs, erreurs à éviter et astuces pour fixer les tarifs de prestations en institut de beauté.",
    images: ["https://solkant.com/images/og/article-tarifs.png"],
  },
  alternates: {
    canonical:
      "https://solkant.com/blog/fixer-tarifs-prestations-institut-beaute",
  },
};

export default function ArticleFixerTarifsPage() {
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
              "Comment fixer vos tarifs de prestations en institut de beauté ? pourquoi ?",
            description:
              "Méthodes et conseils pour fixer les tarifs de prestations en institut de beauté : calculs, erreurs à éviter, astuces pour rentabilité et satisfaction client.",
            image: "https://solkant.com/images/og/article-tarifs.png",
            datePublished: "2025-12-18T09:00:00Z",
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
                "https://solkant.com/blog/fixer-tarifs-prestations-institut-beaute",
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
                name: "Fixer tarifs prestations institut de beauté",
                item: "https://solkant.com/blog/fixer-tarifs-prestations-institut-beaute",
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
                name: "Comment calculer le tarif d’une prestation ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Additionnez le coût des produits, le temps de travail, les charges fixes, la marge souhaitée et comparez avec les prix du marché local.",
                },
              },
              {
                "@type": "Question",
                name: "Quelles erreurs à éviter lors de la fixation des tarifs ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sous-évaluer le temps de travail, ignorer les charges, copier les concurrents sans analyse, ne pas adapter selon la saison ou la demande.",
                },
              },
              {
                "@type": "Question",
                name: "Comment justifier ses tarifs auprès des clientes ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Mettez en avant la qualité des produits, la formation, l’expérience, le confort du lieu et la personnalisation des prestations.",
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
              Tarifs & Rentabilité
            </span>
            <span>•</span>
            <time dateTime="2025-12-18">18 décembre 2025</time>
            <span>•</span>
            <span>5 min de lecture</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Comment fixer vos tarifs de prestations en institut de beauté ?
            pourquoi ?
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Découvrez comment déterminer et justifier vos tarifs de prestations
            en institut de beauté pour assurer la rentabilité et la satisfaction
            de vos clientes, grâce à des méthodes concrètes et des conseils
            pratiques.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Comment calculer le tarif d’une prestation ?
          </h2>
          <ol className="list-decimal ml-6 mb-6">
            <li>Coût des produits utilisés</li>
            <li>Temps de travail (salaire ou rémunération)</li>
            <li>Charges fixes (loyer, électricité, assurances…)</li>
            <li>Marge souhaitée</li>
            <li>Analyse des prix du marché local</li>
          </ol>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs à éviter lors de la fixation des tarifs
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Sous-évaluer le temps de travail</li>
            <li>Ignorer les charges fixes et variables</li>
            <li>Copier les concurrents sans analyse</li>
            <li>Ne pas adapter les tarifs selon la saison ou la demande</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Astuces pour rentabiliser vos prestations
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Proposer des forfaits ou packs</li>
            <li>Valoriser la qualité et la personnalisation</li>
            <li>Adapter les tarifs selon la demande et la saison</li>
            <li>Communiquer sur la valeur ajoutée de vos prestations</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Comment justifier ses tarifs auprès des clientes ?
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Qualité des produits et matériels</li>
            <li>Formation et expérience</li>
            <li>Confort et ambiance du lieu</li>
            <li>Personnalisation des prestations</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">FAQ</h2>
          <dl>
            <dt className="font-semibold">
              Comment calculer le tarif d’une prestation ?
            </dt>
            <dd className="mb-4">
              Additionnez produits, temps, charges, marge, analysez le marché.
            </dd>
            <dt className="font-semibold">Erreurs à éviter ?</dt>
            <dd className="mb-4">
              Sous-évaluation, ignorance des charges, copie sans analyse,
              non-adaptation.
            </dd>
            <dt className="font-semibold">Comment justifier ses tarifs ?</dt>
            <dd className="mb-4">
              Qualité, formation, expérience, confort, personnalisation.
            </dd>
          </dl>
        </div>
      </article>
    </div>
  );
}
