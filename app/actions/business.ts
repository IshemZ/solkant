"use server";

import prisma from "@/lib/prisma";
import {
  updateBusinessSchema,
  type UpdateBusinessInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { withAuth, withAuthAndValidation } from "@/lib/action-wrapper";
import type { Business } from "@prisma/client";
import { z } from "zod";
import { BusinessError } from "@/lib/errors";

/**
 * Récupère les informations du business
 */
export const getBusinessInfo = withAuth(
  async (_input: Record<string, never>, session) => {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    return business;
  },
  "getBusinessInfo"
);

/**
 * Met à jour les informations du business
 */
export const updateBusiness = withAuthAndValidation(
  async (input: UpdateBusinessInput, session) => {
    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: input,
    });

    revalidatePath("/dashboard/parametres");
    return business;
  },
  "updateBusiness",
  updateBusinessSchema
);

/**
 * Upload le logo du business (data URL base64)
 */
export const uploadBusinessLogo = withAuthAndValidation(
  async (input: { logoData: string }, session) => {
    // Valider que c'est bien une data URL d'image
    if (!input.logoData.startsWith("data:image/")) {
      throw new BusinessError("Format d'image invalide");
    }

    // Limiter la taille (5MB en base64 ≈ 3.75MB original)
    if (input.logoData.length > 5 * 1024 * 1024) {
      throw new BusinessError("L'image est trop volumineuse (max 5MB)");
    }

    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: { logo: input.logoData },
    });

    revalidatePath("/dashboard/parametres");
    return business;
  },
  "uploadBusinessLogo",
  z.object({
    logoData: z.string().min(1, "Logo requis"),
  })
);

/**
 * Supprime le logo du business
 */
export const deleteBusinessLogo = withAuth(
  async (_input: Record<string, never>, session) => {
    const business = await prisma.business.update({
      where: { id: session.businessId },
      data: { logo: null },
    });

    revalidatePath("/dashboard/parametres");
    return business;
  },
  "deleteBusinessLogo"
);
