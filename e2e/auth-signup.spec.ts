/**
 * Tests E2E - Flow complet d'inscription
 * Teste le parcours: inscription → création Business → redirection dashboard
 */

import { test, expect } from "@playwright/test";
import { checkA11y } from "./helpers";

test.describe("Inscription et Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("devrait afficher le formulaire d'inscription", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(
      /inscription|créer un compte/i
    );
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="businessName"]')).toBeVisible();
  });

  test("devrait valider les champs requis", async ({ page }) => {
    // Soumettre le formulaire vide
    await page.click('button[type="submit"]');

    // Vérifier les messages d'erreur
    await expect(page.locator("text=/email.*requis/i")).toBeVisible({
      timeout: 3000,
    });
  });

  test("devrait créer un compte avec Business automatiquement", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;

    // Remplir le formulaire
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', "TestPassword123!");
    await page.fill('input[name="businessName"]', "Salon Test");

    // Soumettre
    await page.click('button[type="submit"]');

    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Vérifier que le nom du business apparaît
    await expect(page.locator("text=/Salon Test/i")).toBeVisible({
      timeout: 5000,
    });
  });

  test("devrait être accessible (a11y)", async ({ page }) => {
    await checkA11y(page);
  });

  test("devrait afficher une erreur si l'email existe déjà", async ({
    page,
  }) => {
    // Utiliser un email qui existe probablement
    await page.fill('input[name="email"]', "existing@example.com");
    await page.fill('input[name="password"]', "TestPassword123!");
    await page.fill('input[name="businessName"]', "Salon Test");

    await page.click('button[type="submit"]');

    // Vérifier le message d'erreur (peut varier selon l'implémentation)
    await expect(
      page.locator("text=/existe déjà|already exists/i")
    ).toBeVisible({ timeout: 5000 });
  });
});
