import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E config. Builds and serves the production app, then runs specs against it.
 * Mobile-first project included since mobile traffic dominates (SRS §2.4).
 * Requires a running database (DATABASE_URL) — `docker compose up -d`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // All e2e requests originate from localhost (one IP), so the per-IP auth
    // limiter would make happy-path specs flaky. Its logic is unit-tested.
    env: { AUTH_RATE_LIMIT_DISABLED: '1' },
  },
});
