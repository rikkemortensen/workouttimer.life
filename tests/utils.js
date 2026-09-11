/**
 * Shared helpers for the Interval Timer system tests.
 */

/** Dismiss the cookie consent banner if it's showing. */
async function dismissCookieBanner(page) {
  const gotIt = page.locator('#cookie-banner .cookie-btn');
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
  }
}

/**
 * Fill in the "New timer" form. Defaults are deliberately tiny
 * (1 round, 1 exercise, short durations) so tests that run a timer
 * to completion stay fast; override any field as needed per test.
 */
async function fillTimerForm(page, {
  name = 'Test Timer',
  rounds = 1,
  activities = 1,
  activityTime = 5,
  actBreak = 0,
  roundBreak = 0,
  direction = 'down',
} = {}) {
  await page.fill('#timer-name', name);
  await page.fill('#num-rounds', String(rounds));
  await page.fill('#num-activities', String(activities));
  await page.fill('#act-time', String(activityTime));
  await page.fill('#act-break', String(actBreak));
  await page.fill('#round-break', String(roundBreak));
  if (direction === 'up') {
    await page.check('#dir-up');
  } else {
    await page.check('#dir-down');
  }
}

module.exports = { dismissCookieBanner, fillTimerForm };
