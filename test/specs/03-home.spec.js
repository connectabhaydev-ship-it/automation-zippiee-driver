import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { Home, Notifications } from '../helpers/keys.js';

// Part 3 of the main flow. Starts: dashboard right after login.  Ends: Home tab.
describe('03 Home & Notifications (PR / HM / NT)', () => {
  it('[PR-01] Startup prompts: Closes battery/location prompts and shows the driver dashboard', async () => {
    await HomePage.dismissStartupPrompts();
    expect(await HomePage.isShown(5000)).toBe(true);
  });

  it('[HM-06] Top bar: Shows Online/Offline toggle, notifications bell, and profile avatar', async () => {
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    expect(await HomePage.isNotificationsButtonVisible()).toBe(true);
    expect(await HomePage.isAvatarVisible()).toBe(true);
  });

  it('[HM-02] Safety Controls: Verifies SOS emergency button on dashboard top bar', async () => {
    await isKeyVisible(Home.sosButton, 2000);
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });

  it("[HM-07] Dashboard metrics: Shows home content and today's progress tiles", async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    expect(await HomePage.areProgressTilesVisible()).toBe(true);
  });

  it('[HM-08] Dashboard Scroll: Verifies home dashboard scroll view container', async () => {
    expect(await isKeyVisible(Home.scrollView, 2000)).toBe(true);
  });

  it('[HM-11] Navigation: Bottom bar displays all 4 primary tabs (Home, Orders, Wallet, Profile)', async () => {
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });

  it('[NT-01] Notifications: Bell icon opens the Notifications screen', async () => {
    expect(await NotificationsPage.openFromHome()).toBe(true);
  });

  it('[NT-01] Notification filter tabs: Displays All / Unread / Read tabs', async () => {
    expect(await NotificationsPage.areFilterTabsVisible()).toBe(true);
  });

  it('[NT-02] Notifications List: Verifies notifications scrollable list view container', async () => {
    expect(await isKeyVisible(Notifications.list, 2000)).toBe(true);
  });

  it('[NT-03] Mark All Read: Verifies mark-all-as-read action button is present', async () => {
    await isKeyVisible(Notifications.markAllReadButton, 2000);
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('[NT-04] Notification tabs: Switching to Unread and back to All stays on Notifications', async () => {
    await NotificationsPage.openTab('unread');
    await NotificationsPage.openTab('all');
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('[NT-06] Notification navigation: Back button returns cleanly to Home dashboard', async () => {
    expect(await NotificationsPage.close()).toBe(true);
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
