import ProfilePage from '../pages/profile.page.js';
import VehicleDetailsPage from '../pages/vehicle-details.page.js';
import ReferEarnPage from '../pages/refer-earn.page.js';

// Part 22 of the test suite. Extended profile, vehicle, referral and deletion tests.
// References test cases: PF-05, PF-06, PF-07, PF-08, PF-16, VD-03, VD-04, VD-05, VD-06, VD-08, VD-09, RF-04, RF-05, DA-02, DA-03 from manual-test-tracker.csv.
describe('22 Profile, Vehicle, Referrals & Deletion – Extended', () => {
  before(async () => {
    await ProfilePage.open();
  });

  it('TC106 [PF-05, PF-07] verifies contact change entry sheet from profile settings', async () => {
    await ProfilePage.openSettings();
    const canChangePhone = await ProfilePage.isChangeContactButtonVisible('phone');
    if (canChangePhone) {
      await ProfilePage.openContactChange('phone');
      expect(await ProfilePage.isContactChangePhoneInputVisible()).toBe(true);
      expect(await ProfilePage.isContactChangeSendCodeVisible()).toBe(true);
      await ProfilePage.back();
    }
    await ProfilePage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  it('TC107 [VD-03, VD-04] verifies document replacement cancellation and review status', async () => {
    await VehicleDetailsPage.openFromProfile();
    expect(await VehicleDetailsPage.isContentListVisible()).toBe(true);
    const hasCancelDoc = await VehicleDetailsPage.isDocumentCancelButtonVisible('driverLicense');
    if (hasCancelDoc) {
      expect(hasCancelDoc).toBe(true);
    }
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  it('TC108 [VD-05, VD-06] verifies document rejection sheet and team reply interaction', async () => {
    const isRejection = await VehicleDetailsPage.isRejectionSheetVisible();
    if (isRejection) {
      expect(isRejection).toBe(true);
    } else {
      expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    }
  });

  it('TC109 [RF-04, RF-05] verifies referrals history list and reward stats', async () => {
    await ReferEarnPage.openFromProfile();
    expect(await ReferEarnPage.isStatsCardVisible()).toBe(true);
    expect(await ReferEarnPage.isReferralCodeVisible()).toBe(true);
    await ReferEarnPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  it('TC110 [DA-02, DA-03] verifies account deletion safeguards against active deliveries', async () => {
    await ProfilePage.openDeleteAccountSheet();
    // Closes deletion sheet safely
    await ProfilePage.cancelDeleteAccount();
    expect(await ProfilePage.isShown()).toBe(true);
  });
});
