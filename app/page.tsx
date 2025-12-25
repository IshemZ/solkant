import Link from "next/link";
import type { Metadata } from "next";

// Année pour le copyright - évaluée une seule fois au build
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "Solkant – Logiciel de devis pour instituts de beauté et salons",
  description:
    "Créez des devis professionnels pour votre institut de beauté en quelques clics. Gestion clients, catalogue de services, PDF personnalisés. Essai gratuit.",
  openGraph: {
    title: "Solkant – Logiciel de devis pour instituts de beauté",
    description:
      "Simplifiez la création de devis pour votre institut avec Solkant. Interface simple, PDF élégants, gain de temps garanti.",
    url: "https://solkant.com",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/home.png",
        width: 1200,
        height: 630,
        alt: "Solkant - Créez des devis élégants pour votre institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solkant – Logiciel de devis pour instituts de beauté",
    description:
      "Créez des devis professionnels pour votre institut en quelques clics.",
  },
  alternates: {
    canonical: "https://solkant.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org JSON-LD pour SEO - SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Solkant",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            operatingSystem: "Web",
            description:
              "Logiciel de création de devis pour instituts de beauté et salons. Gestion clients, services et génération de PDF professionnels.",
            url: "https://solkant.com",
            audience: {
              "@type": "Audience",
              audienceType: "instituts de beauté, salons, spas",
            },
          }),
        }}
      />

      {/* Schema.org JSON-LD pour SEO - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Solkant est-il adapté aux petits instituts de beauté ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui, Solkant a été conçu spécialement pour les petites structures : instituts de beauté, salons d'esthétique, spas, praticiennes indépendantes. L'interface est simple et ne nécessite aucune formation.",
                },
              },
              {
                "@type": "Question",
                name: "Puis-je personnaliser mes devis avec mon logo ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolument. Vous pouvez ajouter votre logo, adapter les couleurs à votre charte graphique et personnaliser les mentions légales pour refléter l'identité de votre institut.",
                },
              },
              {
                "@type": "Question",
                name: "Mes données sont-elles sécurisées ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui, vos données clients et devis sont hébergées de manière sécurisée en Europe et protégées par chiffrement. Nous respectons le RGPD.",
                },
              },
              {
                "@type": "Question",
                name: "Combien de temps faut-il pour créer un devis ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En moyenne, 2 à 3 minutes. Une fois votre catalogue de services créé, il suffit de sélectionner les prestations et Solkant génère automatiquement un PDF professionnel prêt à envoyer.",
                },
              },
              {
                "@type": "Question",
                name: "Y a-t-il un essai gratuit ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui, vous pouvez commencer gratuitement et tester toutes les fonctionnalités de Solkant sans engagement ni carte bancaire.",
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
              <div className="text-2xl font-bold text-foreground">Solkant</div>
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
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Logiciel de devis pour instituts de beauté – Solkant
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Solkant simplifie la création de devis professionnels pour les
            instituts de beauté. Gérez vos clients, services et générez des PDF
            personnalisés en quelques clics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-foreground px-8 py-3 text-base font-semibold text-background shadow-sm hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="#features"
              className="rounded-md border border-foreground/20 px-8 py-3 text-base font-semibold text-foreground hover:bg-foreground/5"
            >
              Découvrir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-foreground/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Des outils simples et puissants pour gérer votre activité
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Devis professionnels
              </h3>
              <p className="mt-2 text-muted-foreground">
                Créez des devis élégants et personnalisés avec votre logo et vos
                couleurs en quelques clics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Gestion clients
              </h3>
              <p className="mt-2 text-muted-foreground">
                Gérez facilement vos clients et leur historique de devis depuis
                un seul endroit.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Catalogue de services
              </h3>
              <p className="mt-2 text-muted-foreground">
                Créez votre catalogue de prestations avec prix et durées pour
                générer vos devis rapidement.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Personnalisation
              </h3>
              <p className="mt-2 text-muted-foreground">
                Adaptez les couleurs et le design à l&apos;identité visuelle de
                votre institut.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Simple et rapide
              </h3>
              <p className="mt-2 text-muted-foreground">
                Interface intuitive pensée pour gagner du temps au quotidien.
                Pas de complexité inutile.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg bg-background p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Sécurisé
              </h3>
              <p className="mt-2 text-muted-foreground">
                Vos données sont protégées et hébergées de manière sécurisée.
                Confidentiel et fiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Créez vos premiers devis professionnels en 3 étapes simples
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Étape 1 */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Créez votre catalogue
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Ajoutez vos prestations (soins visage, épilation, manucure,
                etc.) avec les prix et durées. Votre catalogue est réutilisable
                pour tous vos futurs devis. Vous pouvez organiser vos services
                par catégorie pour retrouver rapidement ce dont vous avez
                besoin.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sélectionnez vos prestations
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Créez un nouveau devis en quelques clics : choisissez votre
                client, sélectionnez les prestations dans votre catalogue, et
                Solkant calcule automatiquement les totaux. Ajoutez des remises
                ou des notes personnalisées si besoin. Le tout en moins de 3
                minutes.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Générez et envoyez
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Votre devis PDF professionnel est généré instantanément avec
                votre logo et vos couleurs. Téléchargez-le, imprimez-le ou
                envoyez-le directement par email à votre client. Suivez
                facilement son statut (brouillon, envoyé, accepté, refusé)
                depuis votre tableau de bord.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/register"
              className="inline-block rounded-md bg-foreground px-8 py-3 text-base font-semibold text-background shadow-sm hover:bg-foreground/90"
            >
              Essayer gratuitement maintenant
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Aucune carte bancaire requise • Configuration en 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Pourquoi Solkant Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir Solkant ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Parce que créer des devis ne devrait jamais être une corvée
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                <svg
                  className="h-8 w-8 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                Gain de temps immédiat
              </h3>
              <p className="mt-3 text-muted-foreground">
                Créez un devis en 2-3 minutes au lieu de 15-20 minutes. Plus de
                temps à chercher vos tarifs dans un cahier ou à calculer les
                totaux manuellement.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                <svg
                  className="h-8 w-8 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                Image professionnelle renforcée
              </h3>
              <p className="mt-3 text-muted-foreground">
                Des devis PDF élégants et soignés qui rassurent vos clients et
                valorisent votre expertise. Fini les documents Word mal
                formatés.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                <svg
                  className="h-8 w-8 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                Suivi et organisation
              </h3>
              <p className="mt-3 text-muted-foreground">
                Retrouvez tous vos devis en un coup d&apos;œil. Suivez leur
                statut (envoyé, accepté, refusé) et accédez à l&apos;historique
                par client instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui Section */}
      <section className="bg-foreground/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Solkant est fait pour vous
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Que vous soyez seule ou en équipe, Solkant s&apos;adapte à votre
              activité
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Instituts de beauté
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Soins visage, épilation, maquillage, manucure, pédicure... Créez
                des devis pour toutes vos prestations beauté.
              </p>
            </div>

            <div className="rounded-lg bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Salons d&apos;esthétique
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Esthéticiennes indépendantes ou en salon, simplifiez vos devis
                et concentrez-vous sur votre cœur de métier.
              </p>
            </div>

            <div className="rounded-lg bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Spas et centres bien-être
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Massages, soins corporels, forfaits détente... Proposez des
                devis personnalisés à vos clients.
              </p>
            </div>

            <div className="rounded-lg bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Praticiennes à domicile
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Vous vous déplacez chez vos clients ? Solkant vous suit partout
                depuis votre téléphone ou tablette.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir Solkant plutôt qu&apos;Excel ou Word ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Découvrez ce qui fait la différence pour votre institut
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Fonctionnalité
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground bg-foreground/5">
                    Solkant
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                    Excel / Word
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    Temps de création d&apos;un devis
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <span className="font-semibold text-foreground">
                      2-3 minutes
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">
                    15-20 minutes
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    Calcul automatique des totaux
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg
                      className="h-6 w-6 text-foreground/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    PDF professionnel automatique
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg
                      className="h-6 w-6 text-foreground/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    Gestion des clients intégrée
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg
                      className="h-6 w-6 text-foreground/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    Historique et statistiques
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg
                      className="h-6 w-6 text-foreground/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-foreground/10">
                  <td className="px-6 py-4 text-foreground/80">
                    Accessibilité mobile
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-muted-foreground">Limité</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-foreground/80">
                    Sauvegarde automatique cloud
                  </td>
                  <td className="px-6 py-4 text-center bg-foreground/5">
                    <svg
                      className="h-6 w-6 text-green-600 mx-auto"
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
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg
                      className="h-6 w-6 text-foreground/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-foreground/80 mb-6">
              Solkant vous fait gagner <strong>80% de temps</strong> sur la
              création de vos devis tout en renforçant votre image
              professionnelle.
            </p>
            <Link
              href="/fonctionnalites"
              className="inline-flex items-center text-foreground font-semibold hover:underline"
            >
              Découvrir toutes les fonctionnalités
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Elles nous font confiance
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Découvrez comment Solkant aide des instituts comme le vôtre au
              quotidien
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Témoignage 1 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4">
                &quot;Solkant m&apos;a fait gagner un temps fou ! Je créais mes
                devis sur Word en 20 minutes, maintenant c&apos;est fait en 3
                minutes. Mes clientes adorent le rendu professionnel des
                PDF.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 font-semibold text-foreground">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Sophie Martin
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Institut Belle Étoile, Paris
                  </div>
                </div>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4">
                &quot;Interface super intuitive, j&apos;ai tout compris en 5
                minutes. Le fait de pouvoir retrouver l&apos;historique par
                cliente est un vrai plus pour la fidélisation.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 font-semibold text-foreground">
                  CL
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Camille Lefèvre
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Esthéticienne à domicile, Lyon
                  </div>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4">
                &quot;Je recommande à toutes mes collègues ! Le plan gratuit est
                parfait pour démarrer, et quand on passe au Pro, on ne regrette
                pas les 19€/mois.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 font-semibold text-foreground">
                  EB
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Émilie Bernard
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Spa Zen & Beauté, Bordeaux
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Questions fréquentes
          </h2>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Solkant est-il adapté aux petits instituts de beauté ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, Solkant a été conçu spécialement pour les petites structures : instituts de beauté, salons d'esthétique, spas, praticiennes indépendantes. L'interface est simple et ne nécessite aucune formation.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Puis-je personnaliser mes devis avec mon logo ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolument. Vous pouvez ajouter votre logo, adapter les couleurs à votre charte graphique et personnaliser les mentions légales pour refléter l'identité de votre institut.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Mes données sont-elles sécurisées ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, vos données clients et devis sont hébergées de manière sécurisée en Europe et protégées par chiffrement. Nous respectons le RGPD.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Combien de temps faut-il pour créer un devis ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "En moyenne, 2 à 3 minutes. Une fois votre catalogue de services créé, il suffit de sélectionner les prestations et Solkant génère automatiquement un PDF professionnel prêt à envoyer.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Y a-t-il un essai gratuit ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, vous pouvez commencer gratuitement et tester toutes les fonctionnalités de Solkant sans engagement ni carte bancaire.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Puis-je utiliser Solkant sur mobile ou tablette ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, Solkant est accessible depuis n'importe quel navigateur web, que ce soit sur ordinateur, tablette ou smartphone. L'interface s'adapte automatiquement à la taille de votre écran.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Combien coûte Solkant ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Solkant propose un plan Gratuit (0€/mois, jusqu'à 10 devis/mois) et un plan Pro (19€/mois, devis illimités avec fonctionnalités avancées). Aucun engagement, vous pouvez changer de plan à tout moment.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Que se passe-t-il avec mes données si j'arrête d'utiliser Solkant ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Vous pouvez exporter toutes vos données (clients, services, devis) à tout moment au format PDF ou CSV. Même après l'arrêt de votre abonnement, vos données restent accessibles pendant 30 jours.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Ai-je besoin de compétences techniques pour utiliser Solkant ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Non, aucune compétence technique n'est requise. Solkant est conçu pour être intuitif. Si vous savez envoyer un email, vous savez utiliser Solkant. Un guide de démarrage rapide vous accompagne lors de la première utilisation.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Puis-je envoyer mes devis directement par email depuis Solkant ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, vous pouvez envoyer vos devis PDF directement par email à vos clients depuis Solkant. Vous pouvez également les télécharger ou les imprimer selon vos préférences.",
                    },
                  },
                ],
              }),
            }}
          />

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Solkant est-il adapté aux petits instituts de beauté ?
              </h3>
              <p className="text-muted-foreground">
                Oui, Solkant a été conçu spécialement pour les petites
                structures : instituts de beauté, salons d&apos;esthétique,
                spas, praticiennes indépendantes. L&apos;interface est simple et
                ne nécessite aucune formation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Puis-je personnaliser mes devis avec mon logo ?
              </h3>
              <p className="text-muted-foreground">
                Absolument. Vous pouvez ajouter votre logo, adapter les couleurs
                à votre charte graphique et personnaliser les mentions légales
                pour refléter l&apos;identité de votre institut.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-muted-foreground">
                Oui, vos données clients et devis sont hébergées de manière
                sécurisée en Europe et protégées par chiffrement. Nous
                respectons le RGPD.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Combien de temps faut-il pour créer un devis ?
              </h3>
              <p className="text-muted-foreground">
                En moyenne, 2 à 3 minutes. Une fois votre catalogue de services
                créé, il suffit de sélectionner les prestations et Solkant
                génère automatiquement un PDF professionnel prêt à envoyer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Y a-t-il un essai gratuit ?
              </h3>
              <p className="text-muted-foreground">
                Oui, vous pouvez commencer gratuitement et tester toutes les
                fonctionnalités de Solkant sans engagement ni carte bancaire.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Puis-je utiliser Solkant sur mobile ou tablette ?
              </h3>
              <p className="text-muted-foreground">
                Oui, Solkant est accessible depuis n&apos;importe quel
                navigateur web, que ce soit sur ordinateur, tablette ou
                smartphone. L&apos;interface s&apos;adapte automatiquement à la
                taille de votre écran.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Combien coûte Solkant ?
              </h3>
              <p className="text-muted-foreground">
                Solkant propose un plan Gratuit (0€/mois, jusqu&apos;à 10
                devis/mois) et un plan Pro (19€/mois, devis illimités avec
                fonctionnalités avancées). Aucun engagement, vous pouvez changer
                de plan à tout moment.{" "}
                <Link
                  href="/pricing"
                  className="text-foreground hover:underline font-medium"
                >
                  Voir les tarifs détaillés
                </Link>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Que se passe-t-il avec mes données si j&apos;arrête
                d&apos;utiliser Solkant ?
              </h3>
              <p className="text-muted-foreground">
                Vous pouvez exporter toutes vos données (clients, services,
                devis) à tout moment au format PDF ou CSV. Même après
                l&apos;arrêt de votre abonnement, vos données restent
                accessibles pendant 30 jours.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ai-je besoin de compétences techniques pour utiliser Solkant ?
              </h3>
              <p className="text-muted-foreground">
                Non, aucune compétence technique n&apos;est requise. Solkant est
                conçu pour être intuitif. Si vous savez envoyer un email, vous
                savez utiliser Solkant. Un guide de démarrage rapide vous
                accompagne lors de la première utilisation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Puis-je envoyer mes devis directement par email depuis Solkant ?
              </h3>
              <p className="text-muted-foreground">
                Oui, vous pouvez envoyer vos devis PDF directement par email à
                vos clients depuis Solkant. Vous pouvez également les
                télécharger ou les imprimer selon vos préférences.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Vous avez d&apos;autres questions ?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-foreground font-semibold hover:underline"
            >
              Contactez notre équipe
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section - Maillage interne */}
      <section className="bg-foreground/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Guides pratiques pour votre institut
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Découvrez nos conseils pour optimiser la gestion de votre activité
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Link
              href="/blog/comment-faire-devis-professionnel-institut-beaute"
              className="rounded-lg bg-background border border-foreground/10 p-6 hover:shadow-md transition-shadow"
              aria-label="Lire l'article : Comment faire un devis professionnel pour votre institut"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Comment faire un devis professionnel pour votre institut
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Guide complet pour créer des devis conformes et professionnels
                qui rassurent vos clients.
              </p>
              <span className="text-sm font-medium text-foreground hover:underline" aria-hidden="true">
                Lire l&apos;article →
              </span>
            </Link>

            <Link
              href="/blog/choisir-logiciel-devis-institut-beaute"
              className="rounded-lg bg-background border border-foreground/10 p-6 hover:shadow-md transition-shadow"
              aria-label="Lire l'article : Comment choisir le bon logiciel de devis"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Comment choisir le bon logiciel de devis
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Critères essentiels pour choisir l&apos;outil qui correspond
                vraiment aux besoins de votre institut.
              </p>
              <span className="text-sm font-medium text-foreground hover:underline" aria-hidden="true">
                Lire l&apos;article →
              </span>
            </Link>

            <Link
              href="/blog/optimiser-gestion-clients-institut-beaute"
              className="rounded-lg bg-background border border-foreground/10 p-6 hover:shadow-md transition-shadow"
              aria-label="Lire l'article : Optimiser la gestion de vos clients"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Optimiser la gestion de vos clients
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stratégies concrètes pour fidéliser votre clientèle et améliorer
                votre organisation.
              </p>
              <span className="text-sm font-medium text-foreground hover:underline" aria-hidden="true">
                Lire l&apos;article →
              </span>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-foreground font-semibold hover:underline"
            >
              Voir tous les articles
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-foreground px-6 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Prêt à simplifier votre gestion de devis ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-background/80">
              Rejoignez les instituts qui utilisent Solkant pour créer des devis
              professionnels en quelques minutes.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-md bg-background px-8 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-background/90"
              >
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
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
              &copy; {CURRENT_YEAR} Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
