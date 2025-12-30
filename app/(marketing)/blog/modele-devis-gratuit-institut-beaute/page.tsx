import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modèle de devis gratuit pour institut de beauté (Word + conseils)",
  description:
    "Téléchargez un modèle de devis Word gratuit pour institut de beauté, avec conseils pour rédiger des devis professionnels et convaincre vos clientes.",
  openGraph: {
    title: "Modèle de devis gratuit institut de beauté",
    description:
      "Modèle Word à télécharger + conseils pour rédiger des devis professionnels et efficaces pour votre institut.",
    url: "https://solkant.com/blog/modele-devis-gratuit-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-01T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-modele-devis.png",
        width: 1200,
        height: 630,
        alt: "Modèle de devis gratuit institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modèle de devis gratuit institut de beauté",
    description:
      "Modèle Word à télécharger + conseils pour rédiger des devis professionnels et efficaces pour votre institut.",
    images: ["https://solkant.com/images/og/article-modele-devis.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/modele-devis-gratuit-institut-beaute",
  },
};

export default function ArticleModeleDevisPage() {
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
                "Modèle de devis gratuit pour institut de beauté (Word + conseils)",
              description:
                "Téléchargez un modèle de devis Word gratuit pour institut de beauté, avec conseils pour rédiger des devis professionnels et convaincre vos clientes.",
              image: "https://solkant.com/images/og/article-modele-devis.png",
              datePublished: "2025-12-01T09:00:00Z",
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
                  "https://solkant.com/blog/modele-devis-gratuit-institut-beaute",
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
                  name: "Modèle de devis gratuit institut de beauté",
                  item: "https://solkant.com/blog/modele-devis-gratuit-institut-beaute",
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
                  name: "Quelles sont les mentions obligatoires sur un devis institut de beauté ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nom et coordonnées de l'institut, nom du client, date, description des prestations, prix TTC, durée de validité, conditions de paiement, mention 'devis reçu avant exécution'.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Comment personnaliser le modèle de devis Word ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ajoutez votre logo, modifiez les couleurs, adaptez la liste des prestations et les tarifs selon votre institut. Vérifiez la conformité des mentions légales.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Le devis Word est-il suffisant ou faut-il un logiciel ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Le modèle Word convient pour débuter, mais un logiciel de devis dédié offre plus de rapidité, de sécurité et de suivi (historique, relances, PDF, etc.).",
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
                Modèle & Conseils
              </span>
              <span>•</span>
              <time dateTime="2025-12-01">1 décembre 2025</time>
              <span>•</span>
              <span>4 min de lecture</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Modèle de devis gratuit pour institut de beauté (Word + conseils)
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Téléchargez gratuitement notre modèle de devis Word pour institut
              de beauté et découvrez nos conseils pour rédiger des devis
              professionnels qui rassurent et convainquent vos clientes.
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Télécharger le modèle de devis Word
            </h2>
            <p className="mb-6">
              Cliquez ici pour télécharger le modèle&nbsp;:{" "}
              <a
                href="/images/modele-devis-institut-beaute.docx"
                className="font-semibold text-primary underline"
              >
                Modèle de devis Word (.docx)
              </a>
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Mentions obligatoires sur un devis institut de beauté
            </h2>
            <ul className="list-disc ml-6 mb-6">
              <li>Nom et coordonnées de l&apos;institut</li>
              <li>Nom du client</li>
              <li>Date du devis</li>
              <li>Description détaillée des prestations</li>
              <li>Prix TTC et conditions de paiement</li>
              <li>Durée de validité du devis</li>
              <li>
                Mentions légales (ex : &quot;devis reçu avant exécution&quot;)
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Conseils pour personnaliser et réussir votre devis
            </h2>
            <ul className="list-disc ml-6 mb-6">
              <li>
                Ajoutez votre logo et vos couleurs pour renforcer votre image
              </li>
              <li>
                Adaptez la liste des prestations et les tarifs selon votre
                institut
              </li>
              <li>Soignez la présentation et la clarté du document</li>
              <li>Vérifiez la conformité des mentions légales</li>
              <li>Envoyez le devis en PDF pour plus de professionnalisme</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Pourquoi passer à un logiciel de devis ?
            </h2>
            <p className="mb-6">
              Un logiciel de devis dédié permet de gagner du temps,
              d’automatiser les calculs, d’archiver les devis, de relancer les
              clientes et d’assurer la conformité légale. Idéal pour les
              instituts en croissance.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              FAQ
            </h2>
            <dl>
              <dt className="font-semibold">
                Le modèle Word est-il suffisant pour gérer mes devis ?
              </dt>
              <dd className="mb-4">
                Oui pour débuter, mais un logiciel offre plus de rapidité, de
                sécurité et de suivi.
              </dd>
              <dt className="font-semibold">
                Comment personnaliser le modèle ?
              </dt>
              <dd className="mb-4">
                Ajoutez votre logo, modifiez les couleurs et adaptez les
                prestations.
              </dd>
              <dt className="font-semibold">
                Quelles sont les mentions obligatoires ?
              </dt>
              <dd className="mb-4">
                Nom, coordonnées, client, date, prestations, prix, durée,
                mentions légales.
              </dd>
            </dl>
          </div>
        </article>
      </main>
    </div>
  );
}
