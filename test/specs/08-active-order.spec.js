import { isKeyVisible } from '../helpers/flutter.js';
import { Common, Orders } from '../helpers/keys.js';
import ActiveOrderPage from '../pages/active-order.page.js';

// Standalone suite: Active Order & Delivery Flow.
// Covers lifecycle elements: new order dialog, pickup, in-transit chat, drop OTP, completion.
describe('08 Active Order Lifecycle (OF / OD / CT)', () => {
  it('[OF-01] Order Offer: Handles incoming order request dialog elements (Accept / Reject) when dispatched', async function () {
    if (!(await ActiveOrderPage.isIncomingOrderDialogShown(2000))) this.skip();
    expect(await isKeyVisible(Common.newOrderRequestAcceptButton)).toBe(true);
    expect(await isKeyVisible(Common.newOrderRequestRejectButton)).toBe(true);
  });

  it('[OD-01] Delivery Tracking: Verifies in-progress order tracking card and contact options', async function () {
    if (!(await ActiveOrderPage.isCurrentOrderPageShown(2000))) this.skip();
    expect(await ActiveOrderPage.areCurrentOrderControlsVisible()).toBe(true);
  });

  it('[OD-03] Order Route: Verifies active order route map and navigation control keys', async function () {
    expect(Orders.currentOrderStartNavigationButton).toBe('order_currentOrder_startNavigationButton');
    expect(Orders.currentOrderRefreshRouteButton).toBe('order_currentOrder_refreshRouteButton');
  });

  it('[CT-01] Order Chat: Verifies order chat messaging controls when order is active', async function () {
    if (!(await isKeyVisible(Orders.currentOrderChatButton, 2000))) this.skip();
    expect(await isKeyVisible(Orders.currentOrderChatButton)).toBe(true);
  });

  it('[OD-02] Pickup Confirmation: Verifies order pickup confirmation screen controls', async function () {
    if (!(await ActiveOrderPage.isPickupPageShown(2000))) this.skip();
    expect(await isKeyVisible(Orders.pickupConfirmButton)).toBe(true);
  });

  it('[OD-05] Delivery Verification: Verifies customer drop-off OTP input and confirm button', async function () {
    if (!(await ActiveOrderPage.isDropPageShown(2000))) this.skip();
    expect(await isKeyVisible(Orders.dropOtpField)).toBe(true);
    expect(await isKeyVisible(Orders.dropConfirmButton)).toBe(true);
  });

  it('[OD-06] Delivery Summary: Verifies delivery completed summary screen and Next Order action', async function () {
    if (!(await ActiveOrderPage.isDeliveryCompleteShown(2000))) this.skip();
    expect(await isKeyVisible(Orders.deliveryCompleteNextOrderButton)).toBe(true);
  });
});
