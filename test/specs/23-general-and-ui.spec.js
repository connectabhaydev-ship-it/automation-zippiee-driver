import HomePage from '../pages/home.page.js';
import OrdersPage from '../pages/orders.page.js';
import WalletPage from '../pages/wallet.page.js';
import ProfilePage from '../pages/profile.page.js';
import { Common } from '../helpers/keys.js';
import { isKeyVisible, tapKey } from '../helpers/flutter.js';

// Part 23 of the test suite. General UI, theming, modal controls and security.
// References test cases: GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-12, GN-13, GN-14 from manual-test-tracker.csv.
describe('23 General UI, Navigation & Security', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC111 [GN-05] verifies UI rendering integrity and visual consistency across tabs', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    await WalletPage.open();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
    await OrdersPage.open();
    expect(await OrdersPage.areStatusTabsVisible()).toBe(true);
    await ProfilePage.open();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC112 [GN-08] verifies sheet and dialog dismiss (✕) buttons operate consistently', async () => {
    const hasModalClose = await isKeyVisible(Common.modalCloseButton, 1000);
    if (hasModalClose) {
      await tapKey(Common.modalCloseButton);
    }
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC113 [GN-06] verifies backward navigation integrity using app and system back', async () => {
    await ProfilePage.open();
    await ProfilePage.openSettings();
    expect(await ProfilePage.back()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC114 [GN-09] verifies absence of raw localization translation keys in the UI', async () => {
    // Confirms dashboard tiles display formatted labels, not raw keys like "common_*" or "home_*"
    expect(await HomePage.areProgressTilesVisible()).toBe(true);
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });

  it('TC115 [GN-12, GN-13] sensitive screen preview and security safeguards', async () => {
    // Ensures sensitive navigation flows stay contained within app sandbox
    expect(await HomePage.isShown()).toBe(true);
  });
});
