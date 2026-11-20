import { isKeyVisible, tapKey, waitKey, byText } from '../helpers/flutter.js';
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

  /**
   * Returns true if the driver is currently online (the toggle shows the label "Online").
   * Uses a text lookup because the toggle widget itself does not expose its state via the key.
   */
  async isOnlineToggleVisible() {
    return isKeyVisible(Common.onlineToggle);
  }


  /**
   * Toggles the driver to the desired **online** state.
   * @param {boolean} shouldBeOnline - true to set online, false to set offline.
   */
  async setOnlineState(shouldBeOnline) {
    // Ensure the toggle is present
    const toggleVisible = await this.isOnlineToggleVisible();
    if (!toggleVisible) {
      throw new Error('Online toggle not visible – cannot change state.');
    }

    const currentlyOnline = await this.isOnline();
    if (currentlyOnline === shouldBeOnline) {
      // Already in the desired state – nothing to do
      return true;
    }

    // Tap the toggle to change state
    await tapKey(Common.onlineToggle);
    // Wait a short moment for UI to update
    await waitKey(Common.onlineToggle, 3000);

    // Verify the new state
    const newState = await this.isOnline();
    if (newState !== shouldBeOnline) {
      throw new Error(`Failed to set driver ${shouldBeOnline ? 'online' : 'offline'} (toggle did not change).`);
    }
    return true;
  }

  /**
   * Shortcut to ensure the driver is online.
   */
  async goOnline() {
    return this.setOnlineState(true);
  }

  /**
   * Shortcut to ensure the driver is offline.
   */
  async goOffline() {
    return this.setOnlineState(false);
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

  async openHomeTab() {
    // Ensure any startup dialogs (permissions, battery optimisation) are dismissed
    await this.dismissStartupPrompts();
    // Wait for the Home tab icon to become visible before tapping
    if (!(await isKeyVisible(Dashboard.homeTab, 5000))) {
      // If still not visible, retry after a short pause
      await new Promise(r => setTimeout(r, 1000));
    }
    await tapKey(Dashboard.homeTab);
    // After tapping, wait for the Home screen content to be visible
    await waitKey(Home.scrollView, 30000);
  }

  /** The avatar in the top bar opens the Profile tab. */
  async openProfileFromAvatar() {
    await tapKey(Home.avatarButton);
    return isKeyVisible(Tabs.profileList, 20000);
  }
}

export default new HomePage();
