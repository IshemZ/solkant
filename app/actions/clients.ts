'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createClientSchema, updateClientSchema, type CreateClientInput, type UpdateClientInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    const clients = await prisma.client.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: 'desc' },
    })

    return { data: clients }
  } catch (error) {
    console.error('Error fetching clients:', error)
    return { error: 'Erreur lors de la récupération des clients' }
  }
}

export async function createClient(input: CreateClientInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validation = createClientSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors
    }
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validation.data,
        businessId: session.user.businessId,
      },
    })

    revalidatePath('/dashboard/clients')
    return { data: client }
  } catch (error) {
    console.error('Error creating client:', error)
    return { error: 'Erreur lors de la création du client' }
  }
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validation = updateClientSchema.safeParse(input)
  if (!validation.success) {
    return {
      error: 'Données invalides',
      fieldErrors: validation.error.flatten().fieldErrors
    }
  }

  try {
    const client = await prisma.client.update({
      where: {
        id,
        businessId: session.user.businessId, // Tenant isolation
      },
      data: validation.data,
    })

    revalidatePath('/dashboard/clients')
    return { data: client }
  } catch (error) {
    console.error('Error updating client:', error)
    return { error: 'Erreur lors de la mise à jour du client' }
  }
}

export async function deleteClient(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  try {
    await prisma.client.delete({
      where: {
        id,
        businessId: session.user.businessId,
      },
    })

    revalidatePath('/dashboard/clients')
    return { success: true }
  } catch (error) {
    console.error('Error deleting client:', error)
    return { error: 'Erreur lors de la suppression du client' }
  }
}
