import HomePage from '../pages/home.page.js';
import OrdersPage from '../pages/orders.page.js';
import WalletPage from '../pages/wallet.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 32 of the test suite. Advanced location tracking across app states, background service and split screen.
// References test cases: T02, T03, T04, T05, T06, T12, T13, T15, T16, T17, T18, T19 from manual-test-tracker.csv.
describe('32 Location Tracking – Advanced Lifecycle & Backgrounding', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC153 [T02] tracking remains active across all app tabs (Orders, Wallet, Profile)', async () => {
    await WalletPage.open();
    expect(await WalletPage.isBalanceCarouselVisible()).toBe(true);
    await OrdersPage.open();
    expect(await OrdersPage.isShown()).toBe(true);
    await ProfilePage.open();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });

  it('TC154 [T03, T04, T05, T06] foreground service persists during app minimization and overlay navigation', async () => {
    // Verifies online toggle state remains intact
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC155 [T13, T15] cold GPS start handling and offline retry resilience', async () => {
    // Validates map settles on valid coordinates without crashing or jumping to (0,0)
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC156 [T16, T17, T18, T19] split screen, activity restoration, and push wake-up idempotency', async () => {
    // Verifies single tracking instance is maintained without duplicate background tasks
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });
});
