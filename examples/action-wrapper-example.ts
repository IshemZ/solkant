/**
 * Exemples d'utilisation des Action Wrappers
 *
 * Ce fichier montre comment migrer des Server Actions vers le pattern avec wrappers.
 * NE PAS UTILISER EN PRODUCTION - Pour référence uniquement.
 */

"use server";

import prisma from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  withAuthUnverified,
} from "@/lib/action-wrapper";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auditLog, AuditAction, AuditLevel } from "@/lib/audit-logger";
import { z } from "zod";
import type { Client } from "@prisma/client";

// ============================================================================
// EXEMPLE 1: Action de Liste (Simple GET)
// ============================================================================

/**
 * Récupère tous les clients du business
 * Pattern: withAuth (pas de validation complexe)
 */
export const getClients = withAuth(
  async (input: {}, session) => {
    const clients = await prisma.client.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: "desc" },
    });

    return clients;
  },
  "getClients"
);

// Utilisation dans un composant:
// const result = await getClients({});
// if (result.success) {
//   console.log(result.data); // Client[]
// }

// ============================================================================
// EXEMPLE 2: Action de Création avec Validation Zod
// ============================================================================

/**
 * Crée un nouveau client
 * Pattern: withAuthAndValidation (validation Zod + audit log)
 */
export const createClient = withAuthAndValidation(
  async (input: CreateClientInput, session) => {
    const { businessId, userId } = session;

    const client = await prisma.client.create({
      data: {
        ...input,
        businessId,
      },
    });

    // Audit log
    await auditLog({
      action: AuditAction.CLIENT_CREATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: client.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    // Revalidation cache
    revalidatePath("/dashboard/clients");

    return client;
  },
  "createClient",
  createClientSchema
);

// Utilisation dans un composant:
// const result = await createClient({
//   firstName: "Jean",
//   lastName: "Dupont",
//   email: "jean@example.com",
//   phone: "0612345678"
// });
//
// if (result.success) {
//   console.log(result.data); // Client créé
// } else {
//   console.error(result.error); // Message d'erreur
//   console.error(result.fieldErrors); // Erreurs par champ si validation échoue
// }

// ============================================================================
// EXEMPLE 3: Action de Mise à Jour
// ============================================================================

/**
 * Met à jour un client existant
 * Pattern: withAuthAndValidation avec validation inline + ID
 */
export const updateClient = withAuthAndValidation(
  async (input: { id: string } & UpdateClientInput, session) => {
    const { id, ...data } = input;

    const client = await prisma.client.update({
      where: {
        id,
        businessId: session.businessId, // Tenant isolation
      },
      data,
    });

    revalidatePath("/dashboard/clients");
    return client;
  },
  "updateClient",
  // Schema composé : ID + données de mise à jour
  z.object({
    id: z.string().cuid(),
  }).merge(updateClientSchema)
);

// ============================================================================
// EXEMPLE 4: Action de Suppression avec Audit Log
// ============================================================================

/**
 * Supprime un client
 * Pattern: withAuth avec logSuccess activé (actions critiques)
 */
export const deleteClient = withAuth(
  async (input: { id: string }, session) => {
    const { businessId, userId } = session;

    // Récupérer les infos avant suppression
    const client = await prisma.client.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      select: { firstName: true, lastName: true, email: true },
    });

    if (!client) {
      throw new Error("Client introuvable");
    }

    await prisma.client.delete({
      where: {
        id: input.id,
        businessId,
      },
    });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: input.id,
      resourceType: "Client",
      metadata: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });

    revalidatePath("/dashboard/clients");
  },
  "deleteClient",
  { logSuccess: true } // Log les suppressions dans Sentry
);

// ============================================================================
// EXEMPLE 5: Action avec Validation Inline (sans schéma pré-défini)
// ============================================================================

/**
 * Récupère un client spécifique par ID
 * Pattern: withAuthAndValidation avec schéma inline
 */
export const getClientById = withAuthAndValidation(
  async (input: { id: string }, session) => {
    const client = await prisma.client.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId,
      },
    });

    if (!client) {
      throw new Error("Client introuvable");
    }

    return client;
  },
  "getClientById",
  z.object({
    id: z.string().cuid("ID invalide"),
  })
);

// ============================================================================
// EXEMPLE 6: Action Sans Email Vérifié
// ============================================================================

/**
 * Renvoie l'email de vérification
 * Pattern: withAuthUnverified (avant vérification email)
 */
export const resendVerificationEmail = withAuthUnverified(
  async (input: {}, session) => {
    const { userEmail } = session;

    // Logique d'envoi d'email
    // await sendVerificationEmail(userEmail);

    console.log(`Email de vérification envoyé à ${userEmail}`);
  },
  "resendVerificationEmail"
);

// ============================================================================
// EXEMPLE 7: Action Complexe avec Validations Multiples
// ============================================================================

/**
 * Importe plusieurs clients en masse
 * Pattern: withAuthAndValidation avec validation array
 */
export const importClients = withAuthAndValidation(
  async (input: { clients: CreateClientInput[] }, session) => {
    const { businessId, userId } = session;

    // Validation métier: max 100 clients par import
    if (input.clients.length > 100) {
      throw new Error("Maximum 100 clients par import");
    }

    // Import en transaction
    const imported = await prisma.$transaction(
      input.clients.map((clientData) =>
        prisma.client.create({
          data: {
            ...clientData,
            businessId,
          },
        })
      )
    );

    await auditLog({
      action: AuditAction.CLIENT_CREATED,
      level: AuditLevel.INFO,
      userId,
      businessId,
      resourceId: "bulk_import",
      resourceType: "Client",
      metadata: {
        count: imported.length,
      },
    });

    revalidatePath("/dashboard/clients");
    return { imported: imported.length, clients: imported };
  },
  "importClients",
  z.object({
    clients: z.array(createClientSchema).min(1).max(100),
  })
);

// ============================================================================
// EXEMPLE 8: Action avec Options Personnalisées
// ============================================================================

/**
 * Exporte les données client (sans sanitization car output, pas input)
 * Pattern: withAuth avec options personnalisées
 */
export const exportClientData = withAuth(
  async (input: { clientId: string }, session) => {
    const client = await prisma.client.findFirst({
      where: {
        id: input.clientId,
        businessId: session.businessId,
      },
      include: {
        quotes: true,
      },
    });

    if (!client) {
      throw new Error("Client introuvable");
    }

    // Formater les données pour export CSV/JSON
    const exportData = {
      client,
      exportedAt: new Date().toISOString(),
      exportedBy: session.userId,
    };

    return exportData;
  },
  "exportClientData",
  {
    requireEmailVerification: true,
    sanitizeInput: false, // Pas de sanitization sur un simple ID
    logSuccess: true, // Logger les exports pour conformité RGPD
  }
);

// ============================================================================
// EXEMPLE 9: Action avec Gestion d'Erreurs Métier
// ============================================================================

/**
 * Archive un client (soft delete)
 * Pattern: withAuth avec erreurs métier personnalisées
 */
export const archiveClient = withAuth(
  async (input: { id: string; reason?: string }, session) => {
    const { businessId, userId } = session;

    // Vérifier que le client n'a pas de devis en cours
    const clientWithQuotes = await prisma.client.findFirst({
      where: {
        id: input.id,
        businessId,
      },
      include: {
        quotes: {
          where: { status: "DRAFT" },
        },
      },
    });

    if (!clientWithQuotes) {
      throw new Error("Client introuvable");
    }

    if (clientWithQuotes.quotes.length > 0) {
      throw new Error(
        `Impossible d'archiver : ${clientWithQuotes.quotes.length} devis en cours`
      );
    }

    // Soft delete via flag "archived" (si votre schéma le supporte)
    // const archived = await prisma.client.update({
    //   where: { id: input.id, businessId },
    //   data: { archivedAt: new Date(), archiveReason: input.reason }
    // });

    await auditLog({
      action: AuditAction.CLIENT_DELETED,
      level: AuditLevel.CRITICAL,
      userId,
      businessId,
      resourceId: input.id,
      resourceType: "Client",
      metadata: {
        reason: input.reason || "Non spécifié",
        action: "archived",
      },
    });

    revalidatePath("/dashboard/clients");
  },
  "archiveClient",
  { logSuccess: true }
);

// ============================================================================
// EXEMPLE 10: Action de Recherche avec Paramètres Multiples
// ============================================================================

/**
 * Recherche de clients avec filtres
 * Pattern: withAuthAndValidation avec schéma de recherche complexe
 */
export const searchClients = withAuthAndValidation(
  async (
    input: {
      query?: string;
      limit?: number;
      offset?: number;
    },
    session
  ) => {
    const { query = "", limit = 20, offset = 0 } = input;

    const clients = await prisma.client.findMany({
      where: {
        businessId: session.businessId,
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.client.count({
      where: {
        businessId: session.businessId,
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return {
      clients,
      total,
      hasMore: offset + clients.length < total,
    };
  },
  "searchClients",
  z.object({
    query: z.string().optional(),
    limit: z.number().min(1).max(100).optional().default(20),
    offset: z.number().min(0).optional().default(0),
  })
);

// ============================================================================
// RÉSUMÉ DES PATTERNS
// ============================================================================

/*
1. withAuth() - Pour actions simples sans validation Zod complexe
   ✅ GET (listes, détails)
   ✅ DELETE (avec ID simple)
   ✅ Actions avec validation manuelle

2. withAuthAndValidation() - Pour actions avec validation Zod
   ✅ POST (créations)
   ✅ PUT/PATCH (mises à jour)
   ✅ Actions avec inputs complexes

3. withAuthUnverified() - Pour actions pré-vérification email
   ✅ resendVerificationEmail
   ✅ requestPasswordReset
   ⚠️  À utiliser avec PRÉCAUTION

4. Options disponibles:
   - requireEmailVerification: boolean (défaut: true)
   - sanitizeInput: boolean (défaut: true)
   - logSuccess: boolean (défaut: false - activer pour actions critiques)

5. Gestion d'erreurs:
   - Lancer throw new Error() pour erreurs métier
   - Le wrapper convertit automatiquement en errorResult()
   - Logging Sentry automatique
*/
