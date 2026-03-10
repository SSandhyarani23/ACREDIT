import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../CommonPages/LoginPage";
import { CTModalityPage } from "../Pages/CT-modality-workflow";
import { SurveyAgreementPage } from "../Pages/survey-agreement-page";
import * as fs from "fs";

// --- ModalitySelectionPage Page Object ---
// This is a minimal implementation for this test. If a full implementation exists, replace this with the actual import.
class ModalitySelectionPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Selects the Nuclear Medicine modality (NMAP) and marks as applying
  async selectNuclearMedicineModality() {
    // Wait for the Modality Selection page to load
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for the Nuclear Medicine label to be visible
    await this.page.locator('label[for="ModalitySelectionList_3__IsModalityPerformed"]').waitFor({ state: 'visible', timeout: 10000 });
    // Click the "Is Applying For" radio for Nuclear Medicine (index 3)
    const isApplyingRadio = this.page.locator('#ModalitySelectionList_3__IsApplyingFor');
    await isApplyingRadio.waitFor({ state: 'attached', timeout: 5000 });
    // The radio may be hidden, so use evaluate to set it checked
    await this.page.evaluate(() => {
      const radio = document.getElementById('ModalitySelectionList_3__IsApplyingFor') as HTMLInputElement;
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    // Optionally, check the "Is Modality Performed" checkbox for Nuclear Medicine
    const isPerformedCheckbox = this.page.locator('#ModalitySelectionList_3__IsModalityPerformed');
    if (await isPerformedCheckbox.isVisible()) {
      if (!(await isPerformedCheckbox.isChecked())) {
        await isPerformedCheckbox.check();
      }
    }
    // Click Next to proceed
    const nextButton = this.page.locator('#btnNext');
    await nextButton.waitFor({ state: 'visible', timeout: 5000 });
    await nextButton.click();
    // Wait for navigation to the next step
    await this.page.waitForLoadState('networkidle');
  }
}

// --- Test Data Loader ---
const testDataPath = require.resolve('../TestData/A-Flow.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// --- Test Suite ---
test.describe('NMAP_AH_01: Add Nuclear Medicine Modality', () => {
  test('Facility user can start accreditation cycle by adding Nuclear Medicine modality and reach Survey Agreement page', async ({ page }) => {
    // 1. Login as Facility User
    const loginPage = new LoginPage(page);
    await page.goto(testData.dashboard);
    await loginPage.login(testData.UserName);
    // 2. Navigate to Add Modality (assume user lands on dashboard, then navigates to Modality Selection)
    // Click on "Modality Selection" in the wizard (using link text)
    const modalitySelectionLink = page.getByRole('link', { name: 'Modality Selection' });
    await modalitySelectionLink.waitFor({ state: 'visible', timeout: 10000 });
    await modalitySelectionLink.click();
    // 3. Select Nuclear Medicine modality
    const modalitySelectionPage = new ModalitySelectionPage(page);
    await modalitySelectionPage.selectNuclearMedicineModality();
    // 4. Integration with CTModalityWorkflow (if any further steps are needed, e.g., CMS info, add here)
    // For this test, we only need to reach Survey Agreement page
    // 5. Verify Survey Agreement page is displayed
    // Option 1: Check URL contains 'Wizard/Survey Agreement'
    await expect(page).toHaveURL(/.*Survey\s*Agreement.*/i);
    // Option 2: Check for Survey Agreement heading or link
    const surveyAgreementLink = page.getByRole('link', { name: 'Survey Agreement' });
    await surveyAgreementLink.waitFor({ state: 'visible', timeout: 10000 });
    // Option 3: Check for a known element on Survey Agreement page
    // (If SurveyAgreementPage has a unique element, use it)
    // const surveyAgreementPage = new SurveyAgreementPage(page);
    // await surveyAgreementPage.waitForLoad(); // Implement waitForLoad if needed
    // Final assertion: the Survey Agreement page is visible
    expect(await surveyAgreementLink.isVisible()).toBeTruthy();
  });
});
