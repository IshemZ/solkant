import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politique de confidentialité – Solkant",
  description:
    "Politique de confidentialité et protection des données personnelles de Solkant. Conformité RGPD, utilisation des cookies, droits des utilisateurs.",
  openGraph: {
    title: "Politique de confidentialité – Solkant",
    description:
      "Découvrez comment Solkant protège vos données personnelles et respecte le RGPD.",
    url: "https://solkant.fr/politique-confidentialite",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Politique de confidentialité",
            description:
              "Politique de confidentialité et protection des données personnelles de Solkant",
            url: "https://solkant.fr/politique-confidentialite",
            inLanguage: "fr-FR",
            isPartOf: {
              "@type": "WebSite",
              name: "Solkant",
              url: "https://solkant.fr",
            },
            about: {
              "@type": "Thing",
              name: "Protection des données personnelles",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              {
                label: "Politique de confidentialité",
                href: "/politique-confidentialite",
              },
            ]}
          />

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Politique de confidentialité
            </h1>
            <p className="mb-8 text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <div className="prose prose-purple max-w-none">
              {/* 1. Introduction */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  1. Introduction
                </h2>
                <p className="mb-4 text-gray-700">
                  Solkant accorde une grande importance à la protection de vos
                  données personnelles. Cette politique de confidentialité
                  explique comment nous collectons, utilisons, stockons et
                  protégeons vos informations conformément au Règlement Général
                  sur la Protection des Données (RGPD) et à la loi Informatique
                  et Libertés.
                </p>
                <p className="text-gray-700">
                  En utilisant notre plateforme, vous acceptez les pratiques
                  décrites dans cette politique. Si vous avez des questions,
                  contactez-nous via notre{" "}
                  <Link
                    href="/contact"
                    className="text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    page de contact
                  </Link>
                  .
                </p>
              </section>

              {/* 2. Responsable du traitement */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  2. Responsable du traitement des données
                </h2>
                <p className="mb-4 text-gray-700">
                  Le responsable du traitement de vos données personnelles est :
                </p>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">
                    [NOM DE LA SOCIÉTÉ]
                  </p>
                  <p className="text-gray-700">SIRET : [À COMPLÉTER]</p>
                  <p className="text-gray-700">
                    Adresse : [À COMPLÉTER] - [CODE POSTAL] [VILLE], France
                  </p>
                  <p className="text-gray-700">
                    Email :{" "}
                    <a
                      href="mailto:contact@solkant.fr"
                      className="text-purple-600 hover:underline"
                    >
                      contact@solkant.fr
                    </a>
                  </p>
                </div>
              </section>

              {/* 3. Données collectées */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  3. Données personnelles collectées
                </h2>
                <p className="mb-4 text-gray-700">
                  Nous collectons les données suivantes dans le cadre de
                  l&apos;utilisation de Solkant :
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.1. Données d&apos;inscription
                </h3>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (crypté)</li>
                  <li>
                    Informations professionnelles (nom de l&apos;institut, type
                    d&apos;activité)
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.2. Données liées à l&apos;utilisation de la plateforme
                </h3>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    Informations sur vos clients (nom, email, téléphone) que
                    vous ajoutez volontairement
                  </li>
                  <li>
                    Données des devis créés (services, tarifs, dates, statuts)
                  </li>
                  <li>
                    Catalogue de prestations (noms de services, descriptions,
                    prix)
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.3. Données techniques et de navigation
                </h3>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et version</li>
                  <li>Pages visitées et temps passé sur le site</li>
                  <li>Données de cookies (voir section dédiée ci-dessous)</li>
                </ul>
              </section>

              {/* 4. Finalités du traitement */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  4. Finalités du traitement
                </h2>
                <p className="mb-4 text-gray-700">
                  Nous utilisons vos données personnelles uniquement pour les
                  finalités suivantes :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Gestion de votre compte utilisateur :</strong>{" "}
                    création, authentification, récupération de mot de passe
                  </li>
                  <li>
                    <strong>Fourniture du service Solkant :</strong> création et
                    gestion de devis, catalogue de prestations, génération de
                    PDF
                  </li>
                  <li>
                    <strong>Communication :</strong> envoi d&apos;emails
                    transactionnels (confirmation d&apos;inscription,
                    notifications importantes)
                  </li>
                  <li>
                    <strong>Amélioration de la plateforme :</strong> analyses
                    statistiques anonymisées pour optimiser l&apos;expérience
                    utilisateur
                  </li>
                  <li>
                    <strong>Respect des obligations légales :</strong>{" "}
                    facturation, comptabilité, conformité fiscale
                  </li>
                </ul>
              </section>

              {/* 5. Base légale */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  5. Base légale du traitement
                </h2>
                <p className="mb-4 text-gray-700">
                  Les traitements de vos données personnelles reposent sur les
                  bases légales suivantes :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Exécution du contrat :</strong> pour vous fournir
                    les services Solkant que vous avez souscrits
                  </li>
                  <li>
                    <strong>Consentement :</strong> pour l&apos;envoi de
                    newsletters marketing (vous pouvez vous désabonner à tout
                    moment)
                  </li>
                  <li>
                    <strong>Obligation légale :</strong> pour respecter nos
                    obligations comptables et fiscales
                  </li>
                  <li>
                    <strong>Intérêt légitime :</strong> pour améliorer nos
                    services et assurer la sécurité de la plateforme
                  </li>
                </ul>
              </section>

              {/* 6. Destinataires des données */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  6. Destinataires de vos données
                </h2>
                <p className="mb-4 text-gray-700">
                  Vos données personnelles sont accessibles uniquement aux
                  personnes suivantes :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>L&apos;équipe Solkant :</strong> personnel
                    strictement habilité pour la gestion technique et le support
                    utilisateur
                  </li>
                  <li>
                    <strong>Hébergeur :</strong> Vercel Inc. (États-Unis,
                    certification Privacy Shield et clauses contractuelles types
                    UE)
                  </li>
                  <li>
                    <strong>Base de données :</strong> Supabase (conformité
                    RGPD, serveurs UE)
                  </li>
                  <li>
                    <strong>Outils d&apos;analyse :</strong> Google Analytics
                    (données anonymisées, option de refus disponible)
                  </li>
                  <li>
                    <strong>Processeur de paiement :</strong> Stripe (pour les
                    abonnements payants, conformité PCI-DSS)
                  </li>
                </ul>
                <p className="text-gray-700">
                  Nous ne vendons jamais vos données personnelles à des tiers.
                </p>
              </section>

              {/* 7. Durée de conservation */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  7. Durée de conservation des données
                </h2>
                <p className="mb-4 text-gray-700">
                  Vos données sont conservées pendant les durées suivantes :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Compte actif :</strong> tant que votre compte reste
                    actif
                  </li>
                  <li>
                    <strong>Après suppression de compte :</strong> 30 jours
                    (délai de rétractation), puis suppression définitive
                  </li>
                  <li>
                    <strong>Données de facturation :</strong> 10 ans (obligation
                    légale comptable)
                  </li>
                  <li>
                    <strong>Cookies de navigation :</strong> 13 mois maximum
                  </li>
                </ul>
              </section>

              {/* 8. Sécurité */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  8. Sécurité de vos données
                </h2>
                <p className="mb-4 text-gray-700">
                  Nous mettons en œuvre des mesures techniques et
                  organisationnelles pour protéger vos données personnelles
                  contre tout accès non autorisé, perte ou divulgation :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Chiffrement :</strong> connexions HTTPS (TLS 1.3),
                    mots de passe cryptés avec bcrypt
                  </li>
                  <li>
                    <strong>Isolation des données :</strong> chaque institut a
                    son propre espace cloisonné (multi-tenancy sécurisé)
                  </li>
                  <li>
                    <strong>Sauvegardes automatiques :</strong> sauvegardes
                    quotidiennes de la base de données
                  </li>
                  <li>
                    <strong>Accès restreint :</strong> authentification à deux
                    facteurs pour l&apos;équipe technique
                  </li>
                  <li>
                    <strong>Surveillance :</strong> monitoring des accès et
                    détection d&apos;anomalies
                  </li>
                </ul>
              </section>

              {/* 9. Vos droits RGPD */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  9. Vos droits sur vos données personnelles
                </h2>
                <p className="mb-4 text-gray-700">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-3 text-gray-700">
                  <li>
                    <strong>Droit d&apos;accès :</strong> obtenir une copie de
                    toutes vos données personnelles
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> corriger des
                    données inexactes ou incomplètes
                  </li>
                  <li>
                    <strong>
                      Droit à l&apos;effacement (« droit à l&apos;oubli ») :
                    </strong>{" "}
                    demander la suppression de vos données
                  </li>
                  <li>
                    <strong>Droit à la limitation du traitement :</strong>{" "}
                    suspendre temporairement l&apos;utilisation de vos données
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> recevoir vos
                    données dans un format structuré et lisible par machine
                  </li>
                  <li>
                    <strong>Droit d&apos;opposition :</strong> refuser certains
                    traitements (notamment marketing)
                  </li>
                  <li>
                    <strong>Droit de retirer votre consentement :</strong> à
                    tout moment, sans affecter la licéité des traitements passés
                  </li>
                </ul>
                <p className="mt-4 text-gray-700">
                  Pour exercer vos droits, contactez-nous à{" "}
                  <a
                    href="mailto:contact@solkant.fr"
                    className="text-purple-600 hover:underline"
                  >
                    contact@solkant.fr
                  </a>{" "}
                  avec une preuve d&apos;identité. Nous vous répondrons sous 30
                  jours maximum.
                </p>
                <p className="mt-4 text-gray-700">
                  Vous avez également le droit de déposer une réclamation auprès
                  de la CNIL (Commission Nationale de l&apos;Informatique et des
                  Libertés) :{" "}
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    www.cnil.fr
                  </a>
                </p>
              </section>

              {/* 10. Cookies */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  10. Politique de cookies
                </h2>
                <p className="mb-4 text-gray-700">
                  Solkant utilise des cookies pour améliorer votre expérience de
                  navigation et analyser l&apos;utilisation du site.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  10.1. Types de cookies utilisés
                </h3>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Cookies strictement nécessaires :</strong> requis
                    pour le fonctionnement du site (session, authentification).
                    Pas besoin de consentement.
                  </li>
                  <li>
                    <strong>Cookies de performance :</strong> Google Analytics
                    pour analyser le trafic (anonymisé). Avec consentement.
                  </li>
                  <li>
                    <strong>Cookies fonctionnels :</strong> mémorisation de vos
                    préférences (langue, affichage). Avec consentement.
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  10.2. Gestion des cookies
                </h3>
                <p className="mb-4 text-gray-700">
                  Vous pouvez gérer vos préférences de cookies dans les
                  paramètres de votre navigateur :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Google Chrome :</strong> Paramètres →
                    Confidentialité et sécurité → Cookies
                  </li>
                  <li>
                    <strong>Firefox :</strong> Préférences → Vie privée et
                    sécurité → Cookies
                  </li>
                  <li>
                    <strong>Safari :</strong> Préférences → Confidentialité →
                    Cookies
                  </li>
                </ul>
                <p className="text-gray-700">
                  Notez que le refus de certains cookies peut limiter certaines
                  fonctionnalités du site.
                </p>
              </section>

              {/* 11. Transferts internationaux */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  11. Transferts de données hors UE
                </h2>
                <p className="mb-4 text-gray-700">
                  Certains de nos prestataires (Vercel, Google) sont situés hors
                  de l&apos;Union européenne. Dans ce cas, nous garantissons que
                  vos données sont protégées par :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>
                      Clauses contractuelles types de la Commission européenne
                    </strong>
                  </li>
                  <li>
                    <strong>Décisions d&apos;adéquation</strong> (pays reconnus
                    comme ayant un niveau de protection équivalent)
                  </li>
                  <li>
                    <strong>Certifications conformes au RGPD</strong> (ex :
                    Privacy Shield pour les entreprises américaines ayant
                    renouvelé leurs garanties)
                  </li>
                </ul>
              </section>

              {/* 12. Modifications */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  12. Modifications de cette politique
                </h2>
                <p className="mb-4 text-gray-700">
                  Nous pouvons mettre à jour cette politique de confidentialité
                  pour refléter des changements dans nos pratiques ou pour des
                  raisons légales. La date de dernière mise à jour est indiquée
                  en haut de cette page.
                </p>
                <p className="text-gray-700">
                  En cas de modification substantielle, nous vous en informerons
                  par email ou via une notification sur la plateforme.
                </p>
              </section>

              {/* 13. Contact */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  13. Nous contacter
                </h2>
                <p className="mb-4 text-gray-700">
                  Pour toute question concernant cette politique de
                  confidentialité ou vos données personnelles :
                </p>
                <div className="rounded-lg bg-purple-50 p-6">
                  <p className="mb-2 font-semibold text-gray-900">
                    Email :{" "}
                    <a
                      href="mailto:contact@solkant.fr"
                      className="text-purple-600 hover:underline"
                    >
                      contact@solkant.fr
                    </a>
                  </p>
                  <p className="mb-2 text-gray-700">
                    Ou utilisez notre{" "}
                    <Link
                      href="/contact"
                      className="text-purple-600 hover:underline"
                    >
                      formulaire de contact
                    </Link>
                  </p>
                  <p className="text-gray-700">
                    Consulter nos{" "}
                    <Link
                      href="/mentions-legales"
                      className="text-purple-600 hover:underline"
                    >
                      mentions légales
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
