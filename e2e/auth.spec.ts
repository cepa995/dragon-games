import { expect, test } from '@playwright/test';

function uniqueEmail() {
  return `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
}

test('a visitor can register and then log in', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'password123';

  // Register
  await page.goto('/sr/register');
  await page.locator('input[name="name"]').fill('E2E Korisnik');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Kreiraj nalog' }).click();
  await expect(page.getByText('Nalog je kreiran')).toBeVisible();

  // Log in with the credentials form (the first form on the page)
  await page.goto('/sr/login');
  const credentials = page.locator('form').first();
  await credentials.locator('input[name="email"]').fill(email);
  await credentials.locator('input[name="password"]').fill(password);
  await credentials.getByRole('button', { name: 'Prijavi se' }).click();

  await expect(page).toHaveURL(/\/sr$/);
  const cookies = await page.context().cookies();
  expect(cookies.some((c) => c.name.includes('authjs.session-token'))).toBe(true);
});

test('invalid credentials show an error', async ({ page }) => {
  await page.goto('/sr/login');
  const credentials = page.locator('form').first();
  await credentials.locator('input[name="email"]').fill('nobody@example.com');
  await credentials.locator('input[name="password"]').fill('wrongpassword');
  await credentials.getByRole('button', { name: 'Prijavi se' }).click();
  await expect(page.getByText('Pogrešan email ili lozinka')).toBeVisible();
});

test('forgot-password always reports success (no account enumeration)', async ({ page }) => {
  await page.goto('/sr/forgot-password');
  await page.locator('input[name="email"]').fill('whoever@example.com');
  await page.getByRole('button', { name: 'Pošalji link za resetovanje' }).click();
  await expect(page.getByText('poslali smo link')).toBeVisible();
});
