const { test, expect } = require('@playwright/test');
const { dismissCookieBanner, fillTimerForm } = require('./utils');

test.describe('History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('is empty before any timer has been run', async ({ page }) => {
    await page.locator('#tab-history').click();
    await expect(page.locator('#history-list-container')).toContainText('No timers yet.');
  });

  test('records a run and lets you start it again from history', async ({ page }) => {
    await fillTimerForm(page, { name: 'Leg Day', rounds: 1, activities: 1, activityTime: 5 });
    await page.click('#go-btn');
    await expect(page.locator('#run-page')).toBeVisible();

    await page.locator('#tab-history').click();
    const entry = page.locator('.timer-item', { hasText: 'Leg Day' });
    await expect(entry).toBeVisible();
    await expect(entry).toContainText('1 rounds · 1 exercises · ~00:05');

    await entry.click();
    await expect(page.locator('#run-page')).toBeVisible();
    await expect(page.locator('#run-timer-name')).toHaveText('Leg Day');
  });

  test('keeps the most recent run at the top of the list', async ({ page }) => {
    await fillTimerForm(page, { name: 'First Timer' });
    await page.click('#go-btn');
    await page.locator('#tab-create').click();

    await fillTimerForm(page, { name: 'Second Timer' });
    await page.click('#go-btn');

    await page.locator('#tab-history').click();
    const names = page.locator('.timer-item .timer-item-name');
    await expect(names.first()).toHaveText('Second Timer');
    await expect(names.nth(1)).toHaveText('First Timer');
  });

  test('"Clear history" empties the list after confirmation', async ({ page }) => {
    await fillTimerForm(page, { name: 'Arm Day' });
    await page.click('#go-btn');
    await page.locator('#tab-history').click();
    await expect(page.locator('.timer-item')).toHaveCount(1);

    page.once('dialog', dialog => dialog.accept());
    await page.locator('button', { hasText: 'Clear history' }).click();
    await expect(page.locator('#history-list-container')).toContainText('No timers yet.');
  });

  test('history persists across a page reload (stored in localStorage)', async ({ page }) => {
    await fillTimerForm(page, { name: 'Persisted Timer' });
    await page.click('#go-btn');

    await page.reload();
    await dismissCookieBanner(page);
    await page.locator('#tab-history').click();
    await expect(page.locator('.timer-item', { hasText: 'Persisted Timer' })).toBeVisible();
  });
});
