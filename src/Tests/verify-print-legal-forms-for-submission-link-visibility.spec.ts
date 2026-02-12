// Playwright test for TCD_FT_01_FR-1: Verify 'Print Legal Forms for Submission' link visibility for submitted applications
import { test, expect } from '@playwright/test';
import { LoginPage } from '../CommonPages/LoginPage';
import { MyApplicationsPage } from '../Pages/my-applications-page';
import testData from '../TestData/verify-print-legal-forms-for-submission-link-visibility-data.json';

// Utility to ensure correct typing for imported test data
interface TestCaseData {
  testCaseId: string;
  description: string;
  user: {
    role: string;
    username: string;
    password: string;
  };
  application: {
    applicationId: string;
    status: string;
    requiresLegalForms: boolean;
    facilityName: string;
    submissionDate: string | null;
    legalForms: string[];
  };
  expected: {
    printLegalFormsLinkVisible: boolean;
  };
  locators: Record<string, string>;
}

const cases: TestCaseData[] = testData as TestCaseData[];

test.describe('TCD_FT_01_FR-1: Print Legal Forms for Submission link visibility', () => {
  for (const data of cases) {
    test(`should ${data.expected.printLegalFormsLinkVisible ? 'show' : 'not show'} 'Print Legal Forms for Submission' link when: ${data.description}`, async ({ page }) => {
      // --- Login ---
      const loginPage = new LoginPage(page);
      await loginPage.login(data.user.username, data.user.password);

      // --- Go to My Applications Page ---
      const myApplicationsPage = new MyApplicationsPage(page);
      await myApplicationsPage.clickOnMyApplicationsLink();
      await myApplicationsPage.waitForLoad();
      await myApplicationsPage.expectOnMyApplicationsPage();

      // --- Validate application exists ---
      await myApplicationsPage.validateApplicationExists(data.application.applicationId, data.application.facilityName);

      // --- Select application by ID ---
      await myApplicationsPage.selectApplicationById(data.application.applicationId);
      await myApplicationsPage.waitForApplicationDetailsLoad();

      // --- Check Print Legal Forms link visibility ---
      const isVisible = await myApplicationsPage.isPrintLegalFormsLinkVisible();
      expect(isVisible).toBe(data.expected.printLegalFormsLinkVisible);

      // --- Post-condition: User remains on My Applications page ---
      // (No navigation away from My Applications page)
    });
  }
});
