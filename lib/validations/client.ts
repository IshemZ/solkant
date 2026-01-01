import { z } from "zod";

/**
 * Schéma de validation pour la création d'un Client
 */
export const createClientSchema = z.object({
  firstName: z
    .string({ message: "Le prénom est requis" })
    .trim()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string({ message: "Le nom est requis" })
    .trim()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .email("Format d'email invalide")
    .optional()
    .nullable(),
  phone: z
    .string()
    .trim()
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone invalide (format français attendu)"
    )
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(255, "L'adresse ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  // NEW - structured address fields
  rue: z
    .string()
    .trim()
    .min(1, "La rue est requise")
    .max(255, "La rue ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  complement: z
    .string()
    .trim()
    .max(255, "Le complément d'adresse ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  codePostal: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
    .optional()
    .nullable(),
  ville: z
    .string()
    .trim()
    .min(1, "La ville est requise")
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(5000, "Les notes ne peuvent pas dépasser 5000 caractères")
    .optional()
    .nullable(),
});

/**
 * Schéma de validation pour la mise à jour d'un Client
 * Tous les champs sont optionnels
 */
export const updateClientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .email("Format d'email invalide")
    .optional()
    .nullable(),
  phone: z
    .string()
    .trim()
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone invalide (format français attendu)"
    )
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(255, "L'adresse ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  // NEW - structured address fields
  rue: z
    .string()
    .trim()
    .min(1, "La rue est requise")
    .max(255, "La rue ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  complement: z
    .string()
    .trim()
    .max(255, "Le complément d'adresse ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  codePostal: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
    .optional()
    .nullable(),
  ville: z
    .string()
    .trim()
    .min(1, "La ville est requise")
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(5000, "Les notes ne peuvent pas dépasser 5000 caractères")
    .optional()
    .nullable(),
});

/**
 * Type inféré pour la création d'un Client
 */
export type CreateClientInput = z.infer<typeof createClientSchema>;

/**
 * Type inféré pour la mise à jour d'un Client
 */
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

/**
 * Type for client creation result with analytics flag
 */
export interface CreateClientResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  rue: string | null;
  complement: string | null;
  codePostal: string | null;
  ville: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
  isFirstClient?: boolean;
}
