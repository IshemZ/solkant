"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  createPackageSchema,
  updatePackageSchema,
  type CreatePackageInput,
  type UpdatePackageInput,
} from "@/lib/validations";
import type { Package, PackageItem, Service } from "@prisma/client";
import { successResult, errorResult, type ActionResult } from "@/lib/action-types";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { sanitizeObject } from "@/lib/security";
import { z } from "zod";
import type { SerializedPackage } from "@/types/quote";

export type PackageWithRelations = Package & {
  items: (PackageItem & { service: Service | null })[];
};

// Convert Prisma Decimal fields to plain numbers for safe serialization
function serializePackage(
  pkg: Package & { items: (PackageItem & { service: Service | null })[] }
): SerializedPackage {
  return serializeDecimalFields(pkg) as unknown as SerializedPackage;
}

/**
 * Get all active packages for the current business
 */
export const getPackages = withAuth(
  async (_input: void, session): Promise<ActionResult<SerializedPackage[]>> => {
    const packages = await prisma.package.findMany({
      where: {
        businessId: session.businessId,
        isActive: true,
      },
      include: {
        items: {
          include: { service: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const serialized = packages.map((p) => serializePackage(p));
    return successResult(serialized);
  },
  "getPackages"
);

/**
 * Get a single package by ID
 */
export const getPackageById = withAuth(
  async (input: { id: string }, session): Promise<ActionResult<SerializedPackage>> => {
    const packageData = await prisma.package.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    });

    if (!packageData) {
      return errorResult("Forfait introuvable", "NOT_FOUND");
    }

    return successResult(serializePackage(packageData));
  },
  "getPackageById"
);

/**
 * Create a new package
 */
export const createPackage = withAuthAndValidation(
  async (input: CreatePackageInput, session) => {
    const sanitized = sanitizeObject(input);
    const { items, ...packageData } = sanitized;

    const pkg = await prisma.package.create({
      data: {
        ...packageData,
        businessId: session.businessId,
        items: {
          create: items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(serializePackage(pkg));
  },
  "createPackage",
  createPackageSchema
);

/**
 * Update an existing package
 */
export const updatePackage = withAuthAndValidation(
  async (input: UpdatePackageInput & { id: string }, session) => {
    const sanitized = sanitizeObject(input);
    const { id, items, ...packageData } = sanitized;

    // Delete existing items and create new ones
    await prisma.packageItem.deleteMany({
      where: { packageId: id },
    });

    const pkg = await prisma.package.update({
      where: {
        id,
        businessId: session.businessId,
      },
      data: {
        ...packageData,
        items: items ? {
          create: items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
          })),
        } : undefined,
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    });

    revalidatePath("/dashboard/services");
    return successResult(serializePackage(pkg));
  },
  "updatePackage",
  updatePackageSchema.extend({ id: z.string().min(1) })
);

/**
 * Soft delete a package
 */
export const deletePackage = withAuth(
  async (input: { id: string }, session) => {
    await prisma.package.update({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/services");
    return successResult({ id: input.id });
  },
  "deletePackage"
);
