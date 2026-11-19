import { isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Common, Dashboard, Profile } from '../helpers/keys.js';

class ReferEarnPage {
  async openFromProfile() {
    await tapKey(Dashboard.profileTab);
    await tapKey(Profile.referAndEarnTile);
    return isKeyVisible(Profile.referPage, 10000);
  }

  async isPageShown() {
    return isKeyVisible(Profile.referPage, 5000);
  }

  async isReferralCodeVisible() {
    return isKeyVisible(Profile.referCodeText, 5000);
  }

  async isCopyButtonVisible() {
    return isKeyVisible(Profile.referCopyCodeButton, 5000);
  }

  async isShareButtonVisible() {
    return isKeyVisible(Profile.referShareButton, 5000);
  }

  async isStatsCardVisible() {
    return isKeyVisible(Profile.referEarnPerReferralCard, 5000);
  }

  async back() {
    await tapKey(Common.backButton);
  }
}

export default new ReferEarnPage();
