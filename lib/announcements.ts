/**
 * Announcements Configuration
 *
 * Manages the list of announcements shown in the announcements center.
 * New announcements should be added to the top of the array.
 */

export interface Announcement {
  id: string;
  publishedAt: Date;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  badge?: "new" | "feature" | "improvement";
}

/**
 * List of all announcements, sorted by date descending (newest first).
 * Add new announcements to the top of this array.
 */
export const announcements: Announcement[] = [
  {
    id: "forfaits-packs-2025-01",
    publishedAt: new Date("2025-01-06"),
    title: "Forfaits : packs + réduction automatique",
    description: "Combine plusieurs services, choisis des quantités et applique une réduction automatiquement.",
    actionLabel: "Créer un forfait",
    actionUrl: "/dashboard/services#forfaits",
    badge: "new",
  },
  {
    id: "payment-installments-2025-01",
    publishedAt: new Date("2025-01-05"),
    title: "Option paiement en 4 fois",
    description: "Active l'affichage du paiement en 4x sur les devis (si proposé).",
    actionLabel: "Activer",
    actionUrl: "/dashboard/parametres#payment-installments",
    badge: "feature",
  },
  {
    id: "pdf-prefix-2025-01",
    publishedAt: new Date("2025-01-04"),
    title: "Personnalise le nom de tes PDF",
    description: "Définis un préfixe pour retrouver tes devis plus vite (ex : 'Laser Diode - …').",
    actionLabel: "Choisir un préfixe",
    actionUrl: "/dashboard/parametres#pdf-prefix",
    badge: "feature",
  },
];

/**
 * Check if there are any unseen announcements.
 *
 * @param lastSeenAt - The user's last seen timestamp (null if never seen)
 * @returns true if there are announcements newer than lastSeenAt
 */
export function hasUnseenAnnouncements(lastSeenAt: Date | null): boolean {
  if (!lastSeenAt) return announcements.length > 0;

  const newestAnnouncement = announcements[0];
  if (!newestAnnouncement) return false;

  return newestAnnouncement.publishedAt > lastSeenAt;
}

/**
 * Get the count of unseen announcements.
 *
 * @param lastSeenAt - The user's last seen timestamp (null if never seen)
 * @returns Number of announcements newer than lastSeenAt
 */
export function getUnseenCount(lastSeenAt: Date | null): number {
  if (!lastSeenAt) return announcements.length;

  return announcements.filter((announcement) => announcement.publishedAt > lastSeenAt)
    .length;
}

/**
 * Get all announcements with visibility status.
 *
 * @param lastSeenAt - The user's last seen timestamp (null if never seen)
 * @returns All announcements with isNew flag
 */
export function getVisibleAnnouncements(
  lastSeenAt: Date | null
): (Announcement & { isNew: boolean })[] {
  return announcements.map((announcement) => ({
    ...announcement,
    isNew: !lastSeenAt || announcement.publishedAt > lastSeenAt,
  }));
}
