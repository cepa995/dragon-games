import { expect, test } from '@playwright/test';

test('serves Serbian at /sr (default locale)', async ({ page }) => {
  await page.goto('/sr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'TCG i board games klub od 1994.',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'sr');
});

test('serves English at /en', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'TCG & board games club since 1994.',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('root redirects to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/sr$/);
});
