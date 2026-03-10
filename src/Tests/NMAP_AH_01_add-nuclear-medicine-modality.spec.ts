import { test, expect } from "@playwright/test";
import { LoginPage } from "../CommonPages/LoginPage";
import { FacilityPage } from "../Pages/facility-page";
import { CTModalityPage } from "../Pages/CT-modality-workflow";
import { SurveyAgreementPage } from "../Pages/survey-agreement-page";
import { MyApplicationsPage } from "../Pages/my-applications-page";
import { Logger } from "../Utils/logger";
import fs from "fs";

// Load test data from A-Flow.json
const testData = JSON.parse(fs.readFileSync(require.resolve("../TestData/A-Flow.json"), "utf-8"));

// Test Case: NMAP_AH_01 - Add Nuclear Medicine Modality
// Objective: Verify facility user can start accreditation cycle by adding Nuclear Medicine modality.
test.describe("NMAP_AH_01 - Add Nuclear Medicine Modality", () => {
  let loginPage: LoginPage;
  let facilityPage: FacilityPage;
  let ctModalityPage: CTModalityPage;
  let surveyAgreementPage: SurveyAgreementPage;
  let myApplicationsPage: MyApplicationsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    facilityPage = new FacilityPage(page);
    ctModalityPage = new CTModalityPage(page);
    surveyAgreementPage = new SurveyAgreementPage(page);
    myApplicationsPage = new MyApplicationsPage(page);
    Logger.info("Test setup completed.");
  });

  test("Facility user can add Nuclear Medicine modality and reach Survey Agreement page", async ({ page }) => {
    Logger.info("Starting test: Add Nuclear Medicine Modality");

    // Step 1: Login as Facility User
    await page.goto(testData.dashboard);
    await loginPage.login(testData.UserName);
    Logger.info("Logged in as Facility User: " + testData.UserName);

    // Step 2: Navigate to Add Modality page
    // Reuse CT workflow navigation pattern: open facility page, navigate to modality selection
    await facilityPage.openFacilityPage();
    Logger.info("Navigated to Facility Page");

    // Step 3: Select Nuclear Medicine modality
    // The CTModalityPage should have a method for this (per requirements)
    await ctModalityPage.selectNuclearMedicineModality();
    Logger.info("Selected Nuclear Medicine modality");

    // Step 4: Verify Nuclear Medicine workflow is initiated
    // Check for presence of Nuclear Medicine related UI text or modal
    const nuclearMedicineLabel = page.getByLabel('Nuclear Medicine Accreditation Program');
    await expect(nuclearMedicineLabel).toBeVisible();
    Logger.info("Verified Nuclear Medicine workflow UI is visible");

    // Step 5: Proceed to Survey Agreement page
    // Click Next to go to Survey Agreement (or as per workflow)
    // The navigation may be handled by a page object method if available
    // Here, we check that the Survey Agreement step is reached
    await page.getByRole('link', { name: 'Survey Agreement' }).click();
    await expect(page.getByRole('heading', { name: /Survey Agreement/i })).toBeVisible();
    Logger.info("Reached Survey Agreement page");

    // Post-condition: Optionally sign out or navigate back to dashboard
    await myApplicationsPage.signOut();
    Logger.info("Signed out after test");
  });
});
