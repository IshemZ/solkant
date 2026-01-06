import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title:
    "Fonctionnalités Solkant – Logiciel de devis complet pour instituts de beauté",
  description:
    "Découvrez toutes les fonctionnalités de Solkant : création de devis PDF professionnels, gestion clients, catalogue de services, personnalisation avancée. Essai gratuit.",
  openGraph: {
    title: "Fonctionnalités Solkant – Outil complet pour votre institut",
    description:
      "Gestion de devis, clients, services, PDF élégants. Tout ce dont vous avez besoin pour professionnaliser votre institut de beauté.",
    url: "https://www.solkant.com/fonctionnalites",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://www.solkant.com/images/og/features.png",
        width: 1200,
        height: 630,
        alt: "Fonctionnalités Solkant - Gestion complète de devis pour instituts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fonctionnalités Solkant – Outil complet pour institut",
    description:
      "Gestion de devis, clients, services, PDF élégants pour votre institut.",
    images: ["https://www.solkant.com/images/og/features.png"],
  },
  alternates: {
    canonical: "https://www.solkant.com/fonctionnalites",
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

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Fonctionnalités", href: "/fonctionnalites" },
          ]}
          className="mb-8"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Fonctionnalités du logiciel de devis Solkant pour instituts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
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
              <p className="mt-4 text-lg text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
                  Centralisez vos contacts clients
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Gérez facilement votre base clients
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
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
              <p className="mt-4 text-lg text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
                  Personnalisez l&apos;apparence de vos devis
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Personnalisez vos devis à votre image
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
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
              <p className="mt-4 text-lg text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
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
                <p className="mt-4 text-sm text-muted-foreground">
                  Vos données protégées et sécurisées
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground">
                Vos données en sécurité
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
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

      {/* Use Cases Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cas d&apos;usage concrets par type d&apos;institut
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Découvrez comment des professionnelles comme vous utilisent Solkant
            au quotidien pour simplifier leur gestion de devis et gagner du
            temps.
          </p>
        </div>

        <div className="space-y-16">
          {/* Use Case 1 - Institut de beauté traditionnel */}
          <div className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-purple-50/50 to-white p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-1">
                <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-3 mb-4">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Institut de beauté avec équipe
                </h3>
                <p className="text-muted-foreground">
                  Salon traditionnel, 3 esthéticiennes, 200+ clientes actives
                </p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-foreground/5">
                  <h4 className="font-semibold text-foreground mb-3">
                    📋 Problématique avant Solkant
                  </h4>
                  <p className="text-foreground/70">
                    Marie, gérante d&apos;un institut à Lyon, passait 20 minutes
                    par devis sur Excel : saisie manuelle des prestations,
                    calcul des totaux à la calculatrice, risque d&apos;erreur
                    sur la TVA, impression puis scan pour envoi par email. Avec
                    5-10 devis par semaine, cela représentait 2-3 heures
                    perdues.
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-6 shadow-sm border border-purple-100">
                  <h4 className="font-semibold text-foreground mb-3">
                    ✅ Solution avec Solkant
                  </h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <span>
                        <strong>Catalogue pré-configuré :</strong> 40
                        prestations (soins visage, épilations, manucure,
                        pédicure) avec prix et durées enregistrées une fois pour
                        toutes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <span>
                        <strong>Création rapide :</strong> sélection de la
                        cliente dans la base (+ création rapide si nouvelle),
                        ajout des prestations en 2 clics, ajustement des
                        quantités
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <span>
                        <strong>Génération PDF instantanée :</strong> document
                        professionnel avec logo de l&apos;institut, calculs
                        automatiques, numéro unique (DEVIS-2025-047)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">4.</span>
                      <span>
                        <strong>Suivi centralisé :</strong> tableau de bord avec
                        tous les devis, filtres par statut (en attente,
                        accepté), historique complet par cliente
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6 shadow-sm border border-green-100">
                  <h4 className="font-semibold text-foreground mb-2">
                    🎯 Résultats concrets
                  </h4>
                  <p className="text-foreground/70 mb-3">
                    Temps de création d&apos;un devis :{" "}
                    <strong>20 min → 3 min</strong>. Économie :{" "}
                    <strong>2h30/semaine = 10h/mois</strong>. Marie utilise ce
                    temps gagné pour développer son activité et fidéliser ses
                    clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Case 2 - Spa avec forfaits */}
          <div className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-blue-50/50 to-white p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-1">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-4">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Spa & centre bien-être
                </h3>
                <p className="text-muted-foreground">
                  Spa haut de gamme, forfaits personnalisés, clientèle
                  entreprise
                </p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-foreground/5">
                  <h4 className="font-semibold text-foreground mb-3">
                    📋 Problématique avant Solkant
                  </h4>
                  <p className="text-foreground/70">
                    Sophie gère un spa proposant des forfaits sur-mesure
                    (journées détente, cures bien-être). Chaque devis
                    nécessitait de combiner plusieurs prestations, appliquer des
                    remises conditionnelles, et présenter un document impeccable
                    pour une clientèle exigeante. Résultat : 30-40 min par devis
                    sur Word.
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-6 shadow-sm border border-blue-100">
                  <h4 className="font-semibold text-foreground mb-3">
                    ✅ Solution avec Solkant
                  </h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>
                        <strong>Prestations modulables :</strong> massages (30,
                        60, 90 min), soins corps, hammam, sauna... Chaque
                        prestation a son prix et sa durée
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>
                        <strong>Composition de forfaits :</strong> sélection
                        multiple de prestations, ajustement des quantités (ex :
                        2 massages + 1 soin visage + accès spa)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>
                        <strong>PDF élégant et professionnel :</strong> design
                        épuré, tableau détaillé, total HT/TTC, mentions légales
                        automatiques
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <span>
                        <strong>Suivi des devis entreprises :</strong> statuts
                        clairs (envoyé, relancé, accepté), notes internes,
                        export facilité
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6 shadow-sm border border-green-100">
                  <h4 className="font-semibold text-foreground mb-2">
                    🎯 Résultats concrets
                  </h4>
                  <p className="text-foreground/70 mb-3">
                    Temps par devis : <strong>35 min → 5 min</strong>. Image de
                    marque renforcée grâce aux PDF élégants. Taux de conversion
                    amélioré car les clientes reçoivent leur devis dans
                    l&apos;heure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Case 3 - Praticienne mobile */}
          <div className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-pink-50/50 to-white p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-1">
                <div className="inline-flex items-center justify-center rounded-full bg-pink-100 p-3 mb-4">
                  <svg
                    className="h-8 w-8 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Praticienne indépendante à domicile
                </h3>
                <p className="text-muted-foreground">
                  Auto-entrepreneuse, prestations à domicile, gestion mobile
                </p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-foreground/5">
                  <h4 className="font-semibold text-foreground mb-3">
                    📋 Problématique avant Solkant
                  </h4>
                  <p className="text-foreground/70">
                    Camille, esthéticienne à domicile, jonglait entre son
                    smartphone, des fichiers Excel sur Drive, et des impressions
                    chez ses clientes. Impossible de créer un devis propre en
                    situation, difficile de retrouver l&apos;historique, image
                    peu professionnelle.
                  </p>
                </div>
                <div className="rounded-lg bg-pink-50 p-6 shadow-sm border border-pink-100">
                  <h4 className="font-semibold text-foreground mb-3">
                    ✅ Solution avec Solkant
                  </h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold">1.</span>
                      <span>
                        <strong>Accès mobile optimisé :</strong> interface
                        responsive, création de devis depuis son téléphone entre
                        deux rendez-vous
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold">2.</span>
                      <span>
                        <strong>Catalogue simplifié :</strong> 15-20 prestations
                        principales (manucure, épilation, maquillage
                        événementiel) toujours à portée de clic
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold">3.</span>
                      <span>
                        <strong>Envoi immédiat :</strong> génération PDF + envoi
                        par email direct depuis l&apos;app, ou téléchargement
                        pour WhatsApp
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold">4.</span>
                      <span>
                        <strong>Base clients centralisée :</strong> fini les
                        contacts éparpillés, tout l&apos;historique au même
                        endroit
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6 shadow-sm border border-green-100">
                  <h4 className="font-semibold text-foreground mb-2">
                    🎯 Résultats concrets
                  </h4>
                  <p className="text-foreground/70 mb-3">
                    Professionnalisation immédiate : devis envoyés dans les 5
                    minutes après discussion. Gain de crédibilité auprès des
                    nouvelles clientes. Organisation simplifiée = moins de
                    stress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action from use cases */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Quel que soit votre type d&apos;activité, Solkant s&apos;adapte à
            vos besoins
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-8 py-3 text-base font-semibold text-background shadow-sm hover:bg-foreground/90"
          >
            Découvrir les tarifs
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à tester Solkant gratuitement ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
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
