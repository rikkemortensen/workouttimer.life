const { test, expect } = require('@playwright/test');

test.describe('Cookie banner', () => {
  test('is shown on first visit and can be dismissed', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('local storage');

    await banner.locator('.cookie-btn').click();
    await expect(banner).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem('it_cookie_ok'));
    expect(stored).toBe('1');
  });

  test('stays dismissed after a reload', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-banner .cookie-btn').click();

    await page.reload();
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('"Learn more" opens a detail modal that can be closed', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-banner a', { hasText: 'Learn more' }).click();

    const modal = page.locator('#cookie-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('How your data is stored');

    await modal.locator('.cookie-modal-close').click();
    await expect(modal).toBeHidden();
  });

  test('clicking outside the modal closes it', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-banner a', { hasText: 'Learn more' }).click();

    const modal = page.locator('#cookie-modal');
    await expect(modal).toBeVisible();
    await modal.click({ position: { x: 5, y: 5 } }); // backdrop, outside the box
    await expect(modal).toBeHidden();
  });
});
