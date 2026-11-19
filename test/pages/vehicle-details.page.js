import { isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Common, Dashboard, Profile } from '../helpers/keys.js';

class VehicleDetailsPage {
  async openFromProfile() {
    await tapKey(Dashboard.profileTab);
    await tapKey(Profile.vehicleDetailsTile);
    return isKeyVisible(Profile.vehicleDetailsPage, 10000);
  }

  async isPageShown() {
    return isKeyVisible(Profile.vehicleDetailsPage, 5000);
  }

  async isVehicleInfoCardVisible() {
    return isKeyVisible(Profile.vehicleInfoCard, 5000);
  }

  async isContentListVisible() {
    return isKeyVisible(Profile.vehicleDetailsList, 5000);
  }

  async back() {
    await tapKey(Common.backButton);
  }
}

export default new VehicleDetailsPage();
