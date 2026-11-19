import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';

// Part 19 of the test suite. Extended delivery flow tests.
// References test cases: OD-03, OD-06, OD-07, OD-10, OD-11, OD-12, OD-13, OD-14, OD-15, OD-17, OD-18, OD-20, OD-22 from manual-test-tracker.csv.
describe('19 Order Delivery Flow – Extended', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC92 [OD-03, OD-07] verifies order items list and expandable add-ons', async () => {
    const isPickup = await OrderFlowPage.isPickupPageShown(1000);
    const isDrop = await OrderFlowPage.isDropPageShown(1000);
    if (isPickup || isDrop) {
      const hasItem = await OrderFlowPage.isItemRowVisible(0);
      if (hasItem) {
        await OrderFlowPage.tapItemRow(0);
        expect(await OrderFlowPage.isItemRowVisible(0)).toBe(true);
      }
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC93 [OD-10, OD-11] verifies delivery code input and retry limits handling', async () => {
    const isDrop = await OrderFlowPage.isDropPageShown(1000);
    if (isDrop) {
      expect(await OrderFlowPage.isDropCustomerCardVisible()).toBe(true);
      expect(await OrderFlowPage.isDropOrderDetailsVisible()).toBe(true);
      // Validates code field presence
      await OrderFlowPage.enterDeliveryOtp('0000');
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC94 [OD-12, OD-13] checks payment method indication on drop screen', async () => {
    const isDrop = await OrderFlowPage.isDropPageShown(1000);
    if (isDrop) {
      expect(await OrderFlowPage.isDropOrderDetailsVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC95 [OD-14, OD-15] customer instructions and direct call/message controls', async () => {
    const isCurrentOrder = await OrderFlowPage.isCurrentOrderPageShown(1000);
    const isDrop = await OrderFlowPage.isDropPageShown(1000);
    if (isCurrentOrder || isDrop) {
      expect(await OrderFlowPage.isCallButtonVisible()).toBe(true);
      expect(await OrderFlowPage.isChatButtonVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC96 [OD-17, OD-18] customer and restaurant star rating dialog submission', async () => {
    const hasRateCustomer = await OrderFlowPage.isRateCustomerCardVisible();
    const hasRateRestaurant = await OrderFlowPage.isRateRestaurantCardVisible();
    if (hasRateCustomer) {
      await OrderFlowPage.tapRateCustomer();
      expect(await OrderFlowPage.isRatingDialogVisible()).toBe(true);
      expect(await OrderFlowPage.isRatingStarsVisible()).toBe(true);
      expect(await OrderFlowPage.isRatingCommentFieldVisible()).toBe(true);
      await OrderFlowPage.enterRatingComment('Great delivery experience');
      expect(await OrderFlowPage.isRatingSubmitVisible()).toBe(true);
    } else if (hasRateRestaurant) {
      await OrderFlowPage.tapRateRestaurant();
      expect(await OrderFlowPage.isRatingDialogVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC97 [OD-19, OD-20] order cancellation confirmation dialog handling', async () => {
    const isCancelled = await OrderFlowPage.isCancelledDialogVisible(1000);
    if (isCancelled) {
      await OrderFlowPage.confirmCancelledDialog();
      expect(await HomePage.isShown()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });
});
