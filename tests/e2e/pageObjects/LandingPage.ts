import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly startBuildingButton: Locator;
  readonly viewSampleButton: Locator;
  readonly mainHeading: Locator;
  readonly heroHeading: Locator;
  readonly privacyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startBuildingButton = page.getByTestId('start-building-btn');
    this.viewSampleButton = page.getByTestId('view-sample-resume-btn');
    this.mainHeading = page.getByRole('heading', { name: 'No Strings Resume', exact: true });
    this.heroHeading = page.getByRole('heading', { name: /Resume Builder with.*No Strings Attached/i });
    this.privacyMessage = page.getByText(/privacy first/i);
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickStartBuilding() {
    await this.startBuildingButton.click();
  }

  async clickViewSample() {
    await this.viewSampleButton.click();
  }

  async assertPageLoaded() {
    // Check for logo icon which is always visible
    await this.page.locator('[data-lucide="file-text"]').first().waitFor();
    await this.heroHeading.waitFor();
    await this.startBuildingButton.waitFor();
    await this.viewSampleButton.waitFor();
    
    // Check if heading is visible (desktop) or hidden (mobile)
    const headingVisible = await this.mainHeading.isVisible();
    if (headingVisible) {
      await this.mainHeading.waitFor();
    }
  }
} 