import { z } from 'zod'

/**
 * Schéma de validation pour la création d'un Business
 */
export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom de l\'institut est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  address: z
    .string()
    .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Numéro de téléphone invalide (format français attendu)'
    )
    .trim()
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),
  logo: z
    .string()
    .url('URL du logo invalide')
    .optional()
    .nullable(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres')
    .trim()
    .optional()
    .nullable(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur primaire invalide (format hexadécimal attendu)')
    .default('#D4B5A0'),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur secondaire invalide (format hexadécimal attendu)')
    .default('#8B7355'),
})

/**
 * Schéma de validation pour la mise à jour d'un Business
 * Tous les champs sont optionnels sauf les couleurs qui ont des valeurs par défaut
 */
export const updateBusinessSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim()
    .optional(),
  address: z
    .string()
    .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Numéro de téléphone invalide (format français attendu)'
    )
    .trim()
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),
  logo: z
    .string()
    .url('URL du logo invalide')
    .optional()
    .nullable(),
  siret: z
    .string()
    .regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres')
    .trim()
    .optional()
    .nullable(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur primaire invalide (format hexadécimal attendu)')
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur secondaire invalide (format hexadécimal attendu)')
    .optional(),
})

/**
 * Type inféré pour la création d'un Business
 */
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>

/**
 * Type inféré pour la mise à jour d'un Business
 */
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>
