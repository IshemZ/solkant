import Link from "next/link";
import type { Metadata } from "next";
import { RelatedArticles } from "@/components/shared/RelatedArticles";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title:
    "Comment faire un devis professionnel pour votre institut de beauté – Guide 2025",
  description:
    "Guide complet pour créer des devis professionnels pour institut de beauté : mentions obligatoires, calculs, présentation, outils. Conseils d'experts et modèle gratuit.",
  openGraph: {
    title: "Comment faire un devis professionnel pour institut de beauté",
    description:
      "Tout ce qu'il faut savoir pour créer des devis conformes et professionnels qui rassurent vos clients.",
    url: "https://solkant.com/blog/comment-faire-devis-professionnel-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2024-12-01T09:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-devis.png",
        width: 1200,
        height: 630,
        alt: "Comment faire un devis professionnel pour votre institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comment faire un devis professionnel pour institut de beauté",
    description:
      "Guide complet 2025 : mentions obligatoires, calculs, présentation.",
    images: ["https://solkant.com/images/og/article-devis.png"],
  },
  alternates: {
    canonical:
      "https://solkant.com/blog/comment-faire-devis-professionnel-institut-beaute",
  },
};

export default function Article1Page() {
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
                  className="text-sm font-medium text-foreground/60 hover:text-foreground"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-foreground/60 hover:text-foreground"
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
                  className="text-sm font-medium text-foreground/60 hover:text-foreground"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/60 hover:text-foreground"
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
              "Comment faire un devis professionnel pour votre institut de beauté – Guide 2025",
            description:
              "Guide complet pour créer des devis professionnels pour institut de beauté : mentions obligatoires, calculs, présentation, outils.",
            image: "https://solkant.com/images/og/article-devis.png",
            datePublished: "2024-12-01T09:00:00Z",
            dateModified: "2024-12-01T09:00:00Z",
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
                "https://solkant.com/blog/comment-faire-devis-professionnel-institut-beaute",
            },
          }),
        }}
      />

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-foreground mb-8"
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
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4">
            <span className="font-medium text-foreground">Guides</span>
            <span>•</span>
            <time dateTime="2024-12-01">1 décembre 2024</time>
            <span>•</span>
            <span>8 min de lecture</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Comment faire un devis professionnel pour votre institut de beauté
          </h1>

          <p className="text-xl text-foreground/60 leading-relaxed">
            Créer un devis clair et professionnel est essentiel pour rassurer
            vos clients et valoriser votre expertise. Découvrez notre guide
            complet avec toutes les mentions obligatoires et bonnes pratiques.
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pourquoi un devis professionnel est important
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Un devis bien présenté n&apos;est pas qu&apos;une simple formalité
            administrative. C&apos;est votre carte de visite professionnelle qui
            :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              Rassure vos clients sur votre sérieux et votre professionnalisme
            </li>
            <li>
              Évite les malentendus sur les prestations et les tarifs proposés
            </li>
            <li>Vous protège légalement en cas de litige</li>
            <li>
              Facilite la prise de décision de votre client grâce à la clarté
            </li>
            <li>Valorise votre image de marque et votre expertise</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Les mentions obligatoires sur un devis
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Pour être conforme et avoir une valeur légale, votre devis doit
            obligatoirement contenir :
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            1. Vos informations professionnelles
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Nom de votre institut ou raison sociale</li>
            <li>Adresse complète de votre établissement</li>
            <li>Numéro SIRET (14 chiffres)</li>
            <li>Numéro de TVA intracommunautaire si applicable</li>
            <li>Téléphone et email de contact pour faciliter les échanges</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            2. Informations du client
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Nom et prénom complets</li>
            <li>Adresse postale complète</li>
            <li>Coordonnées (téléphone, email)</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            3. Détails du devis
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              Numéro de devis unique (exemple : DEVIS-2024-001) pour le suivi
            </li>
            <li>Date d&apos;émission du devis</li>
            <li>
              Date de validité (généralement 3 mois pour les prestations beauté)
            </li>
            <li>
              Description détaillée de chaque prestation (nom, durée estimée)
            </li>
            <li>Prix unitaire HT pour chaque prestation</li>
            <li>Quantité pour chaque ligne si applicable</li>
            <li>Total HT (hors taxes)</li>
            <li>Taux de TVA applicable (20% pour la plupart des soins)</li>
            <li>Montant de la TVA</li>
            <li>Total TTC (toutes taxes comprises)</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            4. Mentions légales obligatoires
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              &quot;Devis gratuit&quot; ou mention que le devis est sans
              engagement
            </li>
            <li>Conditions de règlement (acompte éventuel, modalités)</li>
            <li>Délai de réalisation ou date des prestations</li>
            <li>
              Clause de non-responsabilité si nécessaire (allergies, contre-
              indications)
            </li>
            <li>
              Mention &quot;TVA non applicable, article 293 B du CGI&quot; si
              vous êtes en micro-entreprise
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Comment structurer votre devis efficacement
          </h2>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            En-tête clair et professionnel
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Commencez par un en-tête soigné avec votre logo (si vous en avez
            un), le nom de votre institut et vos coordonnées complètes. Ajoutez
            le mot &quot;DEVIS&quot; en gros caractères pour qu&apos;il soit
            immédiatement identifiable.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Tableau des prestations lisible
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Organisez vos prestations dans un tableau avec 4 colonnes minimum :
            Désignation, Quantité, Prix unitaire HT, Total HT. Évitez les
            abréviations incompréhensibles et soyez explicite sur ce qui est
            inclus.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Calculs transparents
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Affichez clairement le sous-total HT, le montant de TVA et le total
            TTC. Si vous proposez une remise, indiquez-la explicitement (par
            exemple : &quot;Remise fidélité -10%&quot;) avant le calcul de la
            TVA.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Outils pour créer vos devis facilement
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Vous avez plusieurs options pour créer vos devis :
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            1. Logiciel spécialisé (recommandé)
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Un logiciel comme Solkant vous permet de créer des devis
            professionnels en quelques clics. Avantages : numérotation
            automatique, calculs automatiques, design professionnel, sauvegarde
            de votre catalogue de services, historique par client.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            2. Modèle Word ou Excel
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Solution basique et gratuite mais chronophage : vous devez tout
            ressaisir à chaque fois, les risques d&apos;erreur de calcul sont
            plus élevés, et le rendu est souvent moins professionnel.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            3. Devis manuscrit (à éviter)
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Certes rapide sur le moment, mais peu professionnel et difficile à
            archiver. De plus, l&apos;écriture manuscrite peut manquer de clarté
            et donner une image amateur de votre institut.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Conseils pour un devis qui convertit
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-foreground/80 mb-6">
            <li>
              <strong>Envoyez-le rapidement :</strong> Idéalement dans les 24h
              suivant la demande pour montrer votre réactivité
            </li>
            <li>
              <strong>Personnalisez-le :</strong> Ajoutez un petit mot
              personnalisé en introduction (&quot;Chère Madame Dupont, suite à
              notre échange téléphonique...&quot;)
            </li>
            <li>
              <strong>Soyez transparent sur les prix :</strong> N&apos;hésitez
              pas à détailler chaque prestation, cela justifie votre tarif
            </li>
            <li>
              <strong>Ajoutez vos coordonnées visibles :</strong> Facilitez le
              contact si votre client a des questions
            </li>
            <li>
              <strong>Proposez des options :</strong> Vous pouvez créer 2
              versions (basique / premium) pour laisser le choix
            </li>
            <li>
              <strong>Incluez vos conditions :</strong> Modalités
              d&apos;annulation, politique de remboursement si applicable
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreurs courantes à éviter absolument
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-foreground/80 mb-6">
            <li>
              ❌ Oublier des mentions obligatoires (SIRET, TVA, date de
              validité)
            </li>
            <li>
              ❌ Fautes d&apos;orthographe et de frappe (relisez toujours avant
              d&apos;envoyer)
            </li>
            <li>
              ❌ Prix imprécis ou arrondis approximatifs (soyez exact au centime
              près)
            </li>
            <li>
              ❌ Descriptions trop vagues (&quot;Soin visage&quot; au lieu de
              &quot;Soin visage hydratant 60 min avec masque&quot;)
            </li>
            <li>
              ❌ Design amateur ou illisible (utilisez un template pro ou un
              logiciel)
            </li>
            <li>
              ❌ Oublier de dater ou numéroter le devis (perte de traçabilité)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Que faire après l&apos;envoi du devis ?
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Une fois votre devis envoyé, ne restez pas passive :
          </p>

          <ol className="list-decimal pl-6 space-y-3 text-foreground/80 mb-6">
            <li>
              <strong>Confirmez la réception</strong> par SMS ou email le
              lendemain
            </li>
            <li>
              <strong>Relancez poliment</strong> après 5-7 jours si pas de
              réponse
            </li>
            <li>
              <strong>Restez disponible</strong> pour répondre aux questions
            </li>
            <li>
              <strong>Archivez systématiquement</strong> tous vos devis (même
              refusés) pour votre historique
            </li>
            <li>
              <strong>Analysez vos taux de conversion</strong> pour améliorer
              vos futurs devis
            </li>
          </ol>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-foreground/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Créez vos devis professionnels en 2 minutes avec Solkant
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">
            Numérotation automatique, calculs instantanés, PDF élégants,
            historique complet. Tout ce qu&apos;il faut pour gagner du temps et
            paraître professionnel.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-foreground px-6 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="/fonctionnalites"
              className="rounded-md border border-foreground/20 px-6 py-3 font-semibold text-foreground hover:bg-foreground/5"
            >
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </article>

      {/* Articles connexes */}
      <RelatedArticles
        articles={blogArticles}
        currentSlug="comment-faire-devis-professionnel-institut-beaute"
      />

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Accueil
              </Link>
              <Link
                href="/fonctionnalites"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Fonctionnalités
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Tarifs
              </Link>
              <Link
                href="/blog"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-foreground/60">
              &copy; 2025 Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
