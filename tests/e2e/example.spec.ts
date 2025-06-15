import { test, expect } from '@playwright/test';
import { LandingPage } from './pageObjects/LandingPage';

test.describe('Resume Builder', () => {
  test('should load the landing page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    
    await landingPage.goto();
    await landingPage.assertPageLoaded();
    
    // Verify all expected elements are visible
    await expect(landingPage.mainHeading).toBeVisible();
    await expect(landingPage.heroHeading).toBeVisible();
    await expect(landingPage.privacyMessage).toBeVisible();
    await expect(landingPage.startBuildingButton).toBeVisible();
    await expect(landingPage.viewSampleButton).toBeVisible();
  });

  test('should navigate to resume editor', async ({ page }) => {
    const landingPage = new LandingPage(page);
    
    await landingPage.goto();
    await landingPage.clickStartBuilding();
    
    // Should navigate to the editor page
    await expect(page.url()).toMatch(/\/edit/);
    
    // Check if the editor interface is loaded using data-testid
    await expect(page.getByTestId('resume-editor')).toBeVisible();
    await expect(page.getByTestId('editor-header')).toBeVisible();
    await expect(page.getByTestId('basics-tab')).toBeVisible();
    await expect(page.getByTestId('editor-tabs')).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that interactive elements with data-testid have accessible names
    const testButtons = [
      { testId: 'start-building-btn', expectedText: /start building resume/i },
      { testId: 'view-sample-resume-btn', expectedText: /view sample resume/i }
    ];
    
    for (const { testId, expectedText } of testButtons) {
      const button = page.getByTestId(testId);
      await expect(button).toBeVisible();
      
      // Check button has accessible text
      const buttonText = await button.textContent();
      expect(buttonText).toMatch(expectedText);
      
      // Check button is keyboard accessible
      await button.focus();
      await expect(button).toBeFocused();
    }
  });
}); 