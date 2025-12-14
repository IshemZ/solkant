"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createPackageSchema,
  updatePackageSchema,
  type CreatePackageInput,
  type UpdatePackageInput,
} from "@/lib/validations";
import type { Package, PackageItem, Service } from "@prisma/client";

type PackageWithRelations = Package & {
  items: (PackageItem & { service: Service | null })[];
};

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Get all active packages for the current business
 */
export async function getPackages(): Promise<ActionResult<PackageWithRelations[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) {
      return { success: false, error: "Non autorisé" };
    }

    const packages = await prisma.package.findMany({
      where: {
        businessId: session.user.businessId,
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

    return { success: true, data: packages };
  } catch (error) {
    console.error("Error fetching packages:", error);
    return { success: false, error: "Erreur lors du chargement des forfaits" };
  }
}

/**
 * Get a single package by ID
 */
export async function getPackageById(
  id: string
): Promise<ActionResult<PackageWithRelations>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) {
      return { success: false, error: "Non autorisé" };
    }

    const packageData = await prisma.package.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
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
      return { success: false, error: "Forfait introuvable" };
    }

    return { success: true, data: packageData };
  } catch (error) {
    console.error("Error fetching package:", error);
    return { success: false, error: "Erreur lors du chargement du forfait" };
  }
}

/**
 * Create a new package
 */
export async function createPackage(
  input: CreatePackageInput
): Promise<ActionResult<Package>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) {
      return { success: false, error: "Non autorisé" };
    }

    // Validate input
    const validation = createPackageSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Données invalides",
      };
    }

    const { items, ...packageData } = validation.data;

    // Verify all services exist and belong to the business
    const serviceIds = items.map((item) => item.serviceId);
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        businessId: session.user.businessId,
        isActive: true,
      },
    });

    if (services.length !== serviceIds.length) {
      return {
        success: false,
        error: "Un ou plusieurs services sont invalides ou inactifs",
      };
    }

    // Create package and items in a transaction
    const newPackage = await prisma.package.create({
      data: {
        ...packageData,
        businessId: session.user.businessId,
        items: {
          create: items,
        },
      },
    });

    revalidatePath("/dashboard/services");
    return { success: true, data: newPackage };
  } catch (error) {
    console.error("Error creating package:", error);
    return { success: false, error: "Erreur lors de la création du forfait" };
  }
}

/**
 * Update an existing package
 */
export async function updatePackage(
  id: string,
  input: UpdatePackageInput
): Promise<ActionResult<Package>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) {
      return { success: false, error: "Non autorisé" };
    }

    // Validate input
    const validation = updatePackageSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Données invalides",
      };
    }

    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
    });

    if (!existingPackage) {
      return { success: false, error: "Forfait introuvable" };
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
            businessId: session.user.businessId!,
            isActive: true,
          },
        });

        if (services.length !== serviceIds.length) {
          throw new Error("Un ou plusieurs services sont invalides ou inactifs");
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
      });
    });

    revalidatePath("/dashboard/services");
    return { success: true, data: updatedPackage };
  } catch (error) {
    console.error("Error updating package:", error);
    const message =
      error instanceof Error ? error.message : "Erreur lors de la mise à jour du forfait";
    return { success: false, error: message };
  }
}

/**
 * Soft delete a package
 */
export async function deletePackage(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) {
      return { success: false, error: "Non autorisé" };
    }

    // Check package exists and belongs to business
    const existingPackage = await prisma.package.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
    });

    if (!existingPackage) {
      return { success: false, error: "Forfait introuvable" };
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
    return { success: true, data: { id } };
  } catch (error) {
    console.error("Error deleting package:", error);
    return { success: false, error: "Erreur lors de la suppression du forfait" };
  }
}
