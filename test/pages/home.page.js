import { isKeyVisible, tapKey, waitKey, byText } from '../helpers/flutter.js';
import { Common, Dashboard, Home, Tabs } from '../helpers/keys.js';

/**
 * Page object for the Home screen of the Zippiee driver app.
 * All interactions that require the Appium `browser` session must be
 * performed inside test hooks (e.g., `before`, `it`).
 */
class HomePage {
  // Existing methods ...

  /** Wait for the “new order” dialog and tap the Accept button. */
  async acceptNewOrder(timeout = 30000) {
    // Wait for the new‑order dialog to become visible (using waitKey for reliability)
    try {
      await waitKey(Common.newOrderRequestDialog, timeout);
    } catch (e) {
      console.warn('⚠️ New‑order dialog never appeared within timeout');
      return false;
    }
    // Try to tap the Accept button directly
    try {
      await tapKey(Common.newOrderRequestAcceptButton);
    } catch (e) {
      console.warn('⚠️ Direct tap on Accept failed, attempting fallback');
      // Open the view‑items button first if present
      const viewBtnVisible = await isKeyVisible(Common.newOrderRequestViewItemsButton, 5000);
      if (viewBtnVisible) {
        await tapKey(Common.newOrderRequestViewItemsButton);
        await tapKey(Common.newOrderRequestAcceptButton);
      } else {
        // As a last resort, try tapping by visible text "Accept"
        const acceptByText = await byText('Accept').catch(() => null);
        if (acceptByText) {
          await acceptByText.click();
        } else {
          console.error('❌ Unable to locate Accept button');
          return false;
        }
      }
    }
    // Ensure the dialog disappears (optional verification)
    await waitKey(Common.newOrderRequestDialog, 5000).catch(() => null);
    return true;
  }

  /** Verify that the current‑order card is visible on Home. */
  async isCurrentOrderCardVisible(timeout = 10000) {
    return isKeyVisible(Home.currentOrderCard, timeout);
  }

  /** Check if the Home screen is currently shown. */
  async isShown(timeout = 30000) {
    return isKeyVisible(Dashboard.page, timeout);
  }

  /** Dismiss any startup dialogs that can appear after login. */
  async dismissStartupPrompts() {
    if (await isKeyVisible(Dashboard.permissionsNotNowButton, 5000)) {
      await tapKey(Dashboard.permissionsNotNowButton);
    }
    if (await isKeyVisible(Home.batteryDialogNotNowButton, 3000)) {
      await tapKey(Home.batteryDialogNotNowButton);
    }
  }

  /** Determine whether the online/offline toggle is visible. */
  async isOnlineToggleVisible() {
    return isKeyVisible(Common.onlineToggle);
  }

  /** Returns the driver’s current status label ("ONLINE" or "OFFLINE"). */
  async getOnlineStatusLabel() {
    const online = await byText('ONLINE').catch(() => null);
    if (online) return online.getText();
    const offline = await byText('OFFLINE').catch(() => null);
    if (offline) return offline.getText();
    return '';
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

  /** Open the Home tab, handling any startup prompts first. */
  async openHomeTab() {
    await this.dismissStartupPrompts();
    const homeTabVisible = await isKeyVisible(Dashboard.homeTab, 15000);
    if (!homeTabVisible) {
      // Retry after a short pause if the tab is not yet visible.
      await browser.pause(1000);
    }
    await tapKey(Dashboard.homeTab);
    // Wait for the main Home content to appear.
    await waitKey(Home.scrollView, 30000);
  }

  /** Open the Profile screen via the avatar button. */
  async openProfileFromAvatar() {
    await tapKey(Home.avatarButton);
    return isKeyVisible(Tabs.profileList, 20000);
  }

  /** Ensure we are on the Home screen after login. */
  async ensureHomeScreen() {
    const homeTabVisible = await isKeyVisible(Dashboard.homeTab, 5000);
    if (homeTabVisible) {
      await this.openHomeTab();
    } else {
      // Assume we might already be on Home; wait for a core element.
      await waitKey(Home.scrollView, 15000).catch(() => null);
    }
  }
}

export default new HomePage();
