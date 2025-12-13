"use server";

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
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import type { Client } from "@prisma/client";

export async function getClients(): Promise<ActionResult<Client[]>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const clients = await prisma.client.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return successResult(clients);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getClients", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching clients:", error);
    }

    return errorResult("Erreur lors de la récupération des clients");
  }
}

export async function createClient(input: CreateClientInput): Promise<ActionResult<Client>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createClientSchema.safeParse(sanitized);
  if (!validation.success) {
    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    const client = await prisma.client.create({
      data: {
        ...validation.data,
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
    return successResult(client);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createClient", businessId },
      extra: { input: sanitized },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error creating client:", error);
    }

    return errorResult("Erreur lors de la création du client");
  }
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<ActionResult<Client>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = updateClientSchema.safeParse(sanitized);
  if (!validation.success) {
    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    const client = await prisma.client.update({
      where: {
        id,
        businessId, // Tenant isolation
      },
      data: validation.data,
    });

    revalidatePath("/dashboard/clients");
    return successResult(client);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateClient", businessId },
      extra: { clientId: id, input: sanitized },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating client:", error);
    }

    return errorResult("Erreur lors de la mise à jour du client");
  }
}

export async function deleteClient(id: string): Promise<ActionResult<void>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  try {
    // Récupérer les infos avant suppression
    const client = await prisma.client.findFirst({
      where: {
        id,
        businessId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!client) {
      return errorResult("Client introuvable", "NOT_FOUND");
    }

    await prisma.client.delete({
      where: {
        id,
        businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
    return successResult(undefined);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteClient", businessId },
      extra: { clientId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting client:", error);
    }

    return errorResult("Erreur lors de la suppression du client");
  }
}
