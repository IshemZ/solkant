import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title:
    "Logiciel de Devis pour Institut de Beauté - Guide Complet 2025 | Solkant",
  description:
    "Découvrez comment choisir le meilleur logiciel de devis pour votre institut de beauté. Comparatif complet, fonctionnalités essentielles, études de cas. Guide 2025 par Solkant.",
  keywords: [
    "logiciel devis institut beauté",
    "logiciel devis esthéticienne",
    "application devis salon beauté",
    "créer devis institut",
    "logiciel gestion devis spa",
  ],
  openGraph: {
    title: "Logiciel de Devis Institut Beauté - Guide Complet 2025",
    description:
      "Guide ultime pour choisir le logiciel de devis idéal pour votre institut de beauté. Fonctionnalités, comparatifs, cas d'usage.",
    url: "https://solkant.com/logiciel-devis-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    images: [
      {
        url: "https://solkant.com/images/og/pillar-logiciel-devis.png",
        width: 1200,
        height: 630,
        alt: "Guide complet logiciel de devis pour institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logiciel de Devis Institut Beauté - Guide Complet 2025",
    description:
      "Tout savoir pour choisir le bon logiciel de devis pour votre institut.",
  },
  alternates: {
    canonical: "https://solkant.com/logiciel-devis-institut-beaute",
  },
};

export default function LogicielDevisInstitutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org - Article + HowTo + FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Logiciel de Devis pour Institut de Beauté - Guide Complet 2025",
            description:
              "Guide complet pour choisir et utiliser un logiciel de devis adapté aux instituts de beauté, salons d'esthétique et spas.",
            image: "https://solkant.com/images/og/pillar-logiciel-devis.png",
            datePublished: "2025-01-15T09:00:00Z",
            dateModified: "2025-01-15T09:00:00Z",
            author: {
              "@type": "Organization",
              name: "Solkant",
            },
            publisher: {
              "@type": "Organization",
              name: "Solkant",
              logo: {
                "@type": "ImageObject",
                url: "https://solkant.com/logo.png",
              },
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Pourquoi utiliser un logiciel de devis plutôt qu'Excel ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Un logiciel de devis spécialisé vous fait gagner 85% du temps (2-3 min vs 15-20 min), calcule automatiquement les totaux et TVA, génère des PDF professionnels, et centralise l'historique client. Excel nécessite ressaisie manuelle à chaque fois avec risques d'erreurs.",
                },
              },
              {
                "@type": "Question",
                name: "Quelles sont les fonctionnalités indispensables ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Les 7 fonctionnalités essentielles : génération PDF automatique, gestion clients intégrée, catalogue de services réutilisable, calculs HT/TTC automatiques, numérotation intelligente des devis, personnalisation (logo, couleurs), et statistiques de suivi.",
                },
              },
              {
                "@type": "Question",
                name: "Combien coûte un logiciel de devis pour institut ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Les tarifs vont de 0€ (versions gratuites limitées) à 30€/mois. Solkant propose un plan gratuit jusqu'à 10 devis/mois et un plan Pro à 19€/mois en illimité. Le ROI est immédiat grâce au temps gagné.",
                },
              },
            ],
          }),
        }}
      />

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
                  className="text-sm font-medium text-foreground/60 hover:text-foreground"
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

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            {
              label: "Logiciel de Devis Institut Beauté",
              href: "/logiciel-devis-institut-beaute",
            },
          ]}
          className="mb-8"
        />

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Logiciel de Devis pour Institut de Beauté : Guide Complet 2025
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Découvrez comment choisir le meilleur logiciel de devis pour votre
            institut de beauté. Ce guide complet vous aide à digitaliser vos
            devis, gagner du temps et professionnaliser votre image.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 rounded-lg bg-foreground/5 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Sommaire
          </h2>
          <ol className="space-y-2 text-foreground/70">
            <li>
              <a href="#introduction" className="hover:text-foreground">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#quest-ce-quun-logiciel" className="hover:text-foreground">
                2. Qu'est-ce qu'un logiciel de devis pour institut ?
              </a>
            </li>
            <li>
              <a href="#pourquoi-en-avoir-besoin" className="hover:text-foreground">
                3. Pourquoi votre institut a besoin d'un logiciel de devis
              </a>
            </li>
            <li>
              <a href="#fonctionnalites" className="hover:text-foreground">
                4. Les 7 fonctionnalités indispensables
              </a>
            </li>
            <li>
              <a href="#criteres-selection" className="hover:text-foreground">
                5. Comment choisir le bon logiciel ?
              </a>
            </li>
            <li>
              <a href="#comparatif" className="hover:text-foreground">
                6. Comparatif : Logiciel vs Excel vs Papier
              </a>
            </li>
            <li>
              <a href="#implementation" className="hover:text-foreground">
                7. Guide d'implémentation
              </a>
            </li>
            <li>
              <a href="#etudes-de-cas" className="hover:text-foreground">
                8. Études de cas réels
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-foreground">
                9. FAQ
              </a>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section id="introduction" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Introduction
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Vous passez encore 15 à 20 minutes à créer chaque devis sur Excel
              ou Word ? Vous cherchez désespérément le bon modèle, recalculez
              manuellement les totaux, et devez ensuite convertir en PDF avant
              d'envoyer ? Cette méthode artisanale vous coûte du temps précieux
              et donne une image amateur de votre institut.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Les logiciels de devis modernes transforment cette corvée en une
              tâche de 2-3 minutes. Ce guide complet vous aide à comprendre
              pourquoi et comment franchir le cap de la digitalisation pour vos
              devis.
            </p>
          </section>

          {/* Section 2 */}
          <section id="quest-ce-quun-logiciel" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Qu'est-ce qu'un logiciel de devis pour institut de beauté ?
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Un logiciel de devis est une application web ou mobile spécialement
              conçue pour simplifier la création, l'envoi et le suivi de devis
              professionnels. Contrairement à un simple modèle Excel, c'est un
              outil complet qui :
            </p>
            <ul className="list-disc pl-6 space-y-3 text-foreground/80 mb-6">
              <li>
                <strong>Centralise votre catalogue de services</strong> : Vous
                enregistrez une fois vos prestations (soins visage, épilation,
                massages, etc.) avec leurs prix et durées
              </li>
              <li>
                <strong>Génère automatiquement les PDF</strong> : Plus besoin de
                convertir, le document professionnel est créé instantanément
              </li>
              <li>
                <strong>Calcule pour vous</strong> : Totaux HT, TVA, TTC sont
                calculés automatiquement sans risque d'erreur
              </li>
              <li>
                <strong>Stocke l'historique</strong> : Retrouvez tous les devis
                d'une cliente en 2 clics
              </li>
              <li>
                <strong>Suit le statut</strong> : Brouillon, envoyé, accepté,
                refusé – vous savez exactement où en est chaque devis
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed">
              La différence fondamentale avec Excel ? L'automatisation complète
              et la gestion intelligente. Vous ne partez plus d'une feuille
              blanche à chaque fois.
            </p>
          </section>

          {/* Section 3 */}
          <section id="pourquoi-en-avoir-besoin" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Pourquoi votre institut a besoin d'un logiciel de devis
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              1. Gain de temps massif (80-85%)
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              <strong>Méthode manuelle</strong> : 15-20 minutes par devis
              (recherche du modèle, saisie des prestations, calculs, mise en
              forme, conversion PDF, envoi). Sur 10 devis/semaine = 2h30-3h
              perdues.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-6">
              <strong>Avec un logiciel</strong> : 2-3 minutes par devis
              (sélection client, ajout prestations, génération PDF). Sur 10
              devis/semaine = 20-30 minutes. <strong>Gain : 2h/semaine = 8h/mois
              = 96h/an</strong>.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              2. Professionnalisation de votre image
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Un devis PDF élégant avec votre logo, une mise en page soignée et
              une numérotation professionnelle (DEVIS-2025-047) inspire
              confiance. Vos clientes vous perçoivent comme une professionnelle
              sérieuse et organisée, ce qui justifie vos tarifs premium.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3. Conformité légale automatique
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Les mentions obligatoires (SIRET, TVA, date de validité,
              conditions) sont pré-remplies et toujours conformes. Vous évitez
              les oublis qui peuvent coûter cher en cas de contrôle ou de litige.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              4. Suivi et statistiques
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Combien de devis avez-vous envoyés ce mois-ci ? Quel est votre
              taux de conversion ? Quelle cliente n'a pas répondu depuis 7 jours
              ? Avec un logiciel, ces réponses sont à portée de clic. Vous
              pilotez votre activité avec des données concrètes.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              5. Mobilité et accessibilité
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              Créez un devis depuis votre téléphone entre deux rendez-vous, ou
              depuis votre tablette chez une cliente à domicile. Vos données
              sont synchronisées en temps réel, accessibles partout.
            </p>
          </section>

          {/* CTA Mid-content */}
          <div className="my-12 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-8 text-center border border-foreground/10">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Testez Solkant gratuitement
            </h3>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Créez vos premiers devis professionnels en 2 minutes. Plan gratuit
              sans carte bancaire.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-md bg-foreground px-8 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              Commencer maintenant
            </Link>
          </div>

          {/* Section 4 - Fonctionnalités */}
          <section id="fonctionnalites" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Les 7 fonctionnalités indispensables d'un logiciel de devis
            </h2>

            <div className="space-y-8">
              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  1. Génération PDF automatique
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Le logiciel doit générer instantanément un PDF professionnel
                  prêt à envoyer, avec votre logo, vos couleurs, et une mise en
                  page élégante. Pas besoin de passer par Word puis "Enregistrer
                  sous PDF". Un clic = un document impeccable.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  2. Gestion clients intégrée
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Chaque cliente a une fiche complète (nom, email, téléphone,
                  adresse) avec l'historique de tous ses devis. Vous retrouvez
                  instantanément ce que vous lui avez proposé il y a 3 mois,
                  facilitant les relances et la fidélisation.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  3. Catalogue de services réutilisable
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Vous créez une fois votre liste de prestations (Soin visage
                  hydratant 60 min - 75€, Épilation jambes complètes - 35€,
                  etc.). Ensuite, pour chaque devis, vous sélectionnez les
                  prestations en 2 clics au lieu de tout retaper.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  4. Calculs automatiques HT/TTC
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Le logiciel calcule les totaux, applique la TVA (20% pour la
                  plupart des soins), et affiche le montant TTC. Vous ajustez les
                  quantités, et les calculs se mettent à jour instantanément.
                  Zéro risque d'erreur.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  5. Numérotation intelligente
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Chaque devis reçoit un numéro unique incrémenté automatiquement
                  (DEVIS-2025-001, DEVIS-2025-002, etc.). Plus besoin de vous
                  souvenir du dernier numéro utilisé ou de gérer manuellement la
                  séquence.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  6. Personnalisation (logo, couleurs)
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Ajoutez votre logo, choisissez vos couleurs de marque,
                  personnalisez les mentions légales. Chaque devis reflète
                  l'identité visuelle de votre institut.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  7. Statistiques et reporting
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Tableau de bord avec KPIs clés : nombre de devis envoyés ce
                  mois, taux de conversion (devis → vente), montant moyen, devis
                  en attente de réponse. Pilotez votre activité data-driven.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 - Critères sélection */}
          <section id="criteres-selection" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Comment choisir le bon logiciel pour votre institut ?
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 1 : Facilité d'utilisation
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              L'interface doit être intuitive. Si vous devez suivre une formation
              de 2 heures pour créer votre premier devis, c'est trop complexe.
              Testez la démo ou l'essai gratuit : vous devez être autonome en
              moins de 10 minutes.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 2 : Prix et rapport qualité/prix
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Les tarifs vont de 0€ (versions gratuites limitées) à 30-50€/mois
              pour des solutions complètes. Calculez votre ROI : si vous gagnez
              2h/semaine à 25€/h de valorisation, vous économisez 200€/mois.
              Payer 19€/mois devient dérisoire face à ce gain.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 3 : Support client en français
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Vérifiez que le support client est réactif et disponible en
              français. Email, chat, téléphone ? Temps de réponse moyen ? Un bon
              support peut faire la différence quand vous bloquez sur une
              fonctionnalité.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 4 : Conformité RGPD
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Vos données clients (noms, emails, téléphones) sont sensibles. Le
              logiciel doit être hébergé en Europe, chiffrer les données, et vous
              permettre d'exporter ou supprimer les informations à tout moment.
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 5 : Intégrations possibles
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Si vous utilisez déjà un logiciel de planning (Calendly, Planity) ou
              de comptabilité, vérifiez que le logiciel de devis peut s'y
              connecter ou au moins exporter des données compatibles (CSV, Excel).
            </p>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Critère 6 : Essai gratuit
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              Ne payez jamais sans avoir testé. Un essai gratuit de 14-30 jours
              (ou un plan gratuit permanent) vous permet de valider que l'outil
              répond à vos besoins réels avant de vous engager.
            </p>
          </section>

          {/* Section 6 - Comparatif */}
          <section id="comparatif" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Comparatif : Logiciel vs Excel vs Papier
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Critère
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Logiciel
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Excel/Word
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Papier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/10">
                    <td className="px-6 py-4 text-foreground/80">
                      Temps de création
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-green-600">
                        2-3 min
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      15-20 min
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      10-15 min
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <td className="px-6 py-4 text-foreground/80">
                      Calculs automatiques
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      Formules manuelles
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="px-6 py-4 text-foreground/80">
                      PDF professionnel
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      Conversion manuelle
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <td className="px-6 py-4 text-foreground/80">
                      Gestion clients
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="px-6 py-4 text-foreground/80">
                      Historique et suivi
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <td className="px-6 py-4 text-foreground/80">
                      Accessibilité mobile
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      Limité
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="px-6 py-4 text-foreground/80">
                      Risque d'erreurs
                    </td>
                    <td className="px-6 py-4 text-center text-green-600">
                      Très faible
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      Moyen-Élevé
                    </td>
                    <td className="px-6 py-4 text-center text-red-600">
                      Élevé
                    </td>
                  </tr>
                  <tr className="bg-foreground/5">
                    <td className="px-6 py-4 text-foreground/80 font-semibold">
                      Coût mensuel
                    </td>
                    <td className="px-6 py-4 text-center text-foreground">
                      0-30€
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      0€ (si licence)
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      0€
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-8 text-foreground/80 leading-relaxed font-semibold">
              💡 <strong>Verdict</strong> : Le logiciel spécialisé gagne sur tous
              les critères importants (temps, qualité, suivi). Le coût est
              largement compensé par le gain de temps et la professionnalisation.
            </p>
          </section>

          {/* Section 7 - Implémentation */}
          <section id="implementation" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Guide d'implémentation : Comment démarrer en 5 étapes
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Audit de vos besoins (30 min)
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Listez combien de devis vous créez par mois, quels types de
                    prestations, combien de clientes actives. Définissez votre
                    budget max (10€, 20€, 30€/mois ?). Identifiez vos priorités
                    (rapidité, personnalisation, statistiques).
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Configuration initiale (1h)
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Créez votre compte, ajoutez votre logo, remplissez vos
                    informations professionnelles (SIRET, adresse, TVA).
                    Personnalisez les couleurs si l'outil le permet.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Import de vos données (1-2h)
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Créez votre catalogue de services : listez toutes vos
                    prestations avec prix et durées. Importez vos clientes
                    existantes (nom, email, téléphone) via CSV si l'outil le
                    permet, sinon créez les 10-20 principales manuellement.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Formation de votre équipe (30 min)
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Si vous avez des collaboratrices, montrez-leur comment créer
                    un devis basique. La plupart des outils sont intuitifs : 10
                    minutes de démo suffisent. Créez un petit guide PDF avec
                    screenshots si besoin.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Premier devis test (10 min)
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Créez un devis réel pour une cliente existante. Vérifiez le
                    rendu PDF, envoyez-le par email. Demandez à la cliente ce
                    qu'elle en pense (design, clarté). Ajustez si besoin, puis
                    lancez-vous en production !
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Before case studies */}
          <div className="my-12 rounded-xl bg-foreground/5 p-8 text-center border border-foreground/10">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Prêt à digitaliser vos devis ?
            </h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              Rejoignez les centaines d'instituts qui utilisent Solkant pour
              créer des devis professionnels en moins de 3 minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-foreground px-8 py-3 font-semibold text-background hover:bg-foreground/90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/fonctionnalites"
                className="rounded-md border border-foreground/20 px-8 py-3 font-semibold text-foreground hover:bg-foreground/5"
              >
                Voir les fonctionnalités
              </Link>
            </div>
          </div>

          {/* Section 8 - Études de cas */}
          <section id="etudes-de-cas" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Études de cas : 3 instituts qui ont digitalisé leurs devis
            </h2>

            <div className="space-y-8">
              <div className="rounded-lg border border-foreground/10 p-8 bg-gradient-to-br from-purple-50/50 to-white">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Institut Belle Étoile (Paris 17e)
                </h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Institut traditionnel, 3 esthéticiennes, 200+ clientes actives
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Avant Solkant
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Marie, gérante, passait 20 min par devis sur Excel. 8-10
                      devis/semaine = 2h30-3h perdues. Erreurs de calcul
                      fréquentes (TVA, remises). Image peu professionnelle avec
                      fichiers Excel convertis en PDF.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Après Solkant (6 mois d'utilisation)
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Temps de création : <strong>3 min/devis</strong>. Économie
                      : 2h20/semaine = <strong>10h/mois</strong>. Taux de
                      conversion devis → vente passé de 62% à{" "}
                      <strong>78%</strong> grâce à des PDF plus professionnels
                      envoyés dans l'heure. ROI : 19€/mois vs 250€ de temps
                      gagné (10h × 25€/h valorisation).
                    </p>
                  </div>
                  <blockquote className="border-l-4 border-foreground pl-4 italic text-foreground/70 mt-4">
                    "Solkant a transformé notre façon de travailler. Nous sommes
                    passées d'une gestion artisanale à une vraie structure pro.
                    Nos clientes adorent recevoir leurs devis dans l'heure !"
                    <footer className="text-sm mt-2 not-italic">
                      — Marie D., Gérante
                    </footer>
                  </blockquote>
                </div>
              </div>

              <div className="rounded-lg border border-foreground/10 p-8 bg-gradient-to-br from-pink-50/50 to-white">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Camille L., Esthéticienne à domicile (Lyon)
                </h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Auto-entrepreneuse, prestations à domicile, gestion mobile
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Avant Solkant
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Devis manuscrits ou fichiers Excel sur Drive accessibles
                      depuis le téléphone. Impossible de créer un devis propre
                      en situation. Image peu professionnelle. Oublis fréquents
                      de numérotation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Après Solkant (3 mois d'utilisation)
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Création de devis depuis son téléphone entre deux
                      rendez-vous. Envoi immédiat par email ou WhatsApp.
                      Professionnalisation perçue par les clientes.{" "}
                      <strong>+35% de nouvelles clientes</strong> grâce au
                      bouche-à-oreille sur la qualité des devis.
                    </p>
                  </div>
                  <blockquote className="border-l-4 border-foreground pl-4 italic text-foreground/70 mt-4">
                    "Avant Solkant, je perdais des clientes à cause de mes devis
                    'fait maison'. Maintenant j'ai un rendu ultra-pro et mes
                    clientes me recommandent énormément !"
                    <footer className="text-sm mt-2 not-italic">
                      — Camille L., Esthéticienne
                    </footer>
                  </blockquote>
                </div>
              </div>

              <div className="rounded-lg border border-foreground/10 p-8 bg-gradient-to-br from-blue-50/50 to-white">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Spa Zen & Beauté (Bordeaux)
                </h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Spa haut de gamme, forfaits personnalisés, clientèle entreprise
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Avant Solkant
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Devis complexes sur Word (forfaits multi-prestations). 30-
                      40 min par devis. Remises conditionnelles calculées
                      manuellement. Retards d'envoi (parfois 48h après demande).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Après Solkant (4 mois d'utilisation)
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Temps réduit à <strong>5-7 min/devis</strong>. Envoi dans
                      l'heure. PDF élégant adapté à une clientèle premium. Taux
                      de conversion amélioré de <strong>12 points</strong>{" "}
                      (70% → 82%) grâce à la réactivité et au design impeccable.
                    </p>
                  </div>
                  <blockquote className="border-l-4 border-foreground pl-4 italic text-foreground/70 mt-4">
                    "Notre clientèle est exigeante. Solkant nous permet d'envoyer
                    des devis dignes de notre standing en un temps record. C'est
                    devenu indispensable."
                    <footer className="text-sm mt-2 not-italic">
                      — Sophie M., Directrice
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 - FAQ */}
          <section id="faq" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Questions fréquentes (FAQ)
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Pourquoi utiliser un logiciel de devis plutôt qu'Excel ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Un logiciel de devis vous fait gagner 85% du temps (2-3 min vs
                  15-20 min), calcule automatiquement les totaux et TVA, génère
                  des PDF professionnels, et centralise l'historique client.
                  Excel nécessite ressaisie manuelle à chaque fois avec risques
                  d'erreurs de calcul.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Quelles sont les fonctionnalités indispensables ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Les 7 fonctionnalités essentielles : génération PDF
                  automatique, gestion clients intégrée, catalogue de services
                  réutilisable, calculs HT/TTC automatiques, numérotation
                  intelligente des devis, personnalisation (logo, couleurs), et
                  statistiques de suivi.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Combien coûte un logiciel de devis pour institut de beauté ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Les tarifs vont de 0€ (versions gratuites limitées comme le
                  plan Solkant gratuit jusqu'à 10 devis/mois) à 30€/mois pour
                  des solutions complètes. Solkant Pro coûte 19€/mois en
                  illimité. Le ROI est immédiat grâce au temps gagné (2h/semaine
                  = 200€/mois valorisés).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Puis-je importer mes clientes existantes ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Oui, la plupart des logiciels permettent d'importer vos
                  contacts via un fichier CSV (Excel). Sinon, vous pouvez créer
                  manuellement les fiches de vos 10-20 clientes principales en
                  30-45 minutes, puis ajouter les nouvelles au fil de l'eau.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Est-ce que mes devis seront conformes légalement ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Oui, les logiciels spécialisés incluent automatiquement les
                  mentions obligatoires (SIRET, TVA, date de validité,
                  conditions). Vous évitez les oublis qui peuvent coûter cher en
                  cas de contrôle ou de litige.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Puis-je utiliser le logiciel sur mobile et tablette ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Oui, les logiciels modernes comme Solkant sont 100%
                  responsive. Vous pouvez créer un devis depuis votre téléphone
                  entre deux rendez-vous, ou depuis votre tablette chez une
                  cliente à domicile. Vos données sont synchronisées en temps
                  réel.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Que se passe-t-il si j'arrête l'abonnement ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Vous pouvez généralement exporter toutes vos données (clients,
                  services, devis) au format PDF ou CSV avant de résilier. Vos
                  données restent accessibles pendant 30 jours après l'arrêt chez
                  la plupart des éditeurs. Vérifiez cette politique avant de vous
                  engager.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Conclusion
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Passer à un logiciel de devis spécialisé est aujourd'hui
              indispensable pour tout institut de beauté qui souhaite gagner du
              temps, professionnaliser son image, et piloter son activité avec
              des données concrètes.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Le retour sur investissement est immédiat : pour 19€/mois, vous
              gagnez 8-10 heures par mois (valorisées à 200-250€) et améliorez
              votre taux de conversion grâce à des devis impeccables.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              N'attendez plus pour franchir le cap de la digitalisation. Testez
              Solkant gratuitement dès aujourd'hui et créez votre premier devis
              professionnel en moins de 3 minutes.
            </p>
          </section>

          {/* Final CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              Créez votre premier devis professionnel maintenant
            </h3>
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              Rejoignez les centaines d'instituts de beauté qui utilisent Solkant
              pour gagner du temps et convertir plus de clientes.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-md bg-white px-10 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100"
            >
              Essai gratuit - Sans carte bancaire
            </Link>
            <p className="mt-4 text-sm text-white/80">
              Plan gratuit permanent • Démarrage en 2 minutes
            </p>
          </div>

          {/* Articles connexes */}
          <div className="mt-16 rounded-lg bg-foreground/5 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Articles connexes
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/blog/comment-faire-devis-professionnel-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Comment faire un devis professionnel pour votre institut
                </h4>
                <p className="text-sm text-foreground/60">
                  Guide complet avec mentions obligatoires, structure et conseils
                </p>
              </Link>
              <Link
                href="/blog/choisir-logiciel-devis-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Comment choisir le bon logiciel de devis
                </h4>
                <p className="text-sm text-foreground/60">
                  Critères essentiels pour sélectionner l'outil idéal
                </p>
              </Link>
              <Link
                href="/gestion-institut-beaute-guide"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Gestion institut de beauté : Le guide complet 2025
                </h4>
                <p className="text-sm text-foreground/60">
                  Tous les aspects de la gestion d'institut (clients, finances,
                  planning)
                </p>
              </Link>
              <Link
                href="/blog/erreurs-eviter-devis-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Les 10 erreurs fatales dans vos devis
                </h4>
                <p className="text-sm text-foreground/60">
                  Erreurs courantes qui font fuir les clientes
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>

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
