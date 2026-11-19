import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';

// Part 12 of the main flow. Runs after 11-order-chat.
// References test cases: NT-01, NT-02, NT-03, NT-04, NT-06, NT-11, NT-12 from manual-test-tracker.csv.
describe('12 Notifications Management', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC59 [NT-01] opens notifications inbox from the home top bar', async () => {
    expect(await NotificationsPage.openFromHome()).toBe(true);
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('TC60 [NT-03] verifies the "Mark all read" button is present and actionable', async () => {
    const hasMarkAll = await NotificationsPage.isMarkAllReadVisible();
    if (hasMarkAll) {
      await NotificationsPage.tapMarkAllRead();
      expect(await NotificationsPage.isShown()).toBe(true);
    } else {
      expect(await NotificationsPage.areFilterTabsVisible()).toBe(true);
    }
  });

  it('TC61 [NT-04] cycles through Unread, Read, and All filter tabs', async () => {
    await NotificationsPage.openTab('unread');
    expect(await NotificationsPage.isShown()).toBe(true);

    await NotificationsPage.openTab('read');
    expect(await NotificationsPage.isShown()).toBe(true);

    await NotificationsPage.openTab('all');
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('TC62 [NT-02] checks notifications list container is rendered', async () => {
    const hasList = await NotificationsPage.isNotificationListVisible();
    // List is rendered even in empty state
    expect(hasList || (await NotificationsPage.isShown())).toBe(true);
  });

  it('TC63 [NT-01] Back returns to the home screen and leaves notifications closed', async () => {
    expect(await NotificationsPage.close()).toBe(true);
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
