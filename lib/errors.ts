/**
 * Custom Error Classes pour les Server Actions
 *
 * BusinessError = Erreurs métier à afficher aux utilisateurs
 * (ex: "Client introuvable", "Devis déjà envoyé", etc.)
 *
 * Les autres erreurs (Error standard) sont considérées comme des erreurs
 * techniques et leurs messages sont masqués pour la sécurité.
 */

/**
 * Erreur métier - le message sera préservé et affiché à l'utilisateur
 *
 * @example
 * if (!client) {
 *   throw new BusinessError("Client introuvable");
 * }
 */
export class BusinessError extends Error {
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "BusinessError";
    this.code = code;
  }
}
