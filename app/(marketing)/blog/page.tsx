import Link from "next/link";
import type { Metadata } from "next";
import { blogArticles } from "@/lib/blog-articles";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title:
    "Blog Solkant – Guides et conseils pour gérer votre institut de beauté",
  description:
    "Découvrez nos guides pratiques pour optimiser la gestion de votre institut de beauté : devis, clients, tarifs, organisation. Conseils d'experts.",
  openGraph: {
    title: "Blog Solkant – Conseils pour instituts de beauté",
    description:
      "Guides et astuces pour améliorer la gestion quotidienne de votre institut de beauté.",
    url: "https://solkant.com/blog",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://solkant.com/images/og/blog.png",
        width: 1200,
        height: 630,
        alt: "Blog Solkant - Guides et conseils pour gérer votre institut",
      },
    ],
  },
  alternates: {
    canonical: "https://solkant.com/blog",
  },
};

export default function BlogPage() {
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
                  className="text-sm font-medium text-foreground hover:text-foreground"
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
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Blog", href: "/blog" },
          ]}
          className="mb-8"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Guides et conseils pour gérer votre institut de beauté
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
            Guides pratiques et conseils d&apos;experts pour optimiser la
            gestion de votre institut de beauté
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <span className="font-medium text-foreground">
                  {article.category}
                </span>
                <span>•</span>
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-foreground">
                {article.title}
              </h2>

              <p className="mt-3 flex-1 text-foreground/60">
                {article.description}
              </p>

              <Link
                href={`/blog/${article.slug}`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-foreground hover:underline"
              >
                Lire l&apos;article
                <svg
                  className="ml-1 h-4 w-4"
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
            </article>
          ))}
        </div>

        {/* Newsletter placeholder */}
        <div className="mt-16 rounded-2xl bg-foreground/5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground">
            Recevez nos derniers articles
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-foreground/60">
            Inscrivez-vous à notre newsletter pour recevoir nos guides et
            conseils directement dans votre boîte mail.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 rounded-md border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              required
            />
            <button
              type="submit"
              className="rounded-md bg-foreground px-6 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              S&apos;inscrire
            </button>
          </form>
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
