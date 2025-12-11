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

export async function getServices() {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

  try {
    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return { data: services };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getServices", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching services:", error);
    }

    return { error: "Erreur lors de la récupération des services" };
  }
}

export async function createService(input: CreateServiceInput) {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId, userId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = createServiceSchema.safeParse(sanitized);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
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
    return { data: service };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createService", businessId },
      extra: { input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error creating service:", error);
    }

    return { error: "Erreur lors de la création du service" };
  }
}

export async function updateService(id: string, input: UpdateServiceInput) {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  const validation = updateServiceSchema.safeParse(sanitized);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
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
    return { data: service };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateService", businessId },
      extra: { serviceId: id, input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating service:", error);
    }

    return { error: "Erreur lors de la mise à jour du service" };
  }
}

export async function deleteService(id: string) {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
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
      return { error: "Service introuvable" };
    }

    await prisma.service.delete({
      where: {
        id,
        businessId,
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
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteService", businessId },
      extra: { serviceId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting service:", error);
    }

    return { error: "Erreur lors de la suppression du service" };
  }
}
