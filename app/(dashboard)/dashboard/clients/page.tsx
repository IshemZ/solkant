import { Metadata } from 'next'
import { getClients } from '@/app/actions/clients'
import ClientsList from '@/components/ClientsList'

export const metadata: Metadata = {
  title: 'Clients | Devisio',
  description: 'Gérez vos clients',
}

export default async function ClientsPage() {
  const result = await getClients()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="mt-2 text-foreground/60">
            Gérez votre liste de clients
          </p>
        </div>
      </div>

      {result.error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {result.error}
        </div>
      ) : (
        <ClientsList initialClients={result.data || []} />
      )}
    </div>
  )
}
