const { test, expect } = require('@playwright/test');
const { dismissCookieBanner } = require('./utils');

test.describe('New timer form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('requires a name', async ({ page }) => {
    await page.click('#go-btn'); // name field is blank by default
    await expect(page.locator('#create-alert')).toBeVisible();
    await expect(page.locator('#create-alert')).toHaveText('Please enter a timer name.');
    await expect(page.locator('#run-page')).toBeHidden();
  });

  test('requires at least 1 round', async ({ page }) => {
    await page.fill('#timer-name', 'My Timer');
    await page.fill('#num-rounds', '0');
    await page.click('#go-btn');
    await expect(page.locator('#create-alert')).toHaveText('Rounds must be at least 1.');
  });

  test('requires at least 1 exercise per round', async ({ page }) => {
    await page.fill('#timer-name', 'My Timer');
    await page.fill('#num-activities', '0');
    await page.click('#go-btn');
    await expect(page.locator('#create-alert')).toHaveText('Exercises must be at least 1.');
  });

  test('requires exercise time of at least 1 second', async ({ page }) => {
    await page.fill('#timer-name', 'My Timer');
    await page.fill('#act-time', '0');
    await page.click('#go-btn');
    await expect(page.locator('#create-alert')).toHaveText('Exercise time must be at least 1 s.');
  });

  test('a valid form starts the run screen', async ({ page }) => {
    await page.fill('#timer-name', 'Morning HIIT');
    await page.click('#go-btn');
    await expect(page.locator('#create-alert')).toBeHidden();
    await expect(page.locator('#run-page')).toBeVisible();
    await expect(page.locator('#run-timer-name')).toHaveText('Morning HIIT');
  });

  test('the form defaults to sensible starting values', async ({ page }) => {
    await expect(page.locator('#num-rounds')).toHaveValue('3');
    await expect(page.locator('#num-activities')).toHaveValue('4');
    await expect(page.locator('#act-time')).toHaveValue('40');
    await expect(page.locator('#act-break')).toHaveValue('20');
    await expect(page.locator('#round-break')).toHaveValue('60');
    await expect(page.locator('#dir-down')).toBeChecked();
    await expect(page.locator('#dir-up')).not.toBeChecked();
  });
});
