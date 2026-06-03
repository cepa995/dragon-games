import { expect, test } from '@playwright/test';

test('about page renders the history, story and CTAs', async ({ page }) => {
  await page.goto('/sr/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('1994').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /pogledaj lokaciju/i })).toBeVisible();
});

test('locations page shows map, address, live status and directions', async ({ page }) => {
  await page.goto('/sr/locations');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('iframe[src*="google.com/maps"]')).toBeVisible();
  await expect(page.getByText('Kralja Aleksandra 4').first()).toBeVisible();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.locator('a[href*="google.com/maps/dir"]')).toBeVisible();
});

test('locations page is localized in English', async ({ page }) => {
  await page.goto('/en/locations');
  await expect(page.getByRole('heading', { name: 'Visit us' })).toBeVisible();
});
