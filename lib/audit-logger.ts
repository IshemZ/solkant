/**
 * Système de logs d'audit pour tracer les actions sensibles
 * Permet de logger les opérations critiques avec contexte métier
 *
 * @module lib/audit-logger
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Types d'actions auditées
 */
export enum AuditAction {
  // Devis
  QUOTE_CREATED = "quote.created",
  QUOTE_UPDATED = "quote.updated",
  QUOTE_DELETED = "quote.deleted",
  QUOTE_SENT = "quote.sent",
  QUOTE_PDF_GENERATED = "quote.pdf_generated",
  QUOTE_STATUS_CHANGED = "quote.status_changed",
  QUOTE_EXPORTED = "quote.exported",

  // Clients
  CLIENT_CREATED = "client.created",
  CLIENT_UPDATED = "client.updated",
  CLIENT_DELETED = "client.deleted",

  // Services
  SERVICE_CREATED = "service.created",
  SERVICE_UPDATED = "service.updated",
  SERVICE_DELETED = "service.deleted",

  // Business
  BUSINESS_UPDATED = "business.updated",
  BUSINESS_SETTINGS_CHANGED = "business.settings_changed",

  // Auth
  LOGIN_SUCCESS = "auth.login_success",
  LOGIN_FAILED = "auth.login_failed",
  LOGOUT = "auth.logout",
  PASSWORD_CHANGED = "auth.password_changed",

  // Abonnement
  SUBSCRIPTION_CREATED = "subscription.created",
  SUBSCRIPTION_CANCELLED = "subscription.cancelled",
  SUBSCRIPTION_UPGRADED = "subscription.upgraded",
}

/**
 * Niveau de criticité de l'action
 */
export enum AuditLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical",
}

/**
 * Structure d'un log d'audit
 */
export interface AuditLog {
  action: AuditAction;
  level: AuditLevel;
  userId?: string;
  businessId?: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Logger une action sensible dans l'application
 *
 * @param log - Informations du log d'audit
 *
 * @example
 * ```typescript
 * await auditLog({
 *   action: AuditAction.QUOTE_DELETED,
 *   level: AuditLevel.CRITICAL,
 *   userId: session.user.id,
 *   businessId: session.user.businessId,
 *   resourceId: quoteId,
 *   resourceType: 'Quote',
 *   metadata: { quoteNumber: 'DEVIS-2024-001' }
 * });
 * ```
 */
export async function auditLog(
  log: Omit<AuditLog, "timestamp">
): Promise<void> {
  const fullLog: AuditLog = {
    ...log,
    timestamp: new Date(),
  };

  // Log en console en développement
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔍 AUDIT LOG:", {
      action: fullLog.action,
      level: fullLog.level,
      userId: fullLog.userId,
      businessId: fullLog.businessId,
      resourceId: fullLog.resourceId,
      metadata: fullLog.metadata,
      timestamp: fullLog.timestamp.toISOString(),
    });
  }

  // Envoyer à Sentry pour monitoring centralisé
  try {
    Sentry.addBreadcrumb({
      type: "audit",
      category: "audit-log",
      level:
        fullLog.level === AuditLevel.CRITICAL
          ? "error"
          : (fullLog.level as "info" | "warning"),
      message: `${fullLog.action}`,
      data: {
        userId: fullLog.userId,
        businessId: fullLog.businessId,
        resourceId: fullLog.resourceId,
        resourceType: fullLog.resourceType,
        metadata: fullLog.metadata,
        ipAddress: fullLog.ipAddress,
        userAgent: fullLog.userAgent,
      },
      timestamp: fullLog.timestamp.getTime() / 1000,
    });

    // Pour les actions critiques, créer un événement Sentry
    if (fullLog.level === AuditLevel.CRITICAL) {
      Sentry.captureMessage(`[AUDIT] ${fullLog.action}`, {
        level: "warning",
        tags: {
          action: fullLog.action,
          businessId: fullLog.businessId,
          resourceType: fullLog.resourceType,
        },
        extra: {
          ...fullLog.metadata,
          userId: fullLog.userId,
          resourceId: fullLog.resourceId,
          ipAddress: fullLog.ipAddress,
        },
      });
    }
  } catch (error) {
    // Ne pas bloquer l'exécution si le logging échoue
    console.error("Erreur lors du logging d'audit:", error);
  }

  // TODO: Implémenter stockage persistant en base de données
  // Pour une vraie application en production, il faudrait :
  // 1. Créer un modèle AuditLog dans Prisma
  // 2. Sauvegarder les logs en BDD pour historique long terme
  // 3. Ajouter des endpoints admin pour consulter les logs
  // 4. Implémenter rotation/archivage des vieux logs
  //
  // Exemple Prisma model:
  // model AuditLog {
  //   id          String   @id @default(cuid())
  //   action      String
  //   level       String
  //   userId      String?
  //   businessId  String?
  //   resourceId  String?
  //   resourceType String?
  //   metadata    Json?
  //   ipAddress   String?
  //   userAgent   String?
  //   createdAt   DateTime @default(now())
  // }
}

/**
 * Helper pour extraire l'IP et User-Agent d'une requête Next.js
 *
 * @param request - NextRequest object
 * @returns Object contenant ipAddress et userAgent
 */
export function extractRequestInfo(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  };
}
