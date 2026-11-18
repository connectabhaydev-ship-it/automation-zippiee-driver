import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';

// Part 3 of the main flow. Starts: dashboard right after login.  Ends: Home tab.
describe('03 Home', () => {
  it('TC15 closes any startup prompt and shows the dashboard', async () => {
    await HomePage.dismissStartupPrompts();
    expect(await HomePage.isShown(5000)).toBe(true);
  });

  it('TC16 shows the top bar: online toggle, notifications, avatar', async () => {
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
    expect(await HomePage.isNotificationsButtonVisible()).toBe(true);
    expect(await HomePage.isAvatarVisible()).toBe(true);
  });

  it("TC17 shows the home content and all of today's progress tiles", async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    expect(await HomePage.areProgressTilesVisible()).toBe(true);
  });

  it('TC18 shows the four bottom tabs', async () => {
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });

  it('TC19 the bell opens Notifications', async () => {
    expect(await NotificationsPage.openFromHome()).toBe(true);
  });

  it('TC20 Notifications shows the All / Unread / Read tabs', async () => {
    expect(await NotificationsPage.areFilterTabsVisible()).toBe(true);
  });

  it('TC21 switching to Unread and back to All stays on Notifications', async () => {
    await NotificationsPage.openTab('unread');
    await NotificationsPage.openTab('all');
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('TC22 Back returns to the home screen', async () => {
    expect(await NotificationsPage.close()).toBe(true);
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
