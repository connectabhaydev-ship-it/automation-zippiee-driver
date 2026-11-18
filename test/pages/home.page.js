import { isKeyVisible, tapKey, waitKey } from '../helpers/flutter.js';
import { Common, Dashboard, Home, Tabs } from '../helpers/keys.js';

class HomePage {
  async isShown(timeout = 30000) {
    return isKeyVisible(Dashboard.page, timeout);
  }

  /**
   * After login the app may open its own sheet / dialog first (permissions,
   * battery optimisation). Close whichever is there; none is fine too.
   */
  async dismissStartupPrompts() {
    if (await isKeyVisible(Dashboard.permissionsNotNowButton, 5000)) {
      await tapKey(Dashboard.permissionsNotNowButton);
    }
    if (await isKeyVisible(Home.batteryDialogNotNowButton, 3000)) {
      await tapKey(Home.batteryDialogNotNowButton);
    }
  }

  async isOnlineToggleVisible() {
    return isKeyVisible(Common.onlineToggle);
  }

  async isNotificationsButtonVisible() {
    return isKeyVisible(Home.notificationsButton);
  }

  async isAvatarVisible() {
    return isKeyVisible(Home.avatarButton);
  }

  async isHomeContentVisible() {
    return isKeyVisible(Home.scrollView);
  }

  /** All four "Today's progress" tiles. */
  async areProgressTilesVisible() {
    const keys = [Home.earningsTile, Home.tripsTile, Home.timeOnOrdersTile, Home.ratingTile];
    for (const key of keys) {
      if (!(await isKeyVisible(key))) return false;
    }
    return true;
  }

  async areNavTabsVisible() {
    const keys = [Dashboard.homeTab, Dashboard.walletTab, Dashboard.ordersTab, Dashboard.profileTab];
    for (const key of keys) {
      if (!(await isKeyVisible(key))) return false;
    }
    return true;
  }

  async openWalletTab() {
    await tapKey(Dashboard.walletTab);
    return isKeyVisible(Tabs.walletList, 20000);
  }

  /** Orders tab: the list, or the filter icon (shown once there are orders). */
  async openOrdersTab() {
    await tapKey(Dashboard.ordersTab);
    return (
      (await isKeyVisible(Tabs.ordersList, 20000)) ||
      (await isKeyVisible(Tabs.ordersFilterButton, 3000))
    );
  }

  async openProfileTab() {
    await tapKey(Dashboard.profileTab);
    return isKeyVisible(Tabs.profileList, 20000);
  }

  async openHomeTab() {
    await tapKey(Dashboard.homeTab);
    await waitKey(Home.scrollView, 20000);
  }

  /** The avatar in the top bar opens the Profile tab. */
  async openProfileFromAvatar() {
    await tapKey(Home.avatarButton);
    return isKeyVisible(Tabs.profileList, 20000);
  }
}

export default new HomePage();
