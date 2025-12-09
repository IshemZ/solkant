/**
 * Helpers pour les tests E2E Playwright
 */

import { Page } from "@playwright/test";

/**
 * Login helper - authentifie un utilisateur pour les tests
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Attendre la redirection vers le dashboard
  await page.waitForURL("/dashboard", { timeout: 10000 });
}

/**
 * Logout helper
 */
export async function logoutUser(page: Page): Promise<void> {
  // Cliquer sur le menu utilisateur et déconnexion
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');

  // Attendre la redirection vers login
  await page.waitForURL("/login", { timeout: 5000 });
}

/**
 * Créer un utilisateur de test via l'API
 */
export async function createTestUser(
  email: string,
  password: string,
  businessName: string
): Promise<{ email: string; password: string; businessName: string }> {
  // En production, utiliser l'API pour créer un user
  // Pour l'instant, retourne les données pour mock
  return { email, password, businessName };
}

/**
 * Nettoyer les données de test après les tests
 */
export async function cleanupTestData(page: Page): Promise<void> {
  // Dans un vrai scénario, appeler une route API de nettoyage
  // Pour l'instant, juste logout
  try {
    await logoutUser(page);
  } catch {
    // Ignore si déjà déconnecté
  }
}

/**
 * Attendre qu'un toast/notification apparaisse
 */
export async function waitForToast(
  page: Page,
  message?: string
): Promise<void> {
  if (message) {
    await page.waitForSelector(`text="${message}"`, { timeout: 5000 });
  } else {
    await page.waitForSelector('[role="status"]', { timeout: 5000 });
  }
}

/**
 * Remplir un formulaire de client
 */
export async function fillClientForm(
  page: Page,
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  }
): Promise<void> {
  await page.fill('input[name="firstName"]', client.firstName);
  await page.fill('input[name="lastName"]', client.lastName);
  await page.fill('input[name="email"]', client.email);
  await page.fill('input[name="phone"]', client.phone);

  if (client.address) {
    await page.fill('textarea[name="address"]', client.address);
  }
}

/**
 * Vérifier l'accessibilité d'une page avec axe-core
 */
export async function checkA11y(page: Page): Promise<void> {
  const AxeBuilder = (await import("@axe-core/playwright")).default;

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  if (accessibilityScanResults.violations.length > 0) {
    console.error(
      "Violations d'accessibilité détectées:",
      accessibilityScanResults.violations
    );
    throw new Error(
      `${accessibilityScanResults.violations.length} violation(s) d'accessibilité trouvée(s)`
    );
  }
}
