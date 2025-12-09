import Link from "next/link";
import type { Metadata } from "next";
import { RelatedArticles } from "@/app/(marketing)/blog/_components/RelatedArticles";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title:
    "Pourquoi digitaliser la gestion de votre institut de beauté en 2025 ?",
  description:
    "Découvrez comment la transformation digitale peut révolutionner votre institut de beauté : gain de temps, image professionnelle, organisation optimisée. Guide complet 2025.",
  openGraph: {
    title: "Digitaliser votre institut de beauté : le guide complet 2025",
    description:
      "Les 7 raisons essentielles de passer au numérique et comment réussir votre transformation digitale.",
    url: "https://solkant.com/blog/digitaliser-gestion-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2024-12-06T14:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/article-digitalisation.png",
        width: 1200,
        height: 630,
        alt: "Digitaliser la gestion de votre institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pourquoi digitaliser votre institut de beauté en 2025",
    description:
      "7 raisons essentielles de passer au numérique. Guide complet.",
    images: ["https://solkant.com/images/og/article-digitalisation.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/digitaliser-gestion-institut-beaute",
  },
};

export default function Article3Page() {
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

      {/* Schema.org JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Pourquoi digitaliser la gestion de votre institut de beauté en 2025 ?",
            description:
              "Découvrez comment la transformation digitale peut révolutionner votre institut de beauté : gain de temps, image professionnelle, organisation optimisée.",
            image: "https://solkant.com/images/og/article-digitalisation.png",
            datePublished: "2024-12-06T14:00:00Z",
            dateModified: "2024-12-06T14:00:00Z",
            author: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Solkant",
              url: "https://solkant.com",
              logo: {
                "@type": "ImageObject",
                url: "https://solkant.com/images/og/home.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://solkant.com/blog/digitaliser-gestion-institut-beaute",
            },
          }),
        }}
      />

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-foreground mb-8"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour au blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4">
            <span className="font-medium text-foreground">
              Transformation digitale
            </span>
            <span>•</span>
            <time dateTime="2024-12-06">6 décembre 2024</time>
            <span>•</span>
            <span>9 min de lecture</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Pourquoi digitaliser la gestion de votre institut de beauté en 2025
            ?
          </h1>

          <p className="text-xl text-foreground/60 leading-relaxed">
            La transformation digitale n&apos;est plus réservée aux grandes
            entreprises. Découvrez comment les outils numériques peuvent
            révolutionner votre quotidien, valoriser votre image et booster
            votre chiffre d&apos;affaires.
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed mb-6">
            Entre les cahiers de rendez-vous griffonnés, les fichiers Excel
            éparpillés, et les devis manuscrits qui traînent, gérer un institut
            de beauté peut vite devenir un casse-tête administratif. En 2025, il
            existe des solutions simples pour digitaliser votre activité sans
            devenir une experte en informatique. Voici pourquoi c&apos;est le
            moment idéal pour franchir le pas.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            1. Gagnez un temps précieux sur l&apos;administratif
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le constat :</strong> Vous passez en moyenne 8 à 10 heures
            par semaine sur des tâches administratives (création de devis, mise
            à jour des fiches clientes, recherche d&apos;informations dans vos
            dossiers).
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>La solution digitale :</strong> Un logiciel de gestion comme
            Solkant vous permet de diviser ce temps par 3. Créez un devis en 2
            minutes au lieu de 15, retrouvez une fiche cliente en 3 clics au
            lieu de fouiller dans des classeurs, générez des rapports
            automatiquement.
          </p>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              💡 Exemple concret
            </h4>
            <p className="text-foreground/70">
              Sophie, gérante d&apos;un institut à Bordeaux, a économisé 6
              heures par semaine en passant au digital. Elle utilise ce temps
              pour : faire de la prospection, créer du contenu sur les réseaux
              sociaux, ou simplement souffler. Résultat : +15% de chiffre
              d&apos;affaires en 6 mois.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            2. Renforcez votre image professionnelle
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Vos clientes jugent votre professionnalisme dès le premier contact.
            Un devis envoyé par email en PDF élégant fait bien plus
            professionnel qu&apos;un document manuscrit ou un fichier Word mal
            formaté.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Les bénéfices concrets :</strong>
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Crédibilité renforcée :</strong> Les nouveaux clients vous
              font plus facilement confiance
            </li>
            <li>
              <strong>Cohérence visuelle :</strong> Tous vos documents ont la
              même charte graphique
            </li>
            <li>
              <strong>Réactivité perçue :</strong> Répondre rapidement avec des
              outils digitaux montre que vous êtes organisée
            </li>
            <li>
              <strong>Image moderne :</strong> Vous vous démarquez des instituts
              qui fonctionnent &quot;à l&apos;ancienne&quot;
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            3. Centralisez toutes vos informations en un seul endroit
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Le problème classique :</strong> Les coordonnées de Mme
            Dupont sont dans votre téléphone, son historique de prestations dans
            un cahier, et ses devis sur votre ordinateur dans 3 dossiers
            différents.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>La solution :</strong> Un système centralisé où chaque
            cliente a une fiche unique contenant :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Ses coordonnées complètes (email, téléphone, adresse)</li>
            <li>L&apos;historique complet de toutes ses prestations</li>
            <li>Tous les devis envoyés avec leurs statuts</li>
            <li>Ses préférences et éventuelles allergies</li>
            <li>Des notes personnelles pour la personnalisation</li>
          </ul>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Résultat : vous retrouvez n&apos;importe quelle information en
            quelques secondes, même 2 ans après. Fini les &quot;Attendez, je
            cherche dans mes dossiers...&quot;
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            4. Réduisez drastiquement les risques d&apos;erreur
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Les erreurs manuelles coûtent cher : une erreur de calcul dans un
            devis, un double rendez-vous noté, un numéro de téléphone mal
            copié...
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="rounded-lg bg-red-50 p-6 border border-red-100">
              <h4 className="font-semibold text-foreground mb-3">
                ❌ Gestion manuelle
              </h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Calculs de TVA erronés</li>
                <li>• Numéros de devis en doublon</li>
                <li>• Informations perdues ou illisibles</li>
                <li>• Oublis de relances clients</li>
                <li>• Données éparpillées et incohérentes</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50 p-6 border border-green-100">
              <h4 className="font-semibold text-foreground mb-3">
                ✅ Gestion digitale
              </h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Calculs automatiques et exacts</li>
                <li>• Numérotation séquentielle automatique</li>
                <li>• Données structurées et sécurisées</li>
                <li>• Alertes et rappels automatiques</li>
                <li>• Base de données unique et cohérente</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            5. Accédez à vos données depuis n&apos;importe où
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Avec un outil en ligne (cloud), vous pouvez consulter vos
            informations depuis :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Votre ordinateur à l&apos;institut</strong> pour créer vos
              devis dans un environnement confortable
            </li>
            <li>
              <strong>Votre smartphone</strong> pour vérifier une info cliente
              entre deux rendez-vous
            </li>
            <li>
              <strong>Votre tablette au salon</strong> pour montrer un devis
              directement à une cliente
            </li>
            <li>
              <strong>Chez vous le soir</strong> pour gérer les demandes de
              devis reçues en fin de journée
            </li>
          </ul>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Plus besoin d&apos;emporter des classeurs ou de se connecter depuis
            un ordinateur spécifique. Votre institut vous suit partout.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            6. Analysez votre activité pour prendre de meilleures décisions
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Le digital vous donne accès à des données précieuses pour piloter
            votre activité :
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Statistiques sur vos devis
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Combien de devis envoyés ce mois-ci ?</li>
            <li>
              Quel est votre taux de conversion (devis acceptés / envoyés) ?
            </li>
            <li>Quelles prestations se vendent le mieux ?</li>
            <li>Quel est votre panier moyen ?</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Analyse de vos clientes
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              Qui sont vos meilleures clientes (chiffre d&apos;affaires) ?
            </li>
            <li>
              Lesquelles n&apos;ont pas pris rendez-vous depuis 6 mois (relance)
              ?
            </li>
            <li>Quelle est la fréquence moyenne de visite ?</li>
          </ul>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Ces insights vous permettent d&apos;ajuster votre offre, vos tarifs,
            et votre communication de manière éclairée.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            7. Respectez facilement les obligations légales (RGPD, TVA, etc.)
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            La réglementation impose des obligations strictes (mentions légales
            sur les devis, conservation des données clients, respect du
            RGPD...).
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Un outil digital sérieux intègre automatiquement ces contraintes :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Mentions obligatoires sur les devis</strong> (SIRET, TVA,
              validité) déjà pré-remplies
            </li>
            <li>
              <strong>Hébergement sécurisé des données</strong> en Europe
              (conformité RGPD)
            </li>
            <li>
              <strong>Chiffrement des mots de passe</strong> et accès sécurisés
            </li>
            <li>
              <strong>Possibilité d&apos;export ou suppression</strong> des
              données pour respecter les droits des clientes
            </li>
            <li>
              <strong>Archivage automatique</strong> des documents pour les
              contrôles fiscaux
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Comment réussir sa transformation digitale ? (Les étapes clés)
          </h2>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Étape 1 : Identifiez vos besoins prioritaires
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Ne digitalisez pas tout d&apos;un coup. Commencez par ce qui vous
            fait le plus perdre de temps : la création de devis, la gestion de
            la clientèle, ou les rendez-vous ?
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Étape 2 : Choisissez un outil simple et adapté
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Privilégiez une solution :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Intuitive</strong> : vous devez pouvoir l&apos;utiliser
              sans formation de 3 jours
            </li>
            <li>
              <strong>Spécialisée</strong> : pensée pour les instituts de
              beauté, pas un outil générique
            </li>
            <li>
              <strong>Abordable</strong> : tarification transparente adaptée aux
              petites structures
            </li>
            <li>
              <strong>Sans engagement</strong> : possibilité de tester avant de
              vous engager sur un an
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Étape 3 : Migrez progressivement vos données
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Pas besoin de tout importer le premier jour. Commencez par :
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Créer votre catalogue de prestations (une fois pour toutes)</li>
            <li>
              Ajouter vos 10-20 clientes les plus fidèles pour tester le système
            </li>
            <li>Créer vos premiers devis sur l&apos;outil</li>
            <li>
              Progressivement, ajouter le reste de votre base au fur et à mesure
              des demandes
            </li>
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Étape 4 : Formez-vous (ou formez votre équipe)
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Consacrez 1-2 heures à bien prendre en main l&apos;outil. La plupart
            des logiciels modernes proposent :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Des tutoriels vidéo courts et pédagogiques</li>
            <li>Une documentation claire en français</li>
            <li>Un support technique réactif en cas de blocage</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Étape 5 : Évaluez les résultats après 1 mois
          </h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Au bout d&apos;un mois, faites le bilan :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>Combien d&apos;heures avez-vous économisées ?</li>
            <li>Votre taux de conversion de devis a-t-il augmenté ?</li>
            <li>Êtes-vous plus organisée au quotidien ?</li>
            <li>Vos clientes ont-elles remarqué la différence ?</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Les idées reçues sur la digitalisation (et pourquoi elles sont
            fausses)
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">
                ❌ &quot;C&apos;est compliqué, je ne suis pas douée en
                informatique&quot;
              </h4>
              <p className="text-foreground/70">
                Les outils modernes sont conçus pour être ultra-intuitifs. Si
                vous savez envoyer un email et utiliser WhatsApp, vous saurez
                utiliser un logiciel comme{" "}
                <Link href="/" className="text-purple-600 hover:underline">
                  Solkant
                </Link>
                .
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">
                ❌ &quot;C&apos;est trop cher pour mon petit institut&quot;
              </h4>
              <p className="text-foreground/70">
                Les solutions SaaS démarrent souvent à moins de 20€/mois.
                Sachant que vous économisez 5-10 heures par mois, le retour sur
                investissement est immédiat. C&apos;est moins cher qu&apos;un
                abonnement téléphone professionnel.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">
                ❌ &quot;Mes données ne seront pas en sécurité&quot;
              </h4>
              <p className="text-foreground/70">
                Au contraire : un serveur professionnel avec sauvegardes
                quotidiennes est bien plus sécurisé que votre ordinateur qui
                peut tomber en panne, être volé, ou crasher. Les données sont
                chiffrées et hébergées en Europe (conformité RGPD).
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">
                ❌ &quot;Mes clientes préfèrent le contact humain au
                digital&quot;
              </h4>
              <p className="text-foreground/70">
                Le digital ne remplace pas le contact humain, il le facilite !
                Vous passez moins de temps sur l&apos;administratif et plus de
                temps avec vos clientes. Elles apprécient recevoir un devis
                rapidement par email plutôt que d&apos;attendre 3 jours.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            En conclusion : le digital est un accélérateur, pas un remplaçant
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Digitaliser votre institut ne signifie pas perdre votre touche
            personnelle ou devenir une &quot;machine&quot;. Au contraire, en
            automatisant les tâches répétitives et chronophages, vous libérez du
            temps pour :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Mieux accueillir vos clientes</strong> et personnaliser
              votre service
            </li>
            <li>
              <strong>Développer de nouvelles prestations</strong> pour enrichir
              votre offre
            </li>
            <li>
              <strong>Communiquer davantage</strong> sur les réseaux sociaux ou
              par email
            </li>
            <li>
              <strong>Former votre équipe</strong> et améliorer vos compétences
            </li>
            <li>
              <strong>Prendre soin de vous</strong> et éviter le burn-out
              administratif
            </li>
          </ul>

          <div className="rounded-lg bg-purple-50 p-8 border border-purple-100 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">
              🚀 Prête à franchir le pas ?
            </h3>
            <p className="text-foreground/70 mb-6">
              La transformation digitale de votre institut de beauté commence
              par un premier petit pas. Commencez simple : la gestion des devis.
              Une fois que vous aurez goûté à la simplicité et au gain de temps,
              vous ne reviendrez jamais en arrière.
            </p>
            <Link
              href="/fonctionnalites"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              Découvrir comment Solkant peut vous aider
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-foreground/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Testez Solkant gratuitement et digitalisez votre institut en 2
            minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">
            Sans engagement, sans carte bancaire. Créez votre compte et
            découvrez comment gagner 10 heures par mois sur votre gestion
            administrative.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-foreground px-6 py-3 font-semibold text-background hover:bg-foreground/90"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-foreground/20 px-6 py-3 font-semibold text-foreground hover:bg-foreground/5"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </article>

      {/* Articles connexes */}
      <RelatedArticles
        articles={blogArticles}
        currentSlug="digitaliser-gestion-institut-beaute"
      />

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
