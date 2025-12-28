"use server";

import prisma from "@/lib/prisma";
import { validateSession } from "@/lib/auth-helpers";
import { type ActionResult, successResult, errorResult } from "@/lib/action-types";
import * as Sentry from "@sentry/nextjs";

/**
 * Type pour les statistiques du dashboard
 */
export type DashboardStats = {
  totalClients: number;
  totalQuotes: number;
  totalRevenue: number;
  averageQuoteValue: number;
};

/**
 * Récupère les statistiques globales du dashboard
 *
 * SÉCURITÉ: Filtre automatiquement par businessId pour l'isolation multi-tenant
 *
 * @returns ActionResult<DashboardStats>
 */
export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const validatedSession = await validateSession();

  if ("error" in validatedSession) {
    return errorResult(validatedSession.error);
  }

  const { businessId } = validatedSession;

  try {
    // Exécuter les requêtes en parallèle pour optimiser les performances
    const [totalClients, quotes] = await Promise.all([
      // Compter le nombre total de clients
      prisma.client.count({
        where: { businessId },
      }),
      // Récupérer tous les quotes avec leur total
      prisma.quote.findMany({
        where: { businessId },
        select: { total: true },
      }),
    ]);

    const totalQuotes = quotes.length;

    // Calculer le revenu total (somme de tous les totaux)
    const totalRevenue = quotes.reduce((sum, quote) => sum + quote.total, 0);

    // Calculer la valeur moyenne des quotes (0 si aucun quote)
    const averageQuoteValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;

    const stats: DashboardStats = {
      totalClients,
      totalQuotes,
      totalRevenue,
      averageQuoteValue,
    };

    return successResult(stats);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "getDashboardStats", businessId },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching dashboard stats:", error);
    }

    return errorResult("Erreur lors de la récupération des statistiques");
  }
}
