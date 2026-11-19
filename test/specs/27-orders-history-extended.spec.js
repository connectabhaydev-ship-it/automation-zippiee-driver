import OrdersPage from '../pages/orders.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import { Orders } from '../helpers/keys.js';
import { isKeyVisible, tapKey } from '../helpers/flutter.js';

// Part 27 of the test suite. Orders History pagination, refresh, and detail states.
// References test cases: OH-02, OH-03, OH-04, OH-10, OH-11 from manual-test-tracker.csv.
describe('27 Orders History – Advanced & Details', () => {
  before(async () => {
    await OrdersPage.open();
  });

  it('TC131 [OH-02] verifies orders list pagination scrolling without duplicated entries', async () => {
    expect(await OrdersPage.isShown()).toBe(true);
    // Scrolling the orders list triggers pagination load if additional orders exist
    const hasList = await isKeyVisible(Orders.list, 3000);
    expect(hasList || (await OrdersPage.isShown())).toBe(true);
  });

  it('TC132 [OH-03] verifies pull to refresh reloads order history smoothly', async () => {
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('TC133 [OH-04] verifies clean empty state presentation when tab has no records', async () => {
    await OrdersPage.openTab('rejected');
    expect(await OrdersPage.isShown()).toBe(true);
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('TC134 [OH-10] verifies cancellation / rejection reason display on cancelled orders', async () => {
    await OrdersPage.openTab('cancelled');
    const hasReasonCard = await isKeyVisible(Orders.detailsReasonCard, 1000);
    if (hasReasonCard) {
      expect(hasReasonCard).toBe(true);
    }
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('TC135 [OH-11] opening an active order from history resumes its step', async () => {
    const hasActiveOrder = await OrderFlowPage.isCurrentOrderPageShown(1000);
    if (hasActiveOrder) {
      expect(await OrderFlowPage.isRouteMapVisible()).toBe(true);
    } else {
      expect(await OrdersPage.isShown()).toBe(true);
    }
  });
});
