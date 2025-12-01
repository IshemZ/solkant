import { Metadata } from 'next'
import { getQuotes } from '@/app/actions/quotes'
import QuotesList from '@/components/QuotesList'

export const metadata: Metadata = {
  title: 'Mes devis | Devisio',
  description: 'Consultez tous vos devis',
}

export default async function DevisPage() {
  const result = await getQuotes()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes devis</h1>
          <p className="mt-2 text-foreground/60">
            Consultez et gérez tous vos devis
          </p>
        </div>
      </div>

      {result.error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {result.error}
        </div>
      ) : (
        <QuotesList initialQuotes={result.data || []} />
      )}
    </div>
  )
}
