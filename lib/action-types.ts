/**
 * Type unifié pour les résultats des Server Actions
 *
 * Ce type utilise un discriminant `success` pour permettre le type narrowing
 * et garantir une gestion d'erreurs cohérente dans toute l'application.
 *
 * @example
 * // Dans une Server Action
 * export async function createClient(input: CreateClientInput): Promise<ActionResult<Client>> {
 *   try {
 *     const client = await prisma.client.create({ data: input });
 *     return { success: true, data: client };
 *   } catch (error) {
 *     return { success: false, error: "Une erreur est survenue", code: "CREATE_ERROR" };
 *   }
 * }
 *
 * // Dans un composant
 * const result = await createClient(input);
 * if (result.success) {
 *   console.log(result.data); // TypeScript sait que data existe
 * } else {
 *   console.error(result.error); // TypeScript sait qu'error existe
 * }
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; fieldErrors?: Record<string, string[]> };

/**
 * Helper pour créer un résultat de succès
 */
export function successResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Helper pour créer un résultat d'erreur
 */
export function errorResult<T>(
  error: string,
  code?: string,
  fieldErrors?: Record<string, string[]>
): ActionResult<T> {
  return { success: false, error, code, fieldErrors };
}

/**
 * Types spécifiques pour les actions courantes
 */
export type VoidActionResult = ActionResult<void>;
export type BooleanActionResult = ActionResult<boolean>;
