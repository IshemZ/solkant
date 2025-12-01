import { Metadata } from 'next'
import { getQuote } from '@/app/actions/quotes'
import { redirect } from 'next/navigation'
import QuoteView from '@/components/QuoteView'

export const metadata: Metadata = {
  title: 'Devis | Devisio',
  description: 'Consulter un devis',
}

interface QuotePageProps {
  params: Promise<{ id: string }>
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params
  const result = await getQuote(id)

  if (result.error || !result.data) {
    redirect('/dashboard/devis')
  }

  return (
    <div className="mx-auto max-w-5xl">
      <QuoteView quote={result.data} />
    </div>
  )
}
