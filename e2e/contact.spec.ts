import { expect, test } from '@playwright/test';

// Note: the over-rate (3/min/IP) rejection path is covered by the contact-action
// unit test, because the e2e server runs with the rate limiter disabled
// (AUTH_RATE_LIMIT_DISABLED) so happy-path specs aren't flaky on a shared IP.

test('contact form submits successfully', async ({ page }) => {
  await page.goto('/sr/contact');
  await page.fill('input[name="name"]', 'Marko Marković');
  await page.fill('input[name="email"]', `e2e+${Date.now()}@example.com`);
  await page.fill('input[name="subject"]', 'E2E pitanje');
  await page.fill('textarea[name="message"]', 'Ovo je test poruka dovoljno duga za slanje.');
  await page.click('button[type="submit"]');
  await expect(page.getByText(/poruka je poslata/i)).toBeVisible();
});

test('contact page lists channels and an embedded map', async ({ page }) => {
  await page.goto('/sr/contact');
  await expect(page.locator('iframe[src*="google.com/maps"]')).toBeVisible();
  // Viber appears in the contact channels (and again in the footer).
  await expect(page.getByRole('link', { name: /viber/i }).first()).toBeVisible();
});
