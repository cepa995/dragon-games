import { expect, test } from '@playwright/test';

function uniqueEmail() {
  return `acct_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
}

async function registerAndLogin(page: import('@playwright/test').Page, email: string) {
  const password = 'password123';
  await page.goto('/sr/register');
  await page.locator('input[name="name"]').fill('E2E');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Kreiraj nalog' }).click();
  await expect(page.getByText('Nalog je kreiran')).toBeVisible();

  await page.goto('/sr/login');
  const form = page.locator('form').first();
  await form.locator('input[name="email"]').fill(email);
  await form.locator('input[name="password"]').fill(password);
  await form.getByRole('button', { name: 'Prijavi se' }).click();
  await expect(page).toHaveURL(/\/sr$/);
}

test('a member can update their profile and add an address', async ({ page }) => {
  await registerAndLogin(page, uniqueEmail());

  // Update profile
  await page.goto('/sr/account/profile');
  await page.locator('input[name="name"]').fill('Novo Ime');
  await page.getByRole('button', { name: 'Sačuvaj', exact: true }).click();
  await expect(page.getByText('Promene su sačuvane')).toBeVisible();

  // Add an address
  await page.goto('/sr/account/addresses');
  await page.locator('input[name="street"]').fill('Stražilovska 3');
  await page.locator('input[name="city"]').fill('Novi Sad');
  await page.locator('input[name="postalCode"]').fill('21000');
  await page.getByRole('button', { name: 'Sačuvaj adresu' }).click();
  await expect(page.getByText('Stražilovska 3')).toBeVisible();
});
