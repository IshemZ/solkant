"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/action-wrapper";

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
 */
export const getDashboardStats = withAuth(
  async (_input: Record<string, never>, session): Promise<DashboardStats> => {
    const { businessId } = session;

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

    return {
      totalClients,
      totalQuotes,
      totalRevenue,
      averageQuoteValue,
    };
  },
  "getDashboardStats"
);
