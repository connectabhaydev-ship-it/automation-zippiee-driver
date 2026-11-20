import VehicleDetailsPage from '../pages/vehicle-details.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 9 of the main flow. Runs from Profile.
// References test cases: VD-01, VD-02, VD-07 from manual-test-tracker.csv.
describe('09 Vehicle Details', () => {
  it('TC46 [VD-01] Vehicle Details tile opens the vehicle info screen', async () => {
    expect(await VehicleDetailsPage.openFromProfile()).toBe(true);
    it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  // New photo upload tests
  describe('Vehicle Details – Photo capture', () => {
    before(async () => {
      // Ensure we are on the Vehicle Details page
      await VehicleDetailsPage.openFromProfile();
    });

    it('TC50 [VD-02] opens camera when uploading a selfie', async () => {
      await VehicleDetailsPage.uploadPhoto('selfie', 'camera');
      expect(await VehicleDetailsPage.isPhotoCardVisible('selfie')).toBe(true);
    });

    it('TC51 [VD-03] opens gallery when uploading a vehicle photo', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'gallery');
      expect(await VehicleDetailsPage.isPhotoCardVisible('vehicle')).toBe(true);
    });

    it('TC52 [VD-04] can cancel the upload dialog', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'camera');
      await VehicleDetailsPage.cancelConfirmDialog();
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
    });
  });
});

  it('TC47 [VD-01] shows the vehicle information card', async () => {
    expect(await VehicleDetailsPage.isVehicleInfoCardVisible()).toBe(true);
    it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  // New photo upload tests
  describe('Vehicle Details – Photo capture', () => {
    before(async () => {
      // Ensure we are on the Vehicle Details page
      await VehicleDetailsPage.openFromProfile();
    });

    it('TC50 [VD-02] opens camera when uploading a selfie', async () => {
      await VehicleDetailsPage.uploadPhoto('selfie', 'camera');
      expect(await VehicleDetailsPage.isPhotoCardVisible('selfie')).toBe(true);
    });

    it('TC51 [VD-03] opens gallery when uploading a vehicle photo', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'gallery');
      expect(await VehicleDetailsPage.isPhotoCardVisible('vehicle')).toBe(true);
    });

    it('TC52 [VD-04] can cancel the upload dialog', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'camera');
      await VehicleDetailsPage.cancelConfirmDialog();
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
    });
  });
});

  it('TC48 [VD-01] shows the vehicle documents and photos content list', async () => {
    expect(await VehicleDetailsPage.isContentListVisible()).toBe(true);
    it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  // New photo upload tests
  describe('Vehicle Details – Photo capture', () => {
    before(async () => {
      // Ensure we are on the Vehicle Details page
      await VehicleDetailsPage.openFromProfile();
    });

    it('TC50 [VD-02] opens camera when uploading a selfie', async () => {
      await VehicleDetailsPage.uploadPhoto('selfie', 'camera');
      expect(await VehicleDetailsPage.isPhotoCardVisible('selfie')).toBe(true);
    });

    it('TC51 [VD-03] opens gallery when uploading a vehicle photo', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'gallery');
      expect(await VehicleDetailsPage.isPhotoCardVisible('vehicle')).toBe(true);
    });

    it('TC52 [VD-04] can cancel the upload dialog', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'camera');
      await VehicleDetailsPage.cancelConfirmDialog();
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
    });
  });
});

  it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  // New photo upload tests
  describe('Vehicle Details – Photo capture', () => {
    before(async () => {
      // Ensure we are on the Vehicle Details page
      await VehicleDetailsPage.openFromProfile();
    });

    it('TC50 [VD-02] opens camera when uploading a selfie', async () => {
      await VehicleDetailsPage.uploadPhoto('selfie', 'camera');
      expect(await VehicleDetailsPage.isPhotoCardVisible('selfie')).toBe(true);
    });

    it('TC51 [VD-03] opens gallery when uploading a vehicle photo', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'gallery');
      expect(await VehicleDetailsPage.isPhotoCardVisible('vehicle')).toBe(true);
    });

    it('TC52 [VD-04] can cancel the upload dialog', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'camera');
      await VehicleDetailsPage.cancelConfirmDialog();
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
    });
  });
});
  it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  // New photo upload tests
  describe('Vehicle Details – Photo capture', () => {
    before(async () => {
      // Ensure we are on the Vehicle Details page
      await VehicleDetailsPage.openFromProfile();
    });

    it('TC50 [VD-02] opens camera when uploading a selfie', async () => {
      await VehicleDetailsPage.uploadPhoto('selfie', 'camera');
      expect(await VehicleDetailsPage.isPhotoCardVisible('selfie')).toBe(true);
    });

    it('TC51 [VD-03] opens gallery when uploading a vehicle photo', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'gallery');
      expect(await VehicleDetailsPage.isPhotoCardVisible('vehicle')).toBe(true);
    });

    it('TC52 [VD-04] can cancel the upload dialog', async () => {
      await VehicleDetailsPage.uploadPhoto('vehicle', 'camera');
      await VehicleDetailsPage.cancelConfirmDialog();
      expect(await VehicleDetailsPage.isConfirmDialogVisible()).toBe(false);
    });
  });
});
