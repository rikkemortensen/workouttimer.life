const { test, expect } = require('@playwright/test');
const { dismissCookieBanner } = require('./utils');

test.describe('Tab navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('loads directly into the New timer page — there is no login', async ({ page }) => {
    await expect(page.locator('#create-page')).toBeVisible();
    await expect(page.locator('#tab-create')).toHaveClass(/active/);
    // Login is disabled (commented out of the app), so it shouldn't exist in the DOM at all.
    await expect(page.locator('#auth-page')).toHaveCount(0);
  });

  test('switches to History and back to New timer', async ({ page }) => {
    await page.locator('#tab-history').click();
    await expect(page.locator('#history-page')).toBeVisible();
    await expect(page.locator('#create-page')).toBeHidden();
    await expect(page.locator('#tab-history')).toHaveClass(/active/);

    await page.locator('#tab-create').click();
    await expect(page.locator('#create-page')).toBeVisible();
    await expect(page.locator('#history-page')).toBeHidden();
    await expect(page.locator('#tab-create')).toHaveClass(/active/);
  });

  test('navigating back to New timer resets the form to defaults', async ({ page }) => {
    await page.fill('#timer-name', 'Something Custom');
    await page.locator('#tab-history').click();
    await page.locator('#tab-create').click();
    await expect(page.locator('#timer-name')).toHaveValue('');
  });
});
