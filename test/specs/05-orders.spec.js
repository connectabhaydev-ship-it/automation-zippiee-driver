import OrdersPage from '../pages/orders.page.js';

// Part 5 of the main flow. Starts: Wallet tab.  Ends: Orders tab (All).
describe('05 Orders', () => {
  it('TC27 Orders tab opens the order history', async () => {
    expect(await OrdersPage.open()).toBe(true);
  });

  it('TC28 shows the All / Completed / Cancelled / Rejected tabs', async () => {
    expect(await OrdersPage.areStatusTabsVisible()).toBe(true);
  });

  it('TC29 switching to Completed and back to All stays on Orders', async () => {
    await OrdersPage.openTab('completed');
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });
});
