import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object for CT Modality and Nuclear Medicine Modality workflow.
 * Supports selection of modalities and navigation to Survey Agreement step.
 */
export class CTModalityPage {
  readonly page: Page;
  // Locators for modality selection
  private readonly nuclearMedicineLabel: Locator;
  private readonly nuclearMedicineRadio: Locator;
  private readonly nextButton: Locator;
  private readonly surveyAgreementLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // The label for Nuclear Medicine Accreditation Program (visible text)
    this.nuclearMedicineLabel = page.locator('label', { hasText: 'Nuclear Medicine Accreditation Program' });
    // The radio button for Nuclear Medicine (hidden, but linked by index in ModalitySelectionList)
    this.nuclearMedicineRadio = page.locator('#ModalitySelectionList_3__IsApplyingFor');
    // Next button to proceed to Modality Information / Survey Agreement
    this.nextButton = page.locator('#btnNext');
    // Survey Agreement wizard step link (for navigation verification)
    this.surveyAgreementLink = page.getByRole('link', { name: 'Survey Agreement' });
  }

  /**
   * Selects the Nuclear Medicine modality from the modality list.
   * Waits for the label and radio to be visible and interacts with them.
   */
  async selectNuclearMedicineModality(): Promise<void> {
    await this.nuclearMedicineLabel.waitFor({ state: 'visible', timeout: 10000 });
    await this.nuclearMedicineRadio.waitFor({ state: 'visible', timeout: 10000 });
    // Click the radio button for Nuclear Medicine ("Is Applying For")
    await this.nuclearMedicineRadio.click();
    // Optionally, verify the radio is now checked
    await expect(this.nuclearMedicineRadio).toBeChecked();
  }

  /**
   * Proceeds to the next step (Modality Information / Survey Agreement) by clicking Next.
   * Waits for navigation to complete.
   */
  async proceedToSurveyAgreement(): Promise<void> {
    await this.nextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.nextButton.click();
    // Wait for the Survey Agreement wizard step to be visible (navigation complete)
    await this.surveyAgreementLink.waitFor({ state: 'visible', timeout: 15000 });
    // Optionally, you can add an assertion to ensure navigation
    // await expect(this.page).toHaveURL(/SurveyAgreement/);
  }
}
