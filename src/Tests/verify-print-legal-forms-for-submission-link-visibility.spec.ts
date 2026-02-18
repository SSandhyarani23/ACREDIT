// Test Case: TCD_FT_01_FR-1
// Verify 'Print Legal Forms for Submission' link visibility for submitted applications

import { test, expect } from '@playwright/test';
import { LoginPage } from '../CommonPages/LoginPage';
import { MyApplicationsPage } from '../Pages/my-applications-page';
import testData from '../TestData/verify-print-legal-forms-for-submission-link-visibility-data.json';

// Data-driven test for all scenarios in the test data file

test.describe('TCD_FT_01_FR-1: Print Legal Forms for Submission link visibility', () => {
  for (const data of testData) {
    test(`Should ${data.expected.printLegalFormsLinkVisible ? '' : 'NOT '}display 'Print Legal Forms for Submission' link - ${data.description}`, async ({ page }, testInfo) => {
      // Arrange: Login as Facility User
      const loginPage = new LoginPage(page);
      await loginPage.login(data.user.username, data.user.password);

      // Act: Navigate to My Applications page and validate application presence
      const myApplicationsPage = new MyApplicationsPage(page);
      await myApplicationsPage.clickOnMyApplicationsLink();
      await myApplicationsPage.waitForLoad();
      await myApplicationsPage.sortCreatedOnAscending();
      await myApplicationsPage.validateApplicationExists(data.application.applicationId, data.application.facilityName);
      await myApplicationsPage.selectApplicationById(data.application.applicationId);
      await myApplicationsPage.waitForApplicationDetailsLoad();

      // Assert: Check visibility of 'Print Legal Forms for Submission' link
      const isVisible = await myApplicationsPage.isPrintLegalFormsForSubmissionLinkVisibleForApplication(data.application.applicationId);
      expect(isVisible).toBe(
        data.expected.printLegalFormsLinkVisible,
        `TestCaseId: ${data.testCaseId} | ApplicationId: ${data.application.applicationId} | Facility: '${data.application.facilityName}' | Expected 'Print Legal Forms for Submission' link to be ${data.expected.printLegalFormsLinkVisible ? 'VISIBLE' : 'NOT VISIBLE'} but found ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}.`
      );
      // Post-condition: User remains on My Applications page (implicit)
    });
  }
});
