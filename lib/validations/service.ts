import { z } from "zod";

/**
 * Schéma de validation pour la création d'un Service
 */
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du service est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim(),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .trim()
    .optional()
    .nullable(),
  price: z
    .number("Le prix doit être un nombre")
    .min(0, "Le prix ne peut pas être négatif")
    .max(999999.99, "Le prix ne peut pas dépasser 999 999,99 €")
    .multipleOf(0.01, "Le prix doit avoir au maximum 2 décimales"),
  duration: z
    .number("La durée doit être un nombre")
    .int("La durée doit être un nombre entier")
    .min(1, "La durée doit être d'au moins 1 minute")
    .max(1440, "La durée ne peut pas dépasser 1440 minutes (24 heures)")
    .optional()
    .nullable(),
  category: z
    .string()
    .max(50, "La catégorie ne peut pas dépasser 50 caractères")
    .trim()
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
});

/**
 * Schéma de validation pour la mise à jour d'un Service
 * Tous les champs sont optionnels
 */
export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .trim()
    .optional()
    .nullable(),
  price: z
    .number("Le prix doit être un nombre")
    .min(0, "Le prix ne peut pas être négatif")
    .max(999999.99, "Le prix ne peut pas dépasser 999 999,99 €")
    .multipleOf(0.01, "Le prix doit avoir au maximum 2 décimales")
    .optional(),
  duration: z
    .number("La durée doit être un nombre")
    .int("La durée doit être un nombre entier")
    .min(1, "La durée doit être d'au moins 1 minute")
    .max(1440, "La durée ne peut pas dépasser 1440 minutes (24 heures)")
    .optional()
    .nullable(),
  category: z
    .string()
    .max(50, "La catégorie ne peut pas dépasser 50 caractères")
    .trim()
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

/**
 * Liste des catégories de services prédéfinies
 */
export const serviceCategories = [
  "Soins visage",
  "Épilation",
  "Manucure",
  "Pédicure",
  "Maquillage",
  "Massage",
  "Soins corps",
  "Extension de cils",
  "Autre",
] as const;

/**
 * Type pour les catégories de services
 */
export type ServiceCategory = (typeof serviceCategories)[number];

/**
 * Type inféré pour la création d'un Service
 */
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

/**
 * Type inféré pour la mise à jour d'un Service
 */
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
