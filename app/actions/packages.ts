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
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { z } from "zod";

type PackageWithRelations = Package & {
  items: (PackageItem & { service: Service | null })[];
};

// Convert Prisma Decimal fields to plain numbers for safe serialization
function serializePackage(
  pkg: Package & { items: (PackageItem & { service: Service | null })[] }
) {
  const items = pkg.items || [];
  return {
    ...pkg,
    discountValue: Number((pkg as unknown as { discountValue: number }).discountValue),
    items: items.map((item) => ({
      ...item,
      service: item.service
        ? {
            ...item.service,
            price: Number((item.service as unknown as { price: number }).price),
          }
        : null,
    })),
  } as unknown as PackageWithRelations;
}

/**
 * Get all active packages for the current business
 */
export const getPackages = withAuth(
  async (_input: Record<string, never>, session) => {
    const packages = await prisma.package.findMany({
      where: {
        businessId: session.businessId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return packages.map((p) => serializePackage(p));
  },
  "getPackages"
);

/**
 * Get a single package by ID
 */
export const getPackageById = withAuthAndValidation(
  async (input: { id: string }, session) => {
    const packageData = await prisma.package.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!packageData) {
      throw new Error("Forfait introuvable");
    }

    return serializePackage(packageData);
  },
  "getPackageById",
  z.object({ id: z.string() })
);

/**
 * Create a new package
 */
export const createPackage = withAuthAndValidation(
  async (input: CreatePackageInput, session) => {
    const { items, ...packageData } = input;

    // Verify all services exist and belong to the business
    const serviceIds = items.map((item) => item.serviceId);
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        businessId: session.businessId,
        isActive: true,
      },
    });

    if (services.length !== serviceIds.length) {
      throw new Error("Un ou plusieurs services sont invalides ou inactifs");
    }

    // Create package and items in a transaction
    const newPackage = await prisma.package.create({
      data: {
        ...packageData,
        businessId: session.businessId,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/services");
    return serializePackage(newPackage);
  },
  "createPackage",
  createPackageSchema
);

/**
 * Update an existing package
 */
export const updatePackage = withAuthAndValidation(
  async (input: { id: string } & UpdatePackageInput, session) => {
    const { id, items, ...packageData } = input;

    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id,
        businessId: session.businessId,
      },
    });

    if (!existingPackage) {
      throw new Error("Forfait introuvable");
    }

    // Update package in transaction
    const updatedPackage = await prisma.$transaction(async (tx) => {
      // If items are being updated, delete old ones and create new ones
      if (items) {
        // Verify all services exist and belong to the business
        const serviceIds = items.map((item) => item.serviceId);
        const services = await tx.service.findMany({
          where: {
            id: { in: serviceIds },
            businessId: session.businessId,
            isActive: true,
          },
        });

        if (services.length !== serviceIds.length) {
          throw new Error(
            "Un ou plusieurs services sont invalides ou inactifs"
          );
        }

        // Delete existing items
        await tx.packageItem.deleteMany({
          where: { packageId: id },
        });

        // Create new items
        await tx.packageItem.createMany({
          data: items.map((item) => ({
            ...item,
            packageId: id,
          })),
        });
      }

      // Update package data
      return tx.package.update({
        where: { id },
        data: packageData,
        include: {
          items: {
            include: {
              service: true,
            },
          },
        },
      });
    });

    revalidatePath("/dashboard/services");
    return serializePackage(updatedPackage);
  },
  "updatePackage",
  z.object({ id: z.string() }).and(updatePackageSchema)
);

/**
 * Soft delete a package
 */
export const deletePackage = withAuth(
  async (input: { id: string }, session) => {
    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
    });

    if (!existingPackage) {
      throw new Error("Forfait introuvable");
    }

    // Soft delete
    await prisma.package.update({
      where: { id: input.id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/services");
    return { id: input.id };
  },
  "deletePackage",
  { logSuccess: true }
);
