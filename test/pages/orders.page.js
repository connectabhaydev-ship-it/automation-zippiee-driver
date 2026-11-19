import { goBack, isKeyGone, isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Common, Dashboard, Orders } from '../helpers/keys.js';

class OrdersPage {
  /** Orders tab: the list, or the filter icon (shown once there are orders). */
  async open() {
    await tapKey(Dashboard.ordersTab);
    return (
      (await isKeyVisible(Orders.list, 20000)) || (await isKeyVisible(Orders.filterButton, 3000))
    );
  }

  /** Status tabs: all, completed, cancelled, rejected. */
  async areStatusTabsVisible() {
    for (const filter of ['all', 'completed', 'cancelled', 'rejected']) {
      if (!(await isKeyVisible(Orders.tab(filter)))) return false;
    }
    return true;
  }

  async openTab(filter) {
    await tapKey(Orders.tab(filter));
  }

  /** Still on the Orders tab (its tabs are on screen). */
  async isShown(timeout = 5000) {
    return isKeyVisible(Orders.tab('all'), timeout);
  }

  /** Opens the Order Filters bottom sheet if the filter button is visible. */
  async openFilters() {
    if (await isKeyVisible(Orders.filterButton, 5000)) {
      await tapKey(Orders.filterButton);
      return (
        (await isKeyVisible(Orders.orderFilterApplyButton, 10000)) ||
        (await isKeyVisible(Orders.orderFilterClearButton, 5000))
      );
    }
    return false;
  }

  /** Verifies Order Filters sheet controls. */
  async areFilterControlsVisible() {
    return (
      (await isKeyVisible(Orders.orderFilterApplyButton, 5000)) ||
      (await isKeyVisible(Orders.orderFilterClearButton, 5000))
    );
  }

  /** Closes the Order Filters sheet without modifying existing filters. */
  async closeFilters() {
    if (await isKeyVisible(Common.modalCloseButton, 3000)) {
      await tapKey(Common.modalCloseButton);
    } else {
      await goBack();
    }
    return isKeyGone(Orders.orderFilterApplyButton, 5000);
  }

  /** Verifies if Order Details page components are visible. */
  async isOrderDetailsShown() {
    return (
      (await isKeyVisible(Orders.orderDetailsPage, 10000)) &&
      ((await isKeyVisible(Orders.orderDetailsHeaderCard, 5000)) ||
        (await isKeyVisible(Orders.orderDetailsItemsCard, 5000)))
    );
  }

  /** Navigates back to the Orders list. */
  async backToOrders() {
    await goBack(Common.backButton);
    return this.isShown(10000);
  }
}

export default new OrdersPage();
