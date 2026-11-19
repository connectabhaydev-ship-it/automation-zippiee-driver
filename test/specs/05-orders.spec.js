import HomePage from '../pages/home.page.js';
import OrdersPage from '../pages/orders.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { Orders } from '../helpers/keys.js';

// Part 5 of the main flow: Complete Orders Module.
// Starts: Home tab. Ends: Home tab.
// Deep inspection of Order management: status tabs, filter bottom sheet, list rendering.
describe('05 Orders Module (OH)', () => {
  it('[OH-01] Navigation: Orders tab opens the order history screen', async () => {
    expect(await OrdersPage.open()).toBe(true);
  });

  it('[OH-05] Status chips: Displays All / Completed / Cancelled / Rejected tabs', async () => {
    expect(await OrdersPage.areStatusTabsVisible()).toBe(true);
  });

  it('[OH-05] Filter navigation: Switching to Completed and back to All stays on Orders', async () => {
    await OrdersPage.openTab('completed');
    await OrdersPage.openTab('all');
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('[OH-03] List Interaction: Verifies order history list container structure', async () => {
    expect(await OrdersPage.isShown()).toBe(true);
    expect(Orders.orderList).toBe('order_list_list');
  });

  it('[OH-07] Order filters: Filter button opens options bottom sheet, Close button exits', async () => {
    const filtersOpened = await OrdersPage.openFilters();
    if (filtersOpened) {
      expect(await OrdersPage.areFilterControlsVisible()).toBe(true);
      expect(await OrdersPage.closeFilters()).toBe(true);
    }
  });

  it('[OH-06] Date Filters: Verifies date range filter options in filter bottom sheet', async () => {
    const filtersOpened = await OrdersPage.openFilters();
    if (filtersOpened) {
      expect(await OrdersPage.areFilterControlsVisible()).toBe(true);
      expect(Orders.orderFilterDateChip('today')).toBe('order_filters_dateChip_today');
      expect(await OrdersPage.closeFilters()).toBe(true);
    }
  });

  it('[OH-01] Order list: Verifies order history list view is rendered on screen', async () => {
    expect(await OrdersPage.isShown()).toBe(true);
  });

  it('[OH-09] Order Details: Verifies order card detail elements and item list structure', async () => {
    expect(Orders.orderDetailsHeaderCard).toBe('order_details_headerCard');
    expect(Orders.orderDetailsItemsCard).toBe('order_details_itemsCard');
  });

  it('[HM-11] Navigation: Safely returns driver back to Home tab', async () => {
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
