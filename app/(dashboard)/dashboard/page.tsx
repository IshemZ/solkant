import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardNav from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Tableau de bord | Devisio',
  description: 'Gérez vos devis et clients',
}

export default async function DashboardPage() {
  // Auth check handled by layout.tsx - session guaranteed to exist
  const session = await getServerSession(authOptions)

  // TypeScript safety: layout.tsx redirects if no session
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNav
        userName={session.user?.name}
        userEmail={session.user?.email}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Bienvenue, {session.user?.name?.split(' ')[0] || 'Utilisateur'}
          </h2>
          <p className="mt-2 text-foreground/60">
            Voici votre tableau de bord pour gérer vos devis et clients
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-foreground/10 bg-background p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Devis</p>
                <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="rounded-full bg-foreground/10 p-3">
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-background p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Clients</p>
                <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="rounded-full bg-foreground/10 p-3">
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-background p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Services</p>
                <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="rounded-full bg-foreground/10 p-3">
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-background p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">Chiffre d&apos;affaires</p>
                <p className="mt-2 text-3xl font-bold text-foreground">0€</p>
              </div>
              <div className="rounded-full bg-foreground/10 p-3">
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Actions rapides
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5">
              <div className="rounded-md bg-foreground p-2 text-background">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Nouveau devis</p>
                <p className="text-sm text-foreground/60">Créer un nouveau devis</p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5">
              <div className="rounded-md bg-foreground p-2 text-background">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Nouveau client</p>
                <p className="text-sm text-foreground/60">Ajouter un client</p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-md border border-foreground/20 bg-background p-4 text-left transition-colors hover:bg-foreground/5">
              <div className="rounded-md bg-foreground p-2 text-background">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Nouveau service</p>
                <p className="text-sm text-foreground/60">Ajouter un service</p>
              </div>
            </button>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 rounded-lg border border-foreground/10 bg-foreground/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Pour commencer
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Configurez votre entreprise</p>
                <p className="text-sm text-foreground/60">
                  Ajoutez les informations de votre institut (nom, adresse, logo)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Créez votre catalogue de services</p>
                <p className="text-sm text-foreground/60">
                  Ajoutez vos prestations avec prix et durées
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Ajoutez vos clients</p>
                <p className="text-sm text-foreground/60">
                  Enregistrez les informations de vos clients
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                4
              </div>
              <div>
                <p className="font-medium text-foreground">Créez votre premier devis</p>
                <p className="text-sm text-foreground/60">
                  Générez un devis professionnel en quelques clics
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
