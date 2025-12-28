import { z } from 'zod'

/**
 * Enum pour le statut d'un devis
 */
export const quoteStatusEnum = z.enum(['DRAFT', 'SENT'])

/**
 * Type pour le statut d'un devis
 */
export type QuoteStatus = z.infer<typeof quoteStatusEnum>

/**
 * Enum pour le type de remise
 */
export const discountTypeEnum = z.enum(['PERCENTAGE', 'FIXED'])

/**
 * Type pour le type de remise
 */
export type DiscountType = z.infer<typeof discountTypeEnum>

/**
 * Schéma de validation pour un item de devis (ligne)
 */
export const quoteItemSchema = z.object({
  serviceId: z
    .string()
    .regex(/^c[a-z0-9]{24}$/, 'ID de service invalide')
    .optional()
    .nullable(),
  packageId: z
    .string()
    .regex(/^c[a-z0-9]{24}$/, 'ID de package invalide')
    .optional()
    .nullable(),
  name: z
    .string()
    .min(1, 'Le nom de l\'article est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .trim()
    .optional()
    .nullable(),
  price: z
    .number('Le prix doit être un nombre')
    .min(0, 'Le prix ne peut pas être négatif')
    .max(999999.99, 'Le prix ne peut pas dépasser 999 999,99 €')
    .multipleOf(0.01, 'Le prix doit avoir au maximum 2 décimales'),
  quantity: z
    .number('La quantité doit être un nombre')
    .int('La quantité doit être un nombre entier')
    .min(1, 'La quantité doit être d\'au moins 1')
    .max(9999, 'La quantité ne peut pas dépasser 9999')
    .default(1),
  total: z
    .number('Le total doit être un nombre')
    .min(0, 'Le total ne peut pas être négatif')
    .max(9999999.99, 'Le total ne peut pas dépasser 9 999 999,99 €'),
  packageDiscount: z
    .number('La remise package doit être un nombre')
    .min(0, 'La remise package ne peut pas être négative')
    .max(999999.99, 'La remise package ne peut pas dépasser 999 999,99 €')
    .multipleOf(0.01, 'La remise package doit avoir au maximum 2 décimales')
    .default(0)
    .optional(),
})

/**
 * Schéma de validation pour la création d'un devis
 */
export const createQuoteSchema = z.object({
  clientId: z
    .string('Le client est requis')
    .regex(/^c[a-z0-9]{24}$/, 'ID de client invalide'),
  status: quoteStatusEnum.default('DRAFT').optional(),
  validUntil: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
      'Date de validité invalide'
    )
    .optional()
    .nullable()
    .or(z.date().optional().nullable()),
  notes: z
    .string()
    .max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères')
    .trim()
    .optional()
    .nullable(),
  discount: z
    .number('La remise doit être un nombre')
    .min(0, 'La remise ne peut pas être négative')
    .max(999999.99, 'La remise ne peut pas dépasser 999 999,99 €')
    .multipleOf(0.01, 'La remise doit avoir au maximum 2 décimales')
    .default(0),
  discountType: discountTypeEnum.default('FIXED'),
  items: z
    .array(quoteItemSchema)
    .min(1, 'Au moins un article est requis')
    .max(100, 'Un devis ne peut pas contenir plus de 100 articles'),
})
.refine(
  (data) => {
    // Validation conditionnelle : si discountType est PERCENTAGE, discount doit être <= 100
    if (data.discountType === 'PERCENTAGE' && data.discount > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'La remise en pourcentage ne peut pas dépasser 100%',
    path: ['discount'],
  }
)
.refine(
  (data) => {
    // Validation : le montant de remise calculé ne doit pas dépasser le sous-total après remises packages
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const packageDiscountsTotal = data.items.reduce((sum, item) => sum + (item.packageDiscount || 0), 0);
    const subtotalAfterPackageDiscounts = subtotal - packageDiscountsTotal;

    const discountAmount = data.discountType === 'PERCENTAGE'
      ? subtotalAfterPackageDiscounts * (data.discount / 100)
      : data.discount;
    return discountAmount <= subtotalAfterPackageDiscounts;
  },
  {
    message: 'La remise ne peut pas dépasser le sous-total',
    path: ['discount'],
  }
)

/**
 * Schéma de validation pour la mise à jour d'un devis
 */
export const updateQuoteSchema = z.object({
  clientId: z
    .string()
    .regex(/^c[a-z0-9]{24}$/, 'ID de client invalide')
    .optional(),
  quoteNumber: z
    .string()
    .min(1, 'Le numéro de devis est requis')
    .max(50, 'Le numéro de devis ne peut pas dépasser 50 caractères')
    .regex(
      /^[A-Z0-9-]+$/,
      'Le numéro de devis ne peut contenir que des lettres majuscules, des chiffres et des tirets'
    )
    .trim()
    .optional(),
  status: quoteStatusEnum.optional(),
  validUntil: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
      'Date de validité invalide'
    )
    .optional()
    .nullable()
    .or(z.date().optional().nullable()),
  notes: z
    .string()
    .max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères')
    .trim()
    .optional()
    .nullable(),
  discount: z
    .number('La remise doit être un nombre')
    .min(0, 'La remise ne peut pas être négative')
    .max(999999.99, 'La remise ne peut pas dépasser 999 999,99 €')
    .multipleOf(0.01, 'La remise doit avoir au maximum 2 décimales')
    .optional(),
  discountType: discountTypeEnum.optional(),
  items: z
    .array(quoteItemSchema)
    .min(1, 'Au moins un article est requis')
    .max(100, 'Un devis ne peut pas contenir plus de 100 articles')
    .optional(),
})
.refine(
  (data) => {
    // Validation conditionnelle : si discountType est PERCENTAGE, discount doit être <= 100
    if (data.discountType === 'PERCENTAGE' && data.discount && data.discount > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'La remise en pourcentage ne peut pas dépasser 100%',
    path: ['discount'],
  }
)
.refine(
  (data) => {
    // Validation : le montant de remise calculé ne doit pas dépasser le sous-total après remises packages
    // Seulement si items ET discount sont fournis
    if (!data.items || !data.discount) {
      return true;
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const packageDiscountsTotal = data.items.reduce((sum, item) => sum + (item.packageDiscount || 0), 0);
    const subtotalAfterPackageDiscounts = subtotal - packageDiscountsTotal;

    const discountType = data.discountType || 'FIXED';
    const discountAmount = discountType === 'PERCENTAGE'
      ? subtotalAfterPackageDiscounts * (data.discount / 100)
      : data.discount;
    return discountAmount <= subtotalAfterPackageDiscounts;
  },
  {
    message: 'La remise ne peut pas dépasser le sous-total',
    path: ['discount'],
  }
)

/**
 * Schéma pour mettre à jour uniquement le statut d'un devis
 */
export const updateQuoteStatusSchema = z.object({
  status: quoteStatusEnum,
})

/**
 * Type inféré pour un item de devis
 */
export type QuoteItemInput = z.infer<typeof quoteItemSchema>

/**
 * Type inféré pour la création d'un devis
 */
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>

/**
 * Type inféré pour la mise à jour d'un devis
 */
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>

/**
 * Type inféré pour la mise à jour du statut
 */
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>
