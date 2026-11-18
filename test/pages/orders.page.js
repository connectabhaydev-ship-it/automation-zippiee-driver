import { isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Dashboard, Orders } from '../helpers/keys.js';

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
}

export default new OrdersPage();
