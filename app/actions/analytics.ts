"use server";

import prisma from "@/lib/prisma";
import { validateSession } from "@/lib/auth-helpers";
import { successResult, errorResult, type ActionResult } from "@/lib/action-types";
import { QuoteStatus } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

/**
 * Get monthly revenue analytics for the current business
 * Returns revenue grouped by month for the last 12 months
 */
export async function getMonthlyRevenue(): Promise<ActionResult<Array<{ month: string; revenue: number; count: number }>>> {
  // 1. Validate session and extract businessId
  const validatedSession = await validateSession();
  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    // 2. CRITICAL: Filter by businessId to prevent data leaks
    const quotes = await prisma.quote.findMany({
      where: {
        businessId, // ← MULTI-TENANT SECURITY: Always filter by businessId
        status: QuoteStatus.SENT,
        sentAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      select: {
        total: true,
        sentAt: true
      },
      orderBy: {
        sentAt: "asc"
      }
    });

    // Group by month
    const monthlyData = quotes.reduce((acc, quote) => {
      if (!quote.sentAt) return acc;

      const monthKey = quote.sentAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long'
      });

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, revenue: 0, count: 0 };
      }

      acc[monthKey].revenue += quote.total;
      acc[monthKey].count += 1;

      return acc;
    }, {} as Record<string, { month: string; revenue: number; count: number }>);

    const result = Object.values(monthlyData);

    return successResult(result);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getMonthlyRevenue", businessId }
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching monthly revenue:", error);
    }

    return errorResult("Erreur lors de la récupération des statistiques mensuelles");
  }
}

/**
 * Get top performing clients by total revenue
 * Returns top 10 clients ordered by total quote value
 */
export async function getTopClientsByRevenue(): Promise<ActionResult<Array<{
  clientId: string;
  clientName: string;
  totalRevenue: number;
  quoteCount: number;
}>>> {
  const validatedSession = await validateSession();
  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    // CRITICAL: Both queries filtered by businessId
    const clients = await prisma.client.findMany({
      where: {
        businessId // ← MULTI-TENANT SECURITY
      },
      include: {
        quotes: {
          where: {
            status: QuoteStatus.SENT,
            businessId // ← DEFENSE IN DEPTH: Even though client is already filtered
          },
          select: {
            total: true
          }
        }
      }
    });

    const topClients = clients
      .map(client => ({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        totalRevenue: client.quotes.reduce((sum, q) => sum + q.total, 0),
        quoteCount: client.quotes.length
      }))
      .filter(c => c.totalRevenue > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return successResult(topClients);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getTopClientsByRevenue", businessId }
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching top clients:", error);
    }

    return errorResult("Erreur lors de la récupération des meilleurs clients");
  }
}

/**
 * Get service utilization statistics
 * Shows which services are most/least used in quotes
 */
export async function getServiceStats(): Promise<ActionResult<Array<{
  serviceId: string;
  serviceName: string;
  timesUsed: number;
  totalRevenue: number;
}>>> {
  const validatedSession = await validateSession();
  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    // CRITICAL: Filter at database level - both quote AND service by businessId
    const quoteItems = await prisma.quoteItem.findMany({
      where: {
        quote: {
          businessId // ← MULTI-TENANT SECURITY: Filter through quote relation
        },
        service: {
          businessId // ← CRITICAL FIX: Filter service at DB level (not app level)
        }
      },
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Build statistics (no app-level filtering needed - DB handles security)
    const stats = quoteItems
      .reduce((acc, item) => {
        if (!item.service) return acc;

        const serviceId = item.service.id;
        if (!acc[serviceId]) {
          acc[serviceId] = {
            serviceId,
            serviceName: item.service.name,
            timesUsed: 0,
            totalRevenue: 0
          };
        }

        acc[serviceId].timesUsed += 1;
        acc[serviceId].totalRevenue += item.total;

        return acc;
      }, {} as Record<string, { serviceId: string; serviceName: string; timesUsed: number; totalRevenue: number }>);

    const result = Object.values(stats).sort((a, b) => b.timesUsed - a.timesUsed);

    return successResult(result);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getServiceStats", businessId }
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching service stats:", error);
    }

    return errorResult("Erreur lors de la récupération des statistiques de services");
  }
}
