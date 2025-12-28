"use server";

import prisma from "@/lib/prisma";
import { QuoteStatus } from "@prisma/client";
import { withAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import { toNumber } from "@/lib/decimal-utils";

/**
 * Get monthly revenue analytics for the current business
 * Returns revenue grouped by month for the last 12 months
 */
export const getMonthlyRevenue = withAuth(
  async (_input: Record<string, never>, session) => {
    const quotes = await prisma.quote.findMany({
      where: {
        businessId: session.businessId,
        status: QuoteStatus.SENT,
        sentAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      select: {
        total: true,
        sentAt: true,
      },
      orderBy: {
        sentAt: "asc",
      },
    });

    // Group by month
    const monthlyData = quotes.reduce(
      (acc, quote) => {
        if (!quote.sentAt) return acc;

        const monthKey = quote.sentAt.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
        });

        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, revenue: 0, count: 0 };
        }

        acc[monthKey].revenue += toNumber(quote.total);
        acc[monthKey].count += 1;

        return acc;
      },
      {} as Record<string, { month: string; revenue: number; count: number }>
    );

    return successResult(Object.values(monthlyData));
  },
  "getMonthlyRevenue"
);

/**
 * Get top performing clients by total revenue
 * Returns top 10 clients ordered by total quote value
 */
export const getTopClientsByRevenue = withAuth(
  async (_input: Record<string, never>, session) => {
    const clients = await prisma.client.findMany({
      where: {
        businessId: session.businessId,
      },
      include: {
        quotes: {
          where: {
            status: QuoteStatus.SENT,
            businessId: session.businessId,
          },
          select: {
            total: true,
          },
        },
      },
    });

    const topClients = clients
      .map((client) => ({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        totalRevenue: client.quotes.reduce((sum, q) => sum + toNumber(q.total), 0),
        quoteCount: client.quotes.length,
      }))
      .filter((c) => c.totalRevenue > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return successResult(topClients);
  },
  "getTopClientsByRevenue"
);

/**
 * Get service utilization statistics
 * Shows which services are most/least used in quotes
 */
export const getServiceStats = withAuth(
  async (_input: Record<string, never>, session) => {
    const quoteItems = await prisma.quoteItem.findMany({
      where: {
        quote: {
          businessId: session.businessId,
        },
        service: {
          businessId: session.businessId,
        },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Build statistics
    const stats = quoteItems.reduce(
      (acc, item) => {
        if (!item.service) return acc;

        const serviceId = item.service.id;
        if (!acc[serviceId]) {
          acc[serviceId] = {
            serviceId,
            serviceName: item.service.name,
            timesUsed: 0,
            totalRevenue: 0,
          };
        }

        acc[serviceId].timesUsed += 1;
        acc[serviceId].totalRevenue += toNumber(item.total);

        return acc;
      },
      {} as Record<
        string,
        {
          serviceId: string;
          serviceName: string;
          timesUsed: number;
          totalRevenue: number;
        }
      >
    );

    return successResult(Object.values(stats).sort((a, b) => b.timesUsed - a.timesUsed));
  },
  "getServiceStats"
);
