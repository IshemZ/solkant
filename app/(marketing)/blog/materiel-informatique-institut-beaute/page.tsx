import Link from "next/link";
import type { Metadata } from "next";
import { RelatedArticles } from "@/app/(marketing)/blog/_components/RelatedArticles";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title:
    "Matériel informatique pour institut de beauté : Guide complet 2025",
  description:
    "Ordinateur, tablette, logiciel de gestion : découvrez tout le matériel informatique essentiel pour digitaliser votre institut de beauté. Guide complet avec budget détaillé.",
  openGraph: {
    title: "Matériel informatique pour institut de beauté : Guide complet 2025",
    description:
      "Ordinateur, tablette, logiciel de gestion : tout le matériel essentiel pour digitaliser votre institut. Guide avec budget détaillé.",
    url: "https://solkant.com/blog/materiel-informatique-institut-beaute",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-01-28T09:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/blog.png",
        width: 1200,
        height: 630,
        alt: "Matériel informatique pour institut de beauté",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matériel informatique pour institut de beauté : Guide 2025",
    description:
      "Guide complet avec budget détaillé pour équiper votre institut.",
    images: ["https://solkant.com/images/og/blog.png"],
  },
  alternates: {
    canonical: "https://solkant.com/blog/materiel-informatique-institut-beaute",
  },
};

export default function MaterielInformatiqueArticle() {
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
                  className="text-sm font-medium text-foreground hover:text-foreground"
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

      {/* Schema.org JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Matériel informatique pour institut de beauté : Guide complet 2025",
            description:
              "Ordinateur, tablette, logiciel de gestion : découvrez tout le matériel informatique essentiel pour digitaliser votre institut de beauté. Guide complet avec budget détaillé.",
            image: "https://solkant.com/images/og/blog.png",
            datePublished: "2025-01-28T09:00:00Z",
            dateModified: "2025-01-28T09:00:00Z",
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
                "https://solkant.com/blog/materiel-informatique-institut-beaute",
            },
          }),
        }}
      />

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8"
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="font-medium text-foreground">Guides</span>
            <span>•</span>
            <time dateTime="2025-01-28">28 janvier 2025</time>
            <span>•</span>
            <span>14 min de lecture</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Matériel informatique pour institut de beauté : Guide complet 2025
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            De l&apos;ordinateur au logiciel de gestion, découvrez tout le
            matériel informatique indispensable pour digitaliser votre institut
            de beauté. Budget détaillé, comparatifs et conseils d&apos;experts.
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <p className="text-foreground/80 leading-relaxed mb-6">
            Marie vient d&apos;ouvrir son institut de beauté. Entre les cahiers
            de rendez-vous griffonnés, les devis manuscrits et les calculs à la
            calculatrice, elle passe près de 10 heures par semaine sur des
            tâches administratives. Son rêve d&apos;esthéticienne se transforme
            progressivement en cauchemar bureaucratique.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Et si la technologie pouvait lui faire gagner ces 10 heures ? Pas
            besoin d&apos;être une experte en informatique. De quel{" "}
            <strong>matériel informatique</strong> avez-vous VRAIMENT besoin
            pour gérer efficacement votre institut de beauté sans exploser votre
            budget ?
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Dans ce guide complet, vous découvrirez :
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-8">
            <li>
              La liste exhaustive du matériel essentiel (hardware + software)
            </li>
            <li>
              Le budget détaillé pour chaque équipement (de 300€ à 2500€ selon
              vos besoins)
            </li>
            <li>
              Des recommandations concrètes par profil
              (débutant/confirmé/premium)
            </li>
            <li>Une checklist actionnable pour démarrer en 7 jours</li>
            <li>Un comparatif objectif des solutions logicielles</li>
          </ul>

          <p className="text-foreground/80 leading-relaxed mb-12">
            Que vous ouvriez votre premier salon ou que vous souhaitiez
            moderniser votre institut existant, ce guide vous aidera à faire les
            bons choix d&apos;investissement.
          </p>

          {/* Section 1 */}
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">
            Pourquoi s&apos;équiper en matériel informatique en 2025 ?
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Avant de parler budget et équipement, prenons un instant pour
            comprendre pourquoi la digitalisation de votre institut
            n&apos;est plus une option, mais une nécessité en 2025.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
            Les 3 défis du &quot;tout papier&quot;
          </h3>

          <div className="rounded-lg bg-red-50 p-6 mb-6 border border-red-100">
            <h4 className="font-semibold text-foreground mb-3">
              ❌ Problème 1 : Erreurs de calcul coûteuses
            </h4>
            <p className="text-foreground/70 mb-3">
              Une erreur de TVA sur un devis de 800€ ? Vous perdez 30€. Une
              prestation oubliée dans un devis ? Vous travaillez gratuitement.
              Les calculs manuels sont sources d&apos;erreurs qui vous coûtent
              cher.
            </p>

            <h4 className="font-semibold text-foreground mb-3">
              ❌ Problème 2 : Perte de temps massive
            </h4>
            <p className="text-foreground/70 mb-3">
              Créer un devis manuscrit : 15 minutes. Le recopier proprement : 5
              minutes. Chercher une fiche cliente dans vos classeurs : 3
              minutes. Calculer votre CA mensuel à la main : 1 heure. Total : 8
              à 10 heures par semaine perdues.
            </p>

            <h4 className="font-semibold text-foreground mb-3">
              ❌ Problème 3 : Image peu professionnelle
            </h4>
            <p className="text-foreground/70">
              Vos clientes comparent. Un devis manuscrit face à un PDF élégant
              envoyé par email ? Le choix est vite fait. L&apos;image
              professionnelle passe aussi par vos documents.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
            Les bénéfices concrets du matériel informatique
          </h3>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-3">
              ✅ Gain de temps chiffré : 6 à 10 heures par semaine
            </h4>
            <p className="text-foreground/70 mb-3">
              Avec un ordinateur et un bon logiciel de gestion comme Solkant,
              créez un devis en 2 minutes au lieu de 15. Retrouvez une fiche
              cliente en 3 clics au lieu de fouiller 5 minutes dans vos
              classeurs. Générez vos rapports mensuels automatiquement.
            </p>

            <h4 className="font-semibold text-foreground mb-3">
              ✅ Augmentation du chiffre d&apos;affaires : +15 à 25%
            </h4>
            <p className="text-foreground/70 mb-3">
              Temps gagné = temps pour prospecter, développer de nouvelles
              prestations, améliorer votre présence sur les réseaux sociaux.
              L&apos;organisation digitale libère du temps pour faire grandir
              votre institut.
            </p>

            <h4 className="font-semibold text-foreground mb-3">
              ✅ Meilleure expérience client
            </h4>
            <p className="text-foreground/70">
              Vos clientes reçoivent leur devis par email immédiatement, avec un
              PDF professionnel à leur nom. Elles peuvent payer par carte sans
              chercher un distributeur. L&apos;expérience moderne qu&apos;elles
              attendent en 2025.
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-6 mb-12 border border-purple-100">
            <h4 className="font-semibold text-foreground mb-2">
              💡 Témoignage - Sophie, gérante à Lyon
            </h4>
            <p className="text-foreground/70 italic">
              &quot;Avant de m&apos;équiper, je passais mes soirées à faire mes
              devis sur Excel. J&apos;ai investi 800€ dans un ordinateur et
              19€/mois pour Solkant. Résultat : j&apos;économise 8 heures par
              semaine que j&apos;utilise pour développer mon Instagram. Mon CA a
              augmenté de 15% en 6 mois. Le meilleur investissement de ma
              carrière !&quot;
            </p>
          </div>

          {/* Section 2 - Les 4 piliers */}
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">
            Les 4 piliers du matériel informatique physique pour votre institut
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-8">
            Le matériel informatique se divise en deux grandes catégories :{" "}
            <strong>le hardware</strong> (matériel physique) et{" "}
            <strong>le software</strong> (logiciels). Commençons par le hardware
            avec 4 équipements essentiels, puis nous aborderons le software (qui
            est le plus stratégique).
          </p>

          <p className="text-foreground/80 leading-relaxed mb-12">
            Bonne nouvelle : les investissements hardware sont{" "}
            <strong>ponctuels</strong> (vous achetez une fois pour 4-5 ans),
            tandis que le software fonctionne sur un{" "}
            <strong>abonnement mensuel</strong> modique.
          </p>

          {/* Pilier 1 - Ordinateur */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pilier 1 : L&apos;ordinateur - Le cerveau de votre institut
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-6">
            C&apos;est l&apos;équipement de base, indispensable. Mais pas besoin
            de dépenser 2000€ dans un MacBook Pro pour gérer un institut de
            beauté ! Voyons ce dont vous avez réellement besoin.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Ordinateur fixe vs portable
          </h4>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h5 className="font-semibold text-foreground mb-3">
                💻 Ordinateur fixe (PC de bureau)
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>✅ Prix : 400-600€</li>
                <li>✅ Plus puissant à budget égal</li>
                <li>✅ Écran plus grand (confort visuel)</li>
                <li>✅ Idéal pour un bureau fixe à l&apos;institut</li>
                <li>❌ Pas de mobilité</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h5 className="font-semibold text-foreground mb-3">
                💼 Ordinateur portable
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>✅ Prix : 600-900€</li>
                <li>✅ Travail possible à domicile</li>
                <li>✅ Mobilité totale</li>
                <li>✅ Parfait si vous gérez depuis chez vous</li>
                <li>❌ Plus cher que le fixe</li>
              </ul>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Configuration minimale recommandée en 2025
          </h4>

          <div className="rounded-lg bg-blue-50 p-6 mb-6 border border-blue-100">
            <ul className="space-y-3 text-foreground/80">
              <li>
                <strong>Processeur :</strong> Intel i3/i5 ou AMD Ryzen 3/5
                (largement suffisant pour un logiciel de gestion)
              </li>
              <li>
                <strong>Mémoire RAM :</strong> 8 Go minimum (4 Go = trop lent en
                2025)
              </li>
              <li>
                <strong>Stockage :</strong> 256 Go SSD (rapide) - Évitez les HDD
                (disques durs classiques, trop lents)
              </li>
              <li>
                <strong>Système d&apos;exploitation :</strong> Windows 11 ou
                macOS récent (évitez les vieux Windows 7/8)
              </li>
              <li>
                <strong>Écran :</strong> 14-15 pouces minimum pour le confort
                visuel
              </li>
            </ul>
          </div>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Budget détaillé selon vos besoins
          </h4>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Type
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Gamme
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Meilleur pour
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    PC fixe entrée de gamme
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    HP/Dell/Lenovo
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    400-600€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Institut fixe, budget serré
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    PC portable milieu de gamme
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Asus/Lenovo/HP
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    600-900€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Flexibilité, travail maison
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    MacBook Air M2
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Apple
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    1200€+
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Image premium, écosystème Apple
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ Recommandation Solkant
            </h4>
            <p className="text-foreground/70">
              Un ordinateur à 600-700€ est largement suffisant pour utiliser
              Solkant et gérer votre institut. Pas besoin de surpayer pour un
              matériel surdimensionné. Privilégiez un bon compromis
              prix/performances avec 8 Go de RAM et un SSD.
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-6 mb-12 border border-yellow-100">
            <h4 className="font-semibold text-foreground mb-2">
              ⚠️ À éviter absolument
            </h4>
            <p className="text-foreground/70">
              Les Chromebook (ordinateurs Chrome OS) pour un usage professionnel
              - compatibilité limitée avec certains logiciels et fonctionnalités
              réduites pour la gestion d&apos;entreprise.
            </p>
          </div>

          {/* Pilier 2 - Tablette */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pilier 2 : La tablette - Votre mobilité au salon
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Est-elle obligatoire ?</strong> Non, mais elle peut être
            très pratique pour certains usages spécifiques.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Cas d&apos;usage pertinents pour une tablette
          </h4>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>
              <strong>Montrer un devis à la cliente</strong> directement dans la
              cabine de soin (évite l&apos;aller-retour au bureau)
            </li>
            <li>
              <strong>Faire signer un devis sur place</strong> avec signature
              tactile (pratique et moderne)
            </li>
            <li>
              <strong>Consulter une fiche cliente</strong> entre deux
              rendez-vous sans retourner au bureau
            </li>
            <li>
              <strong>Prendre des photos avant/après</strong> si votre logiciel
              le permet (suivi client)
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Quelle tablette choisir ?
          </h4>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Modèle
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Avantages
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    iPad (9ème génération)
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    400-500€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Fluide, intuitive, écosystème Apple, excellent pour la
                    signature tactile
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Samsung Galaxy Tab A8/S6
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    250-400€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Bon rapport qualité/prix, Android, compatible avec la
                    plupart des apps professionnelles
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Amazon Fire HD
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    100-150€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Entrée de gamme, limité aux apps Amazon, moins recommandé
                    pour un usage pro
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 mb-12 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-2">
              💡 Conseil budget
            </h4>
            <p className="text-foreground/70">
              La tablette est <strong>optionnelle</strong> si votre budget est
              serré. Commencez avec votre ordinateur (qui lui est indispensable)
              et votre smartphone personnel. Vous pourrez acheter une tablette
              dans un 2ème temps, une fois que votre activité décolle (après 6
              à 12 mois). Investissement : 250-500€.
            </p>
          </div>

          {/* Pilier 3 - Imprimante */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pilier 3 : L&apos;imprimante - Pour vos devis et documents
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-6">
            <strong>Est-elle encore nécessaire en 2025 ?</strong> La réponse
            n&apos;est pas si simple. Cela dépend de votre mode de travail et de
            votre clientèle.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Les deux approches possibles
          </h4>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-lg bg-green-50 p-6 border border-green-100">
              <h5 className="font-semibold text-foreground mb-3">
                ✅ Approche 100% digitale (recommandée)
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>✅ Envoyer tous les devis par email en PDF</li>
                <li>✅ Signature électronique (gain de temps, zéro papier)</li>
                <li>✅ Archivage automatique dans le cloud</li>
                <li>✅ Économie : pas d&apos;imprimante, pas d&apos;encre</li>
                <li>✅ Écologique et moderne</li>
                <li>
                  ⚠️ Nécessite que vos clientes aient un email (généralement le
                  cas)
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h5 className="font-semibold text-foreground mb-3">
                📄 Approche hybride (si clientèle âgée)
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>⚠️ Certaines clientes préfèrent le papier</li>
                <li>⚠️ Impression occasionnelle de devis</li>
                <li>⚠️ Documents administratifs (attestations, CGV)</li>
                <li>❌ Coût récurrent : encre/toner, papier</li>
                <li>❌ Maintenance : pannes, bourrage papier</li>
              </ul>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Si vous avez besoin d&apos;une imprimante
          </h4>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Type recommandé :</strong> Imprimante laser noir et blanc.
            Les imprimantes jet d&apos;encre sont un{" "}
            <strong>gouffre financier</strong> (cartouches hors de prix).
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Type
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Modèle type
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix achat
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Coût par page
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Jet d&apos;encre
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    HP/Epson
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    50-100€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    0,15-0,25€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-red-600 font-semibold">
                    ❌ À éviter (cartouches chères)
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-foreground/20 px-4 py-3">
                    Laser N&B
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Brother/HP LaserJet
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    150-250€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    0,02-0,04€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-green-600 font-semibold">
                    ✅ Usage régulier économique
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Laser couleur
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Brother/Samsung
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    300-450€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    0,08-0,12€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ⚠️ Si besoin occasionnel couleur
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-yellow-50 p-6 mb-6 border border-yellow-100">
            <h4 className="font-semibold text-foreground mb-2">
              💰 Calcul du coût réel sur 3 ans
            </h4>
            <p className="text-foreground/70 mb-3">
              <strong>Jet d&apos;encre :</strong> 100€ achat + 600€ cartouches
              (50€ × 12) = <strong className="text-red-600">700€ total</strong>
            </p>
            <p className="text-foreground/70">
              <strong>Laser :</strong> 200€ achat + 120€ toner (40€ × 3) ={" "}
              <strong className="text-green-600">320€ total</strong>
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ Recommandation Solkant
            </h4>
            <p className="text-foreground/70">
              Avec Solkant, vous pouvez envoyer tous vos devis par email en PDF
              professionnel. 90% de nos utilisatrices n&apos;ont plus besoin
              d&apos;imprimante et ont fait le choix du 100% digital. Économie :
              200-400€ + le coût récurrent de l&apos;encre/papier.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 mb-12 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-2">
              💡 Astuce alternative
            </h4>
            <p className="text-foreground/70">
              Si vous imprimez moins de 10 pages par mois, utilisez une
              imprimerie en ligne (Printoclock, Corep) à 0,10€ la page plutôt
              que d&apos;acheter une imprimante. Plus économique et zéro
              maintenance !
            </p>
          </div>

          {/* Pilier 4 - TPE */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Pilier 4 : Le terminal de paiement (TPE) - Encaisser par carte
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-6">
            En 2025, le terminal de paiement électronique (TPE) est devenu{" "}
            <strong>indispensable</strong> pour tout commerce, y compris les
            instituts de beauté.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Pourquoi c&apos;est devenu incontournable
          </h4>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-8">
            <li>
              <strong>70% des paiements en France</strong> se font par carte
              bancaire en 2025
            </li>
            <li>
              <strong>Obligation légale</strong> au-delà de 1000€ de chiffre
              d&apos;affaires (loi anti-fraude)
            </li>
            <li>
              <strong>Image professionnelle</strong> : vos clientes s&apos;y
              attendent
            </li>
            <li>
              <strong>Évite les impayés</strong> : pas de chèques sans
              provision, paiement immédiat
            </li>
            <li>
              <strong>Paiement sans contact</strong> : rapide et hygiénique
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
            Les 3 options principales pour votre TPE
          </h4>

          <div className="space-y-6 mb-8">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h5 className="font-semibold text-foreground mb-3">
                1. TPE traditionnel de votre banque
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70 mb-3">
                <li>💰 Location : 20-40€/mois + commission 1-2%</li>
                <li>⚠️ Engagement 36-48 mois souvent requis</li>
                <li>✅ Fiable, installé par la banque</li>
                <li>❌ Coûteux sur le long terme</li>
              </ul>
              <p className="text-sm text-foreground/70">
                <strong>Coût 3 ans :</strong> 720-1440€ (location) + commissions
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-6 border border-green-100">
              <h5 className="font-semibold text-foreground mb-3">
                2. TPE nouvelle génération (SumUp, Zettle) ✅ Recommandé
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70 mb-3">
                <li>💰 Achat unique : 29-59€ (sans abonnement !)</li>
                <li>💳 Commission par transaction : 1,75-2,75%</li>
                <li>✅ Sans engagement, plug & play</li>
                <li>✅ Application mobile intuitive</li>
                <li>✅ Paiement sans contact intégré</li>
              </ul>
              <p className="text-sm text-green-700 font-semibold">
                <strong>Coût 3 ans :</strong> 29-59€ (achat) + commissions ={" "}
                <strong>~400€ total*</strong> (50 transactions/mois à 30€)
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h5 className="font-semibold text-foreground mb-3">
                3. Paiement par smartphone (Stripe Terminal, Square)
              </h5>
              <ul className="space-y-2 text-sm text-foreground/70 mb-3">
                <li>💰 Lecteur de carte : 50-100€</li>
                <li>💳 Commission : 1,4-2,9%</li>
                <li>✅ Moderne, compact</li>
                <li>⚠️ Nécessite smartphone professionnel</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Solution
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Coût initial
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Coût mensuel
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Total 3 ans
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    TPE banque
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">0€</td>
                  <td className="border border-foreground/20 px-4 py-3">
                    30€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    1080€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Oui (36 mois)
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    SumUp
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    39€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    0€ + commission
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold text-green-600">
                    ~400€*
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-green-600">
                    Non
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Stripe
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    59€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    0€ + commission
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    ~450€*
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Non
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-muted-foreground mt-2">
              *Base de calcul : 50 transactions/mois à 30€ de panier moyen
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ Recommandation
            </h4>
            <p className="text-foreground/70">
              Pour un petit institut de beauté, <strong>SumUp</strong> ou{" "}
              <strong>Zettle</strong> sont parfaits : pas d&apos;engagement,
              investissement minimal (29-59€), commission transparente, aucun
              abonnement mensuel. Rentabilisé dès la première semaine
              d&apos;utilisation.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 mb-12 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-2">
              🔗 Intégration avec Solkant
            </h4>
            <p className="text-foreground/70">
              Solkant vous permet d&apos;enregistrer tous vos paiements
              (espèces, carte, virement) et génère automatiquement vos rapports
              de chiffre d&apos;affaires. Compatible avec tous les terminaux de
              paiement du marché.
            </p>
          </div>

          {/* Transition vers Pilier 5 */}
          <div className="rounded-lg bg-purple-50 p-8 my-12 border border-purple-100">
            <h4 className="text-xl font-bold text-foreground mb-4">
              🎯 Récapitulatif des 4 piliers matériels
            </h4>
            <ul className="space-y-2 text-foreground/80">
              <li>
                <strong>✅ Ordinateur :</strong> 400-900€ (indispensable)
              </li>
              <li>
                <strong>⚠️ Tablette :</strong> 250-500€ (optionnelle, achat
                différé possible)
              </li>
              <li>
                <strong>⚠️ Imprimante :</strong> 0-250€ (optionnelle avec
                Solkant en 100% digital)
              </li>
              <li>
                <strong>✅ TPE :</strong> 29-59€ (indispensable pour encaisser
                par carte)
              </li>
            </ul>
            <p className="text-foreground/70 mt-4 pt-4 border-t border-purple-200">
              <strong>Investissement matériel total :</strong> 500€ à 1700€
              selon votre configuration (ponctuel, dure 4-5 ans)
            </p>
            <p className="text-lg font-semibold text-purple-700 mt-4">
              👉 Maintenant, passons au pilier le PLUS IMPORTANT : le logiciel
              de gestion. C&apos;est lui qui va véritablement transformer votre
              quotidien et vous faire gagner 10h par semaine.
            </p>
          </div>

          {/* Section 3 - Le Pilier 5 (LOGICIEL) */}
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">
            Le 5ème pilier (le plus stratégique) : Le logiciel de gestion
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Vous pouvez avoir le meilleur ordinateur du monde, mais sans le bon
            logiciel de gestion, vous perdrez autant de temps qu&apos;avec vos
            cahiers et votre calculatrice. Le logiciel est le{" "}
            <strong>véritable cerveau</strong> de votre institut : c&apos;est
            lui qui automatise vos devis, centralise vos données clientes,
            calcule votre TVA, et vous fait gagner 6 à 10 heures par semaine.
          </p>

          <div className="rounded-lg bg-yellow-50 p-6 mb-8 border border-yellow-100">
            <p className="text-foreground/80 font-semibold">
              💡 <strong>La réalité :</strong> 90% de la valeur de votre
              investissement informatique vient du logiciel, pas du matériel. Un
              ordinateur à 500€ avec un excellent logiciel sera 10 fois plus
              efficace qu&apos;un MacBook à 2000€ avec Excel.
            </p>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-12">
            Alors, quel logiciel choisir pour votre institut de beauté ?
          </p>

          <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">
            Les différents types de logiciels pour instituts
          </h3>

          <div className="space-y-6 mb-12">
            <div className="rounded-lg bg-red-50 p-6 border border-red-100">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                ❌ 1. Les tableurs (Excel, Google Sheets)
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Avantages :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>✅ Gratuit ou inclus (Office 365)</li>
                    <li>✅ Flexible, personnalisable</li>
                    <li>✅ Vous connaissez déjà</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Inconvénients majeurs :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>❌ Tout faire manuellement (calculs, mise en page)</li>
                    <li>❌ Risque d&apos;erreurs très élevé</li>
                    <li>❌ Pas d&apos;automatisation</li>
                    <li>❌ Fichiers éparpillés partout</li>
                    <li>❌ Temps perdu : 8-10h/semaine</li>
                  </ul>
                </div>
              </div>
              <p className="font-semibold text-red-700">
                <strong>Verdict :</strong> Acceptable uniquement les 2-3
                premiers mois d&apos;activité. Au-delà, c&apos;est un frein
                majeur à votre développement.
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-6 border border-orange-100">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                ⚠️ 2. Les logiciels généralistes (Facture.net, Henrri, etc.)
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Avantages :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>✅ Prix abordable (10-25€/mois)</li>
                    <li>✅ Interface simple</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Inconvénients :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>❌ Pas pensé pour les instituts de beauté</li>
                    <li>❌ Pas de catalogue de prestations beauté</li>
                    <li>❌ Interface générique, pas adaptée</li>
                    <li>❌ Fonctionnalités manquantes pour votre métier</li>
                  </ul>
                </div>
              </div>
              <p className="font-semibold text-orange-700">
                <strong>Verdict :</strong> Dépannage possible mais pas optimal.
                Vous devrez adapter votre métier au logiciel au lieu du
                contraire.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                ⚠️ 3. Les logiciels tout-en-un &quot;usine à gaz&quot;
                (Planity, Reservio, etc.)
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Avantages :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>✅ Beaucoup de fonctionnalités</li>
                    <li>✅ Gestion RDV, caisse, stock, compta, SMS...</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Inconvénients :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>❌ Trop complexe pour un petit institut</li>
                    <li>❌ Formation de plusieurs jours nécessaire</li>
                    <li>❌ Prix élevé : 40-80€/mois minimum</li>
                    <li>❌ Fonctionnalités que vous n&apos;utilisez pas</li>
                    <li>❌ Engagement long (12-24 mois)</li>
                  </ul>
                </div>
              </div>
              <p className="font-semibold text-gray-700">
                <strong>Verdict :</strong> Surdimensionné sauf si vous avez 3+
                salariés et plusieurs salons. Trop cher et trop complexe pour un
                petit institut.
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-6 border-2 border-green-300">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                ✅ 4. Les logiciels spécialisés devis + clients pour instituts
                (Solkant)
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Avantages :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>✅ Pensé 100% pour les instituts de beauté</li>
                    <li>✅ Simple ET complet</li>
                    <li>✅ Prix juste : 19€/mois</li>
                    <li>✅ Sans engagement</li>
                    <li>✅ Opérationnel en 30 minutes</li>
                    <li>✅ Support en français</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground/80 mb-2">
                    Fonctionnalités clés :
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>✅ Devis en 2 minutes</li>
                    <li>✅ Gestion clients centralisée</li>
                    <li>✅ Catalogue de prestations</li>
                    <li>✅ Envoi email automatique</li>
                    <li>✅ Conformité RGPD native</li>
                  </ul>
                </div>
              </div>
              <p className="font-semibold text-green-700 text-lg">
                <strong>Verdict :</strong> Le sweet spot pour 95% des instituts
                de beauté. Le meilleur rapport simplicité/fonctionnalités/prix.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-foreground mt-16 mb-6">
            Les 7 critères essentiels pour choisir votre logiciel
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Avant de vous décider, posez-vous ces 7 questions cruciales :
          </p>

          <div className="space-y-4 mb-12">
            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                1. Est-il pensé pour mon métier (institut de beauté) ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Catalogue de prestations beauté pré-rempli</li>
                <li>
                  • Vocabulaire adapté (prestations, clientes, devis, etc.)
                </li>
                <li>• Templates de devis pour institut</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                2. Est-il vraiment simple à utiliser ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Créer un devis en moins de 3 minutes</li>
                <li>• Pas de formation de 2 jours nécessaire</li>
                <li>
                  • Interface intuitive (si c&apos;est compliqué, vous ne
                  l&apos;utiliserez pas)
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                3. Combien de temps vais-je vraiment économiser ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Calculs automatiques (TVA, totaux, remises)</li>
                <li>• Numérotation automatique des devis</li>
                <li>• Templates réutilisables</li>
                <li>• Recherche client instantanée</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                4. Quel est le prix total réel ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Abonnement mensuel transparent</li>
                <li>
                  • Y a-t-il des frais cachés ? (SMS, stockage, utilisateurs
                  supplémentaires)
                </li>
                <li>• Y a-t-il un engagement (12-24 mois) ?</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                5. Puis-je l&apos;utiliser partout ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Accès web (ordinateur)</li>
                <li>• Application mobile (smartphone/tablette)</li>
                <li>• Synchronisation automatique en temps réel</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                6. Mes données sont-elles sécurisées ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Hébergement en Europe (conformité RGPD)</li>
                <li>• Sauvegardes automatiques quotidiennes</li>
                <li>• Chiffrement des données sensibles</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200">
              <h4 className="font-semibold text-foreground mb-2">
                7. Le support client est-il réactif ?
              </h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Support en français (pas en anglais)</li>
                <li>• Email, chat, téléphone disponibles ?</li>
                <li>• Délai de réponse acceptable (max 24-48h)</li>
              </ul>
            </div>
          </div>

          {/* Focus Solkant */}
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-8 my-12 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              🎯 Focus Solkant : La solution pensée pour les instituts de beauté
            </h3>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Découvrez pourquoi Solkant coche toutes les cases des 7 critères
              ci-dessus et est devenu le choix n°1 de plus de 500 instituts de
              beauté en France.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 1. Spécialement conçu
                  pour les instituts de beauté
                </h4>
                <p className="text-foreground/70 mb-3">
                  Contrairement aux logiciels généralistes, Solkant a été créé
                  spécifiquement pour les esthéticiennes et gérantes de salon :
                </p>
                <ul className="space-y-2 text-sm text-foreground/70 pl-4">
                  <li>
                    • Vocabulaire adapté (prestations, clientes, catalogue)
                  </li>
                  <li>
                    • Templates de devis professionnels pour la beauté avec logo
                  </li>
                  <li>
                    • Catalogue de prestations pré-rempli (épilation, soins
                    visage, manucure, pédicure, etc.)
                  </li>
                  <li>• Interface pensée pour votre métier au quotidien</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 2. Simplicité extrême : 2
                  minutes pour créer votre premier devis
                </h4>
                <p className="text-foreground/70 mb-4">
                  Pas besoin d&apos;un diplôme en informatique. Si vous savez
                  envoyer un email, vous savez utiliser Solkant.
                </p>

                <div className="rounded-lg bg-purple-50 p-4 mb-3 border border-purple-100">
                  <h5 className="font-semibold text-foreground mb-2 text-sm">
                    Exemple de workflow Solkant :
                  </h5>
                  <ol className="space-y-2 text-sm text-foreground/70 list-decimal pl-5">
                    <li>
                      Sélectionnez votre cliente (ou créez-la en 30 secondes)
                    </li>
                    <li>
                      Ajoutez vos prestations depuis votre catalogue (2 clics
                      par prestation)
                    </li>
                    <li>
                      Solkant calcule automatiquement les totaux, TVA et remises
                    </li>
                    <li>
                      Générez un PDF professionnel avec votre logo et vos
                      couleurs
                    </li>
                    <li>Envoyez par email directement depuis l&apos;outil</li>
                  </ol>
                  <p className="font-bold text-purple-700 mt-3 text-center">
                    ➡️ Temps total : 2 minutes (vs 15 minutes à la main avec
                    Excel)
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-foreground/70 pl-4">
                  <li>• Interface ultra-intuitive (aucune formation requise)</li>
                  <li>• Tutoriels vidéo courts (2-3 minutes chacun)</li>
                  <li>• Support en français réactif si besoin</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 3. Gain de temps réel :
                  8-10 heures par semaine
                </h4>
                <p className="text-foreground/70 mb-3">
                  Automatisations qui changent vraiment la vie :
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✅ Devis en 2 min au lieu de 15 min</li>
                    <li>✅ Calculs automatiques (fini les erreurs de TVA)</li>
                    <li>✅ Numérotation auto (DEVIS-2025-001, 002...)</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✅ Recherche cliente instantanée (3 clics)</li>
                    <li>✅ Historique complet par cliente</li>
                    <li>✅ Templates réutilisables pour vos prestations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 4. Prix transparent :
                  19€/mois, sans engagement
                </h4>
                <ul className="space-y-2 text-foreground/70 mb-4">
                  <li>💰 19€/mois - prix fixe et transparent</li>
                  <li>✅ Pas de frais cachés</li>
                  <li>✅ Pas de commission sur vos ventes</li>
                  <li>✅ Pas de limite de devis ou de clientes</li>
                  <li>✅ Annulation en 1 clic si ça ne vous convient pas</li>
                  <li>✅ Essai gratuit 14 jours (sans carte bancaire)</li>
                </ul>

                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <h5 className="font-semibold text-foreground mb-2">
                    💰 Calcul du ROI (retour sur investissement)
                  </h5>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>• Vous économisez : <strong>8h/mois minimum</strong></li>
                    <li>• Votre taux horaire moyen : <strong>50€/h</strong></li>
                    <li>• Valeur du temps gagné : <strong>400€/mois</strong></li>
                    <li>• Coût Solkant : <strong>19€/mois</strong></li>
                  </ul>
                  <p className="font-bold text-green-700 mt-3 text-lg text-center">
                    ➡️ ROI = +381€/mois de valeur créée !
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 5. Accessible partout,
                  tout le temps
                </h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    💻 Version web complète (depuis votre ordinateur au bureau)
                  </li>
                  <li>
                    📱 Accès depuis smartphone (entre deux rendez-vous, en
                    déplacement)
                  </li>
                  <li>🔄 Synchronisation automatique en temps réel</li>
                  <li>✅ Fonctionne sur PC, Mac, tablette, iOS et Android</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 6. Sécurité et conformité
                  RGPD
                </h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    🇫🇷 Hébergement en France sur serveurs sécurisés (OVH)
                  </li>
                  <li>
                    💾 Sauvegardes automatiques quotidiennes (jamais de perte de
                    données)
                  </li>
                  <li>🔒 Conformité RGPD native et certifiée</li>
                  <li>
                    📄 Mentions légales obligatoires déjà intégrées dans les
                    devis
                  </li>
                  <li>
                    🔐 Chiffrement des mots de passe et données sensibles
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-2xl">✅</span> 7. Support en français,
                  vraiment réactif
                </h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>🇫🇷 Équipe française basée à Paris</li>
                  <li>📧 Réponse sous 24h maximum (souvent le jour même)</li>
                  <li>📚 Documentation complète et tutoriels vidéo</li>
                  <li>💬 Chat en direct pour questions urgentes</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-purple-100 p-6 mt-8 border border-purple-200">
              <h4 className="font-semibold text-foreground mb-3">
                💬 Témoignage utilisatrice
              </h4>
              <p className="text-foreground/70 italic mb-3">
                &quot;Avant Solkant, je passais mes soirées à faire mes devis
                sur Excel. Maintenant, je crée un devis en 2 minutes chrono
                entre deux clientes. J&apos;ai économisé 2h par semaine, que
                j&apos;utilise pour développer mon activité sur Instagram. Le
                meilleur investissement de l&apos;année !&quot;
              </p>
              <p className="text-foreground/70 font-semibold">
                — Sophie, gérante d&apos;un institut à Lyon
              </p>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                Essayer Solkant gratuitement pendant 14 jours
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
              <p className="text-sm text-muted-foreground mt-3">
                Sans carte bancaire • Sans engagement • Support inclus
              </p>
            </div>
          </div>

          {/* Comparatif tableau */}
          <h3 className="text-2xl font-bold text-foreground mt-16 mb-6">
            Comparatif : Solkant vs alternatives
          </h3>

          <div className="overflow-x-auto mb-12">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Critère
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground">
                    Excel
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground">
                    Logiciel généraliste
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground">
                    Logiciel tout-en-un
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground bg-green-50">
                    Solkant
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Prix/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Gratuit
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    15-25€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    50-80€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    19€
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Spécialisé beauté
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ⚠️
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center bg-green-50">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Temps création devis
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    15 min
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    5-8 min
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    5 min
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    2 min
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Courbe d&apos;apprentissage
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Moyenne
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Faible
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Élevée
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    Très faible
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Engagement
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    -
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Variable
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    12-24 mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    Sans engagement
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Support
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Email uniquement
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    Payant
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    Inclus FR
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Application mobile
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ⚠️
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ⚠️
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ✅
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    ✅
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Calculs automatiques
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ✅
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ✅
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    ✅
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Gestion catalogue
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ⚠️
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ✅
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    ✅
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    RGPD natif
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ❌
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ⚠️
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    ✅
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    ✅
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-12 border border-green-200">
            <h4 className="font-semibold text-foreground mb-2 text-lg">
              ✅ Verdict final
            </h4>
            <p className="text-foreground/70">
              Pour 95% des instituts de beauté (1 à 3 salariés), Solkant offre
              le meilleur rapport simplicité/fonctionnalités/prix. Ni trop
              simple (Excel), ni trop complexe (tout-en-un), mais juste ce
              qu&apos;il faut pour gérer efficacement vos devis et clientes.
            </p>
          </div>

          {/* Transition vers budget */}
          <div className="rounded-lg bg-blue-50 p-6 my-12 border border-blue-200">
            <p className="text-foreground/80 text-lg">
              Maintenant que vous connaissez les 5 piliers essentiels (4
              hardware + 1 software), passons aux <strong>budgets concrets</strong>{" "}
              selon votre situation.
            </p>
          </div>

          {/* Section 4 - Budget */}
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">
            Budget complet : Combien coûte le matériel informatique pour votre
            institut ?
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-8">
            La question que toutes les gérantes se posent : combien vais-je
            devoir investir pour informatiser mon institut ? La bonne nouvelle :
            vous pouvez démarrer avec un budget très raisonnable. Voici 3
            scénarios budgétaires selon votre situation et vos ambitions.
          </p>

          {/* Scénario 1 */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Scénario 1 : Budget minimal (démarrage serré)
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Profil :</strong> Vous ouvrez votre premier institut, budget
            très limité, vous voulez tester avant d&apos;investir davantage.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Équipement
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Solution
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Optionnel ?
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Ordinateur
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    PC portable reconditionné (Backmarket)
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    300-400€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ❌ Indispensable
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Logiciel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Solkant
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ❌ Indispensable
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Imprimante
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Pas d&apos;imprimante (100% digital)
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    0€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ✅ Optionnel
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Tablette
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Utilisez votre smartphone perso
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    0€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ✅ Optionnel
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">TPE</td>
                  <td className="border border-foreground/20 px-4 py-3">
                    SumUp
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    39€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    ❌ Indispensable
                  </td>
                </tr>
                <tr className="bg-green-50 font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    TOTAL INITIAL
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-green-600 font-bold">
                    339-439€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
                <tr className="font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    Coût mensuel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-bold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 mb-12 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-3">
              💡 Conseils pour ce budget
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                ✅ Achetez un ordinateur reconditionné (Backmarket, Recommerce) :
                fiable, garanti, et écologique
              </li>
              <li>
                ✅ Évitez l&apos;imprimante : envoyez tous vos devis par email
                avec Solkant (économie de 200-300€)
              </li>
              <li>
                ✅ Utilisez votre smartphone personnel au début (achetez une
                tablette plus tard si besoin)
              </li>
              <li>
                ✅ Investissez dans SumUp (39€) : indispensable pour les
                paiements CB, rentabilisé dès la première semaine
              </li>
            </ul>
            <p className="text-foreground/80 font-semibold mt-4">
              <strong>ROI :</strong> Avec 19€/mois pour Solkant, si vous gagnez
              ne serait-ce que 30 minutes par semaine, c&apos;est déjà
              rentabilisé (votre temps vaut bien plus que 19€ !).
            </p>
          </div>

          {/* Scénario 2 */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Scénario 2 : Budget confort (le sweet spot) ✅
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Profil :</strong> Institut établi ou vous voulez démarrer
            avec du matériel de qualité qui durera 4-5 ans.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Équipement
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Solution
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Justification
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Ordinateur
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    PC portable neuf milieu de gamme
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    700-800€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Rapide, fiable, dure 5 ans
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Logiciel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Solkant
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Gain de temps maximal
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Imprimante
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Laser Brother HL-L2350DW
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    180€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Pour les rares impressions
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Tablette
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    En attente (achat dans 6 mois)
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    0€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Pas urgent au démarrage
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">TPE</td>
                  <td className="border border-foreground/20 px-4 py-3">
                    SumUp + support
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    59€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Version avec socle
                  </td>
                </tr>
                <tr className="bg-green-50 font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    TOTAL INITIAL
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-green-600 font-bold">
                    939-1039€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
                <tr className="font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    Coût mensuel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-bold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-6 border border-green-100">
            <h4 className="font-semibold text-foreground mb-3">
              ✅ Pourquoi c&apos;est le sweet spot
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                ✅ Ordinateur de qualité qui dure 5 ans (800€ ÷ 60 mois = 13€/mois
                amorti)
              </li>
              <li>✅ Imprimante laser économique sur le long terme</li>
              <li>✅ TPE professionnel avec support pratique</li>
              <li>✅ Budget raisonnable avec du matériel fiable</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 mb-12 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-3">
              📅 Plan d&apos;investissement progressif
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <strong>Mois 0 :</strong> Ordinateur + Solkant + TPE = 939€
              </li>
              <li>
                <strong>Mois 6 :</strong> Ajouter une tablette iPad si
                l&apos;activité le permet = +400€
              </li>
              <li>
                <strong>Mois 12 :</strong> Évaluer si d&apos;autres besoins
                (écran supplémentaire pour le confort, etc.)
              </li>
            </ul>
          </div>

          {/* Scénario 3 */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Scénario 3 : Budget premium (confort maximal)
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Profil :</strong> Vous voulez le meilleur équipement,
            plusieurs salons ou équipe de 3+ personnes.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Équipement
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Solution
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Avantages
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Ordinateur
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    MacBook Air M2 ou PC haut de gamme
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    1200-1500€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Rapidité, durabilité 6-7 ans
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Logiciel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Solkant
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Même prix, même efficacité
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">
                    Imprimante
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Laser couleur Brother
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    350€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Impression couleur pro
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Tablette
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    iPad Air + Apple Pencil
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    700€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Signature client, mobilité
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">TPE</td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Zettle Terminal (avec écran)
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    99€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    TPE pro avec écran tactile
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">
                    Écran externe
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Écran 24&quot; pour bureau
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    150€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3">
                    Confort visuel au bureau
                  </td>
                </tr>
                <tr className="bg-purple-50 font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    TOTAL INITIAL
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-purple-600 font-bold">
                    2499-2818€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
                <tr className="font-semibold">
                  <td
                    colSpan={2}
                    className="border border-foreground/20 px-4 py-3"
                  >
                    Coût mensuel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 font-bold">
                    19€/mois
                  </td>
                  <td className="border border-foreground/20 px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-purple-50 p-6 mb-12 border border-purple-100">
            <h4 className="font-semibold text-foreground mb-3">
              🎯 Pour qui c&apos;est justifié
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>✅ Vous gérez plusieurs salons</li>
              <li>✅ Vous avez 3+ salariés qui utilisent l&apos;ordinateur</li>
              <li>✅ Votre institut a un positionnement premium</li>
              <li>✅ Vous passez 6+ heures par jour sur l&apos;ordinateur</li>
            </ul>
            <p className="text-foreground/80 font-semibold mt-3">
              <strong>Important :</strong> Même avec le budget premium, Solkant
              reste à 19€/mois. Le logiciel n&apos;est pas plus cher parce que
              votre MacBook coûte plus cher !
            </p>
          </div>

          {/* Comparatif des 3 scénarios */}
          <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">
            Comparatif des 3 scénarios
          </h3>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left font-semibold text-foreground">
                    Critère
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground">
                    Budget Minimal
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground bg-green-50">
                    Budget Confort ✅
                  </th>
                  <th className="border border-foreground/20 px-4 py-3 text-center font-semibold text-foreground">
                    Budget Premium
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Investissement initial
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    339-439€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    939-1039€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    2499-2818€
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Coût mensuel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    19€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    19€
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    19€
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Pour qui ?
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-sm">
                    Démarrage, test
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50 text-sm">
                    80% des instituts
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-sm">
                    Multi-salons, équipe
                  </td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Durabilité matériel
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    2-3 ans
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    4-5 ans
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    6-7 ans
                  </td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3 font-semibold">
                    Efficacité Solkant
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    100%
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center font-semibold bg-green-50">
                    100%
                  </td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-8 border border-green-200">
            <h4 className="font-semibold text-foreground mb-2">
              ✅ Le conseil Solkant
            </h4>
            <p className="text-foreground/70">
              La majorité de nos utilisatrices choisissent le{" "}
              <strong>Budget Confort</strong> (800-1000€). C&apos;est le
              meilleur compromis entre investissement initial et durabilité du
              matériel. Vous êtes équipée pour 5 ans minimum.
            </p>
          </div>

          {/* Encadré ROI */}
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-blue-50 p-8 mb-16 border-2 border-green-200">
            <h4 className="text-xl font-bold text-foreground mb-4 text-center">
              💰 Calcul du retour sur investissement (Budget Confort)
            </h4>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h5 className="font-semibold text-foreground mb-3">
                  Investissement total
                </h5>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>Matériel : 1000€ (une fois)</li>
                  <li>Solkant : 19€ × 12 mois = 228€/an</li>
                  <li>
                    <strong className="text-foreground">
                      Total 1ère année : 1228€
                    </strong>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-3">
                  Gains concrets
                </h5>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    ⏱️ <strong>Temps gagné :</strong> 8h/mois × 12 = 96h/an
                  </li>
                  <li>
                    💶 <strong>Valeur de votre temps :</strong> 96h × 50€/h =
                    4800€/an
                  </li>
                  <li>
                    📈 <strong>Augmentation CA :</strong> Organisation = +10% CA
                    = +2000-5000€/an
                  </li>
                  <li>
                    😌 <strong>Réduction stress :</strong> Inestimable
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-4 border-t border-green-200">
              <p className="text-2xl font-bold text-green-700">
                ROI : +5800€ pour 1228€ investis = Rentabilisé en 2-3 mois !
              </p>
            </div>
          </div>

          {/* Section 5 - Checklist */}
          <h2 className="text-3xl font-bold text-foreground mt-16 mb-6">
            Checklist : Par où commencer ? Les 7 étapes pour informatiser votre
            institut
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-8">
            Vous êtes convaincue mais vous ne savez pas par où commencer ? Voici
            votre feuille de route étape par étape pour être opérationnelle en 7
            jours (ou un week-end si vous êtes pressée).
          </p>

          {/* Étape 1 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 1 : Évaluez votre budget (1 jour)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Déterminez votre budget disponible (minimal, confort ou
                  premium)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Identifiez ce que vous avez déjà (ordinateur personnel
                  réutilisable ?)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Priorisez : logiciel + ordinateur = indispensable, le reste
                  peut attendre
                </span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Notez votre budget maximum sur un papier.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 2 : Choisissez et achetez votre ordinateur (2-3 jours)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Consultez les offres sur Backmarket (reconditionné) ou
                  LDLC/Boulanger (neuf)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Vérifiez : 8 Go RAM minimum, SSD 256 Go minimum, Windows 11 ou
                  macOS
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Commandez avec garantie de 2 ans minimum</span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Commandez votre ordinateur (livraison sous 2-5 jours).
            </p>
          </div>

          {/* Étape 3 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 3 : Créez votre compte Solkant (30 minutes)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Inscrivez-vous sur{" "}
                  <Link
                    href="/register"
                    className="text-purple-600 hover:underline font-semibold"
                  >
                    solkant.com/register
                  </Link>{" "}
                  (essai gratuit 14 jours)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Remplissez vos informations d&apos;institut (nom, SIRET,
                  adresse)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Téléchargez votre logo pour personnaliser vos devis
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Regardez le tutoriel vidéo de démarrage (3 minutes)</span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Créez votre compte dès maintenant (même avant de
              recevoir l&apos;ordinateur, vous pouvez le faire sur votre
              smartphone).
            </p>
          </div>

          {/* Étape 4 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 4 : Créez votre catalogue de prestations (1 heure)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Listez toutes vos prestations (soins visage, épilation,
                  manucure, etc.)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Indiquez les prix TTC de chaque prestation</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Ajoutez des descriptions courtes (optionnel mais recommandé)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Créez des &quot;packs&quot; si vous en proposez (exemple :
                  &quot;Forfait Mariée&quot;)
                </span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Une fois fait, vous réutiliserez ce catalogue pour
              tous vos devis futurs (gain de temps massif).
            </p>
          </div>

          {/* Étape 5 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 5 : Importez vos clientes (1-2 heures)
            </h3>
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">
                Option A - Démarrage progressif (recommandé) :
              </h4>
              <ul className="space-y-2 text-foreground/70 mb-3">
                <li className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span>
                    Ajoutez manuellement vos 10-20 clientes les plus fidèles
                  </span>
                </li>
                <li className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span>
                    Complétez au fur et à mesure des nouvelles demandes de devis
                  </span>
                </li>
              </ul>
              <h4 className="font-semibold text-foreground mb-2">
                Option B - Import complet :
              </h4>
              <ul className="space-y-2 text-foreground/70">
                <li className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span>
                    Si vous avez un fichier Excel, utilisez la fonction
                    d&apos;import de Solkant
                  </span>
                </li>
                <li className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span>
                    Vérifiez que les données sont bien formatées (nom, email,
                    téléphone)
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Commencez par l&apos;Option A (plus rapide et moins
              intimidant).
            </p>
          </div>

          {/* Étape 6 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 6 : Créez votre premier devis (5 minutes)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Sélectionnez une cliente test (ou créez-en une fictive)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Ajoutez 2-3 prestations depuis votre catalogue</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Prévisualisez le PDF généré</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Envoyez-vous le devis par email pour voir le rendu final
                </span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Testez avec une cliente réelle ou fictive pour vous
              familiariser avec l&apos;interface.
            </p>
          </div>

          {/* Étape 7 */}
          <div className="rounded-lg bg-gray-50 p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-foreground mb-3">
              ✅ Étape 7 : Commandez votre TPE (1 jour)
            </h3>
            <ul className="space-y-2 text-foreground/70 mb-4">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Commandez un SumUp ou Zettle sur leur site officiel (29-59€)
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Téléchargez l&apos;application mobile du TPE sur votre
                  smartphone
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>
                  Testez avec une première transaction de 1€ pour vérifier que
                  tout fonctionne
                </span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span>Configurez le TPE à votre espace de caisse</span>
              </li>
            </ul>
            <p className="text-sm font-semibold text-purple-700">
              👉 Action : Vous êtes prête à encaisser par carte bancaire !
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-8 mt-8 border-2 border-green-200">
            <h4 className="text-xl font-semibold text-foreground mb-2 text-center">
              🎯 Timeline réaliste
            </h4>
            <p className="text-foreground/70 text-center text-lg">
              En suivant ces 7 étapes, vous pouvez informatiser complètement
              votre institut en <strong>1 semaine</strong> (ou en un week-end si
              vous êtes pressée). La plupart de nos utilisatrices sont
              opérationnelles en <strong>48 heures</strong> !
            </p>
          </div>

          {/* CTA Final après checklist - Section manquante suite au prochain message */}
        </div>
      </article>

      {/* Articles connexes */}
      <RelatedArticles
        articles={blogArticles}
        currentSlug="materiel-informatique-institut-beaute"
      />

      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
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
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Solkant. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
