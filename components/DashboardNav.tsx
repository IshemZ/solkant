import Link from 'next/link'
import SignOutButton from './SignOutButton'

interface DashboardNavProps {
  userName?: string | null
  userEmail?: string | null
}

export default function DashboardNav({ userName, userEmail }: DashboardNavProps) {
  return (
    <header className="border-b border-foreground/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-foreground">Devisio</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard/devis/nouveau"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <svg
                  className="h-4 w-4"
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
                Nouveau devis
              </Link>
              <Link
                href="/dashboard/clients"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Clients
              </Link>
              <Link
                href="/dashboard/services"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Services
              </Link>
              <Link
                href="/dashboard/devis"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Mes devis
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/60">
              {userName || userEmail}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
