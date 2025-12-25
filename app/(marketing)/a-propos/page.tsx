import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "À propos de Solkant – Notre mission pour les instituts de beauté",
  description:
    "Découvrez l'histoire de Solkant, notre mission d'accompagner les instituts de beauté dans leur gestion quotidienne, et nos engagements en matière de sécurité et de confidentialité.",
  openGraph: {
    title: "À propos de Solkant – Notre mission",
    description:
      "Un outil pensé pour simplifier la vie des gérantes d'instituts de beauté et professionnaliser leur activité.",
    url: "https://solkant.com/a-propos",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/about.png",
        width: 1200,
        height: 630,
        alt: "À propos de Solkant - Notre mission pour les instituts de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos de Solkant – Notre mission",
    description:
      "Un outil pensé pour simplifier la gestion des instituts de beauté.",
    images: ["https://solkant.com/images/og/about.png"],
  },
  alternates: {
    canonical: "https://solkant.com/a-propos",
  },
};

export default function AboutPage() {
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
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "À propos", href: "/a-propos" },
          ]}
          className="mb-8"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simplifier la gestion des instituts de beauté
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Solkant est né d&apos;un constat simple : les gérantes
            d&apos;instituts de beauté perdent trop de temps sur des tâches
            administratives qui pourraient être simplifiées.
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Notre histoire
            </h2>
            <div className="prose prose-lg max-w-none text-foreground/80 space-y-4">
              <p>
                Tout a commencé par une observation : de nombreuses gérantes
                d&apos;instituts de beauté, malgré leur talent et leur
                professionnalisme, passaient des heures chaque semaine à créer
                des devis sur Word, à les numéroter manuellement, à gérer des
                fichiers Excel désorganisés pour leurs clients.
              </p>
              <p>
                Ces tâches chronophages les empêchaient de se concentrer sur
                l&apos;essentiel : accueillir leurs clientes, perfectionner
                leurs prestations, et développer leur activité.
              </p>
              <p>
                C&apos;est pourquoi nous avons créé <strong>Solkant</strong> :
                un outil pensé spécifiquement pour les instituts de beauté,
                salons et spas. Simple, rapide, et conçu pour s&apos;adapter aux
                réalités du terrain.
              </p>
            </div>
          </div>

          {/* Notre Mission */}
          <div className="bg-foreground/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Notre mission
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p className="text-lg">
                <strong>
                  Faire gagner du temps aux professionnels de la beauté
                </strong>{" "}
                en automatisant leurs tâches administratives.
              </p>
              <p>
                Nous croyons que chaque minute gagnée sur la création d&apos;un
                devis ou la gestion d&apos;un fichier client est une minute de
                plus consacrée à votre cœur de métier : prendre soin de vos
                clientes et faire grandir votre activité.
              </p>
            </div>
          </div>

          {/* Nos Valeurs */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Nos valeurs
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-foreground/10 bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground/10 text-foreground mb-4">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Simplicité
                </h3>
                <p className="text-muted-foreground">
                  Nous concevons des outils intuitifs, sans complexité inutile,
                  pour que vous puissiez les utiliser immédiatement.
                </p>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground/10 text-foreground mb-4">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Fiabilité
                </h3>
                <p className="text-muted-foreground">
                  Vos données sont précieuses. Nous garantissons leur sécurité
                  et leur disponibilité à tout moment.
                </p>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground/10 text-foreground mb-4">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Écoute
                </h3>
                <p className="text-muted-foreground">
                  Nos fonctionnalités sont façonnées par vos retours. Nous
                  restons à l&apos;écoute pour améliorer Solkant en continu.
                </p>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground/10 text-foreground mb-4">
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Excellence
                </h3>
                <p className="text-muted-foreground">
                  Nous visons l&apos;excellence dans chaque détail, pour vous
                  offrir une expérience professionnelle de qualité.
                </p>
              </div>
            </div>
          </div>

          {/* Nos Engagements */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Nos engagements
            </h2>

            <div className="space-y-6">
              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Conformité RGPD
                    </h3>
                    <p className="text-muted-foreground">
                      Solkant est entièrement conforme au Règlement Général sur
                      la Protection des Données (RGPD). Vos données clients sont
                      hébergées en Europe, chiffrées, et protégées selon les
                      standards les plus élevés. Vous pouvez à tout moment
                      exporter ou supprimer vos données.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Sécurité maximale
                    </h3>
                    <p className="text-muted-foreground">
                      Nous utilisons le chiffrement SSL/TLS pour toutes les
                      connexions, des sauvegardes quotidiennes automatiques, et
                      une infrastructure redondante pour garantir que vos
                      données sont toujours accessibles et protégées.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
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
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Support réactif
                    </h3>
                    <p className="text-muted-foreground">
                      Notre équipe est disponible pour répondre à vos questions
                      et vous accompagner dans l&apos;utilisation de Solkant.
                      Nous nous engageons à répondre à toutes les demandes dans
                      les 24 heures ouvrées.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Transparence tarifaire
                    </h3>
                    <p className="text-muted-foreground">
                      Pas de frais cachés, pas de mauvaise surprise. Nos tarifs
                      sont clairs et affichés publiquement. Vous payez
                      uniquement ce que vous utilisez, et pouvez annuler à tout
                      moment sans pénalité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-2xl bg-foreground text-background p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à simplifier votre gestion ?
            </h2>
            <p className="mx-auto max-w-xl text-background/80 mb-8 text-lg">
              Rejoignez les instituts de beauté qui ont déjà adopté Solkant pour
              gagner du temps et professionnaliser leur activité.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-background px-8 py-3 font-semibold text-foreground hover:bg-background/90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-background/30 px-8 py-3 font-semibold text-background hover:bg-background/10"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 bg-foreground/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-foreground mb-4">
                Solkant
              </div>
              <p className="text-sm text-muted-foreground">
                Logiciel de devis pour instituts de beauté et salons
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/fonctionnalites"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Tarifs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/a-propos"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialite"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-foreground/10 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
