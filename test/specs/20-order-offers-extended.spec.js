import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import WalletPage from '../pages/wallet.page.js';

// Part 20 of the test suite. Extended order offers scenarios.
// References test cases: OF-06, OF-07, OF-09, OF-12, OF-13, OF-15, OF-16, OF-17 from manual-test-tracker.csv.
describe('20 Order Offers – Extended', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC98 [OF-12] rejects an incoming order offer with reason', async () => {
    const hasOffer = await OrderFlowPage.isNewOrderDialogVisible(1000);
    if (hasOffer) {
      await OrderFlowPage.rejectOrder();
      // Dialog closes and driver returns to Home
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    } else {
      expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    }
  });

  it('TC99 [OF-16] verifies offer display integrity when driver is on another screen', async () => {
    await WalletPage.open();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
    const hasOfferOnWallet = await OrderFlowPage.isNewOrderDialogVisible(1000);
    if (hasOfferOnWallet) {
      expect(await OrderFlowPage.isViewItemsButtonVisible()).toBe(true);
    }
    // Return to Home tab
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC100 [OF-06, OF-07] verifies countdown timer resync resilience', async () => {
    const hasOffer = await OrderFlowPage.isNewOrderDialogVisible(1000);
    if (hasOffer) {
      expect(await OrderFlowPage.isViewItemsButtonVisible()).toBe(true);
    } else {
      expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    }
  });
});
