import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Gestion Institut de Beauté : Le Guide Complet 2025 | Solkant",
  description:
    "Guide ultime pour gérer votre institut de beauté efficacement : clients, devis, planning, finances. Outils, stratégies et conseils d'experts pour optimiser votre gestion.",
  keywords: [
    "gestion institut beauté",
    "gérer son institut de beauté",
    "outils gestion salon esthétique",
    "organisation institut beauté",
    "gestion clients beauté",
  ],
  openGraph: {
    title: "Gestion Institut de Beauté : Le Guide Complet 2025",
    description:
      "Maîtrisez tous les aspects de la gestion de votre institut : clients, devis, planning, finances. Guide pratique par Solkant.",
    url: "https://solkant.com/gestion-institut-beaute-guide",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    images: [
      {
        url: "https://solkant.com/images/og/pillar-gestion-institut.png",
        width: 1200,
        height: 630,
        alt: "Guide complet gestion institut de beauté 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestion Institut de Beauté : Le Guide Complet 2025",
    description:
      "Optimisez la gestion de votre institut avec ce guide complet : clients, finances, planning, outils.",
  },
  alternates: {
    canonical: "https://solkant.com/gestion-institut-beaute-guide",
  },
};

export default function GestionInstitutBeauteGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Gestion Institut de Beauté : Le Guide Complet 2025",
            description:
              "Guide pratique pour gérer efficacement votre institut de beauté : organisation, outils digitaux, stratégies de fidélisation.",
            image: "https://solkant.com/images/og/pillar-gestion-institut.png",
            datePublished: "2025-01-15T10:00:00Z",
            dateModified: "2025-01-15T10:00:00Z",
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
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

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            {
              label: "Gestion Institut Beauté",
              href: "/gestion-institut-beaute-guide",
            },
          ]}
          className="mb-8"
        />

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Gestion Institut de Beauté : Le Guide Complet pour 2025
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Maîtrisez tous les aspects de la gestion de votre institut de beauté
            pour gagner du temps, fidéliser vos clientes et développer votre
            chiffre d'affaires. Guide pratique et actionnable.
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
              <a href="#les-4-piliers" className="hover:text-foreground">
                2. Les 4 piliers de la gestion d'institut
              </a>
            </li>
            <li>
              <a href="#gestion-clients" className="hover:text-foreground">
                3. Gestion clients : Fidéliser et organiser
              </a>
            </li>
            <li>
              <a href="#gestion-devis-facturation" className="hover:text-foreground">
                4. Gestion des devis et facturation
              </a>
            </li>
            <li>
              <a href="#organisation-planning" className="hover:text-foreground">
                5. Organisation et planning
              </a>
            </li>
            <li>
              <a href="#gestion-financiere" className="hover:text-foreground">
                6. Gestion financière et comptabilité
              </a>
            </li>
            <li>
              <a href="#outils-recommandes" className="hover:text-foreground">
                7. Outils et logiciels recommandés
              </a>
            </li>
            <li>
              <a href="#checklist-30-jours" className="hover:text-foreground">
                8. Checklist : Optimiser sa gestion en 30 jours
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
          {/* Section 1 - Introduction */}
          <section id="introduction" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Introduction : Les défis de la gestion d'institut au quotidien
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Gérer un institut de beauté ne se limite pas à maîtriser les
              techniques de soin. Entre la gestion des rendez-vous, le suivi des
              clientes, la création de devis, la comptabilité, les commandes de
              produits et le marketing, vous jonglez avec une dizaine de
              casquettes simultanément.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cette charge mentale et administrative vous éloigne de votre cœur
              de métier : prendre soin de vos clientes et développer votre
              activité. Beaucoup d'instituts fonctionnent encore avec des
              méthodes artisanales (carnets, Excel, Post-its) qui génèrent stress
              et perte de temps.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Ce guide vous montre comment structurer et optimiser la gestion de
              votre institut grâce à des méthodes éprouvées et des outils
              digitaux accessibles. L'objectif : gagner 5 à 10 heures par semaine
              pour vous concentrer sur l'essentiel.
            </p>
          </section>

          {/* Section 2 - Les 4 piliers */}
          <section id="les-4-piliers" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Les 4 piliers de la gestion d'institut
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Une gestion efficace repose sur 4 piliers fondamentaux qui
              s'articulent entre eux :
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-white p-6 border border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Gestion clients
                  </h3>
                </div>
                <p className="text-foreground/70">
                  Base de données centralisée, historique des prestations,
                  fidélisation, communication personnalisée.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-pink-50 to-white p-6 border border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Gestion financière
                  </h3>
                </div>
                <p className="text-foreground/70">
                  Devis, facturation, suivi des paiements, indicateurs de
                  performance, préparation comptabilité.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-6 border border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Gestion planning
                  </h3>
                </div>
                <p className="text-foreground/70">
                  Prise de rendez-vous optimisée, gestion des annulations,
                  planning multi-praticienne.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-green-50 to-white p-6 border border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Gestion stocks
                  </h3>
                </div>
                <p className="text-foreground/70">
                  Commandes produits, suivi des stocks, prévention ruptures et
                  péremptions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 - Gestion clients */}
          <section id="gestion-clients" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Gestion clients : Fidéliser et organiser
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Pourquoi une base de données clients est indispensable
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              80% de votre chiffre d'affaires vient de 20% de vos clientes
              fidèles. Une gestion clients optimisée vous permet de :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
              <li>Retrouver instantanément l'historique d'une cliente</li>
              <li>
                Personnaliser vos prestations (allergies, préférences notées)
              </li>
              <li>Relancer les clientes inactives depuis 3-6 mois</li>
              <li>
                Envoyer des offres ciblées (anniversaire, fête des mères)
              </li>
              <li>
                Mesurer la valeur vie client (combien dépense une cliente sur 1
                an)
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Que mettre dans une fiche client ?
            </h3>
            <div className="rounded-lg bg-foreground/5 p-6 mb-6">
              <p className="text-foreground/80 mb-4 font-semibold">
                Informations essentielles :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>
                  <strong>Identité</strong> : Nom, prénom, date de naissance
                </li>
                <li>
                  <strong>Contact</strong> : Email, téléphone, adresse postale
                </li>
                <li>
                  <strong>Préférences</strong> : Allergies, sensibilités cutanées
                </li>
                <li>
                  <strong>Historique</strong> : Toutes les prestations avec dates
                </li>
                <li>
                  <strong>Notes</strong> : Commentaires personnalisés
                </li>
                <li>
                  <strong>Statistiques</strong> : CA total, fréquence de visite,
                  panier moyen
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Stratégies de fidélisation efficaces
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  1. Programme de fidélité
                </h4>
                <p className="text-foreground/80">
                  Système de points : 1€ dépensé = 1 point. 100 points = 10€ de
                  réduction. Incite aux visites régulières et augmente le panier
                  moyen.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  2. Communication personnalisée
                </h4>
                <p className="text-foreground/80">
                  Email ou SMS pour l'anniversaire de la cliente avec 15% de
                  remise. Taux d'ouverture de 65%+ car très personnalisé.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  3. Relance des inactives
                </h4>
                <p className="text-foreground/80">
                  Après 3 mois sans visite, envoyez un message : "Vous nous
                  manquez ! 20% sur votre prochaine prestation". Récupérez 25-30%
                  des clientes perdues.
                </p>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mt-6">
              👉 Pour aller plus loin :{" "}
              <Link
                href="/blog/optimiser-gestion-clients-institut-beaute"
                className="font-semibold text-foreground hover:underline"
              >
                5 astuces pour optimiser la gestion de vos clients
              </Link>
            </p>
          </section>

          {/* CTA Mid-content */}
          <div className="my-12 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-8 text-center border border-foreground/10">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Simplifiez la gestion de vos devis avec Solkant
            </h3>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Créez des devis professionnels en 2 minutes, gérez vos clients et
              suivez vos performances. Essai gratuit.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-md bg-foreground px-8 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              Tester gratuitement
            </Link>
          </div>

          {/* Section 4 - Gestion devis/facturation */}
          <section id="gestion-devis-facturation" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Gestion des devis et facturation
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Pourquoi digitaliser vos devis est crucial
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Le devis est souvent le premier document officiel que reçoit votre
              cliente. Un devis professionnel, clair et rapide inspire confiance
              et facilite la conversion. À l'inverse, un devis brouillon envoyé
              avec 2 jours de retard donne une image amateur.
            </p>

            <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-6 mb-6">
              <h4 className="font-semibold text-foreground mb-3">
                Impact d'un logiciel de devis sur votre activité :
              </h4>
              <ul className="space-y-2 text-foreground/80">
                <li>
                  ✅ <strong>Gain de temps :</strong> 15 min → 2 min par devis (85% de gain)
                </li>
                <li>
                  ✅ <strong>Taux de conversion :</strong> +12-15 points grâce à l'envoi
                  rapide
                </li>
                <li>
                  ✅ <strong>Image professionnelle :</strong> PDF élégants avec logo
                </li>
                <li>
                  ✅ <strong>Conformité :</strong> Mentions obligatoires automatiques
                </li>
                <li>
                  ✅ <strong>Suivi :</strong> Statut des devis (envoyé, accepté, refusé)
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Processus optimisé : De la demande au paiement
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Demande cliente (téléphone, email, en institut)
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    Notez les besoins : prestations souhaitées, date, budget
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Création devis (2-3 min avec logiciel)
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    Sélection cliente, ajout prestations, génération PDF
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Envoi immédiat par email
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    Démarquez-vous : envoyez dans l'heure suivant la demande
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Suivi et relance (J+5 si pas de réponse)
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    "Avez-vous pu consulter le devis ? Des questions ?"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Acceptation → Facturation
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    Convertir le devis en facture en 1 clic
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Encaissement et comptabilité
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    Marquer comme "payé", export pour comptable
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-foreground/5 p-6">
              <h4 className="font-semibold text-foreground mb-3">
                📊 Indicateurs à suivre pour vos devis :
              </h4>
              <ul className="space-y-2 text-foreground/80">
                <li>
                  <strong>Taux de conversion devis → vente</strong> : Objectif
                  70-80%
                </li>
                <li>
                  <strong>Délai moyen d'envoi</strong> : Objectif &lt; 24h
                </li>
                <li>
                  <strong>Montant moyen par devis</strong> : Suivre l'évolution
                </li>
                <li>
                  <strong>Nombre de devis/mois</strong> : Indicateur d'activité
                </li>
              </ul>
            </div>

            <p className="text-foreground/80 leading-relaxed mt-6">
              👉 Guide complet :{" "}
              <Link
                href="/logiciel-devis-institut-beaute"
                className="font-semibold text-foreground hover:underline"
              >
                Logiciel de devis pour institut de beauté - Guide 2025
              </Link>
            </p>
            <p className="text-foreground/80 leading-relaxed mt-2">
              👉 Tutoriel :{" "}
              <Link
                href="/blog/comment-faire-devis-professionnel-institut-beaute"
                className="font-semibold text-foreground hover:underline"
              >
                Comment faire un devis professionnel
              </Link>
            </p>
          </section>

          {/* Section 5 - Planning */}
          <section id="organisation-planning" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Organisation et planning
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Optimiser la prise de rendez-vous
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Un planning bien géré = zéro trou dans votre journée + moins
              d'annulations de dernière minute.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Réservation en ligne 24/7
                </h4>
                <p className="text-foreground/80">
                  Proposez un système de réservation en ligne (Calendly, Planity,
                  Treatwell). Vos clientes réservent même à 22h, vous validez le
                  lendemain. Gain : 30-40% de réservations en plus.
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Rappels automatiques par SMS/Email
                </h4>
                <p className="text-foreground/80">
                  Envoyez un rappel 24h avant le RDV. Réduit les absences de
                  15-20%. "Bonjour Julie, RDV demain à 14h pour soin visage. À
                  bientôt !"
                </p>
              </div>

              <div className="rounded-lg bg-foreground/5 p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Politique d'annulation claire
                </h4>
                <p className="text-foreground/80">
                  Annulation gratuite jusqu'à 24h avant, sinon 50% du montant dû.
                  Communiquez-le clairement dès la réservation. Responsabilise
                  les clientes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 - Gestion financière */}
          <section id="gestion-financiere" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Gestion financière et comptabilité
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Les indicateurs clés à suivre (KPIs)
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-6 border border-foreground/10">
                <h4 className="font-bold text-foreground mb-2">
                  Chiffre d'affaires mensuel
                </h4>
                <p className="text-foreground/70 text-sm">
                  Total des ventes du mois. Comparez mois par mois pour voir la
                  tendance.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-green-50 to-white p-6 border border-foreground/10">
                <h4 className="font-bold text-foreground mb-2">
                  Panier moyen par cliente
                </h4>
                <p className="text-foreground/70 text-sm">
                  CA total / nombre de clientes. Objectif : augmenter via upsell
                  et forfaits.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-white p-6 border border-foreground/10">
                <h4 className="font-bold text-foreground mb-2">
                  Taux de fidélisation
                </h4>
                <p className="text-foreground/70 text-sm">
                  % de clientes revenues au moins 2 fois dans l'année. Objectif :
                  &gt; 60%.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-pink-50 to-white p-6 border border-foreground/10">
                <h4 className="font-bold text-foreground mb-2">
                  Marge brute
                </h4>
                <p className="text-foreground/70 text-sm">
                  CA - coûts produits. Visez 60-70% de marge sur les prestations.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Préparer sa comptabilité simplement
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Même si vous avez un comptable, facilitez-lui la vie (et réduisez
              ses honoraires) en tenant un minimum de suivi :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
              <li>
                <strong>Fichier Excel mensuel</strong> : Recettes par jour, TVA
                collectée
              </li>
              <li>
                <strong>Scan des factures</strong> : Toutes vos dépenses
                (produits, loyer, EDF)
              </li>
              <li>
                <strong>Relevés bancaires</strong> : Archivés par mois
              </li>
              <li>
                <strong>Export logiciel devis</strong> : Si vous utilisez Solkant,
                exportez mensuellement
              </li>
            </ul>
          </section>

          {/* Section 7 - Outils */}
          <section id="outils-recommandes" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Outils et logiciels recommandés
            </h2>

            <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Stack technologique idéale pour un institut
            </h3>

            <div className="space-y-6">
              <div className="rounded-lg border border-foreground/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
                    1
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Gestion de devis : Solkant
                  </h4>
                </div>
                <p className="text-foreground/80 mb-3">
                  <strong>Usage :</strong> Création de devis PDF professionnels,
                  gestion clients, catalogue services, statistiques.
                </p>
                <p className="text-foreground/70 text-sm mb-2">
                  <strong>Prix :</strong> Gratuit jusqu'à 10 devis/mois, puis
                  19€/mois illimité
                </p>
                <p className="text-foreground/70 text-sm mb-3">
                  <strong>Pourquoi Solkant ?</strong> Spécialisé instituts de
                  beauté, interface simple, support français.
                </p>
                <Link
                  href="/register"
                  className="inline-block rounded-md bg-foreground px-6 py-2 text-sm font-semibold text-background hover:bg-foreground/90"
                >
                  Essayer Solkant gratuitement
                </Link>
              </div>

              <div className="rounded-lg border border-foreground/10 p-6 bg-foreground/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    2
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Prise de RDV : Planity / Calendly
                  </h4>
                </div>
                <p className="text-foreground/80 mb-2">
                  <strong>Usage :</strong> Réservation en ligne 24/7, rappels
                  automatiques, synchronisation Google Calendar.
                </p>
                <p className="text-foreground/70 text-sm">
                  <strong>Prix :</strong> Planity gratuit pour instituts /
                  Calendly 12€/mois
                </p>
              </div>

              <div className="rounded-lg border border-foreground/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                    3
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Comptabilité : Pennylane / Indy
                  </h4>
                </div>
                <p className="text-foreground/80 mb-2">
                  <strong>Usage :</strong> Facturation, déclarations TVA, export
                  comptable pour votre expert-comptable.
                </p>
                <p className="text-foreground/70 text-sm">
                  <strong>Prix :</strong> À partir de 12€/mois
                </p>
              </div>

              <div className="rounded-lg border border-foreground/10 p-6 bg-foreground/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white font-bold">
                    4
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Marketing : Mailchimp / Brevo
                  </h4>
                </div>
                <p className="text-foreground/80 mb-2">
                  <strong>Usage :</strong> Newsletters, emails automatisés
                  (anniversaires, promotions).
                </p>
                <p className="text-foreground/70 text-sm">
                  <strong>Prix :</strong> Brevo gratuit jusqu'à 300 emails/jour
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-6">
              <h4 className="font-semibold text-foreground mb-3">
                💰 Budget total mensuel recommandé
              </h4>
              <ul className="space-y-2 text-foreground/80">
                <li>
                  <strong>Essentiel (démarrage)</strong> : 20-30€/mois (Solkant +
                  Planity)
                </li>
                <li>
                  <strong>Complet (croissance)</strong> : 50-70€/mois (+ compta +
                  marketing)
                </li>
                <li>
                  <strong>ROI</strong> : Gain de 8-10h/mois = 200-250€ valorisés
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 - Checklist */}
          <section id="checklist-30-jours" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Checklist : Optimiser sa gestion en 30 jours
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                    Semaine 1
                  </span>
                  Audit et nettoyage
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">☐</span>
                    <span>
                      Listez tous vos outils actuels (Excel, carnets, Post-its)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">☐</span>
                    <span>
                      Identifiez les 3 plus grosses pertes de temps (ex: création
                      devis, recherche infos clients)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">☐</span>
                    <span>
                      Centralisez votre fichier clients dans un seul document
                      Excel (nom, email, téléphone)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-pink-600 text-white px-3 py-1 text-sm font-bold">
                    Semaine 2
                  </span>
                  Digitalisation devis
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-bold">☐</span>
                    <span>
                      Créez votre compte Solkant (gratuit jusqu'à 10 devis/mois)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-bold">☐</span>
                    <span>
                      Ajoutez votre logo et vos informations professionnelles
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-bold">☐</span>
                    <span>
                      Créez votre catalogue de services (20-30 prestations)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-600 font-bold">☐</span>
                    <span>
                      Créez 5 devis tests et envoyez-les à des amies pour
                      feedback
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                    Semaine 3
                  </span>
                  Organisation planning
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">☐</span>
                    <span>
                      Testez Planity ou Calendly (versions gratuites)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">☐</span>
                    <span>Configurez les rappels automatiques par SMS/email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">☐</span>
                    <span>
                      Communiquez le lien de réservation à vos clientes
                      (Instagram, email, vitrine)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-green-600 text-white px-3 py-1 text-sm font-bold">
                    Semaine 4
                  </span>
                  Suivi et optimisation
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">☐</span>
                    <span>
                      Créez un tableau de bord Excel avec vos KPIs (CA, nb
                      clientes, panier moyen)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">☐</span>
                    <span>
                      Calculez le temps gagné vs avant (devis, RDV, recherche
                      infos)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">☐</span>
                    <span>
                      Ajustez vos process si nécessaire (templates de messages,
                      automatisations)
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <h4 className="font-semibold text-foreground mb-2">
                🎯 Résultat attendu après 30 jours
              </h4>
              <ul className="space-y-2 text-foreground/80">
                <li>✅ 5-10h/semaine gagnées sur les tâches administratives</li>
                <li>✅ Devis envoyés en moins de 3 minutes (vs 15-20 min)</li>
                <li>
                  ✅ Taux de conversion devis → vente amélioré de 10-15 points
                </li>
                <li>✅ Image professionnelle renforcée</li>
                <li>
                  ✅ Moins de stress, plus de temps pour vos clientes et votre
                  vie perso
                </li>
              </ul>
            </div>
          </section>

          {/* CTA Before FAQ */}
          <div className="my-12 rounded-xl bg-foreground/5 p-8 text-center border border-foreground/10">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Prêt à optimiser la gestion de votre institut ?
            </h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              Commencez par digitaliser vos devis avec Solkant. Essai gratuit,
              configuration en 10 minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-foreground px-8 py-3 font-semibold text-background hover:bg-foreground/90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/logiciel-devis-institut-beaute"
                className="rounded-md border border-foreground/20 px-8 py-3 font-semibold text-foreground hover:bg-foreground/5"
              >
                En savoir plus sur notre logiciel
              </Link>
            </div>
          </div>

          {/* Section 9 - FAQ */}
          <section id="faq" className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Questions fréquentes (FAQ)
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Par où commencer pour digitaliser mon institut ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Commencez par le plus chronophage : la gestion des devis.
                  Utilisez un logiciel comme Solkant (gratuit pour démarrer) qui
                  vous fera gagner 2h/semaine dès le premier mois. Ensuite,
                  ajoutez la prise de RDV en ligne (Planity), puis les autres
                  outils.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Quel budget prévoir pour les outils digitaux ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Pour démarrer : 0-20€/mois (versions gratuites de Solkant +
                  Planity). Pour une gestion complète : 50-70€/mois (devis +
                  planning + compta + marketing). Le ROI est immédiat grâce au
                  temps gagné (8-10h/mois = 200-250€ valorisés).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Comment fidéliser mes clientes efficacement ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Programme de fidélité (points ou cartes), communication
                  personnalisée (anniversaires, offres ciblées), et relance des
                  inactives après 3 mois. Une base clients bien gérée vous permet
                  d'automatiser ces actions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Combien de temps pour voir les bénéfices de la digitalisation ?
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Dès le premier mois pour le gain de temps (devis, RDV). Après
                  3-6 mois pour l'amélioration du CA (meilleur taux de conversion,
                  fidélisation accrue, upsell facilité).
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
              Optimiser la gestion de votre institut de beauté n'est plus une
              option en 2025. Vos concurrentes digitalisent leurs processus, vos
              clientes attendent réactivité et professionnalisme.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Commencez petit : digitalisez vos devis avec Solkant cette semaine,
              puis ajoutez progressivement d'autres outils (planning, marketing).
              En 30 jours, vous aurez transformé votre quotidien et libéré 8-10h
              par mois pour ce qui compte vraiment.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Ne laissez pas la gestion administrative étouffer votre passion
              pour votre métier. Les outils existent, ils sont accessibles et
              rentables. Lancez-vous maintenant.
            </p>
          </section>

          {/* Final CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              Commencez à optimiser votre gestion aujourd'hui
            </h3>
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              Créez votre compte Solkant gratuit et digitalisez vos devis en 10
              minutes. Première étape vers une gestion optimisée.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-md bg-white px-10 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100"
            >
              Démarrer gratuitement
            </Link>
            <p className="mt-4 text-sm text-white/80">
              Aucune carte bancaire requise • Configuration en 10 minutes
            </p>
          </div>

          {/* Articles connexes */}
          <div className="mt-16 rounded-lg bg-foreground/5 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Articles connexes
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/logiciel-devis-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Logiciel de Devis pour Institut de Beauté - Guide Complet
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tout savoir pour choisir le meilleur logiciel de devis
                </p>
              </Link>
              <Link
                href="/blog/optimiser-gestion-clients-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  5 astuces pour optimiser la gestion de vos clients
                </h4>
                <p className="text-sm text-muted-foreground">
                  Fidélisez et organisez votre fichier clients
                </p>
              </Link>
              <Link
                href="/blog/digitaliser-gestion-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Pourquoi digitaliser votre institut en 2025
                </h4>
                <p className="text-sm text-muted-foreground">
                  Les 7 raisons essentielles de passer au numérique
                </p>
              </Link>
              <Link
                href="/blog/comment-faire-devis-professionnel-institut-beaute"
                className="block rounded-lg bg-background p-6 hover:shadow-md transition-shadow border border-foreground/10"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  Comment faire un devis professionnel
                </h4>
                <p className="text-sm text-muted-foreground">
                  Mentions obligatoires, structure et conseils
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>

      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Accueil
              </Link>
              <Link
                href="/fonctionnalites"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Fonctionnalités
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Tarifs
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
