/**
 * Announcements Configuration
 *
 * Manages the list of announcements shown in the announcements center.
 * New announcements should be added to the top of the array.
 */

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export interface VisibleAnnouncement extends Announcement {
  isNew: boolean;
}

/**
 * List of all announcements, sorted by date descending (newest first).
 * Add new announcements to the top of this array.
 */
export const announcements: Announcement[] = [
  {
    id: 'forfaits-2025-01',
    title: 'Nouveaux forfaits disponibles',
    description:
      'Créez des forfaits personnalisés pour vos clients réguliers. Parfait pour les abonnements mensuels ou les packages de prestations.',
    date: new Date('2025-01-06T10:00:00Z'),
  },
  {
    id: 'payment-schedule-2025-01',
    title: 'Paiements en plusieurs fois',
    description:
      'Proposez des paiements échelonnés à vos clients. Configurez le nombre d\'acomptes et les montants dans vos devis.',
    date: new Date('2025-01-05T09:00:00Z'),
  },
  {
    id: 'pdf-prefix-2025-01',
    title: 'Personnalisation des PDF',
    description:
      'Ajoutez un préfixe personnalisé à vos numéros de devis (ex: DEV-001). Configurez-le dans les paramètres de votre entreprise.',
    date: new Date('2025-01-04T09:15:00Z'),
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

  return newestAnnouncement.date > lastSeenAt;
}

/**
 * Get the count of unseen announcements.
 *
 * @param lastSeenAt - The user's last seen timestamp (null if never seen)
 * @returns Number of announcements newer than lastSeenAt
 */
export function getUnseenCount(lastSeenAt: Date | null): number {
  if (!lastSeenAt) return announcements.length;

  return announcements.filter((announcement) => announcement.date > lastSeenAt)
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
): VisibleAnnouncement[] {
  return announcements.map((announcement) => ({
    ...announcement,
    isNew: !lastSeenAt || announcement.date > lastSeenAt,
  }));
}
