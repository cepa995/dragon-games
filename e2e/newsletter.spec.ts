import { expect, test } from '@playwright/test';

test('newsletter signup shows the double opt-in confirmation message', async ({ page }) => {
  await page.goto('/sr');
  const input = page.locator('form input[name="email"]').last();
  await input.scrollIntoViewIfNeeded();
  await input.fill(`e2e+${Date.now()}@example.com`);
  await input.press('Enter');
  // Success copy asks the user to check their inbox to confirm (double opt-in).
  await expect(page.getByText(/proveri email/i)).toBeVisible();
});

test('an invalid confirm token shows an error', async ({ page }) => {
  await page.goto('/sr/newsletter/confirm?token=invalid-token');
  await expect(page.getByRole('heading', { name: /nije važeći/i })).toBeVisible();
});

test('an invalid unsubscribe token shows an error', async ({ page }) => {
  await page.goto('/sr/newsletter/unsubscribe?token=invalid-token');
  await expect(page.getByRole('heading', { name: /nije važeći/i })).toBeVisible();
});
