"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  updateBusinessSchema,
  type UpdateBusinessInput,
} from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";

export async function getBusinessInfo() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: session.user.businessId },
    });

    return { data: business };
  } catch (error) {
    console.error("Error fetching business:", error);
    return { error: "Erreur lors de la récupération des informations" };
  }
}

export async function updateBusiness(input: UpdateBusinessInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  // Validate input
  const validation = updateBusinessSchema.safeParse(sanitized);
  if (!validation.success) {
    console.error("Validation error:", validation.error.flatten());
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const business = await prisma.business.update({
      where: { id: session.user.businessId },
      data: validation.data,
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    console.error("Error updating business:", error);
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function uploadBusinessLogo(logoData: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // Valider que c'est bien une data URL d'image
  if (!logoData.startsWith("data:image/")) {
    return { error: "Format d'image invalide" };
  }

  // Limiter la taille (5MB en base64 ≈ 3.75MB original)
  if (logoData.length > 5 * 1024 * 1024) {
    return { error: "L'image est trop volumineuse (max 5MB)" };
  }

  try {
    const business = await prisma.business.update({
      where: { id: session.user.businessId },
      data: { logo: logoData },
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    console.error("Error uploading logo:", error);
    return { error: "Erreur lors de l'upload du logo" };
  }
}

export async function deleteBusinessLogo() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  try {
    const business = await prisma.business.update({
      where: { id: session.user.businessId },
      data: { logo: null },
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    console.error("Error deleting logo:", error);
    return { error: "Erreur lors de la suppression du logo" };
  }
}
