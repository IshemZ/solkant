import Link from "next/link";
import type { Metadata } from "next";

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
  alternates: {
    canonical: "https://solkant.com/pricing",
  },
};

export default function PricingPage() {
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
                  className="text-sm font-medium text-foreground hover:text-foreground"
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
            Des tarifs simples et transparents pour votre institut
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
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
              <p className="mt-2 text-sm text-foreground/60">
                Pour découvrir Solkant et tester toutes les fonctionnalités
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-foreground">0 €</span>
                <span className="text-foreground/60">/mois</span>
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
              <p className="mt-2 text-sm text-foreground/60">
                Pour les instituts qui veulent optimiser leur gestion
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-foreground">19 €</span>
                <span className="text-foreground/60">/mois</span>
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

            <Link
              href="/register"
              className="mt-8 block rounded-md bg-foreground px-6 py-3 text-center font-semibold text-background hover:bg-foreground/90"
            >
              Commencer l&apos;essai gratuit
            </Link>
          </div>

          {/* Plan Entreprise */}
          <div className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Entreprise</h2>
              <p className="mt-2 text-sm text-foreground/60">
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
      <section className="bg-foreground/5 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Questions fréquentes sur les tarifs
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-foreground/60">
                Oui, vous pouvez passer du plan Gratuit au plan Pro (et
                vice-versa) à tout moment depuis votre tableau de bord. Le
                changement est immédiat et la facturation est ajustée au
                prorata.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Dois-je fournir ma carte bancaire pour l&apos;essai gratuit ?
              </h3>
              <p className="text-foreground/60">
                Non, le plan Gratuit ne nécessite aucune carte bancaire. Vous
                pouvez créer votre compte et utiliser Solkant immédiatement sans
                engagement.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Que se passe-t-il si je dépasse 10 devis sur le plan Gratuit ?
              </h3>
              <p className="text-foreground/60">
                Vous recevrez une notification vous invitant à passer au plan
                Pro. Vos devis existants restent accessibles, mais vous ne
                pourrez plus en créer de nouveaux jusqu&apos;à la prochaine
                période ou jusqu&apos;à votre passage au plan Pro.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Y a-t-il un engagement de durée ?
              </h3>
              <p className="text-foreground/60">
                Non, tous nos plans sont sans engagement. Vous pouvez annuler
                votre abonnement à tout moment, et vous ne serez pas facturé
                pour le mois suivant.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Les tarifs incluent-ils la TVA ?
              </h3>
              <p className="text-foreground/60">
                Les tarifs affichés sont hors taxes. La TVA applicable (20% en
                France) sera ajoutée lors du paiement selon votre pays de
                facturation.
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
