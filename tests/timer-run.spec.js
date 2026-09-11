const { test, expect } = require('@playwright/test');
const { dismissCookieBanner, fillTimerForm } = require('./utils');

test.describe('Running a timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('starts paused, showing the first exercise and the full duration', async ({ page }) => {
    await fillTimerForm(page, { name: 'Squats', rounds: 2, activities: 2, activityTime: 5 });
    await page.click('#go-btn');

    await expect(page.locator('#run-timer-name')).toHaveText('Squats');
    await expect(page.locator('#phase-label')).toHaveText('Exercise 1/2');
    await expect(page.locator('#round-label')).toHaveText('Round 1/2');
    await expect(page.locator('#countdown-display')).toHaveText('5');
  });

  test('count-up direction starts the display at 0', async ({ page }) => {
    await fillTimerForm(page, { activityTime: 8, direction: 'up' });
    await page.click('#go-btn');
    await expect(page.locator('#countdown-display')).toHaveText('0');
  });

  test('play counts down, pause freezes the display', async ({ page }) => {
    await fillTimerForm(page, { activityTime: 20 });
    await page.click('#go-btn');

    await page.click('#play-pause-btn'); // play
    await page.waitForTimeout(1500);
    await page.click('#play-pause-btn'); // pause

    const frozen = await page.locator('#countdown-display').textContent();
    expect(Number(frozen)).toBeLessThan(20);
    await page.waitForTimeout(800);
    await expect(page.locator('#countdown-display')).toHaveText(frozen);
  });

  test('skip advances through exercises and rests', async ({ page }) => {
    await fillTimerForm(page, { rounds: 1, activities: 2, activityTime: 30, actBreak: 5 });
    await page.click('#go-btn');

    await expect(page.locator('#phase-label')).toHaveText('Exercise 1/2');
    await page.click('button[title="Skip"]');
    await expect(page.locator('#phase-label')).toHaveText('Rest');
    await page.click('button[title="Skip"]');
    await expect(page.locator('#phase-label')).toHaveText('Exercise 2/2');
  });

  test('restart resets progress back to the first step', async ({ page }) => {
    await fillTimerForm(page, { rounds: 1, activities: 2, activityTime: 30 });
    await page.click('#go-btn');

    await page.click('button[title="Skip"]');
    await expect(page.locator('#phase-label')).toHaveText('Exercise 2/2');

    await page.click('button[title="Restart"]');
    await expect(page.locator('#phase-label')).toHaveText('Exercise 1/2');
    await expect(page.locator('#countdown-display')).toHaveText('30');
  });

  test('finishing all rounds shows the completion screen', async ({ page }) => {
    await fillTimerForm(page, { name: 'Quick Test', rounds: 1, activities: 1, activityTime: 1 });
    await page.click('#go-btn');
    await page.click('#play-pause-btn');

    await expect(page.locator('#run-done')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.done-title')).toHaveText('You did it!');
    await expect(page.locator('#done-sub')).toHaveText('1 rounds × 1 exercises completed!');
    await expect(page.locator('#run-running')).toBeHidden();
  });

  test('"New timer" from the completion screen returns to the create page', async ({ page }) => {
    await fillTimerForm(page, { rounds: 1, activities: 1, activityTime: 1 });
    await page.click('#go-btn');
    await page.click('#play-pause-btn');
    await expect(page.locator('#run-done')).toBeVisible({ timeout: 5000 });

    await page.locator('.done-btns .btn-secondary').click();
    await expect(page.locator('#create-page')).toBeVisible();
  });

  test('"Restart" from the completion screen runs the timer again', async ({ page }) => {
    await fillTimerForm(page, { rounds: 1, activities: 1, activityTime: 1 });
    await page.click('#go-btn');
    await page.click('#play-pause-btn');
    await expect(page.locator('#run-done')).toBeVisible({ timeout: 5000 });

    await page.locator('.done-btns .btn-primary').click();
    await expect(page.locator('#run-running')).toBeVisible();
    await expect(page.locator('#run-done')).toBeHidden();
    await expect(page.locator('#phase-label')).toHaveText('Exercise 1/1');
  });

  test('back button on the run screen returns to the create page', async ({ page }) => {
    await fillTimerForm(page, {});
    await page.click('#go-btn');
    await page.locator('.run-header .back-btn').click();
    await expect(page.locator('#create-page')).toBeVisible();
  });
});
