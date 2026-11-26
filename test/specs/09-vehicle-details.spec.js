import VehicleDetailsPage from '../pages/vehicle-details.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 9 of the main flow. Starts: Profile (end of 08).  Ends: Profile.
// Read-only: opens the photo picker but never uploads, so the staging
// driver's verified documents are not changed.
// References test cases: VD-01, VD-02, VD-03, VD-04 from manual-test-tracker.csv.
describe('09 Vehicle Details', () => {
  it('TC46 [VD-01] Vehicle Details tile opens the vehicle info screen', async () => {
    expect(await VehicleDetailsPage.openFromProfile()).toBe(true);
  });

  it('TC47 [VD-01] shows the vehicle information card', async () => {
    await VehicleDetailsPage.ensureOpen();
    expect(await VehicleDetailsPage.isVehicleInfoCardVisible()).toBe(true);
  });

  it('TC48 [VD-01] shows the vehicle documents and photos content list', async () => {
    await VehicleDetailsPage.ensureOpen();
    expect(await VehicleDetailsPage.isContentListVisible()).toBe(true);
  });

  describe('Photo source picker', () => {
    beforeEach(async () => {
      await VehicleDetailsPage.ensureOpen();
    });

    afterEach(async () => {
      // Never leave the picker open for the next test.
      if (await VehicleDetailsPage.isCameraOptionVisible()) {
        await VehicleDetailsPage.closePhotoSourcePicker();
      }
    });

    // Photo roles in this build: FRONT, BACK, LEFT, RIGHT (vehicle sides).
    it('TC48a [VD-02] front-side photo offers the Camera option', async () => {
      expect(await VehicleDetailsPage.openPhotoSourcePicker('FRONT')).toBe(true);
      expect(await VehicleDetailsPage.isCameraOptionVisible()).toBe(true);
    });

    it('TC48b [VD-03] back-side photo offers the Gallery option', async () => {
      expect(await VehicleDetailsPage.openPhotoSourcePicker('BACK')).toBe(true);
      expect(await VehicleDetailsPage.isGalleryOptionVisible()).toBe(true);
    });

    it('TC48c [VD-04] closing the picker keeps Vehicle Details without a confirm dialog', async () => {
      expect(await VehicleDetailsPage.openPhotoSourcePicker('LEFT')).toBe(true);
      expect(await VehicleDetailsPage.closePhotoSourcePicker()).toBe(true);
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
      expect(await VehicleDetailsPage.isPageShown()).toBe(true);
    });
  });

  // Own describe: mocha runs a suite's plain `it`s BEFORE its nested describes,
  // so a top-level TC49 would leave the page before the picker tests ran.
  describe('Leave', () => {
    it('TC49 [VD-01] Back returns to the profile screen', async () => {
      expect(await VehicleDetailsPage.back()).toBe(true);
      expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    });
  });
});
