/**
 * Utilitaires de formatage de dates
 * Évite les problèmes d'hydratation en normalisant les dates entre serveur et client
 */

/** Type pour les valeurs de date acceptées */
type DateInput = Date | string | null | undefined;

/**
 * Formate une date de manière cohérente entre serveur et client
 * Utilise UTC pour éviter les problèmes de timezone lors de l'hydratation
 */
export function formatDate(date: DateInput): string {
  // Gérer les valeurs nulles/undefined
  if (!date) {
    return "—";
  }

  const d = typeof date === "string" ? new Date(date) : date;

  // Vérifier que d est bien un objet Date valide
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return "—";
  }

  // Extraire les composants en UTC pour avoir le même résultat serveur/client
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

/**
 * Formate une date avec l'heure de manière cohérente
 */
export function formatDateTime(date: DateInput): string {
  // Gérer les valeurs nulles/undefined
  if (!date) {
    return "—";
  }

  const d = typeof date === "string" ? new Date(date) : date;

  // Vérifier que d est bien un objet Date valide
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return "—";
  }

  const dateStr = formatDate(d);
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");

  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Formate une date au format ISO (YYYY-MM-DD) pour les inputs
 */
export function formatDateISO(date: DateInput): string {
  // Gérer les valeurs nulles/undefined
  if (!date) {
    return "";
  }

  const d = typeof date === "string" ? new Date(date) : date;

  // Vérifier que d est bien un objet Date valide
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return "";
  }

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
