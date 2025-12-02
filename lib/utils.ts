import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export date utilities for convenience
export { formatDate, formatDateTime, formatDateISO } from "./date-utils";

/**
 * Get the current session with businessId for multi-tenant filtering
 * Use this in Server Actions and API routes to ensure proper tenant isolation
 *
 * @returns Session with user.businessId or null if not authenticated
 * @throws Error if user is authenticated but has no Business (should never happen)
 */
export async function getSessionWithBusiness() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  // Ensure businessId exists for authenticated users
  if (!session.user.businessId) {
    throw new Error(
      "User is authenticated but has no associated Business. This should not happen."
    );
  }

  return session;
}

/**
 * Get the businessId from the current session
 * Convenience wrapper around getSessionWithBusiness
 *
 * @returns businessId string
 * @throws Error if user is not authenticated or has no Business
 */
export async function getBusinessId(): Promise<string> {
  const session = await getSessionWithBusiness();

  if (!session) {
    throw new Error("User must be authenticated to access this resource");
  }

  return session.user.businessId!;
}
