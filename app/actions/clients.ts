"use server";

import prisma from "@/lib/prisma";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { z } from "zod";

/**
 * Récupère tous les clients du business
 */
export const getClients = withAuth(
  async (_input: Record<string, never>, session) => {
    const clients = await prisma.client.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: "desc" },
    });

    return clients;
  },
  "getClients"
);

/**
 * Crée un nouveau client
 */
export const createClient = withAuthAndValidation(
  async (input: CreateClientInput, session) => {
    const { businessId, userId } = session;

    const client = await prisma.client.create({
      data: {
        ...input,
        businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_CREATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: client.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return client;
  },
  "createClient",
  createClientSchema
);

/**
 * Met à jour un client existant
 */
export const updateClient = withAuthAndValidation(
  async (input: { id: string } & UpdateClientInput, session) => {
    const { id, ...data } = input;

    const client = await prisma.client.update({
      where: {
        id,
        businessId: session.businessId,
      },
      data,
    });

    revalidatePath("/dashboard/clients");
    return client;
  },
  "updateClient",
  z.object({ id: z.string() }).and(updateClientSchema)
);

/**
 * Supprime un client
 */
export const deleteClient = withAuth(
  async (input: { id: string }, session) => {
    const { businessId, userId } = session;

    // Récupérer les infos avant suppression
    const client = await prisma.client.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!client) {
      throw new Error("Client introuvable");
    }

    await prisma.client.delete({
      where: {
        id: input.id,
        businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: input.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
  },
  "deleteClient",
  { logSuccess: true } // Log deletions in Sentry
);
