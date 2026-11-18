import { goBack, isKeyGone, isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Home, Notifications } from '../helpers/keys.js';

class NotificationsPage {
  /** Opens Notifications from the bell on the home top bar. */
  async openFromHome() {
    await tapKey(Home.notificationsButton);
    return isKeyVisible(Notifications.page, 20000);
  }

  async areFilterTabsVisible() {
    for (const filter of ['all', 'unread', 'read']) {
      if (!(await isKeyVisible(Notifications.tab(filter)))) return false;
    }
    return true;
  }

  async openTab(filter) {
    await tapKey(Notifications.tab(filter));
  }

  async isShown(timeout = 3000) {
    return isKeyVisible(Notifications.page, timeout);
  }

  /** Back to the screen that opened it. True once the page is gone. */
  async close() {
    await goBack();
    return isKeyGone(Notifications.page, 10000);
  }
}

export default new NotificationsPage();
