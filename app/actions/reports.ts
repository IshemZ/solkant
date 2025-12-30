"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import { toNumber } from "@/lib/decimal-utils";

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
 */
export const getBusinessRevenue = withAuth(
  async (_input: Record<string, never>, session) => {
    const { businessId } = session;

    // Fetch business details
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!business) {
      throw new Error("Business not found");
    }

    // Calculate revenue from SENT quotes only
    const quotes = await prisma.quote.findMany({
      where: {
        businessId,
        status: "SENT",
      },
      select: {
        id: true,
        total: true,
      },
    });

    const totalRevenue = quotes.reduce((sum, quote) => sum + toNumber(quote.total), 0);
    const sentQuotes = quotes.length;

    // Calculate total quote value (regardless of status)
    const allQuotes = await prisma.quote.findMany({
      where: {
        businessId,
      },
      select: {
        total: true,
      },
    });

    const totalQuoteValue = allQuotes.reduce(
      (sum, quote) => sum + toNumber(quote.total),
      0
    );

    return successResult({
      businessId: business.id,
      businessName: business.name,
      totalRevenue,
      sentQuotes,
      totalQuoteValue,
    });
  },
  "getBusinessRevenue"
);

/**
 * Get revenue summary for ALL businesses (CEO admin dashboard only)
 *
 * SECURITY CRITICAL: This function demonstrates the difference:
 * - It can be called from an authenticated admin context
 * - Even though it returns multiple businesses, it does NOT filter by businessId
 * - This is ONLY acceptable if this action is wrapped in additional admin authorization checks
 *
 * For a production CEO dashboard, you would need to:
 * 1. Verify the user is a super-admin in a separate table
 * 2. Add audit logging for this sensitive operation
 * 3. Implement rate limiting to prevent data scraping
 *
 * Authorization must be implemented before enabling this endpoint in production.
 */
export const getAllBusinessRevenue = withAuth(
  async (_input: Record<string, never>, _session) => {
    // IMPORTANT: Admin authorization required before production use

    // Fetch ALL businesses (no businessId filter - admin operation)
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Calculate revenue for each business
    const revenueSummaries: RevenueSummary[] = [];

    for (const business of businesses) {
      const quotes = await prisma.quote.findMany({
        where: {
          businessId: business.id,
          status: "SENT",
        },
        select: {
          total: true,
        },
      });

      const totalRevenue = quotes.reduce((sum, quote) => sum + toNumber(quote.total), 0);
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
        (sum, quote) => sum + toNumber(quote.total),
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

    return successResult(revenueSummaries);
  },
  "getAllBusinessRevenue"
);
