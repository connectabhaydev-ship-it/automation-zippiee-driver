import { goBack, isKeyVisible, tapKey } from '../helpers/flutter.js';
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

  async areSecondaryTilesVisible() {
    return (
      (await isKeyVisible(Profile.bankAccountsTile, 3000)) &&
      (await isKeyVisible(Profile.vehicleDetailsTile, 3000)) &&
      (await isKeyVisible(Profile.helpTile, 3000)) &&
      (await isKeyVisible(Profile.logoutTile, 3000))
    );
  }

  async isCompletionCardVisible() {
    return isKeyVisible(Profile.completionCard, 3000);
  }

  async openSettings() {
    await tapKey(Profile.settingsTile);
    return isKeyVisible(Profile.settingsPage, 20000);
  }

  async areSettingsInfoTilesVisible() {
    return (
      (await isKeyVisible(Profile.infoTile('fullName'), 3000)) &&
      (await isKeyVisible(Profile.infoTile('phone'), 3000)) &&
      (await isKeyVisible(Profile.infoTile('email'), 3000))
    );
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

  async openHelpSupport() {
    await tapKey(Profile.helpTile);
    return isKeyVisible(Profile.helpSupportPage, 10000);
  }

  async isHelpSupportEmailButtonVisible() {
    return isKeyVisible(Profile.helpSupportSendEmailButton, 5000);
  }

  async openLegalDoc(tileKey) {
    await tapKey(tileKey);
    return (
      (await isKeyVisible(Common.legalDocumentPage, 10000)) ||
      (await isKeyVisible(Common.documentViewerPage, 3000))
    );
  }

  async openLanguagePicker() {
    await tapKey(Profile.languageTile);
    return (
      (await isKeyVisible(Profile.languageOption('en'), 5000)) ||
      (await isKeyVisible(Profile.moreMenuLanguageOption, 3000))
    );
  }

  async openLogoutDialog() {
    await tapKey(Profile.logoutTile);
    return isKeyVisible(Profile.logoutCancelButton, 5000);
  }

  async cancelLogout() {
    if (await isKeyVisible(Profile.logoutCancelButton, 3000)) {
      await tapKey(Profile.logoutCancelButton);
    }
  }

  async openDeleteAccountSheet() {
    await tapKey(Profile.deleteAccountTile);
    return (
      (await isKeyVisible(Profile.deleteAccountReasonField, 5000)) ||
      (await isKeyVisible(Profile.deleteAccountCancelButton, 3000))
    );
  }

  async cancelDeleteAccount() {
    if (await isKeyVisible(Profile.deleteAccountCancelButton, 3000)) {
      await tapKey(Profile.deleteAccountCancelButton);
    }
  }

  /** Back from a sub page to the Profile tab. */
  async back() {
    await goBack();
    return this.isShown();
  }
}

export default new ProfilePage();
