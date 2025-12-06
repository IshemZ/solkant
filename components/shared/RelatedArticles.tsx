import Link from "next/link";

export interface RelatedArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentSlug: string;
}

export function RelatedArticles({
  articles,
  currentSlug,
}: RelatedArticlesProps) {
  // Filtrer l'article actuel et prendre max 3 articles
  const relatedArticles = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-foreground/10 bg-foreground/5 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Articles connexes
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block rounded-lg border border-foreground/10 bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-foreground/20"
            >
              <div className="mb-3">
                <span className="inline-block rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                  {article.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-foreground/60 mb-4 line-clamp-3">
                {article.description}
              </p>

              <div className="flex items-center text-xs text-foreground/50">
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {article.readTime}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-foreground hover:text-foreground/80"
          >
            Voir tous les articles
            <svg
              className="ml-2 h-4 w-4"
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
  );
}
