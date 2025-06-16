import { test, expect } from '@playwright/test';
import { LandingPage } from './pageObjects/LandingPage';

test.describe('Landing Page', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  test('should load and display all content', async () => {
    await landingPage.assertPageLoaded();
    
    // Verify main content is visible
    await expect(landingPage.heroHeading).toBeVisible();
    await expect(landingPage.startBuildingButton).toBeVisible();
    await expect(landingPage.viewSampleButton).toBeVisible();
    await expect(landingPage.contributeButton).toBeVisible();
  });

  test.describe('Contribute Button Behavior', () => {
    test('should always be visible and functional on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      await landingPage.assertPageLoaded();
      
      // Button should be visible
      await expect(landingPage.contributeButton).toBeVisible();
      
      // Icon should be visible
      await expect(landingPage.contributeIcon).toBeVisible();
      
      // Text should be visible on desktop
      await expect(landingPage.contributeText).toBeVisible();
      
      // Button should be clickable
      await expect(landingPage.contributeButton).toBeEnabled();
    });

    test('should always be visible with icon on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await landingPage.assertPageLoaded();
      
      // Button should be visible
      await expect(landingPage.contributeButton).toBeVisible();
      
      // Icon should be visible
      await expect(landingPage.contributeIcon).toBeVisible();
      
      // Text should be visible on tablet (sm breakpoint is 640px)
      await expect(landingPage.contributeText).toBeVisible();
      
      // Button should be clickable
      await expect(landingPage.contributeButton).toBeEnabled();
    });

    test('should always be visible with icon on mobile', async ({ page }) => {
      // Set mobile viewport (narrow)
      await page.setViewportSize({ width: 375, height: 667 });
      await landingPage.assertPageLoaded();
      
      // Button should still be visible
      await expect(landingPage.contributeButton).toBeVisible();
      
      // Icon should always be visible
      await expect(landingPage.contributeIcon).toBeVisible();
      
      // Text should be hidden on very narrow screens (below sm breakpoint)
      await expect(landingPage.contributeText).toBeHidden();
      
      // Button should still be clickable
      await expect(landingPage.contributeButton).toBeEnabled();
    });

    test('should always be visible on very narrow screens', async ({ page }) => {
      // Set very narrow viewport (320px is often the minimum supported)
      await page.setViewportSize({ width: 320, height: 568 });
      await landingPage.assertPageLoaded();
      
      // Button should still be visible even on very narrow screens
      await expect(landingPage.contributeButton).toBeVisible();
      
      // Icon should always be visible
      await expect(landingPage.contributeIcon).toBeVisible();
      
      // Text should be hidden on narrow screens
      await expect(landingPage.contributeText).toBeHidden();
      
      // Button should still be clickable
      await expect(landingPage.contributeButton).toBeEnabled();
    });

    test('should navigate to contribute page when clicked', async ({ page }) => {
      await landingPage.clickContribute();
      await expect(page.url()).toMatch(/\/contribute/);
    });

    test('should have proper accessibility attributes', async () => {
      // Button should be focusable
      await landingPage.contributeButton.focus();
      await expect(landingPage.contributeButton).toBeFocused();
      
      // Button should have accessible text (either visible text or title/aria-label)
      const buttonText = await landingPage.contributeButton.textContent();
      const buttonTitle = await landingPage.contributeButton.getAttribute('title');
      const ariaLabel = await landingPage.contributeButton.getAttribute('aria-label');
      
      // Should have some form of accessible text
      const hasAccessibleText = (buttonText && buttonText.trim()) || buttonTitle || ariaLabel;
      expect(hasAccessibleText).toBeTruthy();
    });

    test('should maintain proper spacing and layout across screen sizes', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568, name: 'Mobile Small' },
        { width: 375, height: 667, name: 'Mobile Medium' },
        { width: 640, height: 800, name: 'Small Tablet' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Desktop Small' },
        { width: 1280, height: 720, name: 'Desktop' }
      ];

      for (const viewport of viewports) {
        await test.step(`Test layout at ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await landingPage.assertPageLoaded();
          
          // Button should be visible at all viewport sizes
          await expect(landingPage.contributeButton).toBeVisible();
          
          // Button should have reasonable dimensions
          const buttonBox = await landingPage.contributeButton.boundingBox();
          expect(buttonBox?.width).toBeGreaterThan(30); // At least wide enough for icon
          expect(buttonBox?.height).toBeGreaterThan(30); // At least tall enough for touch
          
          // Icon should always be visible
          await expect(landingPage.contributeIcon).toBeVisible();
          
          // Text visibility should depend on screen size
          if (viewport.width >= 640) {
            await expect(landingPage.contributeText).toBeVisible();
          } else {
            await expect(landingPage.contributeText).toBeHidden();
          }
        });
      }
    });
  });

  test('should have functional navigation buttons', async ({ page }) => {
    // Test start building button
    await landingPage.clickStartBuilding();
    await expect(page.url()).toMatch(/\/edit/);
    
    // Navigate back to landing page
    await landingPage.goto();
    
    // Test view sample button
    await landingPage.clickViewSample();
    await expect(page.url()).toMatch(/\/view/);
  });

  test('should be responsive and maintain layout integrity', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await landingPage.assertPageLoaded();
      
      // All essential elements should be visible
      await expect(landingPage.heroHeading).toBeVisible();
      await expect(landingPage.startBuildingButton).toBeVisible();
      await expect(landingPage.viewSampleButton).toBeVisible();
      await expect(landingPage.contributeButton).toBeVisible();
      
      // Page should have substantial content
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      expect(bodyHeight).toBeGreaterThan(500);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await landingPage.page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(2);
    
    // The hero heading (h2) should always be visible
    await expect(landingPage.heroHeading).toBeVisible();
    
    // On desktop, the main h1 heading should also be visible
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 640) {
      await expect(landingPage.mainHeading).toBeVisible();
    }
  });
}); 