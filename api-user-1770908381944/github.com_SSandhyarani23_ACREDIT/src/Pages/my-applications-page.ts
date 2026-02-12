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
   * Navigates to the 'My Applications' page, identifies a submitted application that requires legal forms,
   * and verifies that the 'Print Legal Forms for Submission' link is visible for that application.
   * This method consolidates all steps required to validate the visibility of the legal forms print link
   * for a submitted application as per TCD_FT_01_FR-1.
   *
   * @param applicationId (optional) - If provided, selects the application by ID; otherwise, picks the latest submitted application.
   * @returns Promise<void>
   */
  async verifyPrintLegalFormsLinkForSubmittedApplication(applicationId?: string): Promise<void> {
    // Ensure we are on the My Applications page
    await this.expectOnMyApplicationsPage();
    await this.waitForLoad();

    // If applicationId is provided, select by ID; else, pick the latest submitted application
    if (applicationId) {
      await this.selectApplicationById(applicationId);
    } else {
      // TODO: Replace with logic to select the latest submitted application that requires legal forms
      // Placeholder: Select the first application in the list
      const firstApplicationRow = this.page.locator('tbody tr').first(); // TODO: Refine locator as needed
      await firstApplicationRow.click();
    }

    await this.waitForApplicationDetailsLoad();

    // Validate the 'Print Legal Forms for Submission' link is visible
    await this.verifyPrintLegalFormsLink();
  }
}