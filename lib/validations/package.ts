import { z } from "zod";

/**
 * Schema for a package item (service + quantity)
 */
export const packageItemSchema = z.object({
  serviceId: z.string().regex(/^c[a-z0-9]{24}$/, "ID de service invalide"),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
});

/**
 * Schema for creating a new package
 */
export const createPackageSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  description: z.string().trim().nullable().optional(),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"], {
    message: "Type de réduction invalide",
  }),
  discountValue: z.number().min(0, "La réduction ne peut pas être négative"),
  items: z
    .array(packageItemSchema)
    .min(1, "Vous devez ajouter au moins un service"),
}).refine(
  (data) => {
    if (data.discountType === "PERCENTAGE") {
      return data.discountValue >= 0 && data.discountValue <= 100;
    }
    return true;
  },
  {
    message: "Le pourcentage doit être entre 0 et 100",
    path: ["discountValue"],
  }
);

/**
 * Schema for updating an existing package
 */
export const updatePackageSchema = createPackageSchema.partial().extend({
  items: z
    .array(packageItemSchema)
    .min(1, "Vous devez ajouter au moins un service")
    .optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
export type PackageItemInput = z.infer<typeof packageItemSchema>;
