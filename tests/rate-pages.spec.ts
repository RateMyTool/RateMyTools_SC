import { test, expect } from './auth-utils';

test.slow();
test('can access rate page when authenticated', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the rate page
  await customUserPage.goto('http://localhost:3000/rate');
  await expect(customUserPage.getByRole('heading', { name: 'Rate Tools' })).toBeVisible();
  await expect(customUserPage.getByText('Click on a tool to rate it')).toBeVisible();
});

test('rate page shows navigation link in navbar', async ({ getUserPage }) => {
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  await customUserPage.goto('http://localhost:3000/');
  await expect(customUserPage.getByRole('link', { name: 'Rate Tools' })).toBeVisible();
});

test('list page shows ratings column', async ({ getUserPage }) => {
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  await customUserPage.goto('http://localhost:3000/list');
  await expect(customUserPage.getByRole('heading', { name: 'Stuff' })).toBeVisible();
  await expect(customUserPage.getByRole('columnheader', { name: 'Avg Rating' })).toBeVisible();
});
