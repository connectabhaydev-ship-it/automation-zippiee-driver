import { goBack, isKeyGone, isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Home, Notifications } from '../helpers/keys.js';

class NotificationsPage {
  /** Opens Notifications from the bell on the home top bar. */
  async openFromHome() {
    await tapKey(Home.notificationsButton);
    return isKeyVisible(Notifications.page, 20000);
  }

  async areFilterTabsVisible() {
    for (const filter of ['all', 'unread', 'read']) {
      if (!(await isKeyVisible(Notifications.tab(filter)))) return false;
    }
    return true;
  }

  async openTab(filter) {
    await tapKey(Notifications.tab(filter));
  }

  async isShown(timeout = 3000) {
    return isKeyVisible(Notifications.page, timeout);
  }

  async isMarkAllReadVisible() {
    return isKeyVisible(Notifications.markAllReadButton, 3000);
  }

  async tapMarkAllRead() {
    if (await this.isMarkAllReadVisible()) {
      await tapKey(Notifications.markAllReadButton);
    }
  }

  async isNotificationListVisible() {
    return isKeyVisible(Notifications.list, 5000);
  }

  async isNotificationDetailsVisible(timeout = 5000) {
    return (
      (await isKeyVisible(Notifications.detailsPage, timeout)) ||
      (await isKeyVisible(Notifications.detailsSheet, 2000))
    );
  }

  async isNotificationSettingsVisible(timeout = 5000) {
    return isKeyVisible(Notifications.settingsPage, timeout);
  }

  async isMuteSwitchVisible() {
    return isKeyVisible(Notifications.settingsMuteSwitch, 3000);
  }

  async toggleMute() {
    await tapKey(Notifications.settingsMuteSwitch);
  }

  async isInAppBannerVisible(timeout = 3000) {
    return isKeyVisible(Notifications.inAppBanner, timeout);
  }

  async isBannerActionsVisible() {
    return (
      (await isKeyVisible(Notifications.inAppBannerRejectButton, 3000)) &&
      (await isKeyVisible(Notifications.inAppBannerAcceptButton, 3000))
    );
  }

  /** Back to the screen that opened it. True once the page is gone. */
  async close() {
    await goBack();
    return isKeyGone(Notifications.page, 10000);
  }
}

export default new NotificationsPage();
