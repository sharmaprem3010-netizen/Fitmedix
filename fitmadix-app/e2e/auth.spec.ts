import { test, expect } from '@playwright/test';

test.describe('Authentication Forms & Inputs', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the auth page before each test
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
  });

  test('should render the sign in form by default', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    
    // Check inputs exist
    await expect(page.getByPlaceholder('Email address')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    
    // Full Name should NOT be visible in Sign In mode
    await expect(page.getByPlaceholder('Full Name')).not.toBeVisible();
  });

  test('should toggle to sign up mode and show Full Name input', async ({ page }) => {
    // Click the toggle button
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Check main heading changed
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
    
    // Full Name should now be visible
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
  });

  test('should display HTML5 validation errors on empty submission', async ({ page }) => {
    // Attempt to submit empty form
    const submitBtn = page.getByRole('button', { name: 'Log in' });
    await submitBtn.click();

    // Since the inputs have the 'required' attribute, HTML5 validation will block submission.
    // We can verify this by checking that the browser focus is still on the first invalid element (Email)
    const emailInput = page.getByPlaceholder('Email address');
    await expect(emailInput).toBeFocused();
  });

  test('should prevent short passwords (HTML5 validation)', async ({ page }) => {
    // Fill email
    await page.getByPlaceholder('Email address').fill('test@example.com');
    
    // Fill short password (minlength is 6 in the code)
    await page.getByPlaceholder('Enter password').fill('12345');
    
    // Submit
    await page.getByRole('button', { name: 'Log in' }).click();

    // Focus should remain on the password field due to minLength violation
    const passwordInput = page.getByPlaceholder('Enter password');
    await expect(passwordInput).toBeFocused();
  });

});
