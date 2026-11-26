import { isKeyGone, isKeyVisible, tapKey, waitKey, byText } from '../helpers/flutter.js';
import { dismissBlockingDialogs } from '../helpers/dialogs.js';
import { Common, Dashboard, Home, Tabs } from '../helpers/keys.js';

/**
 * Page object for the Home screen of the Zippiee driver app.
 * All interactions that require the Appium `browser` session must be
 * performed inside test hooks (e.g., `before`, `it`).
 */
class HomePage {
  /**
   * Wait for the "new order" offer and tap Accept.
   * Only call this from the order specs (10+): an accepted order stays active
   * on the staging backend and changes what every later screen shows.
   */
  async acceptNewOrder(timeout = 60000) {
    if (!(await isKeyVisible(Common.newOrderRequestDialog, timeout))) {
      console.warn('⚠️ New-order offer never appeared within timeout');
      return false;
    }
    if (!(await isKeyVisible(Common.newOrderRequestAcceptButton, 3000))) {
      // Accept can sit below the items list – open it first.
      if (await isKeyVisible(Common.newOrderRequestViewItemsButton, 3000)) {
        await tapKey(Common.newOrderRequestViewItemsButton);
      }
    }
    if (await isKeyVisible(Common.newOrderRequestAcceptButton, 5000)) {
      await tapKey(Common.newOrderRequestAcceptButton);
    } else {
      const acceptByText = await byText('Accept').catch(() => null);
      if (!acceptByText) {
        console.error('❌ Unable to locate Accept button');
        return false;
      }
      await acceptByText.click();
    }
    return isKeyGone(Common.newOrderRequestDialog, 10000);
  }

  /** Verify that the current-order card is visible on Home. */
  async isCurrentOrderCardVisible(timeout = 10000) {
    return isKeyVisible(Home.currentOrderCard, timeout);
  }

  /** Check if the Home screen is currently shown. */
  async isShown(timeout = 30000) {
    return isKeyVisible(Dashboard.page, timeout);
  }

  /** Dismiss any startup dialogs that can appear after login. */
  async dismissStartupPrompts() {
    if (await isKeyVisible(Dashboard.permissionsNotNowButton, 2000)) {
      await tapKey(Dashboard.permissionsNotNowButton);
    }
    if (await isKeyVisible(Home.batteryDialogNotNowButton, 3000)) {
      await tapKey(Home.batteryDialogNotNowButton);
    }
    await dismissBlockingDialogs();
  }

  /** Determine whether the online/offline toggle is visible. */
  async isOnlineToggleVisible() {
    return isKeyVisible(Common.onlineToggle);
  }

  /**
   * Returns "ONLINE" or "OFFLINE" ('' if the label can't be found in time).
   * The app shows "Online" / "Offline"; both the visible text and the
   * accessibility label are checked, in any letter case. Uses findElements
   * (returns at once) – findElement blocks ~10 s per miss on this driver.
   */
  async getOnlineStatusLabel(timeout = 5000) {
    const variants = (word) => [word, word.toUpperCase(), word.toLowerCase()];
    const has = async (word) => {
      for (const v of variants(word)) {
        for (const using of ['-flutter text', '-flutter semantics label']) {
          const refs = await browser.findElements(using, v).catch(() => []);
          if (Array.isArray(refs) && refs.length > 0) return true;
        }
      }
      return false;
    };
    const end = Date.now() + timeout;
    for (;;) {
      // Check Offline first: "Online" is not a substring of it, and vice versa.
      if (await has('Offline')) return 'OFFLINE';
      if (await has('Online')) return 'ONLINE';
      if (Date.now() >= end) return '';
      await browser.pause(250);
    }
  }

  /**
   * Puts the driver ONLINE (true) or OFFLINE (false). Taps the toggle only
   * when needed, so it is safe to call in any state. Returns the final label.
   */
  async setOnline(online) {
    const wanted = online ? 'ONLINE' : 'OFFLINE';
    await dismissBlockingDialogs();
    if ((await this.getOnlineStatusLabel()) !== wanted) {
      await tapKey(Common.onlineToggle, 15000).catch(async (err) => {
        // Show what covers the toggle, so the next fix isn't a guess.
        const xml = await browser.getPageSource().catch(() => '');
        const labels = [...xml.matchAll(/(?:content-desc|text)="([^"]{2,})"/g)].map((m) => m[1]).slice(0, 25);
        console.error(`❌ Online toggle hidden. On screen: ${JSON.stringify(labels)}`);
        throw err;
      });
      // Going online can pop the battery / permission dialog over the toggle.
      await dismissBlockingDialogs(3000);
      const end = Date.now() + 15000;
      while (Date.now() < end && (await this.getOnlineStatusLabel(1000)) !== wanted) {
        await browser.pause(500);
      }
    }
    const final = await this.getOnlineStatusLabel();
    if (final !== wanted) {
      console.warn(`⚠️ Wanted ${wanted}, status label shows "${final || 'nothing'}"`);
    }
    return final;
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
    await tapKey(Dashboard.homeTab, 15000);
    await waitKey(Home.scrollView, 30000);
  }

  /** Open the Profile screen via the avatar button. */
  async openProfileFromAvatar() {
    await dismissBlockingDialogs();
    await tapKey(Home.avatarButton);
    return isKeyVisible(Tabs.profileList, 20000);
  }

  /**
   * Ensure we are on the Home tab. Fails with a clear message when the
   * bottom nav bar is missing (usually an active order or a pushed page).
   */
  async ensureHomeScreen() {
    await dismissBlockingDialogs();
    if (!(await isKeyVisible(Dashboard.homeTab, 15000))) {
      await dismissBlockingDialogs();
      if (!(await isKeyVisible(Dashboard.homeTab, 5000))) {
        throw new Error(
          'Bottom nav bar not visible – the app is not on the dashboard. ' +
            'Check for an active order on this driver account or a page left open by an earlier spec.',
        );
      }
    }
    await this.openHomeTab();
  }
}

export default new HomePage();
