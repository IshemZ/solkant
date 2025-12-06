import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Solkant – Contactez-nous pour vos questions",
  description:
    "Une question sur Solkant, notre logiciel de devis pour instituts de beauté ? Contactez notre équipe. Nous répondons rapidement à toutes vos demandes.",
  openGraph: {
    title: "Contact Solkant – Nous sommes là pour vous aider",
    description:
      "Questions, demandes d'information, support technique. Contactez l'équipe Solkant facilement.",
    url: "https://solkant.com/contact",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Solkant - Nous répondons à toutes vos questions",
      },
    ],
  },
  alternates: {
    canonical: "https://solkant.com/contact",
  },
};

export default function ContactPage() {
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
                  className="text-sm font-medium text-foreground/60 hover:text-foreground"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-foreground hover:text-foreground"
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
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
          className="mb-8"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Contactez Solkant – Support logiciel de devis
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
            Une question, une demande de démonstration ou besoin d&apos;aide ?
            Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Formulaire de contact */}
          <div className="rounded-2xl bg-background border border-foreground/10 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Envoyez-nous un message
            </h2>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Sujet
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="demo">Demande de démonstration</option>
                  <option value="support">Support technique</option>
                  <option value="pricing">Questions sur les tarifs</option>
                  <option value="feature">Suggestion de fonctionnalité</option>
                  <option value="other">Autre question</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                  placeholder="Décrivez votre demande..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-foreground px-6 py-3 text-base font-semibold text-background hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Autres moyens de nous joindre
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                    <svg
                      className="h-6 w-6 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="mt-1 text-foreground/60">
                      contact@solkant.com
                    </p>
                    <p className="mt-1 text-sm text-foreground/50">
                      Réponse sous 24h en semaine
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                    <svg
                      className="h-6 w-6 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Chat en direct
                    </h3>
                    <p className="mt-1 text-foreground/60">
                      Disponible du lundi au vendredi
                    </p>
                    <p className="mt-1 text-sm text-foreground/50">
                      9h - 18h (heure de Paris)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                    <svg
                      className="h-6 w-6 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Documentation
                    </h3>
                    <p className="mt-1 text-foreground/60">
                      Centre d&apos;aide et guides
                    </p>
                    <Link
                      href="/blog"
                      className="mt-1 inline-block text-sm text-foreground hover:underline"
                    >
                      Consulter les articles →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="rounded-2xl bg-foreground/5 p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Questions fréquentes rapides
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Puis-je tester Solkant gratuitement ?
                  </h4>
                  <p className="text-sm text-foreground/60">
                    Oui, le plan Gratuit est disponible sans carte bancaire.{" "}
                    <Link
                      href="/register"
                      className="text-foreground hover:underline"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Combien coûte Solkant ?
                  </h4>
                  <p className="text-sm text-foreground/60">
                    À partir de 0€/mois (plan Gratuit) ou 19€/mois (plan Pro).{" "}
                    <Link
                      href="/pricing"
                      className="text-foreground hover:underline"
                    >
                      Voir les tarifs
                    </Link>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Mes données sont-elles sécurisées ?
                  </h4>
                  <p className="text-sm text-foreground/60">
                    Oui, hébergement sécurisé en Europe, chiffrement SSL/TLS et
                    conformité RGPD garantie.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Proposez-vous des formations ?
                  </h4>
                  <p className="text-sm text-foreground/60">
                    L&apos;interface est intuitive, mais nous proposons des
                    guides vidéo et un accompagnement personnalisé sur demande.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/60">
              Créez votre compte gratuitement et testez Solkant sans engagement.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block rounded-md bg-foreground px-8 py-3 text-base font-semibold text-background shadow-sm hover:bg-foreground/90"
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
