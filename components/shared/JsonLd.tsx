/**
 * Composant utilitaire pour injecter des structured data JSON-LD dans les pages
 * Simplifie l'ajout de rich snippets pour améliorer le SEO
 */

import { generateArticleJsonLd, generateFAQJsonLd } from "@/lib/seo-config";

interface JsonLdProps {
  readonly data: object;
}

/**
 * Composant générique pour injecter n'importe quel JSON-LD
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * Composant pour injecter les données structurées d'un article de blog
 */
export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  readonly headline: string;
  readonly description: string;
  readonly image: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly authorName: string;
  readonly url: string;
}) {
  const data = generateArticleJsonLd({
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName,
    url,
  });

  return <JsonLd data={data} />;
}

/**
 * Composant pour injecter les données structurées d'une FAQ
 */
export function FAQJsonLd({
  questions,
}: {
  readonly questions: ReadonlyArray<{ readonly question: string; readonly answer: string }>;
}) {
  const data = generateFAQJsonLd(questions);

  return <JsonLd data={data} />;
}

/**
 * Composant pour injecter les données structurées d'un fil d'Ariane
 */
export function BreadcrumbJsonLd({
  items,
}: {
  readonly items: ReadonlyArray<{ readonly name: string; readonly url: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
