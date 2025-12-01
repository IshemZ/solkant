'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateBusinessSchema, type UpdateBusinessInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getBusinessInfo() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: session.user.businessId },
    })

    return { data: business }
  } catch (error) {
    console.error('Error fetching business:', error)
    return { error: 'Erreur lors de la récupération des informations' }
  }
}

export async function updateBusiness(input: UpdateBusinessInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  // Validate input
  const validation = updateBusinessSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors
    }
  }

  try {
    const business = await prisma.business.update({
      where: { id: session.user.businessId },
      data: validation.data,
    })

    revalidatePath('/dashboard/parametres')
    return { data: business }
  } catch (error) {
    console.error('Error updating business:', error)
    return { error: 'Erreur lors de la mise à jour' }
  }
}
