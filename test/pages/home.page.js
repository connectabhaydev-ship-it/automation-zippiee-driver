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
    // Try the key first
    let toggleVisible = await this.isOnlineToggleVisible();
    // If the key is not found, fallback to locating the toggle by its label text
    if (!toggleVisible) {
      // Look for a button or switch that contains the word "Online" or "Offline"
      const label = await byText(shouldBeOnline ? 'Online' : 'Offline').catch(() => null);
      if (label && (await label.isDisplayed())) {
        // Use the element itself to tap
        await label.click();
        // Wait a short moment for UI to settle
        await waitKey(Common.onlineToggle, 3000);
        // Verify state change via isOnline()
        const newState = await this.isOnline();
        if (newState !== shouldBeOnline) {
          throw new Error(`Failed to set driver ${shouldBeOnline ? 'online' : 'offline'} using label fallback.`);
        }
        return true;
      }
    }

    // If we have the key and it's visible, use the normal flow
    if (toggleVisible) {
      const currentlyOnline = await this.isOnline();
      if (currentlyOnline === shouldBeOnline) return true;
      await tapKey(Common.onlineToggle);
      await waitKey(Common.onlineToggle, 3000);
      const newState = await this.isOnline();
      if (newState !== shouldBeOnline) {
        throw new Error(`Failed to set driver ${shouldBeOnline ? 'online' : 'offline'} (toggle did not change).`);
      }
      return true;
    }

    // If we reach here, we couldn't locate any toggle element
    throw new Error('Online toggle not found by key or label – cannot change state.');
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
