/**
 * Exports centralisés pour tous les schémas de validation Zod
 *
 * Utilisation :
 * ```ts
 * import { loginSchema, createClientSchema, validateAction } from '@/lib/validations'
 * ```
 *
 * Documentation :
 * - README.md - Guide complet d'utilisation
 * - EXAMPLES.md - Exemples pratiques
 * - GOTCHAS.md - Problèmes connus et solutions (Zod v4 spécifique)
 */

// Helpers
export {
  formatZodErrors,
  formatZodFlatErrors,
  validateAction,
  validateOrThrow,
  validateOrNull,
  type ActionResponse,
} from "./helpers";

// Authentication
export {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./auth";

// Password Reset
export {
  requestPasswordResetSchema,
  resetPasswordWithOTPSchema,
  type RequestPasswordResetInput,
  type ResetPasswordWithOTPInput,
} from "./password-reset";

// Business
export {
  createBusinessSchema,
  updateBusinessSchema,
  type CreateBusinessInput,
  type UpdateBusinessInput,
} from "./business";

// Client
export {
  createClientSchema,
  updateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "./client";

// Service
export {
  createServiceSchema,
  updateServiceSchema,
  serviceCategories,
  type CreateServiceInput,
  type UpdateServiceInput,
  type ServiceCategory,
} from "./service";

// Quote
export {
  createQuoteSchema,
  updateQuoteSchema,
  updateQuoteStatusSchema,
  quoteItemSchema,
  quoteStatusEnum,
  discountTypeEnum,
  type CreateQuoteInput,
  type UpdateQuoteInput,
  type UpdateQuoteStatusInput,
  type QuoteItemInput,
  type QuoteStatus,
  type DiscountType,
} from "./quote";

// Package
export {
  createPackageSchema,
  updatePackageSchema,
  packageItemSchema,
  type CreatePackageInput,
  type UpdatePackageInput,
  type PackageItemInput,
} from "./package";
