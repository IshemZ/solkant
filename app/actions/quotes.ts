'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createQuoteSchema, type CreateQuoteInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getQuotes() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    const quotes = await prisma.quote.findMany({
      where: { businessId: session.user.businessId },
      include: {
        client: true,
        items: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { data: quotes }
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return { error: 'Erreur lors de la récupération des devis' }
  }
}

export async function getQuote(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
      include: {
        client: true,
        business: true,
        items: {
          include: {
            service: true,
          },
        },
      },
    })

    if (!quote) {
      return { error: 'Devis introuvable' }
    }

    return { data: quote }
  } catch (error) {
    console.error('Error fetching quote:', error)
    return { error: 'Erreur lors de la récupération du devis' }
  }
}

async function generateQuoteNumber(businessId: string): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `DEVIS-${year}-`

  // Get the last quote number for this year
  const lastQuote = await prisma.quote.findFirst({
    where: {
      businessId,
      quoteNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      quoteNumber: 'desc',
    },
  })

  let nextNumber = 1
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.quoteNumber.split('-').pop() || '0')
    nextNumber = lastNumber + 1
  }

  return `${prefix}${nextNumber.toString().padStart(3, '0')}`
}

export async function createQuote(input: CreateQuoteInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validation = createQuoteSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    const { items, ...quoteData } = validation.data

    // Generate quote number
    const quoteNumber = await generateQuoteNumber(session.user.businessId)

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const total = subtotal - (quoteData.discount || 0)

    // Create quote with items in a transaction
    const quote = await prisma.quote.create({
      data: {
        ...quoteData,
        quoteNumber,
        subtotal,
        total,
        businessId: session.user.businessId,
        items: {
          create: items.map((item) => ({
            serviceId: item.serviceId,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    })

    revalidatePath('/dashboard/devis')
    return { data: quote }
  } catch (error) {
    console.error('Error creating quote:', error)
    return { error: 'Erreur lors de la création du devis' }
  }
}

export async function deleteQuote(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    await prisma.quote.delete({
      where: {
        id,
        businessId: session.user.businessId,
      },
    })

    revalidatePath('/dashboard/devis')
    return { success: true }
  } catch (error) {
    console.error('Error deleting quote:', error)
    return { error: 'Erreur lors de la suppression du devis' }
  }
}
