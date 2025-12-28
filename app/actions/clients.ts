"use server";

import prisma from "@/lib/prisma";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "@/lib/validations";
import { z } from "zod";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { successResult, errorResult } from "@/lib/action-types";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { serializeDecimalFields } from "@/lib/decimal-utils";

export const getClients = withAuth(
  async (_input: void, session) => {
    const clients = await prisma.client.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: "desc" },
    });

    return successResult(serializeDecimalFields(clients));
  },
  "getClients"
);

export const createClient = withAuthAndValidation(
  async (input: CreateClientInput, session) => {
    const sanitized = sanitizeObject(input);

    const client = await prisma.client.create({
      data: {
        ...sanitized,
        businessId: session.businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_CREATED,
      level: AuditLevel.INFO,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: client.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return successResult(serializeDecimalFields(client));
  },
  "createClient",
  createClientSchema
);

export const updateClient = withAuthAndValidation(
  async (input: UpdateClientInput & { id: string }, session) => {
    const sanitized = sanitizeObject(input);
    const { id, ...data } = sanitized;

    const client = await prisma.client.update({
      where: {
        id,
        businessId: session.businessId,
      },
      data,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${id}`);
    return successResult(serializeDecimalFields(client));
  },
  "updateClient",
  updateClientSchema.extend({ id: z.string().min(1) })
);

export const deleteClient = withAuth(
  async (input: { id: string }, session) => {
    // Récupérer les infos avant suppression
    const client = await prisma.client.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!client) {
      throw new Error("Client introuvable");
    }

    await prisma.client.delete({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: input.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return successResult({ id: input.id });
  },
  "deleteClient"
);
