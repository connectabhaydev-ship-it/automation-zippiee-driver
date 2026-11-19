import VehicleDetailsPage from '../pages/vehicle-details.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 9 of the main flow. Runs from Profile.
// References test cases: VD-01, VD-02, VD-07 from manual-test-tracker.csv.
describe('09 Vehicle Details', () => {
  it('TC46 [VD-01] Vehicle Details tile opens the vehicle info screen', async () => {
    expect(await VehicleDetailsPage.openFromProfile()).toBe(true);
  });

  it('TC47 [VD-01] shows the vehicle information card', async () => {
    expect(await VehicleDetailsPage.isVehicleInfoCardVisible()).toBe(true);
  });

  it('TC48 [VD-01] shows the vehicle documents and photos content list', async () => {
    expect(await VehicleDetailsPage.isContentListVisible()).toBe(true);
  });

  it('TC49 [VD-01] Back returns to the profile screen', async () => {
    await VehicleDetailsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });
});
