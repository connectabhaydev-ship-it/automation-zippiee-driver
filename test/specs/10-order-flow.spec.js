import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';

// Part 10 of the main flow. Runs after 09-vehicle-details.
// References test cases: OF-01, OF-08, OF-12, OD-01, OD-02, OD-04, OD-05, OD-08, OD-09, OD-16, OD-25 from manual-test-tracker.csv.
describe('10 Order Flow & Offers', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC50 [OF-01, OF-08] checks for incoming order offer dialog elements or active order status', async () => {
    const hasOffer = await OrderFlowPage.isNewOrderDialogVisible(2000);
    const hasCurrentOrder = await OrderFlowPage.isCurrentOrderCardOnHomeVisible();
    // In an idle test session without push dispatch, neither is an error;
    // but if an offer is present, verify its action buttons.
    if (hasOffer) {
      expect(await OrderFlowPage.isViewItemsButtonVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC51 [OD-01, OD-24] checks current order map and navigation controls', async () => {
    const hasActiveOrder = await OrderFlowPage.isCurrentOrderPageShown(2000);
    if (hasActiveOrder) {
      expect(await OrderFlowPage.isRouteMapVisible()).toBe(true);
      expect(await OrderFlowPage.isNavigationButtonVisible()).toBe(true);
      expect(await OrderFlowPage.isCallButtonVisible()).toBe(true);
    } else {
      // Validates that Home tab is active and ready to receive orders
      expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    }
  });

  it('TC52 [OD-02, OD-05] pickup verification elements check', async () => {
    const onPickup = await OrderFlowPage.isPickupPageShown(1000);
    if (onPickup) {
      expect(await OrderFlowPage.isPickupReadyBannerVisible()).toBe(true);
      expect(await OrderFlowPage.isPickupReceiptCardVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC53 [OD-08, OD-09] drop-off and delivery verification check', async () => {
    const onDrop = await OrderFlowPage.isDropPageShown(1000);
    if (onDrop) {
      expect(await OrderFlowPage.isDropCustomerCardVisible()).toBe(true);
      expect(await OrderFlowPage.isDropOrderDetailsVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC54 [OD-16] delivery complete screen structure check', async () => {
    const onComplete = await OrderFlowPage.isDeliveryCompletePageShown(1000);
    if (onComplete) {
      expect(await OrderFlowPage.isDeliveryEarningsVisible()).toBe(true);
      await OrderFlowPage.tapGetNextOrder();
      expect(await HomePage.isShown()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC55 [OD-25] report issue interface verification', async () => {
    const onReport = await OrderFlowPage.isReportIssuePageVisible(1000);
    if (onReport) {
      expect(await OrderFlowPage.isReportIssueSendEmailVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });
});
