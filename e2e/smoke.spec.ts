import { expect, test } from '@playwright/test';

test('root redirects to the Serbian locale and renders the home placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/sr$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Igra počinje ovde');
});

test('health endpoint reports ok with a database check', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe('ok');
  expect(body.checks.database).toBe('ok');
});

test('responses carry a correlation id header', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.headers()['x-request-id']).toBeTruthy();
});
