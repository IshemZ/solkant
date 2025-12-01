'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateBusiness } from '@/app/actions/business'
import type { Business } from '@prisma/client'

interface BusinessSettingsFormProps {
  business: Business
}

export default function BusinessSettingsForm({ business }: BusinessSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      siret: formData.get('siret') as string,
    }

    const result = await updateBusiness(data)

    if (result.error) {
      setError(result.error)
      toast.error('Erreur lors de la mise à jour')
    } else {
      toast.success('Informations mises à jour avec succès')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-foreground/10 bg-background p-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Nom de l'entreprise *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={business.name}
          required
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email professionnel
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={business.email || ''}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={business.phone || ''}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-foreground">
          Adresse complète
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={business.address || ''}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="siret" className="block text-sm font-medium text-foreground">
          SIRET
        </label>
        <input
          type="text"
          id="siret"
          name="siret"
          defaultValue={business.siret || ''}
          placeholder="123 456 789 00010"
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
