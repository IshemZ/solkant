import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Comment organiser efficacement le planning de votre institut de beauté",
  description:
    "Conseils et méthodes pour organiser le planning de votre institut de beauté, optimiser la gestion des rendez-vous et de l’équipe. Outils, astuces et erreurs à éviter.",
  openGraph: {
    title: "Organiser le planning institut de beauté",
    description:
      "Méthodes, outils et conseils pour optimiser la gestion du planning et des rendez-vous en institut de beauté.",
    url: "https://solkant.com/blog/organiser-planning-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-08T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-planning.png",
        width: 1200,
        height: 630,
        alt: "Organiser planning institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organiser le planning institut de beauté",
    description:
      "Méthodes, outils et conseils pour optimiser la gestion du planning et des rendez-vous en institut de beauté.",
    images: ["https://solkant.com/images/og/article-planning.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/organiser-planning-institut-beaute",
  },
};

export default function ArticlePlanningInstitutPage() {
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
              "Comment organiser efficacement le planning de votre institut de beauté",
            description:
              "Conseils et méthodes pour organiser le planning de votre institut de beauté, optimiser la gestion des rendez-vous et de l’équipe. Outils, astuces et erreurs à éviter.",
            image: "https://solkant.com/images/og/article-planning.png",
            datePublished: "2025-12-08T09:00:00Z",
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
                "https://solkant.com/blog/organiser-planning-institut-beaute",
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
                name: "Organiser le planning institut de beauté",
                item: "https://solkant.com/blog/organiser-planning-institut-beaute",
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
                name: "Quels outils pour organiser le planning d’un institut de beauté ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Agenda papier, Google Agenda, logiciel de gestion spécialisé, application mobile. Un logiciel dédié offre des rappels, la gestion des équipes et la synchronisation des rendez-vous.",
                },
              },
              {
                "@type": "Question",
                name: "Comment éviter les erreurs de planning ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Centralisez les rendez-vous, évitez les doubles réservations, prévoyez des marges entre prestations, communiquez avec l’équipe et utilisez des rappels automatiques.",
                },
              },
              {
                "@type": "Question",
                name: "Quels conseils pour optimiser la gestion des rendez-vous ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Proposez la réservation en ligne, analysez les créneaux les plus demandés, adaptez les horaires selon la saison et relancez les clientes en cas d’annulation.",
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
              Organisation & Conseils
            </span>
            <span>•</span>
            <time dateTime="2025-12-08">8 décembre 2025</time>
            <span>•</span>
            <span>5 min de lecture</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Comment organiser efficacement le planning de votre institut de
            beauté
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Découvrez nos conseils et méthodes pour organiser le planning de
            votre institut de beauté, optimiser la gestion des rendez-vous et de
            l’équipe, et éviter les erreurs courantes.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pourquoi bien organiser le planning ?
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Optimiser le taux de remplissage</li>
            <li>Réduire les annulations et les retards</li>
            <li>Améliorer la satisfaction des clientes et de l’équipe</li>
            <li>Gagner du temps sur la gestion administrative</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Outils pour organiser le planning
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Agenda papier ou mural</li>
            <li>Google Agenda ou Outlook</li>
            <li>Logiciel de gestion spécialisé (ex : Solkant)</li>
            <li>Application mobile dédiée</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Méthodes et astuces pour optimiser la gestion
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Centraliser tous les rendez-vous sur un seul outil</li>
            <li>Prévoir des marges entre prestations</li>
            <li>Communiquer régulièrement avec l’équipe</li>
            <li>Utiliser des rappels automatiques pour les clientes</li>
            <li>Analyser les créneaux les plus demandés</li>
            <li>Adapter les horaires selon la saison</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs courantes à éviter
          </h2>
          <ul className="list-disc ml-6 mb-6">
            <li>Doubles réservations ou oublis</li>
            <li>Manque de communication avec l’équipe</li>
            <li>Absence de relance en cas d’annulation</li>
            <li>Utilisation d’outils non adaptés ou trop complexes</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">FAQ</h2>
          <dl>
            <dt className="font-semibold">
              Quels outils pour organiser le planning ?
            </dt>
            <dd className="mb-4">
              Agenda papier, Google Agenda, logiciel spécialisé, application
              mobile.
            </dd>
            <dt className="font-semibold">Comment éviter les erreurs ?</dt>
            <dd className="mb-4">
              Centralisez les rendez-vous, prévoyez des marges, communiquez avec
              l’équipe, utilisez des rappels.
            </dd>
            <dt className="font-semibold">
              Conseils pour optimiser la gestion ?
            </dt>
            <dd className="mb-4">
              Réservation en ligne, analyse des créneaux, adaptation des
              horaires, relances.
            </dd>
          </dl>
        </div>
      </article>
      </main>
    </div>
  );
}
