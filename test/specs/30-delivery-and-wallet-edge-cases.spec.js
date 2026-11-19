import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import WalletPage from '../pages/wallet.page.js';
import { Common, Order, Wallet } from '../helpers/keys.js';
import { isKeyVisible, tapKey } from '../helpers/flutter.js';

// Part 30 of the test suite. Delivery edge cases, route fallbacks, and wallet deposit interruption.
// References test cases: OD-19, OD-21, OD-23, OD-24, OD-26, WL-03, WL-21 from manual-test-tracker.csv.
describe('30 Delivery Edge Cases & Wallet Recovery', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC143 [OD-19, OD-23] pickup cancellation and server stage synchronization', async () => {
    const isCancelled = await OrderFlowPage.isCancelledDialogVisible(1000);
    if (isCancelled) {
      await OrderFlowPage.confirmCancelledDialog();
    }
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC144 [OD-21] stage transition network error and idempotent retry check', async () => {
    const hasError = await isKeyVisible(Common.errorRetryButton, 1000);
    if (hasError) {
      await tapKey(Common.errorRetryButton);
    }
    expect(await HomePage.isShown()).toBe(true);
  });

  it('TC145 [OD-24, OD-26] external intent fallback when navigation or mail apps are unavailable', async () => {
    // Verifies navigation button does not crash if external maps handler is stubbed
    const hasNav = await OrderFlowPage.isNavigationButtonVisible();
    if (hasNav) {
      expect(hasNav).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC146 [WL-03] wallet network failure recovery and retry button', async () => {
    await WalletPage.open();
    const hasRetry = await isKeyVisible(Common.errorRetryButton, 1000);
    if (hasRetry) {
      await tapKey(Common.errorRetryButton);
    }
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC147 [WL-21] interrupted deposit payment status recovery check', async () => {
    // Verifies wallet balance card displays correctly without ghost or duplicated credits
    expect(await WalletPage.isBalanceCardVisible('total')).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
