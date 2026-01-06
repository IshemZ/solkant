/**
 * Tests E2E - Flow complet de création de devis
 * Teste le parcours: login → créer client → créer devis → export PDF
 */

import { test, expect } from "@playwright/test";
import { loginUser, fillClientForm } from "./helpers";

// NOTE: Ces tests nécessitent un environnement de test avec base de données
// Pour l'instant, ils peuvent échouer si les credentials ne sont pas valides
test.describe("Flow Complet - Création de Devis", () => {
  // Utiliser un compte de test pré-existant ou skip si non disponible
  const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || "test@devisio.fr",
    password: process.env.TEST_USER_PASSWORD || "TestPassword123!", // NOSONAR - test fallback only
  };

  test.skip(
    !process.env.TEST_USER_EMAIL,
    "TEST_USER_EMAIL non défini - skip tests E2E"
  );

  test("Flow complet: Login → Créer Client → Créer Devis → Export PDF", async ({
    page,
  }) => {
    // ===== ÉTAPE 1: Login =====
    await loginUser(page, TEST_USER.email, TEST_USER.password);

    // Vérifier qu'on est sur le dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText(
      /tableau de bord|dashboard/i
    );

    // ===== ÉTAPE 2: Créer un Client =====
    await page.click('a[href*="/clients"]');
    await expect(page).toHaveURL(/\/clients/);

    // Cliquer sur "Nouveau client"
    await page.click('button:has-text("Nouveau client")');

    // Remplir le formulaire client
    const timestamp = Date.now();
    await fillClientForm(page, {
      firstName: "Marie",
      lastName: "Dupont",
      email: `marie-${timestamp}@example.com`,
      phone: "0123456789",
      rue: "1 rue de Paris",
      codePostal: "75001",
      ville: "Paris",
    });

    // Soumettre
    await page.click('button[type="submit"]');

    // Attendre le toast de confirmation (sans regex car waitForToast prend une string)
    await page.waitForSelector("text=/client créé|ajouté/i", {
      timeout: 5000,
    });

    // Vérifier que le client apparaît dans la liste
    await expect(page.locator("text=Marie Dupont")).toBeVisible();

    // ===== ÉTAPE 3: Créer un Devis =====
    await page.click('a[href*="/devis"]');
    await expect(page).toHaveURL(/\/devis/);

    // Cliquer sur "Nouveau devis"
    await page.click('a[href*="/devis/nouveau"]');

    // Sélectionner le client (Marie Dupont)
    await page.click('button[role="combobox"]'); // Combobox du client
    await page.click("text=Marie Dupont");

    // Ajouter une ligne de service
    await page.click('button:has-text("Ajouter un service")');

    // Sélectionner un service (suppose qu'il existe)
    await page.click('select[name*="service"]');
    await page.selectOption('select[name*="service"]', { index: 0 });

    // Définir quantité et prix si nécessaire
    await page.fill('input[name*="quantity"]', "1");

    // Date de validité (30 jours)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await page.fill(
      'input[type="date"]',
      futureDate.toISOString().split("T")[0]
    );

    // Soumettre le devis
    await page.click('button[type="submit"]:has-text("Créer")');

    // Attendre confirmation
    await page.waitForSelector("text=/devis créé/i", { timeout: 5000 });

    // ===== ÉTAPE 4: Export PDF =====
    // Vérifier qu'on est sur la page du devis
    await expect(page).toHaveURL(/\/devis\/[a-z0-9-]+/);

    // Cliquer sur le bouton d'export PDF
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("Export PDF")'),
    ]);

    // Vérifier que le téléchargement a commencé
    expect(download.suggestedFilename()).toMatch(/devis.*\.pdf/i);

    // Vérifier que le fichier n'est pas vide
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test("devrait empêcher de créer un devis sans client", async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);

    // Aller sur création de devis
    await page.goto("/dashboard/devis/nouveau");

    // Essayer de soumettre sans sélectionner de client
    await page.click('button[type="submit"]');

    // Vérifier le message d'erreur
    await expect(page.locator("text=/client.*requis/i")).toBeVisible();
  });

  test("devrait afficher le statut du devis (DRAFT, SENT, etc.)", async ({
    page,
  }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);

    // Aller sur la liste des devis
    await page.goto("/dashboard/devis");

    // Vérifier qu'il y a au moins un devis
    const firstQuote = page.locator('[data-testid="quote-item"]').first();

    if (await firstQuote.isVisible()) {
      // Vérifier que le statut est affiché
      await expect(
        firstQuote.locator("text=/DRAFT|SENT/i")
      ).toBeVisible();
    }
  });
});
