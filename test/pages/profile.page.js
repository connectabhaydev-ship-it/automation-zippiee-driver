import { goBack, isKeyVisible, scrollToKey, tapKey } from '../helpers/flutter.js';
import { Common, Dashboard, Profile } from '../helpers/keys.js';

class ProfilePage {
  async open() {
    await tapKey(Dashboard.profileTab);
    return isKeyVisible(Profile.list, 20000);
  }

  async isShown(timeout = 10000) {
    return isKeyVisible(Profile.list, timeout);
  }

  /** Settings + Performance tiles (scrolls to them: the list may be scrolled down). */
  async areMainTilesVisible() {
    return (
      (await scrollToKey(Profile.settingsTile)) && (await scrollToKey(Profile.performanceTile))
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

  async isChangeContactButtonVisible(field = 'phone') {
    return isKeyVisible(Profile.changeButton(field), 3000);
  }

  async openContactChange(field = 'phone') {
    if (await this.isChangeContactButtonVisible(field)) {
      await tapKey(Profile.changeButton(field));
      return (
        (await isKeyVisible(Profile.contactChangePhoneField, 5000)) ||
        (await isKeyVisible(Profile.contactChangeEmailField, 5000))
      );
    }
    return false;
  }

  async isContactChangePhoneInputVisible() {
    return isKeyVisible(Profile.contactChangePhoneField, 3000);
  }

  async isContactChangeEmailInputVisible() {
    return isKeyVisible(Profile.contactChangeEmailField, 3000);
  }

  async isContactChangeSendCodeVisible() {
    return isKeyVisible(Profile.contactChangeSendCodeButton, 3000);
  }

  async isContactChangeOtpFieldVisible() {
    return isKeyVisible(Profile.contactChangeOtpField, 3000);
  }

  async isContactChangeStartAgainVisible() {
    return isKeyVisible(Profile.contactChangeStartAgainButton, 3000);
  }

  async isOngoingOrderLogoutBlockedDialogVisible() {
    return isKeyVisible(Common.ongoingOrderDialog, 3000);
  }

  async dismissOngoingOrderLogoutDialog() {
    if (await isKeyVisible(Common.ongoingOrderDialogOkButton, 2000)) {
      await tapKey(Common.ongoingOrderDialogOkButton);
    }
  }

  async openPerformance() {
    await tapKey(Profile.performanceTile);
    return isKeyVisible(Profile.performancePage, 20000);
  }

  async arePerformanceRatesVisible() {
    return (
      (await isKeyVisible(Profile.acceptanceRateTile, 25000)) &&
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
