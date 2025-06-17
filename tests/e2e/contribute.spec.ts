import { test, expect } from '@playwright/test';
import { ContributePage } from './pageObjects/ContributePage';

test.describe('Contribute Page', () => {
  let contributePage: ContributePage;

  test.beforeEach(async ({ page }) => {
    contributePage = new ContributePage(page);
    await contributePage.goto();
  });

  test('should load and display all content', async ({ page }) => {
    // Wait for the page to load completely
    await contributePage.assertPageLoaded();
    
    // Verify all content sections are visible
    await expect(contributePage.mainHeading).toBeVisible();
    await expect(contributePage.heroHeading).toBeVisible();
    await expect(contributePage.waysToContributeHeading).toBeVisible();
    await expect(contributePage.supportProjectHeading).toBeVisible();
  });

  test('should display all main sections', async () => {
    // Header section
    await expect(contributePage.mainHeading).toBeVisible();
    await expect(contributePage.backToHomeButton).toBeVisible();
    
    // Hero section
    await expect(contributePage.heroHeading).toBeVisible();
    await expect(contributePage.heroDescription).toBeVisible();
    
    // Contribution section
    await expect(contributePage.waysToContributeHeading).toBeVisible();
    
    // Support section
    await expect(contributePage.supportProjectHeading).toBeVisible();
    
    // Footer
    await expect(contributePage.footer).toBeVisible();
  });

  test('should display gradient text correctly', async () => {
    // Check that the gradient text span exists and is visible
    await expect(contributePage.gradientText).toBeVisible();
    
    // Verify it contains the expected text
    const gradientTextContent = await contributePage.gradientText.textContent();
    expect(gradientTextContent).toContain('No Strings Resume');
    
    // Check that the gradient text has the correct CSS classes
    await expect(contributePage.gradientText).toHaveClass(/text-transparent/);
    await expect(contributePage.gradientText).toHaveClass(/bg-clip-text/);
    await expect(contributePage.gradientText).toHaveClass(/bg-gradient-to-r/);
  });

  test('should display all contribution cards', async () => {
    const cards = [
      { locator: contributePage.codeContributionCard, name: 'Code Contributions' },
      { locator: contributePage.reportIssuesCard, name: 'Report Issues' },
      { locator: contributePage.documentationCard, name: 'Documentation' },
      { locator: contributePage.communitySupportCard, name: 'Community Support' }
    ];

    for (const card of cards) {
      await expect(card.locator).toBeVisible();
      await expect(card.locator).toContainText(card.name);
      
      // Check that each card has the main action button using specific test-id
      const buttonTestIdMap = {
        'Code Contributions': 'contribution-button-code-contributions',
        'Report Issues': 'contribution-button-report-issues',
        'Documentation': 'contribution-button-documentation',
        'Community Support': 'contribution-button-community-support'
      } as const;
      
      const button = card.locator.getByTestId(buttonTestIdMap[card.name as keyof typeof buttonTestIdMap]);
      await expect(button).toBeVisible();
      await expect(button).toContainText(/View Repository|Report Issue|Contribute Docs|Join Discussions/);
    }
  });

  test('should have functional navigation buttons', async ({ page }) => {
    // Test back to home button
    await contributePage.clickBackToHome();
    await expect(page.url()).toMatch(/\/$/);
  });

  test('should handle Stripe donation gracefully', async ({ page }) => {
    // Check that the Stripe button exists
    await expect(contributePage.stripeButton).toBeVisible();
    
    // Check that QR code exists
    await expect(contributePage.qrCodeImage).toBeVisible();
    
    // Verify button has proper text
    await expect(contributePage.stripeButton).toContainText('Donate via Stripe');
    
    // Monitor console for any critical JavaScript errors
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    // Wait a bit for any potential JS to load
    await page.waitForTimeout(2000);
    
    // Should not have any critical JavaScript errors that break the page
    const hasCriticalJSErrors = consoleMessages.some(msg => 
      msg.includes('Uncaught') || 
      msg.includes('TypeError') || 
      msg.includes('ReferenceError')
    );
    expect(hasCriticalJSErrors).toBeFalsy();
  });

  test('should have proper text contrast and visibility', async () => {
    // Get computed styles to ensure text is actually visible
    const styles = await contributePage.getRenderedTextColors();
    
    // Hero heading should not be transparent
    expect(styles.heroStyles.visibility).toBe('visible');
    expect(styles.heroStyles.opacity).not.toBe('0');
    
    // Gradient text should have proper styling
    expect(styles.gradientStyles.visibility).toBe('visible');
    expect(styles.gradientStyles.opacity).not.toBe('0');
    
    // The gradient text should have either a background image or webkit text fill color
    const hasGradientStyling = 
      styles.gradientStyles.backgroundImage !== 'none' || 
      styles.gradientStyles.webkitTextFillColor === 'transparent';
    expect(hasGradientStyling).toBeTruthy();
  });

  test('should not have any broken layouts', async ({ page }) => {
    // Wait for page to be fully loaded with content
    await contributePage.assertPageLoaded();
    
    // Wait for hero heading to be visible (ensures CSS is loaded)
    await expect(contributePage.heroHeading).toBeVisible();
    
    // Check viewport and ensure content is not cut off
    const viewportSize = page.viewportSize();
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Page should have substantial content (not just empty/minimal content)
    expect(bodyHeight).toBeGreaterThan(1000);
    
    // Use the hero heading as a more reliable indicator of hero section height
    // since it's guaranteed to have content
    const heroHeadingBox = await contributePage.heroHeading.boundingBox();
    expect(heroHeadingBox?.height).toBeGreaterThan(30); // Text should have reasonable height
    
    // Check that cards are properly sized
    const firstCard = contributePage.codeContributionCard;
    await expect(firstCard).toBeVisible(); // Ensure card is visible first
    const cardBox = await firstCard.boundingBox();
    expect(cardBox?.height).toBeGreaterThan(100);
    expect(cardBox?.width).toBeGreaterThan(200);
  });

  test('should handle external link clicks', async ({ page, context }) => {
    // Test that external links work (GitHub repository links)
    const codeButton = contributePage.codeContributionCard.getByTestId('contribution-button-code-contributions');
    
    // Listen for new page/tab opening
    const newPagePromise = context.waitForEvent('page');
    await codeButton.click();
    
    const newPage = await newPagePromise;
    await newPage.waitForLoadState();
    
    // Should navigate to GitHub
    expect(newPage.url()).toMatch(/github\.com/);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await contributePage.assertPageLoaded();
    
    // All main content should still be visible in mobile
    await expect(contributePage.heroHeading).toBeVisible();
    await expect(contributePage.codeContributionCard).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await contributePage.assertPageLoaded();
    
    // Content should still be visible
    await expect(contributePage.heroHeading).toBeVisible();
    await expect(contributePage.codeContributionCard).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should have accessible content', async () => {
    // Check that headings are properly structured
    const headings = await contributePage.page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(3);
    
    // Check that buttons have accessible text
    const buttons = await contributePage.page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      expect(text?.trim()).toBeTruthy();
      expect(text?.length).toBeGreaterThan(2);
    }
    
    // Check that navigation buttons can be focused
    await contributePage.backToHomeButton.focus();
    await expect(contributePage.backToHomeButton).toBeFocused();
  });

  test('should display support features and donation options', async () => {
    // Check support features are displayed
    await expect(contributePage.page.getByText(/Support ongoing development and maintenance/)).toBeVisible();
    await expect(contributePage.page.getByText(/Help cover hosting and infrastructure costs/)).toBeVisible();
    await expect(contributePage.page.getByText(/Enable new features and improvements/)).toBeVisible();
    
    // Check donation elements
    await expect(contributePage.stripeButton).toBeVisible();
    await expect(contributePage.qrCodeImage).toBeVisible();
    await expect(contributePage.page.getByText(/Scan with your phone to donate/)).toBeVisible();
  });

  test('should have integrations link in code contributions card', async ({ page }) => {
    // Find the integrations link within the code contributions card
    const integrationsLink = contributePage.codeContributionCard.getByText('new integrations');
    await expect(integrationsLink).toBeVisible();
    
    // Test the integrations link click
    await integrationsLink.click();
    await expect(page.url()).toMatch(/\/integrations/);
  });
}); 