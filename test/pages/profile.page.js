import { goBack, isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Dashboard, Profile } from '../helpers/keys.js';

class ProfilePage {
  async open() {
    await tapKey(Dashboard.profileTab);
    return isKeyVisible(Profile.list, 20000);
  }

  async isShown(timeout = 10000) {
    return isKeyVisible(Profile.list, timeout);
  }

  async areMainTilesVisible() {
    return (
      (await isKeyVisible(Profile.settingsTile)) && (await isKeyVisible(Profile.performanceTile))
    );
  }

  async openSettings() {
    await tapKey(Profile.settingsTile);
    return isKeyVisible(Profile.settingsPage, 20000);
  }

  async openPerformance() {
    await tapKey(Profile.performanceTile);
    return isKeyVisible(Profile.performancePage, 20000);
  }

  async arePerformanceRatesVisible() {
    return (
      (await isKeyVisible(Profile.acceptanceRateTile, 10000)) &&
      (await isKeyVisible(Profile.rejectionRateTile))
    );
  }

  /** Back from a sub page to the Profile tab. */
  async back() {
    await goBack();
    return this.isShown();
  }
}

export default new ProfilePage();
