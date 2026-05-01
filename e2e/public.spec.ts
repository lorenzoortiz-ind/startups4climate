import { test, expect } from '@playwright/test';

test.describe('Public Pages Smoke Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Startups4Climate').first()).toBeVisible();
    await expect(page.locator('text=Plataforma').first()).toBeVisible();
    // Check that there is at least one call to action
    await expect(page.locator('button', { hasText: /Ingresar|Acceder/i }).first()).toBeVisible();
  });

  test('Workbook page loads correctly', async ({ page }) => {
    await page.goto('/workbook');
    // We expect some content related to the workbook
    await expect(page.locator('text=Startups4Climate').first()).toBeVisible();
  });

  test('Organizations page loads correctly', async ({ page }) => {
    await page.goto('/organizaciones');
    // We expect some content related to organizations
    await expect(page.locator('text=Startups4Climate').first()).toBeVisible();
  });
});
