import { Page, Locator } from '@playwright/test';

export class ContributePage {
  readonly page: Page;
  readonly backToHomeButton: Locator;
  readonly mainHeading: Locator;
  readonly heroHeading: Locator;
  readonly gradientText: Locator;
  readonly heroDescription: Locator;
  readonly waysToContributeHeading: Locator;
  readonly contributionCards: Locator;
  readonly codeContributionCard: Locator;
  readonly reportIssuesCard: Locator;
  readonly documentationCard: Locator;
  readonly communitySupportCard: Locator;
  readonly supportProjectHeading: Locator;
  readonly stripeButton: Locator;
  readonly qrCodeImage: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToHomeButton = page.getByTestId('back-to-home-btn');
    this.mainHeading = page.getByRole('heading', { name: /Help Make.*No Strings Resume.*Even Better/i });
    this.heroHeading = page.getByRole('heading', { name: /Help Make.*No Strings Resume.*Even Better/i });
    this.gradientText = page.getByTestId('gradient-text');
    this.heroDescription = page.getByText(/No Strings Resume is an open-source project/i);
    this.waysToContributeHeading = page.getByRole('heading', { name: 'Ways to Contribute' });
    this.contributionCards = page.locator('[data-testid^="contribution-card"]');
    this.codeContributionCard = page.getByTestId('contribution-card-code-contributions');
    this.reportIssuesCard = page.getByTestId('contribution-card-report-issues');
    this.documentationCard = page.getByTestId('contribution-card-documentation');
    this.communitySupportCard = page.getByTestId('contribution-card-community-support');
    this.supportProjectHeading = page.getByRole('heading', { name: 'Support the Project' });
    this.stripeButton = page.getByText('Donate via Stripe');
    this.qrCodeImage = page.getByAltText('QR Code for donation');
    this.footer = page.locator('footer');
  }

  async goto() {
    await this.page.goto('/contribute');
  }

  async clickBackToHome() {
    await this.backToHomeButton.click();
  }

  async clickContributionCard(cardType: 'code' | 'issues' | 'documentation' | 'community') {
    const buttonTestIdMap = {
      code: 'contribution-button-code-contributions',
      issues: 'contribution-button-report-issues',
      documentation: 'contribution-button-documentation',
      community: 'contribution-button-community-support'
    };
    
    const button = this.page.getByTestId(buttonTestIdMap[cardType]);
    await button.click();
  }

  async assertPageLoaded() {
    await this.mainHeading.waitFor();
    await this.heroHeading.waitFor();
    await this.heroDescription.waitFor();
    await this.waysToContributeHeading.waitFor();
  }

  async assertAllContentVisible() {
    // Header elements
    await this.mainHeading.isVisible();
    await this.backToHomeButton.isVisible();
    
    // Hero section
    await this.heroHeading.isVisible();
    await this.gradientText.isVisible();
    await this.heroDescription.isVisible();
    
    // Contribution section
    await this.waysToContributeHeading.isVisible();
    await this.codeContributionCard.isVisible();
    await this.reportIssuesCard.isVisible();
    await this.documentationCard.isVisible();
    await this.communitySupportCard.isVisible();
    
    // Support section
    await this.supportProjectHeading.isVisible();
    await this.stripeButton.isVisible();
    await this.qrCodeImage.isVisible();
    
    // Footer
    await this.footer.isVisible();
  }

  async assertGradientTextIsVisible() {
    // Check that the gradient text span exists and has content
    await this.gradientText.isVisible();
    const textContent = await this.gradientText.textContent();
    return textContent?.includes('No Strings Resume');
  }

  async getRenderedTextColors() {
    // Get computed styles for text elements to ensure they're not invisible
    const heroStyles = await this.heroHeading.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        visibility: style.visibility,
        opacity: style.opacity
      };
    });

    const gradientStyles = await this.gradientText.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundImage: style.backgroundImage,
        webkitTextFillColor: style.webkitTextFillColor,
        visibility: style.visibility,
        opacity: style.opacity
      };
    });

    return { heroStyles, gradientStyles };
  }
} 