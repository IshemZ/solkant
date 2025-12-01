import { Metadata } from 'next'
import { getClients } from '@/app/actions/clients'
import { getServices } from '@/app/actions/services'
import QuoteForm from '@/components/QuoteForm'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Nouveau devis | Devisio',
  description: 'Créer un nouveau devis',
}

export default async function NewQuotePage() {
  const [clientsResult, servicesResult] = await Promise.all([
    getClients(),
    getServices(),
  ])

  if (clientsResult.error || servicesResult.error) {
    redirect('/dashboard')
  }

  const clients = clientsResult.data || []
  const services = servicesResult.data || []

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nouveau devis</h1>
        <p className="mt-2 text-foreground/60">
          Créez un devis professionnel pour votre client
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-12 text-center">
          <p className="text-foreground/60">Vous devez d'abord créer un client</p>
          <a
            href="/dashboard/clients"
            className="mt-4 inline-block rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Aller aux clients
          </a>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-12 text-center">
          <p className="text-foreground/60">Vous devez d'abord créer des services</p>
          <a
            href="/dashboard/services"
            className="mt-4 inline-block rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Aller aux services
          </a>
        </div>
      ) : (
        <QuoteForm clients={clients} services={services} />
      )}
    </div>
  )
}
