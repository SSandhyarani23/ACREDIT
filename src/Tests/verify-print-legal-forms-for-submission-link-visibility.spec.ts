// Test Case: TCD_FT_01_FR-1
// Verify 'Print Legal Forms for Submission' link visibility for submitted applications

import { test, expect } from '@playwright/test';
import { LoginPage } from '../CommonPages/LoginPage';
import { MyApplicationsPage } from '../Pages/my-applications-page';
import testDataRaw from '../TestData/verify-print-legal-forms-for-submission-link-visibility-data.json';

// Type for test data
interface UserData {
  username: string;
  password: string;
  role: string;
}

interface ApplicationData {
  applicationId: string;
  facilityName?: string;
  status: string;
  requiresLegalForms: boolean;
  submissionDate?: string;
  legalForms?: string[];
  documents?: string[];
}

interface TestDatum {
  user: UserData;
  application: ApplicationData;
  expected: {
    printLegalFormsLinkVisible: boolean;
  };
}

interface EdgeCaseDatum {
  description: string;
  application: ApplicationData;
  expected: {
    printLegalFormsLinkVisible: boolean;
  };
}

// Cast imported test data
const testData = testDataRaw as {
  testData: TestDatum[];
  edgeCases: EdgeCaseDatum[];
};

test.describe("TCD_FT_01_FR-1: Verify 'Print Legal Forms for Submission' link visibility for submitted applications", () => {
  // Positive and negative scenarios
  for (const [index, data] of testData.testData.entries()) {
    test(`Scenario ${index + 1}: [${data.application.applicationId}] - Facility: ${data.application.facilityName || ''} - Legal Forms Required: ${data.application.requiresLegalForms} - Expect Link Visible: ${data.expected.printLegalFormsLinkVisible}`, async ({ page }) => {
      // --- Login ---
      const loginPage = new LoginPage(page);
      await loginPage.login(data.user.username, data.user.password);

      // --- My Applications Page ---
      const myApplicationsPage = new MyApplicationsPage(page);
      await myApplicationsPage.clickOnMyApplicationsLink();
      await myApplicationsPage.waitForLoad();
      await myApplicationsPage.validateApplicationExists(data.application.applicationId, data.application.facilityName || '');
      await myApplicationsPage.selectApplicationById(data.application.applicationId);
      await myApplicationsPage.waitForApplicationDetailsLoad();

      // --- Assertion ---
      const isVisible = await myApplicationsPage.isPrintLegalFormsForSubmissionLinkVisible();
      expect(isVisible).toBe(data.expected.printLegalFormsLinkVisible);
    });
  }

  // Edge cases
  for (const [index, edge] of testData.edgeCases.entries()) {
    test(`Edge Case ${index + 1}: ${edge.description} [${edge.application.applicationId}] - Legal Forms Required: ${edge.application.requiresLegalForms} - Status: ${edge.application.status} - Expect Link Visible: ${edge.expected.printLegalFormsLinkVisible}`, async ({ page }) => {
      // For edge cases, use a default user (first in testData) or adapt as needed
      const defaultUser = testData.testData[0].user;
      const loginPage = new LoginPage(page);
      await loginPage.login(defaultUser.username, defaultUser.password);

      const myApplicationsPage = new MyApplicationsPage(page);
      await myApplicationsPage.clickOnMyApplicationsLink();
      await myApplicationsPage.waitForLoad();
      // Facility name may be missing in edge cases
      await myApplicationsPage.validateApplicationExists(edge.application.applicationId, edge.application.facilityName || '');
      await myApplicationsPage.selectApplicationById(edge.application.applicationId);
      await myApplicationsPage.waitForApplicationDetailsLoad();

      const isVisible = await myApplicationsPage.isPrintLegalFormsForSubmissionLinkVisible();
      expect(isVisible).toBe(edge.expected.printLegalFormsLinkVisible);
    });
  }
});
