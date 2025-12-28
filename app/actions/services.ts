"use server";

import prisma from "@/lib/prisma";
import {
  createServiceSchema,
  updateServiceSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { successResult, type ActionResult } from "@/lib/action-types";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { sanitizeObject } from "@/lib/security";
import { z } from "zod";

export const getServices = withAuth(
  async (
    _input: void,
    session
  ): Promise<ActionResult<import("@/types/quote").SerializedService[]>> => {
    const services = await prisma.service.findMany({
      where: {
        businessId: session.businessId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResult(
      serializeDecimalFields(
        services
      ) as unknown as import("@/types/quote").SerializedService[]
    );
  },
  "getServices"
);

export const createService = withAuthAndValidation(
  async (input: CreateServiceInput, session) => {
    const sanitized = sanitizeObject(input);

    const service = await prisma.service.create({
      data: {
        ...sanitized,
        businessId: session.businessId,
      },
    });

    await auditLog({
      action: AuditAction.SERVICE_CREATED,
      level: AuditLevel.INFO,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: service.id,
      resourceType: "Service",
      metadata: {
        name: service.name,
        price: service.price,
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(serializeDecimalFields(service));
  },
  "createService",
  createServiceSchema
);

export const updateService = withAuthAndValidation(
  async (input: UpdateServiceInput & { id: string }, session) => {
    const sanitized = sanitizeObject(input);
    const { id, ...data } = sanitized;

    const service = await prisma.service.update({
      where: {
        id,
        businessId: session.businessId,
      },
      data,
    });

    revalidatePath("/dashboard/services");
    return successResult(serializeDecimalFields(service));
  },
  "updateService",
  updateServiceSchema.extend({ id: z.string().min(1) })
);

export const deleteService = withAuth(
  async (input: { id: string }, session) => {
    // Récupérer les infos avant suppression
    const service = await prisma.service.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      select: { name: true, price: true },
    });

    if (!service) {
      throw new Error("Service introuvable");
    }

    await prisma.service.update({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await auditLog({
      action: AuditAction.SERVICE_DELETED,
      level: AuditLevel.CRITICAL,
      userId: session.userId,
      businessId: session.businessId,
      resourceId: input.id,
      resourceType: "Service",
      metadata: {
        name: service.name,
        price: service.price,
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(undefined);
  },
  "deleteService"
);
