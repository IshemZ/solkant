import Link from "next/link";

// Année pour le copyright - évaluée une seule fois au build
const CURRENT_YEAR = new Date().getFullYear();

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Solkant</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/60 hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Créez des devis élégants
            <br />
            <span className="text-foreground/60">pour votre institut</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/60">
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
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-foreground/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tout ce dont vous avez besoin
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Devis professionnels
              </h4>
              <p className="mt-2 text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Gestion clients
              </h4>
              <p className="mt-2 text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Catalogue de services
              </h4>
              <p className="mt-2 text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Personnalisation
              </h4>
              <p className="mt-2 text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Simple et rapide
              </h4>
              <p className="mt-2 text-foreground/60">
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
              <h4 className="mt-4 text-xl font-semibold text-foreground">
                Sécurisé
              </h4>
              <p className="mt-2 text-foreground/60">
                Vos données sont protégées et hébergées de manière sécurisée.
                Confidentiel et fiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-foreground px-6 py-16 text-center sm:px-16">
            <h3 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Prêt à simplifier votre gestion de devis ?
            </h3>
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

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-foreground/60">
              &copy; {CURRENT_YEAR} Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
