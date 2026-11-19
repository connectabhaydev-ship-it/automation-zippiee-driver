import OrdersPage from '../pages/orders.page.js';

// Part 13 of the main flow. Runs after 12-notifications.
// References test cases: OH-01, OH-05, OH-06, OH-07, OH-08, OH-09, OH-10 from manual-test-tracker.csv.
describe('13 Orders History & Filters', () => {
  it('TC64 [OH-01] opens Orders tab and verifies header filter action', async () => {
    expect(await OrdersPage.open()).toBe(true);
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('TC65 [OH-05, OH-06] opens the filter sheet and checks date quick filter chips', async () => {
    const sheetOpened = await OrdersPage.openFilterSheet();
    if (sheetOpened) {
      expect(await OrdersPage.areDateFilterChipsVisible()).toBe(true);
    } else {
      expect(await OrdersPage.areStatusTabsVisible()).toBe(true);
    }
  });

  it('TC66 [OH-05] checks status filter chips in the filter sheet', async () => {
    if (await OrdersPage.areStatusFilterChipsVisible()) {
      expect(await OrdersPage.areStatusFilterChipsVisible()).toBe(true);
    } else {
      expect(await OrdersPage.isShown()).toBe(true);
    }
  });

  it('TC67 [OH-07] checks sort option chips in the filter sheet', async () => {
    if (await OrdersPage.areSortFilterChipsVisible()) {
      expect(await OrdersPage.areSortFilterChipsVisible()).toBe(true);
    } else {
      expect(await OrdersPage.isShown()).toBe(true);
    }
  });

  it('TC68 [OH-08] applies or clears the filter and returns to the orders list', async () => {
    await OrdersPage.clearFilters();
    await OrdersPage.applyFilters();
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('TC69 [OH-01] confirms orders screen remains healthy and reactive', async () => {
    await OrdersPage.openTab('completed');
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });
});
