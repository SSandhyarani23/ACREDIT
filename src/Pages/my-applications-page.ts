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
  private printLegalForms: Locator;
  private viewSubmittedApplication: Locator;

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
   * This method encapsulates the workflow: navigation, locating the correct application, and validating link visibility.
   * @param applicationId - The unique identifier for the submitted application
   * @param facilityName - The facility name associated with the application
   */
  async verifyPrintLegalFormsLinkForSubmittedApplication(applicationId: string, facilityName: string): Promise<void> {
    // Ensure we are on My Applications page
    await this.expectOnMyApplicationsPage();
    await this.waitForLoad();

    // Optionally sort or filter to find the submitted application
    // (Assume sortCreatedOnAscending() helps bring latest to top)
    await this.sortCreatedOnAscending();

    // Validate application exists in the list
    await this.validateApplicationExists(applicationId, facilityName);

    // Select the application row (if needed)
    await this.selectApplicationById(applicationId);
    await this.waitForApplicationDetailsLoad();

    // Assert the 'Print Legal Forms for Submission' link is visible
    await this.verifyPrintLegalFormsLink();
  }

  /**
   * Checks if the 'Print Legal Forms for Submission' link is visible for the currently selected application.
   * Returns true if visible, false otherwise.
   */
  async isPrintLegalFormsForSubmissionLinkVisible(): Promise<boolean> {
    // The link can be identified by link text or partial link text or CSS selector
    // Reuse existing locator strategy for the link
    const printLegalFormsLink = this.page.locator("a[href*='ViewLegalForms']");
    return await printLegalFormsLink.isVisible();
  }

  /**
   * Checks if the 'Print Legal Forms for Submission' link is visible for a specific application row, identified by applicationId.
   * This method ensures robust scoping by locating the link only within the targeted application's row, avoiding false positives from other rows.
   * Usage: await page.isPrintLegalFormsForSubmissionLinkVisibleForApplication(applicationId)
   * @param applicationId - The unique identifier for the application row
   * @returns Promise<boolean> - true if the link is visible in the specified row, false otherwise
   */
  async isPrintLegalFormsForSubmissionLinkVisibleForApplication(applicationId: string): Promise<boolean> {
    // Select the application row by its data-testid attribute
    const rowLocator = this.page.locator(`[data-testid="application-row-${applicationId}"]`);
    // Wait for the row to be loaded/visible
    await rowLocator.waitFor({ state: 'visible' });
    // Find the link within this row only
    const linkInRow = rowLocator.locator("a[href*='ViewLegalForms']");
    return await linkInRow.isVisible();
  }
}
