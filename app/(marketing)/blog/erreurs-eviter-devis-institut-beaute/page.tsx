import Link from "next/link";
import type { Metadata } from "next";
import { RelatedArticles } from "@/app/(marketing)/blog/_components/RelatedArticles";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title:
    "Devis beauté : les 10 erreurs fatales à éviter absolument – Guide 2025",
  description:
    "Découvrez les erreurs les plus courantes dans les devis d'instituts de beauté et comment les éviter pour augmenter votre taux de conversion et paraître plus professionnel.",
  openGraph: {
    title: "10 erreurs à éviter dans vos devis beauté",
    description:
      "Les pièges qui vous font perdre des clients et comment les éviter pour maximiser vos conversions.",
    url: "https://solkant.com/blog/erreurs-eviter-devis-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2024-12-06T10:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-erreurs-devis.png",
        width: 1200,
        height: 630,
        alt: "Les erreurs à éviter dans vos devis beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "10 erreurs fatales à éviter dans vos devis beauté",
    description:
      "Les pièges qui font fuir vos clients et comment les corriger.",
    images: ["https://solkant.com/images/og/article-erreurs-devis.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/erreurs-eviter-devis-institut-beaute",
  },
};

export default function Article2Page() {
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
              "Devis beauté : les 10 erreurs fatales à éviter absolument",
            description:
              "Découvrez les erreurs les plus courantes dans les devis d'instituts de beauté et comment les éviter pour augmenter votre taux de conversion.",
            image: "https://solkant.com/images/og/article-erreurs-devis.png",
            datePublished: "2024-12-06T10:00:00Z",
            dateModified: "2024-12-06T10:00:00Z",
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
                "https://solkant.com/blog/erreurs-eviter-devis-institut-beaute",
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
            <span className="font-medium text-foreground">Conseils</span>
            <span>•</span>
            <time dateTime="2024-12-06">6 décembre 2024</time>
            <span>•</span>
            <span>7 min de lecture</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Devis beauté : les 10 erreurs fatales à éviter absolument
          </h1>

          <p className="text-xl text-foreground/60 leading-relaxed">
            Découvrez les erreurs les plus courantes qui font fuir les clientes
            et plombent votre taux de conversion. Apprenez à les corriger pour
            des devis plus professionnels et efficaces.
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed mb-6">
            En tant que gérante d&apos;institut de beauté, chaque devis que vous
            envoyez est une opportunité de convaincre une nouvelle cliente. Mais
            certaines erreurs, même involontaires, peuvent ruiner vos chances.
            Voici les 10 pièges à éviter absolument.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #1 : Prendre trop de temps pour envoyer le devis
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Votre cliente demande un devis le
            lundi et le reçoit le vendredi. Entre-temps, elle a contacté 3
            concurrentes qui ont été plus réactives.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Selon une étude du secteur beauté,
            70% des clientes choisissent le premier institut qui leur répond
            avec un devis clair. Chaque heure de retard diminue vos chances de
            15%.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Utilisez un outil qui vous permet de créer un devis en 2-3 minutes
              maximum. Avec{" "}
              <Link
                href="/fonctionnalites"
                className="text-purple-600 hover:underline"
              >
                Solkant
              </Link>
              , sélectionnez vos prestations depuis votre catalogue
              pré-enregistré, et générez un PDF professionnel instantanément.
              Objectif : envoyer le devis dans les 2-3 heures maximum.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #2 : Oublier des mentions légales obligatoires
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Votre devis n&apos;a pas de numéro
            SIRET, pas de date de validité, ou pas de mention sur la TVA.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> En cas de litige, votre devis
            n&apos;a aucune valeur juridique. De plus, cela donne une image peu
            professionnelle et peut inquiéter les clientes les plus exigeantes.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70 mb-3">
              Utilisez un template ou un logiciel qui intègre automatiquement
              toutes les mentions légales obligatoires :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70">
              <li>Numéro SIRET et adresse complète</li>
              <li>Date d&apos;émission et date de validité (3 mois)</li>
              <li>Numéro de devis unique (DEVIS-2024-XXX)</li>
              <li>Taux de TVA applicable (20% ou mention micro-entreprise)</li>
              <li>Conditions de règlement</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #3 : Des descriptions de prestations trop vagues
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous notez &quot;Soin visage -
            80€&quot; sans aucun détail sur ce qui est inclus (durée, produits
            utilisés, étapes du soin).
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Votre cliente ne sait pas ce
            qu&apos;elle achète exactement. Elle peut imaginer que c&apos;est
            &quot;cher pour pas grand-chose&quot; et aller voir ailleurs. De
            plus, en cas de malentendu, vous n&apos;avez aucune preuve de ce qui
            était prévu.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70 mb-3">
              Soyez précise et descriptive. Exemple :
            </p>
            <div className="bg-white p-4 rounded border border-foreground/10">
              <p className="text-foreground font-medium">
                ❌ Avant : &quot;Soin visage - 80€&quot;
              </p>
              <p className="text-green-700 font-medium mt-2">
                ✅ Après : &quot;Soin visage hydratant complet (60 min) -
                Nettoyage, gommage, masque hydratant, massage du visage et du
                décolleté - 80€&quot;
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #4 : Des erreurs de calcul dans les totaux
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous calculez à la main sur Excel ou
            sur papier et vous vous trompez dans le calcul de la TVA ou du
            total.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Catastrophique pour votre
            crédibilité. Si la cliente remarque l&apos;erreur (et elle la
            remarquera), elle se demandera si elle peut vous faire confiance. Si
            l&apos;erreur est en sa défaveur, elle ira ailleurs. Si c&apos;est
            en votre défaveur, vous perdez de l&apos;argent.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Utilisez un logiciel qui fait les calculs automatiquement. Avec
              Solkant, vous entrez simplement vos prestations et leurs prix HT,
              et le système calcule automatiquement la TVA (20%) et le total
              TTC. Zéro risque d&apos;erreur, zéro perte de temps à vérifier 3
              fois avec une calculatrice.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #5 : Un design amateur ou illisible
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Devis manuscrit ou sur Word mal
            formaté, avec des polices fantaisistes, des couleurs criardes, ou
            une mise en page brouillonne.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Votre image de marque en prend un
            coup. Une cliente qui hésite entre vous et une concurrente choisira
            celle dont le devis est plus professionnel, même si vos tarifs sont
            similaires.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Investissez dans un template professionnel ou utilisez un outil
              qui génère automatiquement des PDF élégants. Privilégiez un design
              sobre, épuré, avec une typographie lisible et une structure
              claire. Votre logo en haut à gauche, un tableau bien organisé, et
              des couleurs cohérentes avec votre charte graphique.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #6 : Ne pas personnaliser le devis
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous envoyez un devis générique sans
            adresser directement la cliente par son nom, sans rappeler le
            contexte de sa demande.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> La cliente a l&apos;impression de
            recevoir un document impersonnel, comme si vous ne vous souveniez
            même pas d&apos;elle. Cela diminue considérablement l&apos;envie de
            choisir votre institut.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Ajoutez toujours un petit paragraphe d&apos;introduction
              personnalisé. Exemple : &quot;Chère Madame Dupont, suite à notre
              échange téléphonique de ce matin concernant votre demande de
              forfait bien-être, voici le devis détaillé comme convenu.&quot;
              Cela prend 30 secondes mais fait toute la différence.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #7 : Tarifs imprécis ou arrondis approximatifs
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous indiquez &quot;environ
            100€&quot; ou &quot;~85€&quot; au lieu de prix exacts au centime
            près.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Cela donne l&apos;impression que
            vous improvisez vos tarifs au feeling. Une cliente ne peut pas
            valider un devis avec des prix approximatifs, elle va forcément vous
            redemander le montant exact, ce qui rallonge inutilement le
            processus.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Définissez une grille tarifaire précise pour toutes vos
              prestations et respectez-la. Indiquez toujours les prix exacts :
              89,00€ et non pas &quot;environ 90€&quot;. Cela montre votre
              professionnalisme et votre organisation.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #8 : Oublier de relancer la cliente
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous envoyez le devis et vous
            attendez passivement une réponse qui ne vient jamais.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Beaucoup de clientes sont
            intéressées mais procrastinent ou oublient simplement de répondre.
            Si vous ne relancez pas, vous perdez des ventes &quot;faciles&quot;.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70 mb-3">
              Mettez en place un système de relance :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70">
              <li>J+1 : Confirmez par SMS que le devis est bien reçu</li>
              <li>
                J+5 : Relancez poliment par email (&quot;Avez-vous eu le temps
                de consulter le devis ? Je reste disponible pour toute
                question&quot;)
              </li>
              <li>
                J+10 : Relance finale avec éventuellement une offre limitée dans
                le temps
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #9 : Ne pas conserver l&apos;historique des devis
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Une cliente vous recontacte 6 mois
            après et vous ne retrouvez plus le devis que vous lui aviez envoyé.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Vous devez refaire le travail
            depuis zéro, ou pire, vous proposez des tarifs différents de la
            première fois, ce qui crée de la confusion et de la méfiance.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Utilisez un système qui archive automatiquement tous vos devis
              avec leur statut (brouillon, envoyé, accepté, refusé). Solkant
              vous permet de retrouver n&apos;importe quel devis en 2 clics
              grâce à des filtres par cliente, par date, ou par numéro. Vous
              pouvez même dupliquer un ancien devis pour gagner du temps.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Erreur #10 : Proposer trop d&apos;options qui embrouillent
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème :</strong> Vous envoyez un devis avec 5 formules
            différentes, 10 options à cocher, et 3 pages de conditions. La
            cliente est perdue et ne sait plus quoi choisir.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>L&apos;impact :</strong> Paradoxe du choix : trop
            d&apos;options tue la décision. La cliente reporte sa décision
            &quot;pour réfléchir&quot; et finit par aller chez une concurrente
            qui propose une offre plus simple.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ La solution
            </h4>
            <p className="text-foreground/70">
              Proposez maximum 2-3 options clairement différenciées (basique /
              standard / premium). Mettez en avant celle que vous recommandez.
              Évitez les options à rallonge, privilégiez la clarté et la
              simplicité. Si vraiment la cliente a des besoins complexes,
              proposez un appel ou un RDV pour en discuter ensemble.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            En résumé : les bonnes pratiques pour un devis parfait
          </h2>

          <div className="rounded-lg bg-purple-50 p-6 border border-purple-100">
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Envoyez-le en moins de 3 heures après la demande</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  Vérifiez que toutes les mentions légales sont présentes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  Décrivez précisément chaque prestation avec la durée
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  Utilisez un outil avec calculs automatiques (zéro erreur)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Soignez le design pour une image professionnelle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Personnalisez avec un mot d&apos;introduction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Indiquez des prix exacts au centime près</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Relancez poliment après 5-7 jours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Archivez tous vos devis pour l&apos;historique</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Restez simple : max 2-3 options claires</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-foreground/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Évitez toutes ces erreurs automatiquement avec Solkant
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">
            Mentions légales automatiques, calculs sans erreur, design
            professionnel, relances facilitées, archivage complet. Créez des
            devis parfaits en 2 minutes chrono.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-foreground px-6 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-foreground/20 px-6 py-3 font-semibold text-foreground hover:bg-foreground/5"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </article>

      {/* Articles connexes */}
      <RelatedArticles
        articles={blogArticles}
        currentSlug="erreurs-eviter-devis-institut-beaute"
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
