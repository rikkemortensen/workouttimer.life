const { test, expect } = require('@playwright/test');
const { dismissCookieBanner, fillTimerForm } = require('./utils');

// The play/pause, skip, restart and count-up/down controls were switched from
// emoji glyphs to inline SVG icons so they render identically on every
// platform (some phones render text glyphs like ▶ ⏭ ⬆ as colourful emoji).
// These tests guard against that regression by asserting an <svg> is present
// and no emoji character sneaks back into the button/label text.

test.describe('Icons render as SVG, not emoji', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
  });

  test('direction toggle uses SVG arrows', async ({ page }) => {
    const down = page.locator('label[for="dir-down"]');
    const up = page.locator('label[for="dir-up"]');
    await expect(down.locator('svg')).toHaveCount(1);
    await expect(up.locator('svg')).toHaveCount(1);
    await expect(down).toHaveText('Count down');
    await expect(up).toHaveText('Count up');
  });

  test('run controls (restart / play / skip) use SVG icons', async ({ page }) => {
    await fillTimerForm(page, {});
    await page.click('#go-btn');

    await expect(page.locator('button[title="Restart"] svg')).toHaveCount(1);
    await expect(page.locator('#play-pause-btn svg')).toHaveCount(1);
    await expect(page.locator('button[title="Skip"] svg')).toHaveCount(1);

    // The play icon should swap for a pause icon once playing, and back again.
    const playBtnHtmlBefore = await page.locator('#play-pause-btn').innerHTML();
    await page.click('#play-pause-btn');
    const playBtnHtmlDuring = await page.locator('#play-pause-btn').innerHTML();
    expect(playBtnHtmlDuring).not.toBe(playBtnHtmlBefore);
    await page.click('#play-pause-btn');
    const playBtnHtmlAfter = await page.locator('#play-pause-btn').innerHTML();
    expect(playBtnHtmlAfter).toBe(playBtnHtmlBefore);
  });
});
