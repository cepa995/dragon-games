import { expect, test } from '@playwright/test';

test('an unknown in-locale path renders the branded 404', async ({ page }) => {
  const res = await page.goto('/sr/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /nije pronađena/i })).toBeVisible();
  // Recovery links back into the site.
  await expect(page.getByRole('link', { name: /početna/i })).toBeVisible();
});
