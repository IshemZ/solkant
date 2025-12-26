"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  createPackageSchema,
  updatePackageSchema,
  type CreatePackageInput,
  type UpdatePackageInput,
} from "@/lib/validations";
import { formatZodFieldErrors } from "@/lib/validations/helpers";
import type { Package, PackageItem, Service } from "@prisma/client";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import { serializeDecimalFields } from "@/lib/decimal-utils";
import { validateSessionWithEmail } from "@/lib/auth-helpers";
import * as Sentry from "@sentry/nextjs";

type PackageWithRelations = Package & {
  items: (PackageItem & { service: Service | null })[];
};

// Convert Prisma Decimal fields to plain numbers for safe serialization
function serializePackage(
  pkg: Package & { items: (PackageItem & { service: Service | null })[] }
) {
  return serializeDecimalFields(pkg) as PackageWithRelations;
}

/**
 * Get all active packages for the current business
 */
export async function getPackages(): Promise<
  ActionResult<PackageWithRelations[]>
> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const packages = await prisma.package.findMany({
      where: {
        businessId,
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

    const serialized = packages.map((p) => serializePackage(p));
    return successResult(serialized);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getPackages", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching packages:", error);
    }

    return errorResult("Erreur lors du chargement des forfaits");
  }
}

/**
 * Get a single package by ID
 */
export async function getPackageById(
  id: string
): Promise<ActionResult<PackageWithRelations>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const packageData = await prisma.package.findFirst({
      where: {
        id,
        businessId,
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
      return errorResult("Forfait introuvable", "NOT_FOUND");
    }

    return successResult(serializePackage(packageData));
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getPackageById", businessId },
      extra: { packageId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching package:", error);
    }

    return errorResult("Erreur lors du chargement du forfait");
  }
}

/**
 * Create a new package
 */
export async function createPackage(
  input: CreatePackageInput
): Promise<ActionResult<Package>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  // Validate input
  const validation = createPackageSchema.safeParse(input);
  if (!validation.success) {
    return errorResult(
      validation.error.issues[0]?.message || "Données invalides",
      "VALIDATION_ERROR",
      formatZodFieldErrors(validation.error)
    );
  }

  const { items, ...packageData } = validation.data;

  try {
    // Verify all services exist and belong to the business
    const serviceIds = items.map((item) => item.serviceId);
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        businessId,
        isActive: true,
      },
    });

    if (services.length !== serviceIds.length) {
      return errorResult(
        "Un ou plusieurs services sont invalides ou inactifs"
      );
    }

    // Create package and items in a transaction
    const newPackage = await prisma.package.create({
      data: {
        ...packageData,
        businessId,
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
    return successResult(serializePackage(newPackage));
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createPackage", businessId },
      extra: { input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error creating package:", error);
    }

    return errorResult("Erreur lors de la création du forfait");
  }
}

/**
 * Update an existing package
 */
export async function updatePackage(
  id: string,
  input: UpdatePackageInput
): Promise<ActionResult<Package>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  // Validate input
  const validation = updatePackageSchema.safeParse(input);
  if (!validation.success) {
    return errorResult(
      validation.error.issues[0]?.message || "Données invalides",
      "VALIDATION_ERROR",
      formatZodFieldErrors(validation.error)
    );
  }

  try {
    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!existingPackage) {
      return errorResult("Forfait introuvable", "NOT_FOUND");
    }

    const { items, ...packageData } = validation.data;

    // Update package in transaction
    const updatedPackage = await prisma.$transaction(async (tx) => {
      // If items are being updated, delete old ones and create new ones
      if (items) {
        // Verify all services exist and belong to the business
        const serviceIds = items.map((item) => item.serviceId);
        const services = await tx.service.findMany({
          where: {
            id: { in: serviceIds },
            businessId,
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
    return successResult(serializePackage(updatedPackage));
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updatePackage", businessId },
      extra: { packageId: id, input },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating package:", error);
    }

    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la mise à jour du forfait";
    return errorResult(message);
  }
}

/**
 * Soft delete a package
 */
export async function deletePackage(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!existingPackage) {
      return errorResult("Forfait introuvable", "NOT_FOUND");
    }

    // Soft delete
    await prisma.package.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/services");
    return successResult({ id });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deletePackage", businessId },
      extra: { packageId: id },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting package:", error);
    }

    return errorResult("Erreur lors de l'archivage du forfait");
  }
}
