"use server";

import prisma from "@/lib/prisma";
import {
  updateBusinessSchema,
  type UpdateBusinessInput,
} from "@/lib/validations";
import { sanitizeObject } from "@/lib/security";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { validateSessionWithEmail } from "@/lib/auth-helpers";

export async function getBusinessInfo() {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    return { data: business };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getBusinessInfo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching business:", error);
    }

    return { error: "Erreur lors de la récupération des informations" };
  }
}

export async function updateBusiness(input: UpdateBusinessInput) {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

  // Sanitize input before validation
  const sanitized = sanitizeObject(input);

  // Validate input
  const validation = updateBusinessSchema.safeParse(sanitized);
  if (!validation.success) {
    if (process.env.NODE_ENV === "development") {
      console.error("Validation error:", validation.error.flatten());
    }

    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: validation.data,
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateBusiness", businessId },
      extra: { input: sanitized },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating business:", error);
    }

    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function uploadBusinessLogo(logoData: string) {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

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
      where: { id: businessId },
      data: { logo: logoData },
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "uploadBusinessLogo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error uploading logo:", error);
    }

    return { error: "Erreur lors de l'upload du logo" };
  }
}

export async function deleteBusinessLogo() {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return validatedSession;
  }

  const { businessId } = validatedSession;

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { logo: null },
    });

    revalidatePath("/dashboard/parametres");
    return { data: business };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteBusinessLogo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting logo:", error);
    }

    return { error: "Erreur lors de la suppression du logo" };
  }
}
