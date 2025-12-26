import * as Sentry from "@sentry/nextjs";
import {
  validateSessionWithEmail,
  type ValidatedSession,
} from "@/lib/auth-helpers";
import { errorResult, type ActionResult } from "@/lib/action-types";
import { type ZodSchema } from "zod";
import { formatZodFieldErrors } from "@/lib/validations/helpers";

/**
 * Higher-order function that wraps server action handlers with authentication and error handling.
 *
 * @param handler - The server action handler function that receives input and validated session
 * @param actionName - Name of the action for error logging and messages
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
 *   "deleteClient"
 * );
 */
export function withAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string
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
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { action: actionName, businessId: validatedSession.businessId },
        extra: { input },
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      return errorResult(`Erreur lors de ${actionName}`);
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
 * @returns Wrapped function with auth, validation, and error handling
 *
 * @example
 * const createClientSchema = z.object({
 *   nom: z.string().min(1),
 *   email: z.string().email(),
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
 *   createClientSchema
 * );
 */
export function withAuthAndValidation<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string,
  schema: ZodSchema<TInput>
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
      // Log to Sentry
      Sentry.captureException(error, {
        tags: { action: actionName, businessId: validatedSession.businessId },
        extra: { input },
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in ${actionName}:`, error);
      }

      return errorResult(`Erreur lors de ${actionName}`);
    }
  };
}
