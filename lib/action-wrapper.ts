import * as Sentry from "@sentry/nextjs";
import {
  validateSessionWithEmail,
  type ValidatedSession,
} from "@/lib/auth-helpers";
import { errorResult, type ActionResult } from "@/lib/action-types";

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
