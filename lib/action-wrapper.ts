/**
 * Action Wrappers - Abstractions pour Server Actions
 *
 * Ces wrappers éliminent le boilerplate répétitif dans les Server Actions en centralisant :
 * - Validation de session
 * - Validation Zod des inputs
 * - Gestion d'erreurs standardisée
 * - Logging Sentry
 * - Retour type-safe avec ActionResult<T>
 *
 * @example
 * // Action simple sans validation d'input
 * export const deleteClient = withAuth(
 *   async (input: { id: string }, session) => {
 *     await prisma.client.delete({
 *       where: { id: input.id, businessId: session.businessId }
 *     });
 *   },
 *   "deleteClient"
 * );
 *
 * @example
 * // Action avec validation Zod
 * export const createClient = withAuthAndValidation(
 *   async (input: CreateClientInput, session) => {
 *     const client = await prisma.client.create({
 *       data: { ...input, businessId: session.businessId }
 *     });
 *     return client;
 *   },
 *   "createClient",
 *   createClientSchema
 * );
 */

import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { BusinessError } from "@/lib/errors";

/**
 * Type guard pour vérifier si une valeur est un Record
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
import {
  validateSession,
  validateSessionWithEmail,
  type ValidatedSession,
} from "@/lib/auth-helpers";
import { sanitizeObject } from "@/lib/security";
import {
  type ActionResult,
  successResult,
  errorResult,
} from "@/lib/action-types";

/**
 * Options de configuration pour les wrappers d'actions
 */
export type ActionWrapperOptions = {
  /**
   * Exiger que l'email soit vérifié (défaut: false)
   * Mettre à true pour les actions qui nécessitent absolument un email vérifié
   */
  requireEmailVerification?: boolean;

  /**
   * Sanitizer automatiquement l'input avant validation (défaut: true)
   * Prévient les injections XSS et autres attaques
   */
  sanitizeInput?: boolean;

  /**
   * Logger l'action dans Sentry en cas de succès (défaut: false)
   * Utile pour les actions critiques (deletions, payments, etc.)
   */
  logSuccess?: boolean;
};

const DEFAULT_OPTIONS: ActionWrapperOptions = {
  requireEmailVerification: false,
  sanitizeInput: true,
  logSuccess: false,
};

/**
 * Wrapper pour Server Actions SANS validation d'input
 *
 * Utiliser quand :
 * - L'input est simple (ex: juste un ID)
 * - Aucune validation complexe n'est nécessaire
 * - Vous voulez gérer la validation manuellement dans le handler
 *
 * @param handler - Fonction qui traite l'action, reçoit (input, session)
 * @param actionName - Nom de l'action pour logging Sentry
 * @param options - Options de configuration
 *
 * @example
 * export const deleteClient = withAuth(
 *   async (input: { id: string }, session) => {
 *     await prisma.client.delete({
 *       where: { id: input.id, businessId: session.businessId }
 *     });
 *   },
 *   "deleteClient",
 *   { logSuccess: true } // Log les suppressions
 * );
 */
export function withAuth<TInput, TOutput>(
  handler: (input: TInput, session: ValidatedSession) => Promise<TOutput>,
  actionName: string,
  options: ActionWrapperOptions = {}
): (input: TInput) => Promise<ActionResult<TOutput>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    try {
      // 1. Valider la session
      const validatedSession = opts.requireEmailVerification
        ? await validateSessionWithEmail()
        : await validateSession();

      if ("error" in validatedSession) {
        return errorResult(validatedSession.error, validatedSession.code);
      }

      // 2. Sanitizer l'input si demandé
      const processedInput = opts.sanitizeInput && isRecord(input)
        ? (sanitizeObject(input) as TInput)
        : input;

      // 3. Exécuter le handler
      const result = await handler(processedInput, validatedSession);

      // 4. Logger le succès si demandé
      if (opts.logSuccess) {
        Sentry.captureMessage(`Action ${actionName} succeeded`, {
          level: "info",
          tags: {
            action: actionName,
            businessId: validatedSession.businessId,
          },
        });
      }

      return successResult(result);
    } catch (error) {
      // Préserver les erreurs métier (BusinessError)
      if (error instanceof BusinessError) {
        // Pas de logging Sentry pour les erreurs métier (flux normal)
        return errorResult(error.message, error.code || "BUSINESS_ERROR");
      }

      // Logger les erreurs techniques dans Sentry
      Sentry.captureException(error, {
        tags: { action: actionName },
        extra: { input },
      });

      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      // Retourner une erreur générique pour les erreurs techniques
      return errorResult(
        `Erreur lors de l'exécution de ${actionName}`,
        "INTERNAL_ERROR"
      );
    }
  };
}

/**
 * Wrapper pour Server Actions AVEC validation Zod
 *
 * Utiliser quand :
 * - Vous avez un schéma Zod pour valider l'input
 * - Vous voulez des erreurs de validation structurées (fieldErrors)
 * - Vous voulez centraliser la validation
 *
 * @param handler - Fonction qui traite l'action, reçoit (validatedInput, session)
 * @param actionName - Nom de l'action pour logging Sentry
 * @param schema - Schéma Zod pour valider l'input
 * @param options - Options de configuration
 *
 * @example
 * export const createClient = withAuthAndValidation(
 *   async (input: CreateClientInput, session) => {
 *     const client = await prisma.client.create({
 *       data: { ...input, businessId: session.businessId }
 *     });
 *     return client;
 *   },
 *   "createClient",
 *   createClientSchema
 * );
 *
 * @example
 * // Avec audit logging
 * export const deleteClient = withAuthAndValidation(
 *   async (input: { id: string }, session) => {
 *     await prisma.client.delete({
 *       where: { id: input.id, businessId: session.businessId }
 *     });
 *   },
 *   "deleteClient",
 *   z.object({ id: z.string().cuid() }),
 *   { logSuccess: true }
 * );
 */
export function withAuthAndValidation<TInput, TOutput>(
  handler: (input: TInput, session: ValidatedSession) => Promise<TOutput>,
  actionName: string,
  schema: z.ZodSchema<TInput>,
  options: ActionWrapperOptions = {}
): (input: unknown) => Promise<ActionResult<TOutput>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (input: unknown): Promise<ActionResult<TOutput>> => {
    try {
      // 1. Sanitizer l'input si demandé (avant validation)
      const processedInput = opts.sanitizeInput && isRecord(input)
        ? sanitizeObject(input)
        : input;

      // 2. Valider l'input avec Zod
      const validation = schema.safeParse(processedInput);
      if (!validation.success) {
        // Formater les erreurs Zod en fieldErrors
        const fieldErrors: Record<string, string[]> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(issue.message);
        });

        return errorResult(
          "Données invalides",
          "VALIDATION_ERROR",
          fieldErrors
        );
      }

      // 3. Valider la session
      const validatedSession = opts.requireEmailVerification
        ? await validateSessionWithEmail()
        : await validateSession();

      if ("error" in validatedSession) {
        return errorResult(validatedSession.error, validatedSession.code);
      }

      // 4. Exécuter le handler avec les données validées
      const result = await handler(validation.data, validatedSession);

      // 5. Logger le succès si demandé
      if (opts.logSuccess) {
        Sentry.captureMessage(`Action ${actionName} succeeded`, {
          level: "info",
          tags: {
            action: actionName,
            businessId: validatedSession.businessId,
          },
        });
      }

      return successResult(result);
    } catch (error) {
      // Préserver les erreurs métier (BusinessError)
      if (error instanceof BusinessError) {
        // Pas de logging Sentry pour les erreurs métier (flux normal)
        return errorResult(error.message, error.code || "BUSINESS_ERROR");
      }

      // Logger les erreurs techniques dans Sentry
      Sentry.captureException(error, {
        tags: { action: actionName },
        extra: { input },
      });

      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      // Retourner une erreur générique pour les erreurs techniques
      return errorResult(
        `Erreur lors de l'exécution de ${actionName}`,
        "INTERNAL_ERROR"
      );
    }
  };
}

/**
 * Variante de withAuth qui ne requiert PAS d'email vérifié
 *
 * Utiliser UNIQUEMENT pour :
 * - resendVerificationEmail
 * - requestPasswordReset
 * - Autres actions pré-vérification
 *
 * @example
 * export const resendVerificationEmail = withAuthUnverified(
 *   async (input: {}, session) => {
 *     await sendVerificationEmail(session.userEmail);
 *   },
 *   "resendVerificationEmail"
 * );
 */
export function withAuthUnverified<TInput, TOutput>(
  handler: (input: TInput, session: ValidatedSession) => Promise<TOutput>,
  actionName: string,
  options: Omit<ActionWrapperOptions, "requireEmailVerification"> = {}
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return withAuth(handler, actionName, {
    ...options,
    requireEmailVerification: false,
  });
}

/**
 * Variante de withAuthAndValidation qui ne requiert PAS d'email vérifié
 *
 * @example
 * export const requestPasswordReset = withAuthAndValidationUnverified(
 *   async (input: { email: string }, session) => {
 *     // ...
 *   },
 *   "requestPasswordReset",
 *   z.object({ email: z.string().email() })
 * );
 */
export function withAuthAndValidationUnverified<TInput, TOutput>(
  handler: (input: TInput, session: ValidatedSession) => Promise<TOutput>,
  actionName: string,
  schema: z.ZodSchema<TInput>,
  options: Omit<ActionWrapperOptions, "requireEmailVerification"> = {}
): (input: unknown) => Promise<ActionResult<TOutput>> {
  return withAuthAndValidation(handler, actionName, schema, {
    ...options,
    requireEmailVerification: false,
  });
}
