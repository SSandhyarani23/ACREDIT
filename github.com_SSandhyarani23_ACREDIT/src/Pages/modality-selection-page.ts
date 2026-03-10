import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object for the Modality Selection step in the accreditation wizard.
 * Encapsulates logic for selecting a modality (by long name) and proceeding to the next step.
 * Reusable for both CT and Nuclear Medicine flows.
 */
export class ModalitySelectionPage {
  readonly page: Page;
  // Locators
  private readonly nextButton: Locator;

  /**
   * Constructor initializes the page and key locators.
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.locator('#btnNext');
  }

  /**
   * Selects a modality by its visible long name (e.g., 'Nuclear Medicine Accreditation Program').
   * Will click the corresponding radio button for 'Is Applying For' for the given modality.
   * @param modalityName The visible, exact long name of the modality to select
   */
  async selectModality(modalityName: string): Promise<void> {
    // Find the label for the modality by its text
    const modalityLabel = this.page.locator(`label`, { hasText: modalityName });
    await modalityLabel.waitFor({ state: 'visible', timeout: 10000 });

    // Get the 'for' attribute to find the corresponding input radio
    const forAttr = await modalityLabel.getAttribute('for');
    if (!forAttr) {
      throw new Error(`Could not find 'for' attribute for modality label: ${modalityName}`);
    }
    // The radio input for 'Is Applying For' has id pattern: ModalitySelectionList_X__IsApplyingFor
    const radioInput = this.page.locator(`#${forAttr.replace('__IsModalityPerformed', '__IsApplyingFor')}`);
    await radioInput.waitFor({ state: 'attached', timeout: 5000 });
    // Sometimes the radio is hidden for styling, so click via evaluate if needed
    await this.page.evaluate((id) => {
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (input && !input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, forAttr.replace('__IsModalityPerformed', '__IsApplyingFor'));
    // Optionally, assert the radio is now checked
    await expect(radioInput).toBeChecked();
  }

  /**
   * Proceeds to the next step in the wizard by clicking the Next button.
   * Waits for navigation or the next panel to load.
   */
  async proceedToNextStep(): Promise<void> {
    await this.nextButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.nextButton.click();
    // Wait for the next wizard panel to load (e.g., Modality Information)
    // This can be improved by waiting for a specific element on the next page
    await this.page.waitForLoadState('networkidle');
    // Optionally, wait for a known element of the next step
    // e.g., await this.page.locator('text=Modality Information').waitFor({ state: 'visible', timeout: 15000 });
  }
}
