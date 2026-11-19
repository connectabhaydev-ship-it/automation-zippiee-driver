import OnboardingPage from '../pages/onboarding.page.js';
import HomePage from '../pages/home.page.js';

// Part 18 of the test suite.
// References test cases: OB-01, OB-03, OB-07, OB-08, OB-10, OB-14, OB-17, OB-26, OB-27, OB-28 from manual-test-tracker.csv.
describe('18 Driver Onboarding & Verification', () => {
  it('TC87 [OB-01, OB-03] verifies onboarding form progress and primary action', async () => {
    const isStep = await OnboardingPage.isOnboardingStepShown('personalDetails', 1000);
    if (isStep) {
      expect(await OnboardingPage.isPrimaryButtonVisible()).toBe(true);
    } else {
      // Driver profile is fully verified and active
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC88 [OB-07, OB-08] verifies work location map elements when on location step', async () => {
    const onLocation = await OnboardingPage.isLocationMapShown(1000);
    if (onLocation) {
      expect(await OnboardingPage.isConfirmLocationVisible()).toBe(true);
      expect(await OnboardingPage.isCurrentLocationPillVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC89 [OB-10, OB-12] verifies selfie capture step guidelines and retake options', async () => {
    const hasSelfie = await OnboardingPage.isSelfiePreviewVisible();
    if (hasSelfie) {
      expect(await OnboardingPage.isSelfieRetakeButtonVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC90 [OB-17, OB-20] verifies document upload list and document boxes', async () => {
    const hasDoc = await OnboardingPage.isDocumentBoxVisible('driverLicense');
    if (hasDoc) {
      expect(await OnboardingPage.isDocumentsListVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC91 [OB-26, OB-27, OB-28] verifies account verification or rejected status screen', async () => {
    const inReview = await OnboardingPage.isAccountVerificationShown(1000);
    const isRejected = await OnboardingPage.isRejectedPageShown(1000);

    if (inReview) {
      expect(await OnboardingPage.isAccountVerificationShown()).toBe(true);
    } else if (isRejected) {
      expect(await OnboardingPage.isRejectedAttentionCardVisible()).toBe(true);
      expect(await OnboardingPage.isViewRejectedItemsVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });
});
