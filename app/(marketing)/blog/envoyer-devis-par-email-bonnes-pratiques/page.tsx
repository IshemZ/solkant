import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment envoyer un devis par email : le guide complet 2025",
  description:
    "Guide complet pour envoyer vos devis par email en toute sécurité et professionnalisme en 2025. Conseils, étapes, mentions légales et astuces pour instituts de beauté.",
  openGraph: {
    title: "Envoyer un devis par email : guide 2025",
    description:
      "Toutes les étapes pour envoyer un devis par email à vos clientes, avec conseils et mentions obligatoires.",
    url: "https://solkant.com/blog/envoyer-devis-email-guide-2025",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-12-10T09:00:00Z",
    modifiedTime: "2025-12-23T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-email.png",
        width: 1200,
        height: 630,
        alt: "Envoyer un devis par email institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Envoyer un devis par email : guide 2025",
    description:
      "Toutes les étapes pour envoyer un devis par email à vos clientes, avec conseils et mentions obligatoires.",
    images: ["https://solkant.com/images/og/article-email.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/envoyer-devis-email-guide-2025",
  },
};

export default function ArticleEmailPage() {
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
                "Comment envoyer un devis par email : le guide complet 2025",
              description:
                "Guide complet pour envoyer vos devis par email en toute sécurité et professionnalisme en 2025. Conseils, étapes, mentions légales et astuces pour instituts de beauté.",
              image: "https://solkant.com/images/og/article-email.png",
              datePublished: "2025-12-10T09:00:00Z",
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
                  "https://solkant.com/blog/envoyer-devis-email-guide-2025",
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
                  name: "Envoyer un devis par email",
                  item: "https://solkant.com/blog/envoyer-devis-email-guide-2025",
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
                  name: "Quelles mentions obligatoires doivent figurer sur un devis envoyé par email ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Les mentions obligatoires sont : nom et coordonnées de l'institut, nom du client, date, description des prestations, prix TTC, durée de validité, conditions de paiement, et la mention 'devis reçu avant exécution'.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Comment s'assurer que le devis envoyé par email est juridiquement valable ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Le devis doit être accepté explicitement par le client (réponse écrite, signature électronique ou retour d'email avec accord). Conservez la preuve de l'envoi et de l'acceptation.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Quels conseils pour maximiser l'ouverture de l'email contenant le devis ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Soignez l'objet de l'email (ex : 'Votre devis personnalisé - Institut [Nom]'), ajoutez un message personnalisé, évitez les pièces jointes trop lourdes, et vérifiez que le PDF est lisible sur mobile.",
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
                Guide pratique
              </span>
              <span>•</span>
              <time dateTime="2025-12-10">10 décembre 2025</time>
              <span>•</span>
              <span>5 min de lecture</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              Comment envoyer un devis par email : le guide complet 2025
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez toutes les étapes pour envoyer un devis par email à vos
              clientes, en respectant la législation et en maximisant
              l&apos;impact de votre communication.
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Pourquoi envoyer vos devis par email ?
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              L&apos;envoi de devis par email permet de gagner du temps,
              d&apos;améliorer la traçabilité et d&apos;offrir une expérience
              moderne à vos clientes. Un devis envoyé par email est aussi
              juridiquement valable, à condition de respecter certaines règles.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Étapes pour envoyer un devis par email
            </h2>
            <ol className="list-decimal ml-6 mb-6">
              <li>
                Générez le devis au format PDF avec toutes les mentions
                obligatoires.
              </li>
              <li>
                Rédigez un email personnalisé : objet clair, message
                d&apos;accompagnement, rappel des prestations.
              </li>
              <li>Ajoutez le devis en pièce jointe (PDF, taille &lt; 2 Mo).</li>
              <li>
                Envoyez l&apos;email à l&apos;adresse du client et conservez une
                copie dans votre logiciel ou boîte mail.
              </li>
              <li>
                Demandez une confirmation écrite ou une signature électronique
                pour valider le devis.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Mentions obligatoires sur le devis
            </h2>
            <ul className="list-disc ml-6 mb-6">
              <li>Nom et coordonnées de l&apos;institut</li>
              <li>Nom du client</li>
              <li>Date du devis</li>
              <li>Description détaillée des prestations</li>
              <li>Prix TTC et conditions de paiement</li>
              <li>Durée de validité du devis</li>
              <li>
                Mentions légales (ex :&quot;devis reçu avant exécution&quot;)
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              Conseils pour maximiser l&apos;ouverture et l&apos;acceptation
            </h2>
            <ul className="list-disc ml-6 mb-6">
              <li>
                Soignez l&apos;objet de l&apos;email (ex :&quot;Votre devis
                personnalisé - Institut [Nom]&quot;)
              </li>
              <li>Personnalisez le message d&apos;accompagnement</li>
              <li>Vérifiez la lisibilité du PDF sur mobile</li>
              <li>Relancez poliment si pas de réponse sous 48h</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              FAQ
            </h2>
            <dl>
              <dt className="font-semibold">
                Le devis envoyé par email est-il juridiquement valable ?
              </dt>
              <dd className="mb-4">
                Oui, à condition que le client donne son accord explicite (email
                de retour, signature électronique, etc.).
              </dd>
              <dt className="font-semibold">
                Comment prouver l&apos;envoi et l&apos;acceptation du devis ?
              </dt>
              <dd className="mb-4">
                Conservez l&apos;email envoyé et la réponse du client. Un
                logiciel de devis comme Solkant archive automatiquement ces
                échanges.
              </dd>
              <dt className="font-semibold">
                Peut-on envoyer un devis via WhatsApp ou SMS ?
              </dt>
              <dd className="mb-4">
                Oui, mais privilégiez l&apos;email pour la traçabilité et la
                conformité légale. WhatsApp/SMS peuvent servir de relance ou
                d&apos;accompagnement.
              </dd>
            </dl>
          </div>
        </article>
      </main>
    </div>
  );
}
