"use server";

import prisma from "@/lib/prisma";
import {
  createServiceSchema,
  updateServiceSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
} from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import type { Service } from "@prisma/client";

export async function getServices(): Promise<ActionResult<Service[]>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const services = await prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResult(services);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getServices", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching services:", error);
    }

    return errorResult("Erreur lors de la récupération des services");
  }
}

export async function createService(input: CreateServiceInput): Promise<ActionResult<Service>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createServiceSchema.safeParse(sanitized);
  if (!validation.success) {
    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    const service = await prisma.service.create({
      data: {
        ...validation.data,
        businessId,
      },
    });

    // Audit log pour cohérence avec createClient et createQuote
    await auditLog({
      action: AuditAction.SERVICE_CREATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: service.id,
      resourceType: "Service",
      metadata: {
        name: service.name,
        price: service.price,
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(service);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createService", businessId },
      extra: { input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error creating service:", error);
    }

    return errorResult("Erreur lors de la création du service");
  }
}

export async function updateService(id: string, input: UpdateServiceInput): Promise<ActionResult<Service>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = updateServiceSchema.safeParse(sanitized);
  if (!validation.success) {
    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    const service = await prisma.service.update({
      where: {
        id,
        businessId,
      },
      data: validation.data,
    });

    revalidatePath("/dashboard/services");
    return successResult(service);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateService", businessId },
      extra: { serviceId: id, input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating service:", error);
    }

    return errorResult("Erreur lors de la mise à jour du service");
  }
}

export async function deleteService(id: string): Promise<ActionResult<void>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId, userId } = validatedSession;

  try {
    // Récupérer les infos avant suppression
    const service = await prisma.service.findFirst({
      where: {
        id,
        businessId,
      },
      select: { name: true, price: true },
    });

    if (!service) {
      return errorResult("Service introuvable", "NOT_FOUND");
    }

    await prisma.service.update({
      where: {
        id,
        businessId,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await auditLog({
      action: AuditAction.SERVICE_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: id,
      resourceType: "Service",
      metadata: {
        name: service.name,
        price: service.price,
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(undefined);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteService", businessId },
      extra: { serviceId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting service:", error);
    }

    return errorResult("Erreur lors de la suppression du service");
  }
}
