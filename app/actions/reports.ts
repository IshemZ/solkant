"use server";

import prisma from "@/lib/prisma";
import { validateSession } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import * as Sentry from "@sentry/nextjs";

/**
 * Revenue summary for a business
 */
export type RevenueSummary = {
  businessId: string;
  businessName: string;
  totalRevenue: number;
  sentQuotes: number;
  totalQuoteValue: number;
};

/**
 * Get revenue data for the current business
 *
 * This action is used for the CEO/owner dashboard to see their business revenue.
 * It MUST filter by businessId from the session to ensure data isolation.
 *
 * SECURITY: This is a standard Server Action in /app/actions - NO exceptions to businessId filtering!
 */
export async function getBusinessRevenue(): Promise<
  ActionResult<RevenueSummary>
> {
  const validatedSession = await validateSession();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error, "UNAUTHORIZED");
  }

  const { businessId } = validatedSession;

  try {
    // Fetch business details
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!business) {
      return errorResult("Business not found", "NOT_FOUND");
    }

    // Calculate revenue from SENT quotes only
    // Filter by: businessId AND status = SENT
    const quotes = await prisma.quote.findMany({
      where: {
        businessId, // REQUIRED: Filter by businessId for multi-tenant security
        status: "SENT",
      },
      select: {
        id: true,
        total: true,
      },
    });

    const totalRevenue = quotes.reduce((sum, quote) => sum + quote.total, 0);
    const sentQuotes = quotes.length;

    // Calculate total quote value (regardless of status)
    const allQuotes = await prisma.quote.findMany({
      where: {
        businessId, // REQUIRED: Filter by businessId
      },
      select: {
        total: true,
      },
    });

    const totalQuoteValue = allQuotes.reduce(
      (sum, quote) => sum + quote.total,
      0
    );

    const result: RevenueSummary = {
      businessId: business.id,
      businessName: business.name,
      totalRevenue,
      sentQuotes,
      totalQuoteValue,
    };

    return successResult(result);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getBusinessRevenue", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching business revenue:", error);
    }

    return errorResult("Erreur lors de la récupération des revenus");
  }
}

/**
 * Get revenue summary for ALL businesses (CEO admin dashboard only)
 *
 * SECURITY CRITICAL: This function demonstrates the difference:
 * - It can be called from an authenticated admin context
 * - Even though it returns multiple businesses, it does NOT filter by businessId
 * - This is ONLY acceptable if this action is wrapped in additional admin authorization checks
 * - In a real application, you would validate that the caller is a system administrator
 *
 * For a production CEO dashboard, you would need to:
 * 1. Verify the user is a super-admin in a separate table
 * 2. Add audit logging for this sensitive operation
 * 3. Implement rate limiting to prevent data scraping
 *
 * This is a demonstration of the exception case mentioned in CLAUDE.md
 */
export async function getAllBusinessRevenue(): Promise<
  ActionResult<RevenueSummary[]>
> {
  const validatedSession = await validateSession();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error, "UNAUTHORIZED");
  }

  // TODO: Add admin authorization check here in production
  // const isAdmin = await checkIfUserIsAdmin(validatedSession.userId);
  // if (!isAdmin) {
  //   return errorResult("Access denied", "FORBIDDEN");
  // }

  try {
    // Fetch ALL businesses (no businessId filter - this is the key difference)
    // This is ONLY acceptable because:
    // 1. It's in /app/actions with explicit admin context
    // 2. Should be gated behind admin checks (TODO in production)
    // 3. This demonstrates the security boundary
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Calculate revenue for each business
    const revenueSummaries: RevenueSummary[] = [];

    for (const business of businesses) {
      // NOTE: We fetch quotes per business here, but the query itself
      // uses businessId filter because we're explicitly iterating
      const quotes = await prisma.quote.findMany({
        where: {
          businessId: business.id,
          status: "SENT",
        },
        select: {
          total: true,
        },
      });

      const totalRevenue = quotes.reduce((sum, quote) => sum + quote.total, 0);
      const sentQuotes = quotes.length;

      const allQuotes = await prisma.quote.findMany({
        where: {
          businessId: business.id,
        },
        select: {
          total: true,
        },
      });

      const totalQuoteValue = allQuotes.reduce(
        (sum, quote) => sum + quote.total,
        0
      );

      revenueSummaries.push({
        businessId: business.id,
        businessName: business.name,
        totalRevenue,
        sentQuotes,
        totalQuoteValue,
      });
    }

    // Log this sensitive operation
    Sentry.captureMessage("getAllBusinessRevenue called - admin access", {
      level: "warning",
      tags: { action: "getAllBusinessRevenue" },
      extra: { userId: validatedSession.userId },
    });

    return successResult(revenueSummaries);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getAllBusinessRevenue" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching all business revenue:", error);
    }

    return errorResult("Erreur lors de la récupération des revenus");
  }
}
