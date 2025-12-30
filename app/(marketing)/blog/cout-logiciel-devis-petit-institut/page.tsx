import Link from "next/link";
import type { Metadata } from "next";
import { RelatedArticles } from "@/app/(marketing)/blog/_components/RelatedArticles";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title:
    "Combien coûte vraiment un logiciel de devis pour petit institut ? Guide prix 2025",
  description:
    "Découvrez le vrai coût d'un logiciel de devis pour institut de beauté : abonnements, fonctionnalités, retour sur investissement. Comparatif complet 2025.",
  openGraph: {
    title: "Coût réel d'un logiciel de devis pour petit institut",
    description:
      "Prix, ROI et comparatif des solutions pour instituts de beauté.",
    url: "https://solkant.com/blog/cout-logiciel-devis-petit-institut",
    siteName: "Solkant",
    locale: "fr_FR",
    type: "article",
    publishedTime: "2025-01-12T09:00:00Z",
    authors: ["Solkant"],
    images: [
      {
        url: "https://solkant.com/images/og/blog.png",
        width: 1200,
        height: 630,
        alt: "Coût logiciel devis institut beauté",
      },
    ],
  },
  alternates: {
    canonical: "https://solkant.com/blog/cout-logiciel-devis-petit-institut",
  },
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Solkant
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/fonctionnalites" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Fonctionnalités
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Tarifs
                </Link>
                <Link href="/blog" className="text-sm font-medium text-foreground hover:text-foreground">
                  Blog
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Connexion
              </Link>
              <Link href="/register" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="font-medium text-foreground">Budget</span>
            <span>•</span>
            <time dateTime="2025-01-12">12 janvier 2025</time>
            <span>•</span>
            <span>8 min de lecture</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Combien coûte vraiment un logiciel de devis pour petit institut ?
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Entre options gratuites et abonnements premium, découvrez le vrai coût d&apos;un logiciel de devis et calculez votre retour sur investissement.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed mb-6">
            &ldquo;C&apos;est trop cher pour mon petit institut.&rdquo; Vous avez déjà pensé ça en regardant les tarifs des{" "}
            <Link href="/logiciel-devis-institut-beaute" className="text-foreground font-semibold hover:underline">
              logiciels de devis
            </Link>
            ? Pourtant, quand on fait le calcul complet, la réalité est souvent surprenante. Décryptons ensemble les vrais coûts et le retour sur investissement.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Les différents modèles de tarification
          </h2>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            1. Formule gratuite (Freemium)
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Prix :</strong> 0€/mois
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li><strong>Ce qui est inclus :</strong> Généralement 5-10 devis par mois, fonctionnalités de base, parfois publicité ou logo de l&apos;éditeur</li>
            <li><strong>Pour qui :</strong> Instituts débutants (&lt; 5 clientes/mois) ou test avant de s&apos;engager</li>
            <li><strong>Limites :</strong> Nombre de devis restreint, fonctionnalités limitées, pas de personnalisation complète</li>
          </ul>

          <div className="rounded-lg bg-blue-50 p-6 mb-6 border border-blue-100">
            <h4 className="font-semibold text-foreground mb-2">💡 Notre conseil</h4>
            <p className="text-foreground/70">
              Excellente option pour tester un logiciel sans risque. Solkant propose 10 devis/mois gratuits sans carte bancaire requise.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            2. Abonnement mensuel (le plus courant)
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Prix :</strong> 10€ à 40€/mois selon les fonctionnalités
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li><strong>Entrée de gamme (10-15€/mois) :</strong> Devis illimités, 1 utilisateur, fonctionnalités basiques</li>
            <li><strong>Milieu de gamme (20-30€/mois) :</strong> Gestion clients complète, personnalisation, statistiques, support prioritaire</li>
            <li><strong>Premium (35-40€/mois) :</strong> Multi-utilisateurs, facturation, intégrations comptables, API</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            3. Abonnement annuel (avec réduction)
          </h3>

          <p className="text-foreground/80 leading-relaxed mb-4">
            <strong>Prix :</strong> 100€ à 350€/an (soit 8-30€/mois)
          </p>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li><strong>Avantage :</strong> Économie de 15-20% par rapport au mensuel</li>
            <li><strong>Inconvénient :</strong> Engagement sur 12 mois, paiement en une fois</li>
            <li><strong>Pour qui :</strong> Instituts établis avec besoin confirmé</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Le vrai coût caché du &ldquo;gratuit&rdquo; (papier/Word)
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Avant de juger qu&apos;un logiciel est &ldquo;trop cher&rdquo;, calculons le coût réel de la méthode manuelle que vous utilisez peut-être encore :
          </p>

          <div className="rounded-lg bg-red-50 p-6 mb-6 border border-red-100">
            <h4 className="font-semibold text-foreground mb-3">📊 Calcul du coût &ldquo;papier/Word&rdquo;</h4>

            <div className="space-y-3 text-sm text-foreground/80">
              <div>
                <strong>Temps de création par devis :</strong> 15-20 minutes
                <br />
                <strong>Nombre de devis/mois :</strong> 15 en moyenne
                <br />
                <strong>Total temps mensuel :</strong> 15 × 20 min = 300 minutes = 5 heures
              </div>

              <div className="pt-3 border-t border-red-200">
                <strong>Valorisation de votre temps :</strong>
                <br />
                • Tarif moyen esthéticienne : 30-40€/heure
                <br />
                • Coût mensuel du temps perdu : 5h × 35€ = <strong className="text-red-700">175€/mois</strong>
              </div>

              <div className="pt-3 border-t border-red-200">
                <strong>Coûts matériels :</strong>
                <br />
                • Impression, papier, encre : 15€/mois
                <br />
                • Classeurs, archivage : 5€/mois
                <br />
                • Total matériel : <strong>20€/mois</strong>
              </div>

              <div className="pt-3 border-t border-red-200 font-bold text-red-700">
                COÛT TOTAL RÉEL : 195€/mois
              </div>
            </div>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Conclusion surprenante : votre méthode &ldquo;gratuite&rdquo; vous coûte en réalité <strong>195€ par mois</strong> en temps et matériel. Un logiciel à 20€/mois représente une économie de 175€/mois !
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Calcul du retour sur investissement (ROI)
          </h2>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Exemple concret : Institut avec 15 devis/mois
          </h3>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 px-4 py-3 text-left">Élément</th>
                  <th className="border border-foreground/20 px-4 py-3 text-center">Méthode manuelle</th>
                  <th className="border border-foreground/20 px-4 py-3 text-center">Solkant (20€/mois)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">Temps mensuel</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">5 heures</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-green-600">30 min</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">Valeur du temps</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-red-600">175€</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-green-600">17,50€</td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 px-4 py-3">Coûts matériels</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">20€</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-green-600">0€</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 px-4 py-3">Abonnement logiciel</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">0€</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center">20€</td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-foreground/20 px-4 py-3">TOTAL</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-red-700">195€/mois</td>
                  <td className="border border-foreground/20 px-4 py-3 text-center text-green-700">37,50€/mois</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-6 mb-8 border border-green-100">
            <h4 className="font-semibold text-foreground mb-2">💰 Économie mensuelle</h4>
            <p className="text-2xl font-bold text-green-700 mb-2">157,50€/mois</p>
            <p className="text-foreground/70">Soit 1 890€ économisés par an !</p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Les bénéfices cachés (au-delà du temps gagné)
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-foreground/80 mb-6">
            <li>
              <strong>Augmentation du taux de conversion :</strong> Un devis professionnel et rapide convertit mieux (+10-15% en moyenne). Sur 15 devis/mois à 150€ de panier moyen, cela représente 225-340€ de CA supplémentaire mensuel.
            </li>
            <li>
              <strong>Réduction des erreurs :</strong> Zéro erreur de calcul = zéro perte d&apos;argent par sous-facturation
            </li>
            <li>
              <strong>Image de marque valorisée :</strong> Professionnalisme renforcé = tarifs premium justifiés
            </li>
            <li>
              <strong>Moins de stress :</strong> Organisation mentale, pas de risque d&apos;oubli = qualité de vie améliorée
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Comment choisir selon votre budget
          </h2>

          <div className="space-y-6 mb-8">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">Budget 0€ : Version gratuite</h4>
              <p className="text-foreground/70 mb-2">
                <strong>Idéal si :</strong> Vous débutez ou envoyez &lt; 10 devis/mois
              </p>
              <p className="text-sm text-muted-foreground">
                Testez Solkant gratuitement (10 devis/mois) pour valider l&apos;utilité avant d&apos;investir
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">Budget 10-20€/mois : Formule basique</h4>
              <p className="text-foreground/70 mb-2">
                <strong>Idéal si :</strong> Vous envoyez 10-20 devis/mois, institut solo
              </p>
              <p className="text-sm text-muted-foreground">
                Fonctionnalités essentielles, ROI dès le premier mois
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-semibold text-foreground mb-2">Budget 25-35€/mois : Formule complète</h4>
              <p className="text-foreground/70 mb-2">
                <strong>Idéal si :</strong> Vous envoyez &gt; 20 devis/mois, plusieurs employées
              </p>
              <p className="text-sm text-muted-foreground">
                Multi-utilisateurs, statistiques avancées, support prioritaire
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Les erreurs à éviter
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-6">
            <li>❌ <strong>Choisir le moins cher sans tester :</strong> Un logiciel inadapté ne sera pas utilisé, argent perdu</li>
            <li>❌ <strong>Payer à l&apos;année dès le départ :</strong> Testez en mensuel d&apos;abord (1-2 mois minimum)</li>
            <li>❌ <strong>Prendre trop de fonctionnalités inutiles :</strong> Payez uniquement ce dont vous avez besoin</li>
            <li>❌ <strong>Négliger le support client :</strong> Un bon support vaut son prix en cas de blocage</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Conclusion : Un investissement, pas une dépense
          </h2>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Un logiciel de devis n&apos;est pas une dépense, c&apos;est un <strong>investissement rentable</strong> dès le premier mois. Pour 15-25€/mois, vous économisez 5 heures de travail administratif, augmentez votre taux de conversion et renforcez votre image professionnelle.
          </p>

          <p className="text-foreground/80 leading-relaxed mb-6">
            Le vrai luxe pour un petit institut, ce n&apos;est pas d&apos;avoir un logiciel coûteux. C&apos;est de continuer à perdre 5 heures par mois sur des tâches qu&apos;un outil pourrait faire en 30 minutes.
          </p>
        </div>

        <div className="mt-16 rounded-2xl bg-foreground/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Testez Solkant gratuitement - 0€, 0 engagement
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            10 devis gratuits par mois, sans carte bancaire. Si ça vous convient, passez à 19€/mois. Sinon, restez en gratuit.
          </p>
          <div className="mt-6">
            <Link href="/register" className="rounded-md bg-foreground px-6 py-3 font-semibold text-background hover:bg-foreground/90">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </article>
      </main>

      <RelatedArticles articles={blogArticles} currentSlug="cout-logiciel-devis-petit-institut" />

      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">© 2025 Solkant. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
