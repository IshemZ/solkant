import { z } from 'zod'

/**
 * Formate les erreurs Zod en un objet Record<string, string>
 * pour faciliter l'affichage dans les formulaires
 *
 * @example
 * ```ts
 * try {
 *   createClientSchema.parse(data)
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     const errors = formatZodErrors(error)
 *     // { email: "Format d'email invalide" }
 *   }
 * }
 * ```
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!formattedErrors[path]) {
      formattedErrors[path] = issue.message
    }
  })

  return formattedErrors
}

/**
 * Formate les erreurs Zod flatten en format simple
 * Utile pour les retours d'API
 *
 * @example
 * ```ts
 * const result = createClientSchema.safeParse(data)
 * if (!result.success) {
 *   const errors = formatZodFlatErrors(result.error)
 *   // { email: "Format d'email invalide", phone: "Numéro invalide" }
 * }
 * ```
 */
export function formatZodFlatErrors(error: z.ZodError): Record<string, string> {
  return formatZodErrors(error)
}

/**
 * Type pour les réponses d'actions avec validation
 */
export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string> }

/**
 * Wrapper pour valider les données avec Zod de manière sécurisée
 * Retourne un ActionResponse typé
 *
 * @example
 * ```ts
 * export async function createClient(data: unknown) {
 *   const validated = await validateAction(createClientSchema, data)
 *   if (!validated.success) {
 *     return validated // Retourne l'erreur
 *   }
 *
 *   // Utiliser validated.data qui est typé
 *   const client = await prisma.client.create({
 *     data: validated.data
 *   })
 *
 *   return { success: true, data: client }
 * }
 * ```
 */
export async function validateAction<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<
  | { success: true; data: T }
  | { success: false; error: string; details: Record<string, string> }
> {
  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: 'Données invalides',
      details: formatZodFlatErrors(result.error),
    }
  }

  return { success: true, data: result.data }
}

/**
 * Valide les données de manière synchrone
 * Lance une erreur si la validation échoue
 *
 * @example
 * ```ts
 * export async function createClient(data: unknown) {
 *   const validated = validateOrThrow(createClientSchema, data)
 *   // validated est typé comme CreateClientInput
 *
 *   const client = await prisma.client.create({
 *     data: validated
 *   })
 * }
 * ```
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Valide les données et retourne null en cas d'erreur
 * Utile pour les validations optionnelles
 *
 * @example
 * ```ts
 * const validated = validateOrNull(updateClientSchema, data)
 * if (!validated) {
 *   console.log('Données invalides, utilisation des valeurs par défaut')
 *   return
 * }
 * // Utiliser validated
 * ```
 */
export function validateOrNull<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Formate les erreurs Zod en un objet Record<string, string[]>
 * pour les fieldErrors dans ActionResult
 *
 * @example
 * ```ts
 * const result = createClientSchema.safeParse(data)
 * if (!result.success) {
 *   const fieldErrors = formatZodFieldErrors(result.error)
 *   // { email: ["Format d'email invalide"], phone: ["Numéro invalide"] }
 *   return errorResult("Données invalides", "VALIDATION_ERROR", fieldErrors)
 * }
 * ```
 */
export function formatZodFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }
    fieldErrors[path].push(issue.message)
  })

  return fieldErrors
}
