import { isKeyVisible, tapKey } from '../helpers/flutter.js';
import { AppVersion, Common } from '../helpers/keys.js';

class AppVersionPage {
  async isForceUpdatePageShown(timeout = 5000) {
    return isKeyVisible(AppVersion.forceUpdatePage, timeout);
  }

  async isForceUpdateNowButtonVisible() {
    return isKeyVisible(AppVersion.forceUpdateNowButton, 5000);
  }

  async isUpdateAvailableDialogShown(timeout = 5000) {
    return isKeyVisible(AppVersion.updateAvailableDialog, timeout);
  }

  async isUpdateLaterButtonVisible() {
    return isKeyVisible(AppVersion.updateAvailableLaterButton, 3000);
  }

  async isUpdateNowButtonVisible() {
    return isKeyVisible(AppVersion.updateAvailableNowButton, 3000);
  }

  async dismissUpdateDialog() {
    if (await isKeyVisible(AppVersion.updateAvailableLaterButton, 2000)) {
      await tapKey(AppVersion.updateAvailableLaterButton);
    }
  }

  async isAlertNotificationDialogShown(timeout = 5000) {
    return isKeyVisible(AppVersion.alertNotificationDialog, timeout);
  }

  async isAlertCloseButtonVisible() {
    return isKeyVisible(AppVersion.alertNotificationCloseButton, 3000);
  }

  async isAlertCtaButtonVisible() {
    return isKeyVisible(AppVersion.alertNotificationCtaButton, 3000);
  }

  async isNoInternetDialogShown(timeout = 5000) {
    return isKeyVisible(Common.noInternetDialog, timeout);
  }

  async isNoInternetRetryVisible() {
    return (
      (await isKeyVisible(Common.noInternetRetryButton, 3000)) ||
      (await isKeyVisible(Common.noInternetTryAgainButton, 3000))
    );
  }

  async isLocationRequiredDialogShown(timeout = 5000) {
    return isKeyVisible(Common.locationRequiredDialog, timeout);
  }

  async isLocationEnableButtonVisible() {
    return isKeyVisible(Common.locationRequiredEnableButton, 3000);
  }

  async isPermissionSettingsDialogShown(timeout = 5000) {
    return isKeyVisible(Common.permissionSettingsDialog, timeout);
  }

  async isPermissionSettingsOpenVisible() {
    return isKeyVisible(Common.permissionSettingsOpenButton, 3000);
  }
}

export default new AppVersionPage();
