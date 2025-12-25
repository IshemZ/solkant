import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CheckoutButton } from "@/components/shared/CheckoutButton";

export const metadata: Metadata = {
  title: "Tarifs Solkant – Prix du logiciel de devis pour instituts de beauté",
  description:
    "Découvrez les tarifs de Solkant, le logiciel de devis pour instituts de beauté. Essai gratuit, sans engagement. Plans adaptés aux petites structures et salons.",
  openGraph: {
    title: "Tarifs Solkant – Logiciel de devis pour instituts",
    description:
      "Plans tarifaires transparents pour votre institut de beauté. Commencez gratuitement, sans carte bancaire.",
    url: "https://solkant.com/pricing",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/pricing.png",
        width: 1200,
        height: 630,
        alt: "Tarifs Solkant - Plans adaptés aux instituts de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs Solkant – Plans pour instituts de beauté",
    description:
      "Plans tarifaires transparents pour votre institut. Commencez gratuitement.",
    images: ["https://solkant.com/images/og/pricing.png"],
  },
  alternates: {
    canonical: "https://solkant.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Solkant - Logiciel de devis pour instituts de beauté",
            description:
              "Logiciel SaaS de création de devis pour instituts de beauté, salons d'esthétique et spas. Gestion clients, catalogue de services et génération de PDF professionnels.",
            image: "https://solkant.com/images/og/pricing.png",
            brand: {
              "@type": "Brand",
              name: "Solkant",
            },
            offers: [
              {
                "@type": "Offer",
                name: "Plan Gratuit",
                price: "0",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://solkant.com/pricing",
                description:
                  "Plan gratuit pour découvrir Solkant : jusqu'à 10 devis/mois, gestion clients illimitée, catalogue de services, génération PDF.",
              },
              {
                "@type": "Offer",
                name: "Plan Pro",
                price: "19",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://solkant.com/pricing",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "19",
                  priceCurrency: "EUR",
                  unitText: "MONTH",
                },
                description:
                  "Plan professionnel pour instituts : devis illimités, personnalisation avancée, statistiques, support prioritaire.",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              ratingCount: "1",
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
                  className="text-sm font-medium text-foreground hover:text-foreground"
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

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Tarifs", href: "/pricing" },
          ]}
          className="mb-8"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Tarifs Solkant : logiciel de devis pour instituts de beauté
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Commencez gratuitement et ne payez que lorsque votre activité se
            développe. Pas de frais cachés, pas d&apos;engagement.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Plan Gratuit */}
          <div className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Gratuit</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour découvrir Solkant et tester toutes les fonctionnalités
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-foreground">0 €</span>
                <span className="text-muted-foreground">/mois</span>
              </p>

              <ul className="mt-8 space-y-3">
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
                    Jusqu&apos;à 10 devis par mois
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
                    Gestion clients illimitée
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
                    Catalogue de services
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
                    Génération PDF élégante
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
                  <span className="text-foreground/80">Support par email</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 block rounded-md border border-foreground/20 px-6 py-3 text-center font-semibold text-foreground hover:bg-foreground/5"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Plan Pro - Recommandé */}
          <div className="relative flex flex-col rounded-2xl border-2 border-foreground bg-background p-8 shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block rounded-full bg-foreground px-4 py-1 text-sm font-semibold text-background">
                Recommandé
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Pro</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour les instituts qui veulent optimiser leur gestion
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-foreground">19 €</span>
                <span className="text-muted-foreground">/mois</span>
              </p>

              <ul className="mt-8 space-y-3">
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
                  <span className="text-foreground/80">Devis illimités</span>
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
                    Tout du plan Gratuit
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
                    Personnalisation avancée (logo, couleurs)
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
                    Historique complet et statistiques
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
                    Support prioritaire
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
                  <span className="text-foreground/80">Export des données</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <CheckoutButton />
            </div>
          </div>

          {/* Plan Entreprise */}
          <div className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Entreprise</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour les réseaux de salons et grandes structures
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-foreground">
                  Sur mesure
                </span>
              </p>

              <ul className="mt-8 space-y-3">
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
                  <span className="text-foreground/80">Tout du plan Pro</span>
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
                    Multi-établissements
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
                    Gestion des équipes
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
                    API et intégrations personnalisées
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
                    Formation et accompagnement
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
                  <span className="text-foreground/80">Support dédié 24/7</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 block rounded-md border border-foreground/20 px-6 py-3 text-center font-semibold text-foreground hover:bg-foreground/5"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-foreground/5 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions fréquentes sur nos tarifs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Tout ce que vous devez savoir sur les prix et abonnements Solkant
            </p>
          </div>

          {/* Schema.org FAQPage JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Le plan Gratuit est-il vraiment sans engagement ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, totalement. Le plan Gratuit de Solkant ne nécessite pas de carte bancaire et vous pouvez l'utiliser indéfiniment. Vous pouvez créer jusqu'à 10 devis par mois avec toutes les fonctionnalités essentielles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Puis-je changer de plan à tout moment ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolument. Vous pouvez passer du plan Gratuit au plan Pro (ou vice-versa) à tout moment depuis votre tableau de bord. Le changement est immédiat et vous ne payez que pour le temps restant du mois en cours.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Comment fonctionne la facturation du plan Pro ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Le plan Pro à 19€/mois est facturé mensuellement. Vous recevez une facture par email chaque mois. Vous pouvez annuler à tout moment sans frais supplémentaires. Aucune période d'engagement minimum n'est requise.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Y a-t-il des frais cachés ou des coûts supplémentaires ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Non, aucun. Le prix affiché (0€ pour Gratuit, 19€ pour Pro) est le prix total. Il n'y a pas de frais d'installation, de configuration, ni de coûts supplémentaires par utilisateur ou par devis.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Que se passe-t-il si je dépasse 10 devis sur le plan Gratuit ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Vous recevrez une notification lorsque vous approchez de la limite. Au-delà de 10 devis par mois, vous devrez passer au plan Pro pour continuer à créer des devis. Vos devis existants restent accessibles même si vous ne changez pas de plan.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Proposez-vous des réductions pour les abonnements annuels ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Actuellement, nous proposons uniquement des abonnements mensuels à 19€/mois. Nous prévoyons de proposer des tarifs annuels avec réduction dans le futur. Inscrivez-vous à notre newsletter pour être informé.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Puis-je annuler mon abonnement Pro à tout moment ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Oui, sans aucune pénalité. Vous pouvez annuler votre abonnement Pro depuis votre tableau de bord à tout moment. Vous conserverez l'accès au plan Pro jusqu'à la fin de votre période de facturation payée, puis vous serez automatiquement basculé sur le plan Gratuit.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Acceptez-vous les paiements par virement bancaire ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Actuellement, nous acceptons uniquement les paiements par carte bancaire via notre plateforme sécurisée (Stripe). Pour les entreprises nécessitant d'autres moyens de paiement, contactez-nous à contact@solkant.com.",
                    },
                  },
                ],
              }),
            }}
          />

          <div className="space-y-8">
            {/* FAQ 1 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Le plan Gratuit est-il vraiment sans engagement ?
              </h3>
              <p className="text-foreground/70">
                Oui, totalement. Le plan Gratuit de Solkant ne nécessite pas de
                carte bancaire et vous pouvez l&apos;utiliser indéfiniment. Vous
                pouvez créer jusqu&apos;à 10 devis par mois avec toutes les
                fonctionnalités essentielles.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-foreground/70">
                Absolument. Vous pouvez passer du plan Gratuit au plan Pro (ou
                vice-versa) à tout moment depuis votre tableau de bord. Le
                changement est immédiat et vous ne payez que pour le temps
                restant du mois en cours.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Comment fonctionne la facturation du plan Pro ?
              </h3>
              <p className="text-foreground/70">
                Le plan Pro à 19€/mois est facturé mensuellement. Vous recevez
                une facture par email chaque mois. Vous pouvez annuler à tout
                moment sans frais supplémentaires. Aucune période
                d&apos;engagement minimum n&apos;est requise.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Y a-t-il des frais cachés ou des coûts supplémentaires ?
              </h3>
              <p className="text-foreground/70">
                Non, aucun. Le prix affiché (0€ pour Gratuit, 19€ pour Pro) est
                le prix total. Il n&apos;y a pas de frais d&apos;installation,
                de configuration, ni de coûts supplémentaires par utilisateur ou
                par devis.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Que se passe-t-il si je dépasse 10 devis sur le plan Gratuit ?
              </h3>
              <p className="text-foreground/70">
                Vous recevrez une notification lorsque vous approchez de la
                limite. Au-delà de 10 devis par mois, vous devrez passer au plan
                Pro pour continuer à créer des devis. Vos devis existants
                restent accessibles même si vous ne changez pas de plan.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Proposez-vous des réductions pour les abonnements annuels ?
              </h3>
              <p className="text-foreground/70">
                Actuellement, nous proposons uniquement des abonnements mensuels
                à 19€/mois. Nous prévoyons de proposer des tarifs annuels avec
                réduction dans le futur. Inscrivez-vous à notre newsletter pour
                être informé.
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Puis-je annuler mon abonnement Pro à tout moment ?
              </h3>
              <p className="text-foreground/70">
                Oui, sans aucune pénalité. Vous pouvez annuler votre abonnement
                Pro depuis votre tableau de bord à tout moment. Vous conserverez
                l&apos;accès au plan Pro jusqu&apos;à la fin de votre période de
                facturation payée, puis vous serez automatiquement basculé sur
                le plan Gratuit.
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="rounded-lg bg-background border border-foreground/10 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Acceptez-vous les paiements par virement bancaire ?
              </h3>
              <p className="text-foreground/70">
                Actuellement, nous acceptons uniquement les paiements par carte
                bancaire via notre plateforme sécurisée (Stripe). Pour les
                entreprises nécessitant d&apos;autres moyens de paiement,
                contactez-nous à contact@solkant.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-foreground px-6 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Prêt à démarrer avec Solkant ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-background/80">
              Créez votre compte gratuit en 2 minutes et commencez à générer vos
              premiers devis professionnels.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-md bg-background px-8 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-background/90"
              >
                Commencer gratuitement
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
