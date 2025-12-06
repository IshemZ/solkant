import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente (CGV) – Solkant",
  description:
    "Conditions générales de vente de Solkant : abonnements, paiements, résiliation, garanties. Transparence et conformité légale pour nos utilisateurs.",
  openGraph: {
    title: "Conditions Générales de Vente – Solkant",
    description:
      "Consultez nos conditions de vente : abonnements, tarifs, résiliation, garanties.",
    url: "https://solkant.fr/conditions-generales-vente",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "website",
  },
};

export default function CGVPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Conditions Générales de Vente",
            description:
              "Conditions générales de vente de Solkant, logiciel de devis pour instituts de beauté",
            url: "https://solkant.fr/conditions-generales-vente",
            inLanguage: "fr-FR",
            isPartOf: {
              "@type": "WebSite",
              name: "Solkant",
              url: "https://solkant.fr",
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
                label: "Conditions Générales de Vente",
                href: "/conditions-generales-vente",
              },
            ]}
          />

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Conditions Générales de Vente (CGV)
            </h1>
            <p className="mb-8 text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <div className="prose prose-purple max-w-none">
              {/* 1. Préambule */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  1. Préambule
                </h2>
                <p className="mb-4 text-gray-700">
                  Les présentes Conditions Générales de Vente (ci-après « CGV »)
                  régissent l&apos;ensemble des relations contractuelles entre :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>[NOM DE LA SOCIÉTÉ]</strong>, société [FORME
                    JURIDIQUE], au capital de [MONTANT]€, immatriculée au RCS de
                    [VILLE] sous le numéro [NUMÉRO], dont le siège social est
                    situé [ADRESSE COMPLÈTE], représentée par [NOM DU
                    REPRÉSENTANT], en qualité de [FONCTION] (ci-après « Solkant
                    » ou « le Prestataire »)
                  </li>
                  <li>
                    Et toute personne physique ou morale souhaitant souscrire à
                    un abonnement au service Solkant (ci-après « le Client » ou
                    « l&apos;Utilisateur »)
                  </li>
                </ul>
                <p className="text-gray-700">
                  Toute souscription à un abonnement Solkant implique
                  l&apos;acceptation sans réserve des présentes CGV.
                </p>
              </section>

              {/* 2. Objet */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  2. Objet du service
                </h2>
                <p className="mb-4 text-gray-700">
                  Solkant est un logiciel en ligne (SaaS) permettant aux
                  professionnels de la beauté et du bien-être de :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>Créer et gérer des devis professionnels en PDF</li>
                  <li>Gérer une base de données clients</li>
                  <li>Créer et maintenir un catalogue de prestations</li>
                  <li>
                    Suivre l&apos;historique des devis (statuts, dates,
                    montants)
                  </li>
                  <li>
                    Générer des documents conformes aux obligations légales
                    françaises
                  </li>
                </ul>
                <p className="text-gray-700">
                  Le service est accessible en ligne via un navigateur web ou
                  une application mobile, sous réserve de disposer d&apos;une
                  connexion Internet.
                </p>
              </section>

              {/* 3. Souscription et création de compte */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  3. Souscription et création de compte
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.1. Inscription
                </h3>
                <p className="mb-4 text-gray-700">
                  Pour souscrire à Solkant, le Client doit :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>Être majeur et capable juridiquement</li>
                  <li>
                    Fournir des informations exactes et à jour (nom, prénom,
                    email, raison sociale si applicable)
                  </li>
                  <li>Créer un mot de passe sécurisé</li>
                  <li>
                    Accepter les présentes CGV et la Politique de
                    confidentialité
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.2. Activation du compte
                </h3>
                <p className="mb-4 text-gray-700">
                  Le compte est activé immédiatement après validation de
                  l&apos;email. Le Client peut alors accéder à son espace
                  personnel et commencer à utiliser les fonctionnalités de
                  Solkant.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  3.3. Identifiants
                </h3>
                <p className="text-gray-700">
                  Le Client est seul responsable de la confidentialité de ses
                  identifiants (email et mot de passe). Toute utilisation du
                  service avec ses identifiants est présumée émaner de lui.
                </p>
              </section>

              {/* 4. Offres et tarifs */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  4. Offres et tarifs
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  4.1. Formules disponibles
                </h3>
                <p className="mb-4 text-gray-700">
                  Solkant propose plusieurs formules d&apos;abonnement
                  détaillées sur la{" "}
                  <Link
                    href="/pricing"
                    className="text-purple-600 hover:underline"
                  >
                    page Tarifs
                  </Link>
                  :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Formule Gratuite</strong> : accès limité aux
                    fonctionnalités de base
                  </li>
                  <li>
                    <strong>Formule Premium</strong> : accès complet à toutes
                    les fonctionnalités, facturation mensuelle ou annuelle
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  4.2. Prix et TVA
                </h3>
                <p className="mb-4 text-gray-700">
                  Les prix sont indiqués en euros (€) toutes taxes comprises
                  (TTC), TVA française à 20% incluse. Les tarifs en vigueur sont
                  ceux affichés sur le site au moment de la souscription.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  4.3. Modification des tarifs
                </h3>
                <p className="text-gray-700">
                  Solkant se réserve le droit de modifier ses tarifs à tout
                  moment. Les Clients en cours d&apos;abonnement seront informés
                  par email au moins 30 jours avant l&apos;entrée en vigueur des
                  nouveaux tarifs. En cas d&apos;augmentation, le Client pourra
                  résilier son abonnement avant l&apos;application du nouveau
                  tarif.
                </p>
              </section>

              {/* 5. Paiement */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  5. Modalités de paiement
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  5.1. Moyens de paiement acceptés
                </h3>
                <p className="mb-4 text-gray-700">
                  Les paiements sont effectués par carte bancaire (Visa,
                  Mastercard, American Express) via notre prestataire de
                  paiement sécurisé Stripe, certifié PCI-DSS niveau 1.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  5.2. Échéances
                </h3>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    <strong>Abonnement mensuel :</strong> prélèvement
                    automatique le même jour chaque mois
                  </li>
                  <li>
                    <strong>Abonnement annuel :</strong> paiement en une fois à
                    la souscription, puis renouvellement annuel automatique
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  5.3. Factures
                </h3>
                <p className="mb-4 text-gray-700">
                  Une facture conforme est automatiquement générée et envoyée
                  par email après chaque paiement. Elle est également accessible
                  dans l&apos;espace client.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  5.4. Échec de paiement
                </h3>
                <p className="text-gray-700">
                  En cas d&apos;échec du prélèvement (carte expirée, provision
                  insuffisante), le Client dispose de 7 jours pour régulariser
                  sa situation. Passé ce délai, l&apos;accès au service pourra
                  être suspendu jusqu&apos;à régularisation.
                </p>
              </section>

              {/* 6. Durée et renouvellement */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  6. Durée et renouvellement
                </h2>
                <p className="mb-4 text-gray-700">
                  Les abonnements sont souscrits pour une durée déterminée
                  (mensuelle ou annuelle) et se renouvellent automatiquement par
                  tacite reconduction, sauf résiliation à l&apos;initiative du
                  Client.
                </p>
                <p className="text-gray-700">
                  Le Client est informé par email au moins 7 jours avant la date
                  de renouvellement et le montant du prochain prélèvement.
                </p>
              </section>

              {/* 7. Résiliation */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  7. Résiliation de l&apos;abonnement
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  7.1. Résiliation par le Client
                </h3>
                <p className="mb-4 text-gray-700">
                  Le Client peut résilier son abonnement à tout moment depuis
                  son espace personnel (section « Paramètres » → « Abonnement »
                  → « Résilier »). La résiliation prend effet à la fin de la
                  période en cours déjà payée. Aucun remboursement n&apos;est
                  effectué pour la période restante.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  7.2. Résiliation par Solkant
                </h3>
                <p className="mb-4 text-gray-700">
                  Solkant se réserve le droit de résilier un abonnement en cas
                  de :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    Manquement grave aux présentes CGV (utilisation frauduleuse,
                    violation de propriété intellectuelle, etc.)
                  </li>
                  <li>Impayés récurrents</li>
                  <li>
                    Comportement abusif ou nuisible envers l&apos;équipe support
                  </li>
                </ul>
                <p className="text-gray-700">
                  Dans ce cas, le Client sera notifié par email avec un préavis
                  de 15 jours, sauf en cas de violation grave nécessitant une
                  suspension immédiate.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  7.3. Conséquences de la résiliation
                </h3>
                <p className="text-gray-700">
                  Après résiliation, le Client conserve l&apos;accès au service
                  jusqu&apos;à la fin de la période payée. Passé ce délai,
                  l&apos;accès est désactivé. Les données sont conservées 30
                  jours supplémentaires puis supprimées définitivement, sauf
                  demande contraire ou obligation légale de conservation.
                </p>
              </section>

              {/* 8. Droit de rétractation */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  8. Droit de rétractation (14 jours)
                </h2>
                <p className="mb-4 text-gray-700">
                  Conformément aux articles L221-18 et suivants du Code de la
                  consommation, le Client consommateur dispose d&apos;un délai
                  de 14 jours à compter de la souscription pour exercer son
                  droit de rétractation, sans avoir à justifier de motifs ni à
                  payer de pénalités.
                </p>
                <p className="mb-4 text-gray-700">
                  Pour exercer ce droit, le Client doit notifier sa décision par
                  email à{" "}
                  <a
                    href="mailto:contact@solkant.fr"
                    className="text-purple-600 hover:underline"
                  >
                    contact@solkant.fr
                  </a>{" "}
                  ou via le{" "}
                  <Link
                    href="/contact"
                    className="text-purple-600 hover:underline"
                  >
                    formulaire de contact
                  </Link>
                  .
                </p>
                <p className="text-gray-700">
                  <strong>Exception :</strong> Si le Client a commencé à
                  utiliser le service avant la fin du délai de 14 jours, il
                  renonce expressément à son droit de rétractation conformément
                  à l&apos;article L221-28 du Code de la consommation.
                </p>
              </section>

              {/* 9. Disponibilité et maintenance */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  9. Disponibilité du service et maintenance
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  9.1. Engagement de disponibilité
                </h3>
                <p className="mb-4 text-gray-700">
                  Solkant s&apos;engage à fournir un service accessible 24h/24
                  et 7j/7, avec un objectif de disponibilité de 99,5% sur
                  l&apos;année. Cependant, aucune garantie absolue ne peut être
                  donnée en raison de la nature d&apos;Internet et des
                  infrastructures tierces.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  9.2. Maintenance programmée
                </h3>
                <p className="mb-4 text-gray-700">
                  Des maintenances programmées peuvent occasionner des
                  interruptions temporaires. Solkant s&apos;efforce de les
                  planifier en dehors des heures ouvrées et d&apos;en informer
                  les Clients au moins 48h à l&apos;avance.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  9.3. Interruptions non planifiées
                </h3>
                <p className="text-gray-700">
                  En cas d&apos;incident technique majeur, Solkant s&apos;engage
                  à tout mettre en œuvre pour rétablir le service dans les
                  meilleurs délais et à communiquer sur l&apos;avancement via
                  email et/ou les réseaux sociaux.
                </p>
              </section>

              {/* 10. Garanties et responsabilités */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  10. Garanties et limitation de responsabilité
                </h2>
                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  10.1. Garanties
                </h3>
                <p className="mb-4 text-gray-700">
                  Solkant garantit que le service fonctionne conformément à sa
                  description et qu&apos;il s&apos;efforce de corriger les bugs
                  signalés dans des délais raisonnables.
                </p>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  10.2. Limitation de responsabilité
                </h3>
                <p className="mb-4 text-gray-700">
                  La responsabilité de Solkant ne peut être engagée que pour les
                  dommages directs et prévisibles. Sont exclus :
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    Les dommages indirects (perte de chiffre d&apos;affaires,
                    manque à gagner, perte de données suite à une erreur du
                    Client, etc.)
                  </li>
                  <li>
                    Les conséquences d&apos;un usage non conforme du service
                  </li>
                  <li>
                    Les interruptions dues à des cas de force majeure (panne
                    généralisée d&apos;Internet, catastrophe naturelle, etc.)
                  </li>
                </ul>

                <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                  10.3. Plafond de responsabilité
                </h3>
                <p className="text-gray-700">
                  En toute hypothèse, la responsabilité totale de Solkant ne
                  pourra excéder le montant des sommes payées par le Client au
                  cours des 12 derniers mois.
                </p>
              </section>

              {/* 11. Protection des données */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  11. Protection des données personnelles
                </h2>
                <p className="mb-4 text-gray-700">
                  Le traitement des données personnelles du Client est régi par
                  notre{" "}
                  <Link
                    href="/politique-confidentialite"
                    className="text-purple-600 hover:underline"
                  >
                    Politique de confidentialité
                  </Link>
                  , conforme au RGPD.
                </p>
                <p className="text-gray-700">
                  Le Client conserve la propriété exclusive des données
                  qu&apos;il saisit dans Solkant (informations clients, devis,
                  services). Solkant s&apos;engage à ne jamais les vendre, louer
                  ou exploiter commercialement.
                </p>
              </section>

              {/* 12. Propriété intellectuelle */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  12. Propriété intellectuelle
                </h2>
                <p className="mb-4 text-gray-700">
                  L&apos;ensemble du site, du logiciel, des logos, designs,
                  textes, images et codes sources sont la propriété exclusive de
                  Solkant et sont protégés par le droit d&apos;auteur et le
                  droit des marques.
                </p>
                <p className="text-gray-700">
                  Toute reproduction, représentation, modification, publication,
                  adaptation de tout ou partie du service, par quelque procédé
                  que ce soit, est interdite sans autorisation écrite préalable
                  de Solkant.
                </p>
              </section>

              {/* 13. Force majeure */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  13. Force majeure
                </h2>
                <p className="text-gray-700">
                  Solkant ne pourra être tenu responsable de tout retard ou
                  inexécution résultant d&apos;un cas de force majeure au sens
                  de la jurisprudence française (guerre, grève généralisée,
                  catastrophe naturelle, panne d&apos;infrastructure Internet
                  majeure, etc.).
                </p>
              </section>

              {/* 14. Modifications des CGV */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  14. Modifications des CGV
                </h2>
                <p className="mb-4 text-gray-700">
                  Solkant se réserve le droit de modifier les présentes CGV à
                  tout moment. Les Clients seront informés par email des
                  modifications substantielles au moins 30 jours avant leur
                  entrée en vigueur.
                </p>
                <p className="text-gray-700">
                  La poursuite de l&apos;utilisation du service après
                  l&apos;entrée en vigueur des nouvelles CGV vaut acceptation de
                  celles-ci.
                </p>
              </section>

              {/* 15. Droit applicable et litiges */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  15. Droit applicable et règlement des litiges
                </h2>
                <p className="mb-4 text-gray-700">
                  Les présentes CGV sont régies par le droit français.
                </p>
                <p className="mb-4 text-gray-700">
                  En cas de litige, les parties s&apos;engagent à rechercher une
                  solution amiable avant toute action judiciaire. À défaut
                  d&apos;accord, le litige sera porté devant les tribunaux
                  compétents du ressort du siège social de Solkant, sauf
                  dispositions impératives contraires du Code de la
                  consommation.
                </p>
                <p className="text-gray-700">
                  <strong>Médiation de la consommation :</strong> Conformément à
                  l&apos;article L612-1 du Code de la consommation, le Client
                  consommateur a le droit de recourir gratuitement à un
                  médiateur de la consommation en vue de la résolution amiable
                  du litige. Coordonnées du médiateur : [À COMPLÉTER selon le
                  médiateur choisi].
                </p>
              </section>

              {/* 16. Contact */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  16. Nous contacter
                </h2>
                <p className="mb-4 text-gray-700">
                  Pour toute question concernant les présentes CGV :
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
                    Formulaire :{" "}
                    <Link
                      href="/contact"
                      className="text-purple-600 hover:underline"
                    >
                      Page de contact
                    </Link>
                  </p>
                  <p className="text-gray-700">
                    Liens utiles :{" "}
                    <Link
                      href="/mentions-legales"
                      className="text-purple-600 hover:underline"
                    >
                      Mentions légales
                    </Link>{" "}
                    •{" "}
                    <Link
                      href="/politique-confidentialite"
                      className="text-purple-600 hover:underline"
                    >
                      Politique de confidentialité
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
