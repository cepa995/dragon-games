import { expect, test } from '@playwright/test';

test('skip-to-content link becomes visible on focus', async ({ page }) => {
  await page.goto('/sr');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Pređi na sadržaj' });
  await expect(skip).toBeFocused();
});

test('language switch navigates to the selected locale', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/sr');
  await page.locator('header').getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The game begins here');
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/sr');

  const openBtn = page.getByRole('button', { name: 'Otvori meni' });
  await openBtn.click();

  const mobileNav = page.locator('#mobile-nav');
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole('link', { name: 'Turniri' })).toBeVisible();

  await page.getByRole('button', { name: 'Zatvori meni' }).click();
  await expect(mobileNav).toBeHidden();
});

test('header gains a blurred background after scrolling', async ({ page }) => {
  await page.goto('/sr');
  const header = page.locator('header');
  await expect(header).not.toHaveClass(/backdrop-blur/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/backdrop-blur/);
});
