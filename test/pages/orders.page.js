import { goBack, isKeyVisible, tapKey } from '../helpers/flutter.js';
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

  async isFilterButtonVisible() {
    return isKeyVisible(Orders.filterButton, 3000);
  }

  async openFilterSheet() {
    if (await this.isFilterButtonVisible()) {
      await tapKey(Orders.filterButton);
      return isKeyVisible(Orders.filterApplyButton, 5000);
    }
    return false;
  }

  async areDateFilterChipsVisible() {
    for (const filter of ['today', 'yesterday', 'thisWeek', 'thisMonth', 'custom']) {
      if (!(await isKeyVisible(Orders.filterDateChip(filter), 2000))) return false;
    }
    return true;
  }

  async areStatusFilterChipsVisible() {
    for (const status of ['onGoing', 'completed', 'failed', 'rejected']) {
      if (!(await isKeyVisible(Orders.filterStatusChip(status), 2000))) return false;
    }
    return true;
  }

  async areSortFilterChipsVisible() {
    for (const sort of ['newestFirst', 'oldestFirst', 'highestAmount', 'lowestAmount']) {
      if (!(await isKeyVisible(Orders.filterSortChip(sort), 2000))) return false;
    }
    return true;
  }

  async clearFilters() {
    if (await isKeyVisible(Orders.filterClearButton, 3000)) {
      await tapKey(Orders.filterClearButton);
    }
  }

  async applyFilters() {
    if (await isKeyVisible(Orders.filterApplyButton, 3000)) {
      await tapKey(Orders.filterApplyButton);
    }
  }

  async isOrderDetailsShown(timeout = 5000) {
    return isKeyVisible(Orders.detailsPage, timeout);
  }

  async areOrderDetailsCardsVisible() {
    return (
      (await isKeyVisible(Orders.detailsHeaderCard, 3000)) &&
      (await isKeyVisible(Orders.detailsRouteCard, 3000)) &&
      (await isKeyVisible(Orders.detailsItemsCard, 3000))
    );
  }

  async back() {
    await goBack();
  }
}

export default new OrdersPage();
