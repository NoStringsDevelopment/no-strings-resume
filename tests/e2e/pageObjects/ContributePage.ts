import { Page, Locator } from '@playwright/test';

export class ContributePage {
  readonly page: Page;
  readonly backToHomeButton: Locator;
  readonly startBuildingButton: Locator;
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
  readonly kofiIframe: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToHomeButton = page.getByTestId('back-to-home-btn');
    this.startBuildingButton = page.getByTestId('start-building-btn');
    this.mainHeading = page.getByRole('heading', { name: 'No Strings Resume', exact: true });
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
    this.kofiIframe = page.locator('#kofiframe');
    this.footer = page.locator('footer');
  }

  async goto() {
    await this.page.goto('/contribute');
  }

  async clickBackToHome() {
    await this.backToHomeButton.click();
  }

  async clickStartBuilding() {
    await this.startBuildingButton.click();
  }

  async clickContributionCard(cardType: 'code' | 'issues' | 'documentation' | 'community') {
    const cardMap = {
      code: this.codeContributionCard,
      issues: this.reportIssuesCard,
      documentation: this.documentationCard,
      community: this.communitySupportCard
    };
    
    const card = cardMap[cardType];
    const button = card.locator('button');
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
    await this.startBuildingButton.isVisible();
    
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
    await this.kofiIframe.isVisible();
    
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