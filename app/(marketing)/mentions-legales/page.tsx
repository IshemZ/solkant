import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales – Solkant",
  description:
    "Mentions légales de Solkant, logiciel de devis pour instituts de beauté. Informations sur l'éditeur, l'hébergement et les conditions d'utilisation.",
  openGraph: {
    title: "Mentions légales – Solkant",
    description:
      "Informations légales sur Solkant, éditeur et hébergement du service.",
    url: "https://solkant.com/mentions-legales",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "https://solkant.com/mentions-legales",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Mentions légales – Solkant",
            description:
              "Mentions légales de Solkant, logiciel de devis pour instituts de beauté.",
            url: "https://solkant.com/mentions-legales",
            publisher: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
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
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
          Mentions légales
        </h1>

        <div className="prose prose-lg max-w-none">
          {/* Section 1 : Éditeur du site */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Éditeur du site
            </h2>
            <div className="text-foreground/80 space-y-2">
              <p>
                <strong>Raison sociale :</strong> Solkant
              </p>
              <p>
                <strong>Forme juridique :</strong> [À compléter : SARL, SAS,
                auto-entrepreneur, etc.]
              </p>
              <p>
                <strong>Adresse du siège social :</strong> [À compléter :
                adresse complète]
              </p>
              <p>
                <strong>SIRET :</strong> [À compléter : numéro SIRET]
              </p>
              <p>
                <strong>Capital social :</strong> [À compléter si applicable]
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@solkant.com"
                  className="text-foreground underline hover:text-foreground/80"
                >
                  contact@solkant.com
                </a>
              </p>
              <p>
                <strong>Directeur de la publication :</strong> [À compléter :
                nom du responsable légal]
              </p>
            </div>
          </section>

          {/* Section 2 : Hébergement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Hébergement du site
            </h2>
            <div className="text-foreground/80 space-y-2">
              <p>
                Le site <strong>solkant.com</strong> est hébergé par :
              </p>
              <p>
                <strong>Vercel Inc.</strong>
              </p>
              <p>440 N Barranca Ave #4133</p>
              <p>Covina, CA 91723, États-Unis</p>
              <p>
                Site web :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline hover:text-foreground/80"
                >
                  https://vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 3 : Propriété intellectuelle */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Propriété intellectuelle
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                L&apos;ensemble de ce site (structure, textes, graphismes,
                logos, icônes, images, sons, vidéos, logiciels, etc.) relève de
                la législation française et internationale sur le droit
                d&apos;auteur et la propriété intellectuelle.
              </p>
              <p>
                Tous les droits de reproduction sont réservés, y compris pour
                les documents téléchargeables et les représentations
                iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support
                électronique ou autre quel qu&apos;il soit est formellement
                interdite sauf autorisation expresse de l&apos;éditeur,
                conformément à l&apos;article L 122-4 du Code de la Propriété
                Intellectuelle.
              </p>
              <p>
                Le nom de marque <strong>Solkant</strong> ainsi que les logos et
                éléments graphiques présents sur le site sont des marques
                déposées et ne peuvent être utilisés sans l&apos;autorisation
                préalable et écrite de Solkant.
              </p>
            </div>
          </section>

          {/* Section 4 : Protection des données personnelles */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Protection des données personnelles (RGPD)
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Conformément au Règlement Général sur la Protection des Données
                (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978
                modifiée, vous disposez d&apos;un droit d&apos;accès, de
                rectification, de suppression et de portabilité de vos données
                personnelles.
              </p>
              <p>
                Les données collectées par Solkant sont utilisées uniquement
                dans le cadre de la fourniture du service (création de devis,
                gestion de clients, etc.) et ne sont en aucun cas transmises à
                des tiers à des fins commerciales.
              </p>
              <p>
                Les données sont hébergées sur des serveurs sécurisés en Europe
                et protégées par chiffrement.
              </p>
              <p>
                Pour exercer vos droits ou pour toute question relative à vos
                données personnelles, vous pouvez nous contacter à
                l&apos;adresse :{" "}
                <a
                  href="mailto:contact@solkant.com"
                  className="text-foreground underline hover:text-foreground/80"
                >
                  contact@solkant.com
                </a>
              </p>
              <p>
                Pour plus d&apos;informations, consultez notre{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-foreground underline hover:text-foreground/80"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 5 : Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Cookies
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Le site <strong>solkant.com</strong> utilise des cookies pour
                améliorer votre expérience de navigation et analyser
                l&apos;utilisation du site.
              </p>
              <p>
                <strong>Cookies essentiels :</strong> nécessaires au
                fonctionnement du site (authentification, session utilisateur).
              </p>
              <p>
                <strong>Cookies analytiques :</strong> Google Analytics pour
                mesurer l&apos;audience et améliorer le service.
              </p>
              <p>
                Vous pouvez à tout moment désactiver les cookies depuis les
                paramètres de votre navigateur. Toutefois, cela peut affecter
                certaines fonctionnalités du site.
              </p>
            </div>
          </section>

          {/* Section 6 : Responsabilité */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Limitation de responsabilité
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Solkant s&apos;efforce d&apos;assurer l&apos;exactitude et la
                mise à jour des informations diffusées sur ce site. Toutefois,
                Solkant ne peut garantir l&apos;exactitude, la complétude,
                l&apos;actualité des informations diffusées.
              </p>
              <p>
                En conséquence, l&apos;utilisateur reconnaît utiliser ces
                informations sous sa responsabilité exclusive.
              </p>
              <p>
                Solkant ne pourra être tenu responsable des dommages directs ou
                indirects résultant de l&apos;accès au site ou de
                l&apos;utilisation du site, y compris l&apos;inaccessibilité,
                les pertes de données, détériorations, destructions ou virus qui
                pourraient affecter l&apos;équipement informatique de
                l&apos;utilisateur.
              </p>
            </div>
          </section>

          {/* Section 7 : Liens hypertextes */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Liens hypertextes
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Le site <strong>solkant.com</strong> peut contenir des liens
                hypertextes vers d&apos;autres sites. Solkant n&apos;exerce
                aucun contrôle sur ces sites et décline toute responsabilité
                quant à leur contenu.
              </p>
              <p>
                La mise en place de liens hypertextes vers le site{" "}
                <strong>solkant.com</strong> nécessite une autorisation
                préalable écrite de Solkant.
              </p>
            </div>
          </section>

          {/* Section 8 : Droit applicable */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Droit applicable et juridiction
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Les présentes mentions légales sont régies par le droit
                français.
              </p>
              <p>
                En cas de litige et à défaut d&apos;accord amiable, le différend
                sera porté devant les tribunaux français compétents.
              </p>
            </div>
          </section>

          {/* Section 9 : Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Contact
            </h2>
            <div className="text-foreground/80 space-y-4">
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez
                nous contacter :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Par email :{" "}
                  <a
                    href="mailto:contact@solkant.com"
                    className="text-foreground underline hover:text-foreground/80"
                  >
                    contact@solkant.com
                  </a>
                </li>
                <li>
                  Via notre{" "}
                  <Link
                    href="/contact"
                    className="text-foreground underline hover:text-foreground/80"
                  >
                    formulaire de contact
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="pt-8 border-t border-foreground/10">
            <p className="text-sm text-muted-foreground">
              <strong>Dernière mise à jour :</strong> 6 décembre 2024
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 mt-16">
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
              <Link
                href="/mentions-legales"
                className="text-sm text-foreground hover:text-foreground"
              >
                Mentions légales
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
