import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Fonctionnalités Solkant – Logiciel de devis complet pour instituts de beauté",
  description:
    "Découvrez toutes les fonctionnalités de Solkant : création de devis PDF professionnels, gestion clients, catalogue de services, personnalisation avancée. Essai gratuit.",
  openGraph: {
    title: "Fonctionnalités Solkant – Outil complet pour votre institut",
    description:
      "Gestion de devis, clients, services, PDF élégants. Tout ce dont vous avez besoin pour professionnaliser votre institut de beauté.",
    url: "https://solkant.com/fonctionnalites",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/features.png",
        width: 1200,
        height: 630,
        alt: "Fonctionnalités Solkant - Gestion complète de devis pour instituts",
      },
    ],
  },
  alternates: {
    canonical: "https://solkant.com/fonctionnalites",
  },
};

export default function FeaturesPage() {
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
                  className="text-sm font-medium text-foreground hover:text-foreground"
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

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Toutes les fonctionnalités pour gérer vos devis professionnels
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
            Solkant vous accompagne au quotidien avec des outils simples et
            efficaces, pensés pour les instituts de beauté, salons
            d&apos;esthétique et spas.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {/* Feature 1 - Création de devis */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Créez des devis élégants en quelques clics
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Générez des devis professionnels en PDF avec un design moderne
                et épuré. Ajoutez vos prestations depuis votre catalogue,
                ajustez les quantités et durées, et téléchargez un document prêt
                à envoyer.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Numérotation automatique des devis (DEVIS-2025-001, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Calcul automatique des totaux et TVA
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Prévisualisation en temps réel avant génération PDF
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Suivi du statut (brouillon, envoyé, accepté, refusé)
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Aperçu de vos devis PDF élégants
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 - Gestion clients */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Centralisez vos contacts clients
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Gérez facilement votre base clients
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Enregistrez toutes les informations importantes de vos clients
                et accédez à leur historique de devis en un clic. Fini les
                carnets d&apos;adresses et fichiers Excel dispersés.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Fiches clients complètes (nom, email, téléphone, adresse)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Historique complet de tous les devis par client
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Recherche rapide par nom ou email
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Import/export de contacts (CSV)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 - Catalogue services */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Créez votre catalogue de prestations
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Définissez une fois pour toutes vos services avec leurs prix et
                durées. Utilisez-les ensuite pour générer vos devis en quelques
                secondes sans ressaisir les informations.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Services illimités (soins visage, épilation, massage, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Prix unitaire et durée estimée par prestation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Descriptions détaillées pour chaque service
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Modification facile des tarifs à tout moment
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Votre catalogue de services à portée de clic
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 - Personnalisation */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Personnalisez l&apos;apparence de vos devis
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Personnalisez vos devis à votre image
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Ajoutez votre logo, adaptez les couleurs à votre charte
                graphique et personnalisez les mentions légales pour que vos
                devis reflètent parfaitement l&apos;identité de votre institut.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Ajout de votre logo sur tous les devis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Personnalisation des couleurs (thème clair/foncé)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Mentions légales et conditions générales personnalisables
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Coordonnées de l&apos;institut (SIRET, adresse, contact)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 5 - Interface simple */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Une interface pensée pour vous
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Pas besoin de formation ni de compétences techniques. Solkant
                est intuitif et s&apos;adapte à votre façon de travailler. Vous
                serez autonome dès la première utilisation.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Tableau de bord clair avec statistiques clés
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Navigation simple et rapide entre les sections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Responsive : fonctionne sur ordinateur, tablette et mobile
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Notifications intelligentes pour ne rien oublier
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Simple, rapide, efficace
                </p>
              </div>
            </div>
          </div>

          {/* Feature 6 - Sécurité */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-foreground/5 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-32 w-32 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="mt-4 text-sm text-foreground/60">
                  Vos données protégées et sécurisées
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Vos données en sécurité
              </h2>
              <p className="mt-4 text-lg text-foreground/60">
                Nous prenons la sécurité de vos données au sérieux. Vos
                informations clients et vos devis sont protégés et hébergés en
                Europe selon les normes les plus strictes.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Chiffrement SSL/TLS de toutes les données
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Hébergement en Europe (conformité RGPD)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Sauvegardes automatiques quotidiennes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground/80">
                    Authentification sécurisée (email + Google OAuth)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à tester Solkant gratuitement ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/60">
              Créez votre compte en 2 minutes et découvrez comment Solkant peut
              simplifier la gestion de vos devis au quotidien.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-foreground px-8 py-3 text-base font-semibold text-background shadow-sm hover:bg-foreground/90"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/pricing"
                className="rounded-md border border-foreground/20 px-8 py-3 text-base font-semibold text-foreground hover:bg-foreground/5"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>

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
