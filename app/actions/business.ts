"use server";

import prisma from "@/lib/prisma";
import {
  updateBusinessSchema,
  type UpdateBusinessInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { successResult, errorResult } from "@/lib/action-types";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import { sanitizeObject } from "@/lib/security";

export const getBusinessInfo = withAuth(
  async (_input: void, session) => {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    return successResult(business);
  },
  "getBusinessInfo",
  "Erreur lors de la récupération des informations"
);

export const updateBusiness = withAuthAndValidation(
  async (input: UpdateBusinessInput, session) => {
    const sanitized = sanitizeObject(input);

    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: sanitized,
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  },
  "updateBusiness",
  updateBusinessSchema,
  "Erreur lors de la mise à jour"
);

export const uploadBusinessLogo = withAuth(
  async (input: { logoData: string }, session) => {
    const { logoData } = input;

    // Valider que c'est bien une data URL d'image
    if (!logoData.startsWith("data:image/")) {
      return errorResult("Format d'image invalide", "INVALID_FORMAT");
    }

    // Limiter la taille (5MB en base64 ≈ 3.75MB original)
    if (logoData.length > 5 * 1024 * 1024) {
      return errorResult("L'image est trop volumineuse (max 5MB)", "FILE_TOO_LARGE");
    }

    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: { logo: logoData },
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  },
  "uploadBusinessLogo",
  "Erreur lors de l'upload du logo"
);

export const deleteBusinessLogo = withAuth(
  async (_input: void, session) => {
    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: { logo: null },
    });

    revalidatePath("/dashboard/parametres");
    return successResult(business);
  },
  "deleteBusinessLogo"
);
