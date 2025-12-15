import { z } from "zod";

/**
 * Schéma de validation pour la création d'un Business
 */
export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom de l'institut est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim(),
  address: z
    .string()
    .max(255, "L'adresse ne peut pas dépasser 255 caractères")
    .trim()
    .optional()
    .nullable(),
  // NEW - structured address fields
  rue: z
    .string()
    .min(1, "La rue est requise")
    .max(255, "La rue ne peut pas dépasser 255 caractères")
    .trim()
    .optional()
    .nullable(),
  complement: z
    .string()
    .max(255, "Le complément d'adresse ne peut pas dépasser 255 caractères")
    .trim()
    .optional()
    .nullable(),
  codePostal: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
    .trim()
    .optional()
    .nullable(),
  ville: z
    .string()
    .min(1, "La ville est requise")
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone invalide (format français attendu)"
    )
    .trim()
    .optional()
    .nullable(),
  email: z
    .string()
    .email("Format d'email invalide")
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),
  logo: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        // Accepter les URLs normales et les data URLs (base64)
        return (
          val.startsWith("http://") ||
          val.startsWith("https://") ||
          val.startsWith("data:image/")
        );
      },
      {
        message:
          "URL du logo invalide (doit être une URL HTTP ou une image base64)",
      }
    )
    .optional()
    .nullable(),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le SIRET doit contenir exactement 14 chiffres")
    .trim()
    .optional()
    .nullable(),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Couleur primaire invalide (format hexadécimal attendu)"
    )
    .default("#D4B5A0"),
  secondaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Couleur secondaire invalide (format hexadécimal attendu)"
    )
    .default("#8B7355"),
});

/**
 * Schéma de validation pour la mise à jour d'un Business
 * Tous les champs sont optionnels sauf les couleurs qui ont des valeurs par défaut
 */
export const updateBusinessSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim()
    .optional(),
  address: z
    .union([
      z
        .string()
        .max(255, "L'adresse ne peut pas dépasser 255 caractères")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  // NEW - structured address fields
  rue: z
    .union([
      z
        .string()
        .min(1, "La rue est requise")
        .max(255, "La rue ne peut pas dépasser 255 caractères")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  complement: z
    .union([
      z
        .string()
        .max(255, "Le complément d'adresse ne peut pas dépasser 255 caractères")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  codePostal: z
    .union([
      z
        .string()
        .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  ville: z
    .union([
      z
        .string()
        .min(1, "La ville est requise")
        .max(100, "La ville ne peut pas dépasser 100 caractères")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  phone: z
    .union([
      z
        .string()
        .regex(
          /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
          "Numéro de téléphone invalide (format français attendu)"
        )
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  email: z
    .union([
      z.string().email("Format d'email invalide").toLowerCase().trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  logo: z
    .union([
      z.string().refine(
        (val) => {
          if (!val) return true;
          return (
            val.startsWith("http://") ||
            val.startsWith("https://") ||
            val.startsWith("data:image/")
          );
        },
        {
          message:
            "URL du logo invalide (doit être une URL HTTP ou une image base64)",
        }
      ),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  siret: z
    .union([
      z
        .string()
        .regex(/^\d{14}$/, "Le SIRET doit contenir exactement 14 chiffres")
        .trim(),
      z.literal(""),
      z.null(),
    ])
    .transform((val) => (val === "" || !val ? null : val))
    .optional(),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Couleur primaire invalide (format hexadécimal attendu)"
    )
    .optional(),
  secondaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Couleur secondaire invalide (format hexadécimal attendu)"
    )
    .optional(),
  showInstallmentPayment: z.boolean().default(false).optional(),
});

/**
 * Type inféré pour la création d'un Business
 */
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

/**
 * Type inféré pour la mise à jour d'un Business
 */
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
