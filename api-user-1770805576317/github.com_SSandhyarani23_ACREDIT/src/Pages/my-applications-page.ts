import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class MyApplicationsPage extends BasePage {
  readonly page: Page;

  // ---------------- Locators ----------------
  private heading: Locator;
  private applicationsLink: Locator;
  private createdOnSortLabel: Locator;
  private printLegalFormsLink: Locator;
  private applicationGrid: Locator;
  private signOutLink: Locator;
  private printLegalForms:Locator;
  private viewSubmittedApplication:Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.heading = page.locator('[data-testid="my-applications-heading"]');
    this.applicationsLink = page.getByRole('link', { name: 'My Applications' });
    this.createdOnSortLabel = page.getByLabel('Created On: Ascending sort').getByText('Created On');
    this.printLegalFormsLink = page.getByRole('link', { name: 'Print legal forms for Submission' });
    this.applicationGrid = page.locator('#gridList_AccrAppList');
    this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
    this.printLegalForms = page.getByRole('link', { name: 'Print legal forms for' });
    this.viewSubmittedApplication = this.page.getByRole('link', { name: 'View Submitted Application' }).first();
  }

  /* ---------------- Page Load ---------------- */
  async waitForLoad(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }

  async expectOnMyApplicationsPage(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  /* ---------------- Navigation ---------------- */
  async clickOnMyApplicationsLink(): Promise<void> {
    await expect(this.applicationsLink).toBeVisible({ timeout: 50000 });
    await this.applicationsLink.click();
  }

  async sortCreatedOnAscending(): Promise<void> {
    await this.createdOnSortLabel.click();
  }

  /* ---------------- Application Selection ---------------- */
  async selectApplicationById(applicationId: string): Promise<void> {
    await this.page.click(`[data-testid="application-row-${applicationId}"]`);
  }

  async waitForApplicationDetailsLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="application-details-section"]', { state: 'visible' });
  }

  async validateApplicationExists(appNumber: string, facilityName: string): Promise<void> {
    await expect(this.applicationGrid).toContainText(appNumber);
    await expect(this.applicationGrid).toContainText(facilityName);
  }

  /* ---------------- Print Legal Forms ---------------- */
  async isPrintLegalFormsLinkVisible(): Promise<boolean> {
    return await this.printLegalFormsLink.isVisible();
  }

  async verifyPrintLegalFormsLink(): Promise<void> {
    await expect(this.printLegalFormsLink).toBeVisible();
  }

  async clickOnPrintLegalForms(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.printLegalForms.click();
    return await popupPromise;
  }

  async clickOnViewSubmittedApplicationSummary(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.viewSubmittedApplication.click();
    return await popupPromise;
  }

  /* ---------------- Sign Out ---------------- */
  async signOut(): Promise<void> {
    await this.signOutLink.click();
  }

  /**
   * Complete workflow to verify the visibility of the 'Print Legal Forms for Submission' link
   * for a submitted application that requires legal forms. This method navigates to the 'My Applications' page,
   * locates the submitted application, and asserts the presence of the required link.
   *
   * @param applicationId - The unique identifier of the submitted application
   * @returns Promise<void>
   */
  async verifyPrintLegalFormsLinkVisibilityForSubmittedApplication(applicationId: string): Promise<void> {
    // Ensure we're on the My Applications page
    await this.expectOnMyApplicationsPage();
    await this.waitForLoad();

    // Select the application by its ID (assumes submitted & requires legal forms)
    await this.selectApplicationById(applicationId);
    await this.waitForApplicationDetailsLoad();

    // Assert the 'Print Legal Forms for Submission' link is visible
    await this.verifyPrintLegalFormsLink();
  }

  /**
   * Checks if the 'Print Legal Forms for Submission' link is visible for the currently selected application.
   * Returns true if visible, false otherwise.
   *
   * @returns Promise<boolean>
   */
  async isPrintLegalFormsForSubmissionLinkVisible(): Promise<boolean> {
    // Primary locator: link text
    const link = this.page.locator('a', { hasText: 'Print legal forms for Submission' });
    // Secondary locator: partial link text (for robustness)
    // const link = this.page.locator('a:has-text("Print legal forms")');
    // Alternative: CSS selector if needed
    // const link = this.page.locator('a[href*="ViewLegalForms"]');
    return await link.isVisible();
  }
}