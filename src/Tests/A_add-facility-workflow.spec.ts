import { expect, test } from '@playwright/test';
import { LoginPage } from '../CommonPages/LoginPage';
import { FacilityPage } from '../Pages/facility-page';
import { FacilityDetailsPage } from '../Pages/facility-detail-page';
import { SurveyAgreementPage } from '../Pages/survey-agreement-page';
import { CTModalityPage } from '../Pages/CT-modality-workflow';
import { ExamPersonnelPage } from '../Pages/exam-personnel-page';
import { PaymentSubmissionPage } from '../Pages/payment-application-submission-page';
import { Logger } from '../Utils/logger';
import { MyApplicationsPage } from '../Pages/my-applications-page';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('../ACREDIT/src/TestData/ApplicationSubmission.json', 'utf-8'));

test.setTimeout(15 * 60 * 1000);
test('Login test', async ({ page }) => {
  
    // Page Objects
    const loginPage = new LoginPage(page);
    const facilityPage = new FacilityPage(page);
    const facilityDetailPage = new FacilityDetailsPage(page);
    const surveyAgreementPage = new SurveyAgreementPage(page);
    const cTModalityPage = new CTModalityPage(page);
    const examPersonnelPage = new ExamPersonnelPage(page);
    const paymentSubmissionPage = new PaymentSubmissionPage(page);
    const myApplicationsPage = new MyApplicationsPage(page);

    const acreditURL = "https://acreditplus-cloud-uat-one.acr.org/ACReditPlus";
    const userName = "acreditplusfacilityuser@yahoo.com";
    const dashboard = "https://acreditplus-cloud-uat-one.acr.org/ACReditPlus/Facility/Dashboard";

    //Login
    await test.step('Login to ACRedit application as Facility User', async () => {
        await loginPage.goto(acreditURL);
        await loginPage.login(userName);        
    });

    await test.step('Navigate to Facility Dashboard', async () => {
        await page.goto(dashboard);
    });

    // Facility Creation
    await test.step('Create Facility', async () => {
        await facilityPage.openFacilityPage();
        await facilityPage.selectFacilityType();
        await facilityPage.fillFacilityInfo();
    });

    // Facility Details
    await test.step('Enter Facility Details', async () => {
        await facilityDetailPage.enterPhoneFaxNumber(data.facility.phoneNumber.first,
            data.facility.phoneNumber.second,
            data.facility.phoneNumber.third,
            data.facility.faxNumber.first,
            data.facility.faxNumber.second,
            data.facility.faxNumber.third
        );

        await facilityDetailPage.enterFacilityOwner(data.facility.owner.name);

        await facilityDetailPage.enterSupervisingPhysician(
            data.supervisingPhysician.firstName,
            data.supervisingPhysician.lastName, 
            data.supervisingPhysician.degreeValue, 
            data.supervisingPhysician.email);

        await facilityDetailPage.enterAdministrator(
            data.administrator.firstName, 
            data.administrator.lastName, 
            data.administrator.degreeValue, 
            data.administrator.email ,
            data.administrator.phoneNumber.first ,
            data.administrator.phoneNumber.second ,
            data.administrator.phoneNumber.third );

        await facilityDetailPage.enterAccountsPayableContact(
            data.accountsPayableContact.firstName, 
            data.accountsPayableContact.lastName, 
            data.accountsPayableContact.email,
            data.accountsPayableContact.phoneNumber.first,
            data.accountsPayableContact.phoneNumber.second,
            data.accountsPayableContact.phoneNumber.third //'654','576','8889'
        );
        
        await facilityDetailPage.selectPracticeSettingOptions(
            data.practiceSetting.selectedPracticeSettingId,
            data.practiceSetting.interpretingPhysicians,
            data.practiceSetting.facilityType,
            data.practiceSetting.locationType 
        );
        await facilityDetailPage.clickNextSurveyAgreement();
    });

    // JSON file data Mapping needs to start from here 

        // Survey Agreement
    await test.step('Complete Survey Agreement', async () => {
        await surveyAgreementPage.selectPrintTitleAndGoNext(data.printTitleOption);
    });

    // CT Modality Selection
    await test.step('Configure CT Modality', async () => {
        await page.waitForTimeout(3000);
        await cTModalityPage.selectComputedTomography();

        //
        await page.waitForTimeout(3000);
        // Clicking on the next modality info button in CMS info page is missing. Need to add it 
        await cTModalityPage.selectnextModalityInCMSInfo();

        await cTModalityPage.enterCTSupervisingPhysician(
        data.SupervisingPhysicianContact.firstName, 
        data.SupervisingPhysicianContact.lastName,
        data.SupervisingPhysicianContact.degree, 
        data.SupervisingPhysicianContact.phoneNumber,
        data.SupervisingPhysicianContact.email
        );

        await page.waitForTimeout(3000);
        await cTModalityPage.enterCTTechnologist(
        data.TechnologistContact.firstName, 
        data.TechnologistContact.lastName,        
        data.TechnologistContact.phoneNumber,
        data.TechnologistContact.email
        );

        await page.waitForTimeout(3000);

        await cTModalityPage.enterUnitAndPhysicianQuality(
            data.UnitAndPhysician.unit, 
            data.UnitAndPhysician.peerReviewOption,
            data.UnitAndPhysician.qualityScore
        );

        await page.waitForTimeout(3000);
        await cTModalityPage.enterCTUnitDetails(
            data.CTUnitDetails.roomLocation,
            data.CTUnitDetails.manufacturer,
            data.CTUnitDetails.modelName,
            data.CTUnitDetails.yearManufactured,
            data.CTUnitDetails.serialNumber,
            data.CTUnitDetails.operatingLocation
        );
    });

    // Exam Personnel
    await test.step('Add Exam Personnel', async () => {
        await page.waitForTimeout(3000);
        await examPersonnelPage.selectCTExams();
        await page.waitForTimeout(3000);

        await examPersonnelPage.addInterpretingRadiologist(
            data.InterpretingRadiologis.lastName,
            data.InterpretingRadiologis.firstName,
            data.InterpretingRadiologis.email,
            data.InterpretingRadiologis.degreeMD,
            data.InterpretingRadiologis.degreeDO,
            data.InterpretingRadiologis.degreeOption
        );
        await page.waitForTimeout(3000);

        await examPersonnelPage.addMedicalPhysicist(
        data.MedicoPhysician.lastName,
            data.MedicoPhysician.firstName,
            data.MedicoPhysician.email,
            data.MedicoPhysician.degreeMD,
            data.MedicoPhysician.degreeDO
        );
        await page.waitForTimeout(3000);

        await examPersonnelPage.addTechnologist(
            data.addTechnologist.lastName,
            data.addTechnologist.firstName,
            data.addTechnologist.email,
            data.addTechnologist.degreeMD,
            data.addTechnologist.degreeDO,
            data.addTechnologist.certficateARRT,
            data.addTechnologist.certficateCT,
            data.addTechnologist.certFilterCCI,
            data.addTechnologist.certificateRVS
        // 'techie', '123', 'techie@gmail.com'
        );
        await page.waitForTimeout(3000);

        await examPersonnelPage.clickNextPaymentDetail();
    });

    // Payment & Submission
    await test.step('Submit Payment and Application', async () => {
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.selectPaymentMethodAndProceed();
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.proceedThroughSummaryAndVerification();
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.submitApplication();
        await page.waitForTimeout(3000);
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.verifySubmissionConfirmation();
        await page.waitForTimeout(3000);
    });

    // Sign Out
    await test.step('Sign Out', async () => {
        await myApplicationsPage.signOut();
    });
    
    Logger.info('Test execution completed successfully');

});
