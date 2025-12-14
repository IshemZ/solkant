import { z } from "zod";

export const packageItemSchema = z.object({
  serviceId: z.string().cuid("ID de service invalide"),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
});

export const createPackageSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"], {
    errorMap: () => ({ message: "Type de réduction invalide" }),
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

export const updatePackageSchema = createPackageSchema.partial().extend({
  items: z
    .array(packageItemSchema)
    .min(1, "Vous devez ajouter au moins un service")
    .optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
export type PackageItemInput = z.infer<typeof packageItemSchema>;
