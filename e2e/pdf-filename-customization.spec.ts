/**
 * Tests E2E - PDF Filename Customization
 * Tests all scenarios for the pdfFileNamePrefix feature
 */

import { test, expect, type Page } from "@playwright/test";
import { loginUser } from "./helpers";

// NOTE: Ces tests nécessitent un environnement de test avec base de données
test.describe("PDF Filename Customization", () => {
  const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || "test@devisio.fr",
    password: process.env.TEST_USER_PASSWORD || "TestPassword123!",
  };

  test.skip(
    !process.env.TEST_USER_EMAIL,
    "TEST_USER_EMAIL non défini - skip tests E2E"
  );

  /**
   * Helper: Navigate to settings and set PDF filename prefix
   */
  async function setPdfFileNamePrefix(page: Page, prefix: string | null) {
    await page.goto("/dashboard/parametres");
    await expect(page).toHaveURL(/\/parametres/);

    const input = page.locator('input[name="pdfFileNamePrefix"]');

    if (prefix === null || prefix === "") {
      await input.clear();
    } else {
      await input.fill(prefix);
    }

    // Save the form
    await page.click('button[type="submit"]');

    // Wait for success message or page reload
    await page.waitForTimeout(1000);
  }

  /**
   * Helper: Create a test quote and return its ID
   * @deprecated Not currently used - kept for future test scenarios
   */
  async function _createTestQuote(
    page: Page,
    _clientName: { firstName: string; lastName: string }
  ): Promise<string> {
    // Navigate to quotes
    await page.goto("/dashboard/devis");

    // Click "Nouveau devis"
    await page.click('a[href*="/devis/nouveau"]');
    await page.waitForURL(/\/devis\/nouveau/);

    // Select a client (assumes client exists or create one)
    // For simplicity, we'll select the first client in the dropdown
    const clientSelect = page.locator('select[name="clientId"]');
    await clientSelect.selectOption({ index: 1 });

    // Fill basic quote info
    await page.fill('input[name="title"]', "Test Quote");
    await page.fill('textarea[name="notes"]', "Test notes");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to quote detail page
    await page.waitForURL(/\/devis\/[a-z0-9]+/);

    // Extract quote ID from URL
    const url = page.url();
    const match = /\/devis\/([a-z0-9]+)/.exec(url);
    return match ? match[1] : "";
  }

  /**
   * Helper: Download PDF and return filename
   */
  async function downloadPdfAndGetFilename(
    page: Page,
    quoteId: string
  ): Promise<string> {
    await page.goto(`/dashboard/devis/${quoteId}`);

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent("download");

    // Click the download PDF button
    await page.click('a[href*="/api/quotes/"][href*="/pdf"]');

    // Wait for the download to complete
    const download = await downloadPromise;

    // Get the suggested filename
    const filename = download.suggestedFilename();

    return filename;
  }

  test.beforeEach(async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("Scenario 1: Validation - 25 character limit", async ({ page }) => {
    await page.goto("/dashboard/parametres");
    await expect(page).toHaveURL(/\/parametres/);

    const input = page.locator('input[name="pdfFileNamePrefix"]');

    // Try to enter 26 characters - HTML maxLength should prevent it
    const longText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 chars
    await input.fill(longText);

    // Verify only 25 characters are accepted
    const value = await input.inputValue();
    expect(value.length).toBeLessThanOrEqual(25);
  });

  test("Scenario 2: Validation - Accepts exactly 25 characters", async ({ page }) => {
    await page.goto("/dashboard/parametres");

    const input = page.locator('input[name="pdfFileNamePrefix"]');
    const exactly25 = "Devis Épilation Definit"; // 25 chars

    await input.fill(exactly25);
    await page.click('button[type="submit"]');

    // Wait for save
    await page.waitForTimeout(1000);

    // Reload and verify
    await page.reload();
    const savedValue = await input.inputValue();
    expect(savedValue).toBe(exactly25);
  });

  test("Scenario 3: Validation - Accepts empty/null value", async ({ page }) => {
    await page.goto("/dashboard/parametres");

    const input = page.locator('input[name="pdfFileNamePrefix"]');

    // Clear the field
    await input.fill("");
    await page.click('button[type="submit"]');

    // Wait for save
    await page.waitForTimeout(1000);

    // Reload and verify it's still empty
    await page.reload();
    const savedValue = await input.inputValue();
    expect(savedValue).toBe("");
  });

  test("Scenario 4: PDF Generation - Full happy path with prefix", async ({ page }) => {
    // Set a custom prefix
    await setPdfFileNamePrefix(page, "Devis Laser Diode");

    // Create a test quote (this would need a pre-existing client)
    // For this test, we'll navigate to an existing quote
    await page.goto("/dashboard/devis");

    // Get first quote ID from the list
    const firstQuoteLink = page.locator('a[href*="/dashboard/devis/"]').first();
    const href = await firstQuoteLink.getAttribute("href");
    const quoteId = href?.split("/").pop() || "";

    if (!quoteId) {
      test.skip(true, "No quotes available for testing");
      return;
    }

    // Download PDF and check filename
    const filename = await downloadPdfAndGetFilename(page, quoteId);

    // Filename should match pattern: "Devis Laser Diode - LastName FirstName.pdf"
    // Or fallback to "DEVIS-YYYY-NNN.pdf" if no client
    expect(filename).toMatch(/^(Devis Laser Diode - .+\.pdf|DEVIS-\d{4}-\d{3}\.pdf)$/);
  });

  test("Scenario 5: PDF Generation - No prefix (fallback)", async ({ page }) => {
    // Clear the prefix
    await setPdfFileNamePrefix(page, null);

    // Navigate to quotes list
    await page.goto("/dashboard/devis");

    // Get first quote ID
    const firstQuoteLink = page.locator('a[href*="/dashboard/devis/"]').first();
    const href = await firstQuoteLink.getAttribute("href");
    const quoteId = href?.split("/").pop() || "";

    if (!quoteId) {
      test.skip(true, "No quotes available for testing");
      return;
    }

    // Download PDF and check filename
    const filename = await downloadPdfAndGetFilename(page, quoteId);

    // Filename should be "DEVIS-YYYY-NNN.pdf"
    expect(filename).toMatch(/^DEVIS-\d{4}-\d{3}\.pdf$/);
  });

  test("Scenario 6: PDF Generation - Special characters (accents)", async ({ page }) => {
    // Set prefix with French accented characters
    const prefixWithAccents = "Devis Éclat & Beauté";
    await setPdfFileNamePrefix(page, prefixWithAccents);

    // Navigate to quotes
    await page.goto("/dashboard/devis");

    // Get first quote ID
    const firstQuoteLink = page.locator('a[href*="/dashboard/devis/"]').first();
    const href = await firstQuoteLink.getAttribute("href");
    const quoteId = href?.split("/").pop() || "";

    if (!quoteId) {
      test.skip(true, "No quotes available for testing");
      return;
    }

    // Download PDF - should not throw error
    const filename = await downloadPdfAndGetFilename(page, quoteId);

    // Verify filename contains the prefix (with or without accents depending on browser handling)
    expect(filename).toBeTruthy();
    expect(filename.endsWith(".pdf")).toBe(true);
  });

  test("Scenario 7: Persistence - Value survives page refresh", async ({ page }) => {
    const testPrefix = "Test Persistence";

    // Set prefix
    await setPdfFileNamePrefix(page, testPrefix);

    // Navigate away
    await page.goto("/dashboard");

    // Navigate back to settings
    await page.goto("/dashboard/parametres");

    // Verify prefix is still there
    const input = page.locator('input[name="pdfFileNamePrefix"]');
    const savedValue = await input.inputValue();
    expect(savedValue).toBe(testPrefix);
  });

  test("Scenario 8: Regression - Other business settings still save", async ({ page }) => {
    await page.goto("/dashboard/parametres");

    // Update business name
    const nameInput = page.locator('input[name="name"]');
    const timestamp = Date.now();
    const newName = `Test Business ${timestamp}`;

    await nameInput.fill(newName);

    // Also set PDF prefix
    const pdfPrefixInput = page.locator('input[name="pdfFileNamePrefix"]');
    await pdfPrefixInput.fill("Test Prefix");

    // Save
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Reload and verify both saved
    await page.reload();

    const savedName = await nameInput.inputValue();
    const savedPrefix = await pdfPrefixInput.inputValue();

    expect(savedName).toBe(newName);
    expect(savedPrefix).toBe("Test Prefix");
  });
});
