import { test, expect } from '@playwright/test';

test.describe('RateMyTools Pages', () => {
  test('Landing page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Rate My Tools')).toBeVisible();
  });

  test('Rate a Tool page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/rate');
    await expect(page.getByRole('heading', { name: 'Rate a Tool' })).toBeVisible();
    await expect(page.locator('text=Your School')).toBeVisible();
  });

  test('View Reviews page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/reviews');
    await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();
  });

  test('School Page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/schoolpage');
    await expect(page).toHaveURL(/.*schoolpage/);
  });

  test('Tool Page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/tool');
    await expect(page.locator('text=VS Code')).toBeVisible();
    await expect(page.locator('text=Student Ratings')).toBeVisible();
  });
});
