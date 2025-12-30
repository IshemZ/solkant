import { z } from "zod";

/**
 * Validation schema for contact form submission
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .trim(),
  email: z
    .string()
    .min(1, "L'email est requis")
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .email("Format d'email invalide")
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .refine(
      (val) =>
        ["demo", "support", "pricing", "feature", "other"].includes(val),
      "Sujet invalide"
    ),
  message: z
    .string()
    .min(1, "Le message est requis")
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères")
    .trim(),
});

/**
 * Type inferred from contact form schema
 */
export type ContactFormInput = z.infer<typeof contactFormSchema>;
