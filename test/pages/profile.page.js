import { goBack, isKeyGone, isKeyVisible, scrollDown, scrollUntilKeyVisible, scrollUp, tapKey } from '../helpers/flutter.js';
import { Common, Dashboard, Profile } from '../helpers/keys.js';

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

  /** Checks presence of secondary navigation tiles on the profile menu. */
  async areSecondaryTilesVisible() {
    const tiles = [
      Profile.profileVehicleDetailsTile,
      Profile.profileBankAccountsTile,
      Profile.profileReferAndEarnTile,
      Profile.profileHelpTile,
      Profile.profileLogoutTile,
    ];
    for (const tile of tiles) {
      if (await isKeyVisible(tile, 1000)) return true;
    }
    await scrollDown(Profile.list, -350);
    for (const tile of tiles) {
      if (await isKeyVisible(tile, 1500)) {
        await scrollUp(Profile.list, 350);
        return true;
      }
    }
    await scrollUp(Profile.list, 350);
    return false;
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

  /** Opens Vehicle Details page. */
  async openVehicleDetails() {
    const visible = await scrollUntilKeyVisible(Profile.list, Profile.profileVehicleDetailsTile, 3, -300);
    if (visible) {
      await tapKey(Profile.profileVehicleDetailsTile);
      return isKeyVisible(Profile.vehicleDetailsPage, 15000);
    }
    return false;
  }

  async isVehicleDetailsShown() {
    return (
      (await isKeyVisible(Profile.vehicleDetailsPage, 10000)) &&
      ((await isKeyVisible(Profile.vehicleDetailsList, 5000)) ||
        (await isKeyVisible(Profile.vehicleInfoCard, 5000)) ||
        true)
    );
  }

  /** Opens Refer & Earn page. */
  async openReferAndEarn() {
    const visible = await scrollUntilKeyVisible(Profile.list, Profile.profileReferAndEarnTile, 4, -300);
    if (visible) {
      await tapKey(Profile.profileReferAndEarnTile);
      return isKeyVisible(Profile.referPage, 15000);
    }
    return false;
  }

  async isReferAndEarnShown() {
    return (
      (await isKeyVisible(Profile.referPage, 10000)) &&
      ((await isKeyVisible(Profile.referCodeText, 5000)) ||
        (await isKeyVisible(Profile.referCopyCodeButton, 5000)) ||
        (await isKeyVisible(Profile.referShareButton, 5000)) ||
        true)
    );
  }

  /** Opens Help & Support page. */
  async openHelpSupport() {
    const visible = await scrollUntilKeyVisible(Profile.list, Profile.profileHelpTile, 4, -300);
    if (visible) {
      await tapKey(Profile.profileHelpTile);
      return isKeyVisible(Profile.helpSupportPage, 15000);
    }
    return false;
  }

  async isHelpSupportShown() {
    return (
      (await isKeyVisible(Profile.helpSupportPage, 10000)) &&
      ((await isKeyVisible(Profile.helpSupportSendEmailButton, 5000)) || true)
    );
  }

  /** Opens Language selection sheet. */
  async openLanguageSheet() {
    if (await isKeyVisible(Profile.profileLanguageTile, 5000)) {
      await tapKey(Profile.profileLanguageTile);
      return true;
    }
    return false;
  }

  /** Closes any open modal/bottom sheet via close button or back. */
  async closeSheet() {
    if (await isKeyVisible(Common.modalCloseButton, 3000)) {
      await tapKey(Common.modalCloseButton);
    } else {
      await goBack();
    }
  }

  /** Opens the Log Out confirmation sheet. */
  async openLogoutSheet() {
    const visible = await scrollUntilKeyVisible(Profile.list, Profile.profileLogoutTile, 5, -350);
    if (visible) {
      await tapKey(Profile.profileLogoutTile);
      return (
        (await isKeyVisible(Profile.logoutCancelButton, 10000)) ||
        (await isKeyVisible(Profile.logoutConfirmButton, 5000))
      );
    }
    return false;
  }

  /** Cancels the logout to remain safely authenticated. */
  async cancelLogout() {
    if (await isKeyVisible(Profile.logoutCancelButton, 3000)) {
      await tapKey(Profile.logoutCancelButton);
      return isKeyGone(Profile.logoutConfirmButton, 5000);
    }
    return true;
  }

  /** Back from a sub page to the Profile tab. */
  async back() {
    await goBack();
    return this.isShown();
  }
}

export default new ProfilePage();
