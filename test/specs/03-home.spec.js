
import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';

// Part 3 of the main flow. Starts after login and ends on the Home tab, OFFLINE.
// Must NOT accept orders: specs 04-09 need an idle driver with the nav bar
// visible. Order acceptance lives in 10-order-flow.

describe('03 Home', () => {
  // TC15 – close any startup prompts and ensure the dashboard is visible
  it('TC15 closes startup prompts and shows the dashboard', async () => {
    await HomePage.dismissStartupPrompts();
    await HomePage.ensureHomeScreen();
    expect(await HomePage.isShown(5000)).toBe(true);
  });

  // TC15a – the account must start without an order left over from an earlier run
  it('TC15a has no active order left over from an earlier run', async () => {
    const leftover = await HomePage.isCurrentOrderCardVisible(3000);
    if (leftover) {
      console.error(
        '❌ This driver account already has an active order on staging. ' +
          'Deliver or cancel it before running the suite, or specs 04-09 will fail.',
      );
    }
    expect(leftover).toBe(false);
  });

  // TC16 – verify the top‑bar elements are present
  it('TC16 shows the top bar: online toggle, notifications, avatar', async () => {
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    expect(await HomePage.isNotificationsButtonVisible()).toBe(true);
    expect(await HomePage.isAvatarVisible()).toBe(true);
  });

  // TC16a – toggle online/offline state, always ending OFFLINE
  it('TC16a toggles online state on and off', async function () {
    // With an active order the app blocks going offline
    // ("Complete your current delivery before going offline") – correct behaviour.
    if (await HomePage.isCurrentOrderCardVisible(2000)) this.skip();
    expect(await HomePage.setOnline(true)).toBe('ONLINE');
    expect(await HomePage.setOnline(false)).toBe('OFFLINE');
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
});
