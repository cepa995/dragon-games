import { expect, test } from '@playwright/test';

test('home content is fully visible under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/sr');

  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();

  // With reduced motion the reveal/page-transition wrappers must not leave
  // content mid-animation: opacity settles to 1 (poll to avoid evaluating the
  // node mid re-render).
  await expect.poll(async () => heading.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('home content settles to full opacity with motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/sr');

  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect.poll(async () => heading.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});
