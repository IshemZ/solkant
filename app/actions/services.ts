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
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import type { Service } from "@prisma/client";
import { z } from "zod";

/**
 * Récupère tous les services actifs du business
 */
export const getServices = withAuth(
  async (_input: Record<string, never>, session) => {
    const services = await prisma.service.findMany({
      where: {
        businessId: session.businessId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return services;
  },
  "getServices"
);

/**
 * Crée un nouveau service
 */
export const createService = withAuthAndValidation(
  async (input: CreateServiceInput, session) => {
    const { businessId, userId } = session;

    const service = await prisma.service.create({
      data: {
        ...input,
        businessId,
      },
    });

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
    return service;
  },
  "createService",
  createServiceSchema
);

/**
 * Met à jour un service existant
 */
export const updateService = withAuthAndValidation(
  async (input: { id: string } & UpdateServiceInput, session) => {
    const { id, ...data } = input;

    const service = await prisma.service.update({
      where: {
        id,
        businessId: session.businessId,
      },
      data,
    });

    revalidatePath("/dashboard/services");
    return service;
  },
  "updateService",
  z.object({ id: z.string() }).and(updateServiceSchema)
);

/**
 * Archive un service (soft delete)
 */
export const deleteService = withAuth(
  async (input: { id: string }, session) => {
    const { businessId, userId } = session;

    // Récupérer les infos avant archivage
    const service = await prisma.service.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      select: { name: true, price: true },
    });

    if (!service) {
      throw new Error("Service introuvable");
    }

    await prisma.service.update({
      where: {
        id: input.id,
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
      resourceId: input.id,
      resourceType: "Service",
      metadata: {
        name: service.name,
        price: service.price,
      },
    });

    revalidatePath("/dashboard/services");
  },
  "deleteService",
  { logSuccess: true }
);

/**
 * Interface pour service avec compteur de devis
 */
interface ServiceWithQuoteCount extends Service {
  quoteCount: number;
}

/**
 * Récupère les services les plus utilisés (top 10)
 */
export const getTopServices = withAuth(
  async (_input: Record<string, never>, session) => {
    const { businessId } = session;

    // Use raw SQL to efficiently count quotes per service with multi-tenant security
    const result = await prisma.$queryRaw<
      Array<{ serviceId: string; quoteCount: bigint }>
    >`
      SELECT
        qi."serviceId",
        COUNT(DISTINCT qi."quoteId") AS "quoteCount"
      FROM "quote_items" qi
      INNER JOIN "quotes" q ON qi."quoteId" = q."id"
      WHERE q."businessId" = ${businessId} AND qi."serviceId" IS NOT NULL
      GROUP BY qi."serviceId"
      ORDER BY "quoteCount" DESC
      LIMIT 10
    `;

    // Fetch the top services with their quote counts
    const serviceIds = result.map((r) => r.serviceId);

    if (serviceIds.length === 0) {
      return [];
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        businessId,
        isActive: true,
      },
    });

    // Merge quote counts with services
    const serviceCounts = new Map(
      result.map((r) => [r.serviceId, Number(r.quoteCount)])
    );

    const servicesWithCounts: ServiceWithQuoteCount[] = services.map(
      (service) => ({
        ...service,
        quoteCount: serviceCounts.get(service.id) || 0,
      })
    );

    // Sort by quote count descending
    servicesWithCounts.sort((a, b) => b.quoteCount - a.quoteCount);

    return servicesWithCounts;
  },
  "getTopServices"
);
