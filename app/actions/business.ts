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
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import type { Business } from "@prisma/client";

export async function getBusinessInfo(): Promise<ActionResult<Business | null>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    return successResult(business);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getBusinessInfo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching business:", error);
    }

    return errorResult("Erreur lors de la récupération des informations");
  }
}

export async function updateBusiness(input: UpdateBusinessInput): Promise<ActionResult<Business>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
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

    return errorResult("Données invalides", "VALIDATION_ERROR");
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: validation.data,
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "updateBusiness", businessId },
      extra: { input: sanitized },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error updating business:", error);
    }

    return errorResult("Erreur lors de la mise à jour");
  }
}

export async function uploadBusinessLogo(logoData: string): Promise<ActionResult<Business>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  // Valider que c'est bien une data URL d'image
  if (!logoData.startsWith("data:image/")) {
    return errorResult("Format d'image invalide", "INVALID_FORMAT");
  }

  // Limiter la taille (5MB en base64 ≈ 3.75MB original)
  if (logoData.length > 5 * 1024 * 1024) {
    return errorResult("L'image est trop volumineuse (max 5MB)", "FILE_TOO_LARGE");
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { logo: logoData },
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "uploadBusinessLogo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error uploading logo:", error);
    }

    return errorResult("Erreur lors de l'upload du logo");
  }
}

export async function deleteBusinessLogo(): Promise<ActionResult<Business>> {
  const validatedSession = await validateSessionWithEmail();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { logo: null },
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "deleteBusinessLogo", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting logo:", error);
    }

    return errorResult("Erreur lors de la suppression du logo");
  }
}
