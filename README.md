# Interval Timer

A single-file interval/HIIT timer (`index.html`). Login and cloud sync are
currently disabled (see comments in `index.html`) — the app runs entirely
client-side, with run history kept in the browser's `localStorage`.

## Running the tests locally

Requires Node.js 18+.

```bash
npm install
npx playwright install --with-deps   # one-time browser download
npm test                             # runs the full system-test suite
npm run test:ui                      # interactive UI mode
npm run report                       # view the last HTML report
```

The tests start a throwaway local static server for `index.html`
automatically (see `webServer` in `playwright.config.js`) — no deployment or
backend needed.

## What's covered

- **Cookie banner** — shown on first visit, dismiss persists, "Learn more"
  modal opens/closes.
- **Navigation** — tab switching between "New timer" and "History", and that
  the app lands directly on "New timer" (no login screen).
- **Form validation** — every required-field error on the "New timer" form.
- **Running a timer** — initial state, count-up vs count-down, play/pause,
  skip, restart, completing a full timer, and the buttons on the completion
  screen.
- **History** — a run is recorded locally, can be re-started from history,
  most-recent-first ordering, "Clear history", and that it survives a reload.
- **Icons** — regression guard confirming the play/pause/skip/restart and
  count-up/down icons are SVG (not emoji, which render inconsistently across
  phones/desktops).

## CI/CD

`.github/workflows/playwright.yml` runs the full suite on every push and pull
request to `main` (and can be triggered manually from the Actions tab). It
uploads the HTML report as a build artifact so failures are easy to inspect.

## Pushing this to GitHub

This project was built locally and hasn't been pushed anywhere yet. To get
it onto GitHub and have CI start running automatically:

1. Create a new, empty repository on [github.com/new](https://github.com/new)
   (don't initialize it with a README/`.gitignore` — this project already has
   both).
2. In a terminal, from this folder:
   ```bash
   git init
   git add -A
   git commit -m "Add interval timer app with Playwright system tests and CI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. Open the **Actions** tab on the new GitHub repo — the "Playwright system
   tests" workflow will already be running against your first push.

From then on, every push (and every pull request) to `main` automatically
re-runs the full system-test suite.
