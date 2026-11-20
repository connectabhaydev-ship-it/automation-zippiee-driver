// Home screen tests including order acceptance

import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';
import { tapKey } from '../helpers/flutter.js';
import { Common } from '../helpers/keys.js';

// Part 3 of the main flow. Starts after login and ends on the Home tab.

describe('03 Home', () => {
  // TC15 – close any startup prompts and ensure the dashboard is visible
  it('TC15 closes startup prompts and shows the dashboard', async () => {
    await HomePage.dismissStartupPrompts();
    await HomePage.ensureHomeScreen();
    expect(await HomePage.isShown(5000)).toBe(true);
  });

  // TC16 – verify the top‑bar elements are present
  it('TC16 shows the top bar: online toggle, notifications, avatar', async () => {
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    expect(await HomePage.isNotificationsButtonVisible()).toBe(true);
    expect(await HomePage.isAvatarVisible()).toBe(true);
  });

  // TC16a – toggle online/offline state
  it('TC16a toggles online state on and off', async () => {
    // Go online
    await tapKey(Common.onlineToggle);
    expect(await HomePage.getOnlineStatusLabel()).toBe('ONLINE');
    // Go offline
    await tapKey(Common.onlineToggle);
    expect(await HomePage.getOnlineStatusLabel()).toBe('OFFLINE');
  });

  // TC17 – verify home content and progress tiles
  it('TC17 shows the home content and today\'s progress tiles', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    expect(await HomePage.areProgressTilesVisible()).toBe(true);
  });

  // TC18 – verify the four bottom navigation tabs
  it('TC18 shows the four bottom tabs', async () => {
    await HomePage.ensureHomeScreen();
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });

  // TC19 – open the notifications panel via the bell icon
  it('TC19 the bell opens Notifications', async () => {
    expect(await NotificationsPage.openFromHome()).toBe(true);
  });

  // TC20 – verify notifications filter tabs exist
  it('TC20 Notifications shows the All / Unread / Read tabs', async () => {
    expect(await NotificationsPage.areFilterTabsVisible()).toBe(true);
  });

  // TC21 – switch between Unread and All tabs and stay on Notifications
  it('TC21 switching to Unread and back to All stays on Notifications', async () => {
    await NotificationsPage.openTab('unread');
    await NotificationsPage.openTab('all');
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  // TC22 – go back from Notifications to Home
  it('TC22 Back returns to the home screen', async () => {
    expect(await NotificationsPage.close()).toBe(true);
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  // TC23 – accept a new order and verify the current‑order card appears
  it('TC23 accepts a new order and shows the current order card', async () => {
    // Ensure we are on Home and online (orders only appear when driver is online)
    await HomePage.ensureHomeScreen();
    await tapKey(Common.onlineToggle);
    expect(await HomePage.getOnlineStatusLabel()).toBe('ONLINE');

    // OPTIONAL: force a test order if your backend does not push one automatically
    // await driver.execute('mobile: pushNotification', {
    //   title: 'New Order',
    //   body: 'You have a new delivery request',
    //   data: { orderId: 'test-123' },
    // });

    const accepted = await HomePage.acceptNewOrder();
    expect(accepted).toBe(true);
    const cardVisible = await HomePage.isCurrentOrderCardVisible();
    expect(cardVisible).toBe(true);
  });
});
