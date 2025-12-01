'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createServiceSchema, updateServiceSchema, type CreateServiceInput, type UpdateServiceInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getServices() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    const services = await prisma.service.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: 'desc' },
    })

    return { data: services }
  } catch (error) {
    console.error('Error fetching services:', error)
    return { error: 'Erreur lors de la récupération des services' }
  }
}

export async function createService(input: CreateServiceInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validation = createServiceSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors
    }
  }

  try {
    const service = await prisma.service.create({
      data: {
        ...validation.data,
        businessId: session.user.businessId,
      },
    })

    revalidatePath('/dashboard/services')
    return { data: service }
  } catch (error) {
    console.error('Error creating service:', error)
    return { error: 'Erreur lors de la création du service' }
  }
}

export async function updateService(id: string, input: UpdateServiceInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validation = updateServiceSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors
    }
  }

  try {
    const service = await prisma.service.update({
      where: {
        id,
        businessId: session.user.businessId,
      },
      data: validation.data,
    })

    revalidatePath('/dashboard/services')
    return { data: service }
  } catch (error) {
    console.error('Error updating service:', error)
    return { error: 'Erreur lors de la mise à jour du service' }
  }
}

export async function deleteService(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    await prisma.service.delete({
      where: {
        id,
        businessId: session.user.businessId,
      },
    })

    revalidatePath('/dashboard/services')
    return { success: true }
  } catch (error) {
    console.error('Error deleting service:', error)
    return { error: 'Erreur lors de la suppression du service' }
  }
}
