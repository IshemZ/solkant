/**
 * Tests E2E - Isolation Multi-Tenant
 * Vérifie qu'un tenant ne peut JAMAIS voir les données d'un autre tenant
 */

import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers";

test.describe("🔒 Isolation Multi-Tenant E2E (CRITICAL)", () => {
  // Ces tests nécessitent 2 comptes de test pré-existants
  const TENANT1 = {
    email: process.env.TENANT1_EMAIL || "tenant1@devisio.fr",
    password: process.env.TENANT1_PASSWORD || "TestPassword123!",
  };

  const TENANT2 = {
    email: process.env.TENANT2_EMAIL || "tenant2@devisio.fr",
    password: process.env.TENANT2_PASSWORD || "TestPassword123!",
  };

  test.skip(
    !process.env.TENANT1_EMAIL || !process.env.TENANT2_EMAIL,
    "Variables d'environnement TENANT1/TENANT2 non définies - skip tests"
  );

  test("🚨 Tenant 1 ne doit PAS voir les clients du Tenant 2", async ({
    browser,
  }) => {
    // Créer 2 contextes de navigateur séparés (2 sessions distinctes)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Login Tenant 1
    await loginUser(page1, TENANT1.email, TENANT1.password);

    // Login Tenant 2
    await loginUser(page2, TENANT2.email, TENANT2.password);

    // Tenant 2 crée un client unique
    await page2.goto("/dashboard/clients");
    await page2.click('button:has-text("Nouveau client")');

    const uniqueId = `tenant2-${Date.now()}`;
    await page2.fill('input[name="firstName"]', `Client-${uniqueId}`);
    await page2.fill('input[name="lastName"]', "Test");
    await page2.fill('input[name="email"]', `${uniqueId}@example.com`);
    await page2.fill('input[name="phone"]', "0123456789");
    await page2.click('button[type="submit"]');

    // Attendre que le client soit créé
    await page2.waitForSelector(`text=Client-${uniqueId}`, { timeout: 5000 });

    // Tenant 1 va sur la liste des clients
    await page1.goto("/dashboard/clients");
    await page1.waitForLoadState("networkidle");

    // Vérifier que le client du Tenant 2 n'apparaît PAS
    const tenant2Client = page1.locator(`text=Client-${uniqueId}`);
    await expect(tenant2Client).not.toBeVisible();

    // Rechercher explicitement (au cas où il serait caché)
    if (await page1.locator('input[type="search"]').isVisible()) {
      await page1.fill('input[type="search"]', uniqueId);
      await page1.waitForTimeout(1000);

      // Toujours pas visible
      await expect(tenant2Client).not.toBeVisible();
    }

    await context1.close();
    await context2.close();
  });

  test("🚨 Tenant 1 ne doit PAS voir les devis du Tenant 2", async ({
    browser,
  }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await loginUser(page1, TENANT1.email, TENANT1.password);
    await loginUser(page2, TENANT2.email, TENANT2.password);

    // Tenant 2 va sur ses devis
    await page2.goto("/dashboard/devis");

    // Récupérer le premier devis du Tenant 2 (s'il existe)
    const firstQuote = page2.locator('[data-testid="quote-item"]').first();

    if (await firstQuote.isVisible()) {
      const quoteNumber = await firstQuote
        .locator('[data-testid="quote-number"]')
        .textContent();

      if (quoteNumber) {
        // Tenant 1 va sur ses devis
        await page1.goto("/dashboard/devis");
        await page1.waitForLoadState("networkidle");

        // Vérifier que le numéro de devis du Tenant 2 n'apparaît PAS
        const tenant2Quote = page1.locator(`text=${quoteNumber}`);
        await expect(tenant2Quote).not.toBeVisible();
      }
    }

    await context1.close();
    await context2.close();
  });

  test("🚨 URLs directes: Tenant 1 ne peut PAS accéder aux ressources du Tenant 2", async ({
    browser,
  }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await loginUser(page1, TENANT1.email, TENANT1.password);
    await loginUser(page2, TENANT2.email, TENANT2.password);

    // Tenant 2 crée un client et récupère son ID
    await page2.goto("/dashboard/clients");
    await page2.click('button:has-text("Nouveau client")');

    const uniqueId = `security-test-${Date.now()}`;
    await page2.fill('input[name="firstName"]', uniqueId);
    await page2.fill('input[name="lastName"]', "Test");
    await page2.fill('input[name="email"]', `${uniqueId}@example.com`);
    await page2.fill('input[name="phone"]', "0123456789");
    await page2.click('button[type="submit"]');

    await page2.waitForSelector(`text=${uniqueId}`);

    // Cliquer sur le client pour aller sur sa page détail
    await page2.click(`text=${uniqueId}`);

    // Récupérer l'URL (contient l'ID du client)
    const clientUrl = page2.url();

    // Tenant 1 essaye d'accéder directement à l'URL du client du Tenant 2
    await page1.goto(clientUrl);

    // Doit voir une erreur 404 ou être redirigé
    await page1.waitForLoadState("networkidle");

    // Vérifier qu'on ne voit PAS les données du client
    await expect(
      page1.locator(`text=${uniqueId}@example.com`)
    ).not.toBeVisible();

    // Vérifier erreur ou redirection
    const is404 = await page1
      .locator("text=/404|non trouvé|not found/i")
      .isVisible();
    const isRedirected = page1.url() !== clientUrl;

    expect(is404 || isRedirected).toBeTruthy();

    await context1.close();
    await context2.close();
  });

  test("🚨 API directe: Les endpoints doivent filtrer par businessId", async ({
    request,
  }) => {
    // Test d'API directe (nécessite API routes testables)
    // Ce test suppose l'existence d'une route GET /api/clients

    // Login pour obtenir un cookie de session
    const loginResponse = await request.post("/api/auth/callback/credentials", {
      data: {
        email: TENANT1.email,
        password: TENANT1.password,
      },
    });

    const cookies = loginResponse.headers()["set-cookie"];

    // Appeler l'API clients
    const clientsResponse = await request.get("/api/clients", {
      headers: {
        Cookie: cookies || "",
      },
    });

    if (clientsResponse.ok()) {
      const clients = await clientsResponse.json();

      // Tous les clients doivent appartenir au même businessId
      const businessIds = new Set(
        clients.map((c: { businessId: string }) => c.businessId)
      );

      expect(businessIds.size).toBe(1); // Un seul businessId
    }
  });
});
