// Playwright test for: Verify 'Print Legal Forms for Submission' link visibility for submitted applications
// Test Case ID: TCD_FT_01_FR-1

import { test, expect } from '@playwright/test';
import { LoginPage } from '../CommonPages/LoginPage';
import { MyApplicationsPage } from '../Pages/my-applications-page';
import testDataRaw from '../TestData/verify-print-legal-forms-for-submission-link-visibility-data.json';

// Type for the test data
interface TestCaseData {
  testCaseId: string;
  testCaseName: string;
  priority: string;
  type: string;
  preconditions: {
    userRole: string;
    isLoggedIn: boolean;
    applicationStatus: string;
    requiresLegalForms: boolean;
  };
  applicationData: {
    applicationId: string;
    facilityName: string;
    facilityId: string;
    submissionDate: string | null;
    legalFormsRequired: string[];
    legalFormsUploaded: string[];
    legalFormsPending: string[];
  };
  user: {
    username: string;
    password: string;
    email: string;
  };
  expectedResult: {
    printLegalFormsLinkVisible: boolean;
    currentPage: string;
  };
  locators: Record<string, string>;
  notes?: string;
}

const testData: TestCaseData[] = testDataRaw as TestCaseData[];

test.describe('TCD_FT_01_FR-1: Print Legal Forms for Submission link visibility', () => {
  for (const data of testData) {
    test(`should ${data.expectedResult.printLegalFormsLinkVisible ? '' : 'NOT '}show 'Print Legal Forms for Submission' link for applicationId=${data.applicationData.applicationId} (${data.testCaseName})`, async ({ page }, testInfo) => {
      // --- Login ---
      const loginPage = new LoginPage(page);
      await loginPage.login(data.user.username, data.user.password);

      // --- Go to My Applications Page ---
      const myApplicationsPage = new MyApplicationsPage(page);
      await myApplicationsPage.clickOnMyApplicationsLink();
      await myApplicationsPage.waitForLoad();
      await myApplicationsPage.expectOnMyApplicationsPage();

      // --- Validate application exists ---
      await myApplicationsPage.validateApplicationExists(
        data.applicationData.applicationId,
        data.applicationData.facilityName
      );

      // --- Select application row (if required by workflow) ---
      await myApplicationsPage.selectApplicationById(data.applicationData.applicationId);
      await myApplicationsPage.waitForApplicationDetailsLoad();

      // --- Check Print Legal Forms for Submission link visibility ---
      const isVisible = await myApplicationsPage.isPrintLegalFormsLinkVisible();
      if (data.expectedResult.printLegalFormsLinkVisible) {
        expect(isVisible).toBeTruthy();
      } else {
        expect(isVisible).toBeFalsy();
      }

      // --- Post-condition: User remains on My Applications page ---
      await myApplicationsPage.expectOnMyApplicationsPage();
    });
  }
});
