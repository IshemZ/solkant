import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSubscriptionStatus } from "@/app/actions/stripe";
import SubscriptionCard from "./_components/SubscriptionCard";

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getSubscriptionStatus();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {result.error}
        </div>
      </div>
    );
  }

  const subscription = result.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Gérer mon abonnement
        </h1>
        <p className="mt-2 text-muted-foreground">
          Consultez votre plan actuel et gérez votre abonnement
        </p>
      </div>

      {/* Plan actuel */}
      <div className="mb-12 rounded-lg border border-foreground/10 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Plan actuel : {subscription.plan === "free" ? "Gratuit" : "Pro"}
            </h2>
            {subscription.plan === "pro" && (
              <div className="mt-2 space-y-1 text-sm text-foreground/70">
                <p>
                  Statut :{" "}
                  {subscription.status === "active"
                    ? "Actif"
                    : subscription.status === "canceled"
                    ? "Annulé"
                    : subscription.status}
                </p>
                {subscription.currentPeriodEnd && (
                  <p>
                    {subscription.cancelAtPeriodEnd
                      ? "Expire le"
                      : "Renouvellement le"}{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-orange-600">
                    Votre abonnement sera annulé à la fin de la période en cours
                  </p>
                )}
              </div>
            )}
          </div>
          {subscription.plan === "pro" && <SubscriptionCard type="manage" />}
        </div>
      </div>

      {/* Plans disponibles */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Plans disponibles
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan Gratuit */}
          <div className="flex flex-col rounded-lg border border-foreground/10 bg-background p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Gratuit</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">0 €</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
            </div>

            <ul className="mb-6 flex-1 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Jusqu&apos;à 10 devis par mois</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Gestion clients illimitée</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Catalogue de services</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Génération PDF</span>
              </li>
            </ul>

            {subscription.plan === "free" ? (
              <div className="rounded-md bg-foreground/5 px-4 py-2 text-center text-sm font-medium text-foreground">
                Plan actuel
              </div>
            ) : (
              <SubscriptionCard type="downgrade" />
            )}
          </div>

          {/* Plan Pro */}
          <div className="relative flex flex-col rounded-lg border-2 border-foreground bg-background p-6">
            <div className="absolute -top-3 right-4">
              <span className="inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                Recommandé
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Pro</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">19 €</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
            </div>

            <ul className="mb-6 flex-1 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Devis illimités</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Tout du plan Gratuit</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Personnalisation avancée</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Statistiques avancées</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Support prioritaire</span>
              </li>
            </ul>

            {subscription.plan === "pro" ? (
              <div className="rounded-md bg-foreground/5 px-4 py-2 text-center text-sm font-medium text-foreground">
                Plan actuel
              </div>
            ) : (
              <SubscriptionCard type="upgrade" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
