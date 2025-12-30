import {
  validateSessionWithEmail,
  validateSuperAdmin,
  type ValidatedSession,
} from "@/lib/auth-helpers";
import { errorResult, type ActionResult } from "@/lib/action-types";
import { type ZodType } from "zod";
import { formatZodFieldErrors } from "@/lib/validations/helpers";
import { BusinessError } from "@/lib/errors";

/**
 * Higher-order function that wraps server action handlers with authentication and error handling.
 *
 * @param handler - The server action handler function that receives input and validated session
 * @param actionName - Name of the action for error logging and messages
 * @param errorMessage - Optional custom error message (defaults to "Erreur lors de {actionName}")
 * @returns Wrapped function that handles auth, errors, and Sentry logging
 *
 * @example
 * export const deleteClient = withAuth(
 *   async (input: { id: string }, session) => {
 *     await prisma.client.delete({
 *       where: { id: input.id, businessId: session.businessId }
 *     });
 *     return successResult({ id: input.id });
 *   },
 *   "deleteClient",
 *   "Erreur lors de la suppression du client"
 * );
 */
export function withAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string,
  errorMessage?: string
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    // Validate session
    const validatedSession = await validateSessionWithEmail();
    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    try {
      // Call the wrapped handler
      return await handler(input, validatedSession);
    } catch (error) {
      // BusinessError: preserve user-facing message
      if (error instanceof BusinessError) {
        return errorResult(error.message, error.code);
      }

      // Technical errors: log to Sentry and return generic message
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: { action: actionName, businessId: validatedSession.businessId },
        extra: { input },
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      return errorResult(errorMessage || `Erreur lors de ${actionName}`);
    }
  };
}

/**
 * Higher-order function that wraps server action handlers with authentication,
 * input validation, and error handling.
 *
 * @param handler - The server action handler function
 * @param actionName - Name of the action for error logging
 * @param schema - Zod schema for input validation
 * @param errorMessage - Optional custom error message (defaults to "Erreur lors de {actionName}")
 * @returns Wrapped function with auth, validation, and error handling
 *
 * @example
 * const createClientSchema = z.object({
 *   nom: z.string().min(1),
 *   email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email invalide'),
 * });
 *
 * export const createClient = withAuthAndValidation(
 *   async (input, session) => {
 *     const client = await prisma.client.create({
 *       data: { ...input, businessId: session.businessId }
 *     });
 *     return successResult(client);
 *   },
 *   "createClient",
 *   createClientSchema,
 *   "Erreur lors de la création du client"
 * );
 */
export function withAuthAndValidation<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string,
  schema: ZodType<TInput>,
  errorMessage?: string
) {
  return async (input: unknown): Promise<ActionResult<TOutput>> => {
    // Validate session
    const validatedSession = await validateSessionWithEmail();
    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    // Validate input
    const validation = schema.safeParse(input);
    if (!validation.success) {
      return errorResult(
        "Données invalides",
        "VALIDATION_ERROR",
        formatZodFieldErrors(validation.error)
      );
    }

    try {
      // Call the wrapped handler with validated input
      return await handler(validation.data, validatedSession);
    } catch (error) {
      // BusinessError: preserve user-facing message
      if (error instanceof BusinessError) {
        return errorResult(error.message, error.code);
      }

      // Technical errors: log to Sentry and return generic message
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: { action: actionName, businessId: validatedSession.businessId },
        extra: { input },
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      return errorResult(errorMessage || `Erreur lors de ${actionName}`);
    }
  };
}

/**
 * Higher-order function for authenticated actions (alias de withAuth)
 *
 * @deprecated Email verification has been removed - this is now identical to withAuth. Use withAuth instead.
 * @param handler - The server action handler function
 * @param actionName - Name of the action for error logging
 * @param errorMessage - Optional custom error message
 * @returns Wrapped function with auth and error handling
 */
export function withAuthUnverified<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string,
  errorMessage?: string
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    // Validate session (identical to withAuth now that email verification is removed)
    const validatedSession = await validateSessionWithEmail();
    if ("error" in validatedSession) {
      return errorResult(validatedSession.error);
    }

    try {
      return await handler(input, validatedSession);
    } catch (error) {
      // BusinessError: preserve user-facing message
      if (error instanceof BusinessError) {
        return errorResult(error.message, error.code);
      }

      // Technical errors: log to Sentry and return generic message
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: { action: actionName, businessId: validatedSession.businessId },
        extra: { input },
      });

      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      return errorResult(errorMessage || `Erreur lors de ${actionName}`);
    }
  };
}

/**
 * Higher-order function that wraps server action handlers with super admin authentication.
 *
 * @param handler - The server action handler function
 * @param actionName - Name of the action for error logging
 * @param errorMessage - Optional custom error message (defaults to "Erreur lors de {actionName}")
 * @returns Wrapped function that validates super admin role
 *
 * @example
 * export const getAllBusinesses = withSuperAdminAuth(
 *   async (_input: void, _session) => {
 *     const businesses = await prisma.business.findMany({});
 *     return successResult(businesses);
 *   },
 *   "getAllBusinesses"
 * );
 */
export function withSuperAdminAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string,
  errorMessage?: string
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    // Validate super admin session
    const validation = await validateSuperAdmin();

    if ('error' in validation) {
      return errorResult(validation.error);
    }

    try {
      // Call the wrapped handler
      return await handler(input, validation);
    } catch (error) {
      // BusinessError: preserve user-facing message
      if (error instanceof BusinessError) {
        return errorResult(error.message, error.code);
      }

      // Technical errors: log to Sentry with super_admin tag
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: {
          action: actionName,
          type: 'super_admin_action',
        },
        extra: { input },
        user: { id: validation.userId, email: validation.userEmail }
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in super admin action ${actionName}:`, error);
      }

      return errorResult(errorMessage || `Erreur lors de ${actionName}`);
    }
  };
}
