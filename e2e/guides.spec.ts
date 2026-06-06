import { expect, test } from '@playwright/test';

const GAMES = ['mtg', 'pokemon', 'yugioh', 'riftbound'] as const;

test('guides hub lists all four games', async ({ page }) => {
  await page.goto('/sr/guides');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const name of ['Magic: The Gathering', 'Pokémon', 'Yu-Gi-Oh!', 'Riftbound']) {
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  }
});

for (const game of GAMES) {
  test(`guide page renders content for ${game}`, async ({ page }) => {
    await page.goto(`/sr/guides/${game}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /kako da počneš/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /česta pitanja/i })).toBeVisible();
  });
}

test('a guide links its starter product into the catalog', async ({ page }) => {
  await page.goto('/sr/guides/mtg');
  await expect(page.locator('a[href*="/product/"]').first()).toBeVisible();
});

test('an unknown guide returns 404', async ({ page }) => {
  const res = await page.goto('/sr/guides/does-not-exist');
  expect(res?.status()).toBe(404);
});
