"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";

export async function getClients() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    const clients = await prisma.client.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: "desc" },
    });

    return { data: clients };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getClients", businessId: session.user.businessId },
    });
    console.error("Error fetching clients:", error);
    return { error: "Erreur lors de la récupération des clients" };
  }
}

export async function createClient(input: CreateClientInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createClientSchema.safeParse(sanitized);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validation.data,
        businessId: session.user.businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_CREATED,
      level: AuditLevel.INFO,
      userId: session.user.id,
      businessId: session.user.businessId,
      resourceId: client.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return { data: client };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createClient", businessId: session.user.businessId },
      extra: { input: sanitized },
    });
    console.error("Error creating client:", error);
    return { error: "Erreur lors de la création du client" };
  }
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = updateClientSchema.safeParse(sanitized);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const client = await prisma.client.update({
      where: {
        id,
        businessId: session.user.businessId, // Tenant isolation
      },
      data: validation.data,
    });

    revalidatePath("/dashboard/clients");
    return { data: client };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateClient", businessId: session.user.businessId },
      extra: { clientId: id, input: sanitized },
    });
    console.error("Error updating client:", error);
    return { error: "Erreur lors de la mise à jour du client" };
  }
}

export async function deleteClient(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    // Récupérer les infos avant suppression
    const client = await prisma.client.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!client) {
      return { error: "Client introuvable" };
    }

    await prisma.client.delete({
      where: {
        id,
        businessId: session.user.businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId: session.user.id,
      businessId: session.user.businessId,
      resourceId: id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteClient", businessId: session.user.businessId },
      extra: { clientId: id },
    });
    console.error("Error deleting client:", error);
    return { error: "Erreur lors de la suppression du client" };
  }
}
