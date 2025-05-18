import { test, expect } from '@playwright/test';

test.describe('Register Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
  });

  test('should display register form', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Register');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Password confirmation is required')).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.locator('#email').fill('invalid-email');
    await page.locator('#email').blur();

    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.locator('#password').fill('Password123!');
    await page.locator('#confirmPassword').fill('DifferentPassword123!');
    await page.locator('#confirmPassword').blur();

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should successfully register with valid data', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('Password123!');
    await page.locator('#confirmPassword').fill('Password123!');

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/events');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.locator('text=Login').click();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should show password requirements', async ({ page }) => {
    await page.locator('#password').fill('weak');
    await page.locator('#password').blur();

    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
  });

  test('should show loading state during registration', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('Password123!');
    await page.locator('#confirmPassword').fill('Password123!');

    await Promise.all([
      page.locator('button[type="submit"]').click(),
      page.waitForSelector('.loading-indicator')
    ]);

    await expect(page.locator('.loading-indicator')).toBeVisible();
  });
}); 