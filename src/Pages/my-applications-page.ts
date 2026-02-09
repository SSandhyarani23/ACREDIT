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
   * Navigates to the 'My Applications' page and verifies that the 'Print Legal Forms for Submission' link is visible for a submitted application that requires legal forms.
   * This method groups all steps required to validate the visibility of the 'Print Legal Forms for Submission' link for the relevant application.
   * Preconditions: User is logged in and application is submitted & requires legal forms.
   * Post-conditions: User remains on the 'My Applications' page.
   *
   * @param applicationId - The unique identifier of the submitted application (if available)
   * @returns {Promise<boolean>} - Returns true if the link is visible, false otherwise
   */
  async verifyPrintLegalFormsLinkVisibilityForSubmittedApplication(applicationId?: string): Promise<boolean> {
    // Ensure we are on the My Applications page
    await this.expectOnMyApplicationsPage();
    await this.waitForLoad();

    // If applicationId is provided, select the application row (reuse existing method if available)
    if (applicationId) {
      await this.selectApplicationById(applicationId);
      await this.waitForApplicationDetailsLoad();
    }

    // Check visibility of the 'Print Legal Forms for Submission' link
    // Reuse existing locator if present, otherwise use a robust locator
    const printLegalFormsLink = this.page.locator("a:has-text('Print legal forms for Submission')");
    await printLegalFormsLink.waitFor({ state: 'visible', timeout: 5000 });
    return await printLegalFormsLink.isVisible();
  }

  /**
   * Clicks the 'Print Legal Forms for Submission' link for the selected application.
   * Assumes the link is visible and enabled.
   */
  async clickPrintLegalFormsForSubmission() {
    const printLegalFormsLink = this.page.locator("a:has-text('Print legal forms for Submission')");
    await printLegalFormsLink.waitFor({ state: 'visible', timeout: 5000 });
    await printLegalFormsLink.click();
    // Optionally, add logic to handle new tab/window if link opens in a new tab
  }
}