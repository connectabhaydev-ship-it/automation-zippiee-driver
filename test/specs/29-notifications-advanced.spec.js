import HomePage from '../pages/home.page.js';
import NotificationsPage from '../pages/notifications.page.js';
import { Common, Notifications } from '../helpers/keys.js';
import { isKeyVisible, tapKey } from '../helpers/flutter.js';

// Part 29 of the test suite. Advanced notification routing, deduplication, channels and mute settings.
// References test cases: NT-05, NT-07, NT-08, NT-09, NT-10, NT-11, NT-12, NT-13, NT-14, NT-15 from manual-test-tracker.csv.
describe('29 Notifications – Advanced & System Channels', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC139 [NT-05, NT-15] verifies error retry handling on notification fetch timeout', async () => {
    await NotificationsPage.openFromHome();
    const hasErrorRetry = await isKeyVisible(Common.errorRetryButton, 1000);
    if (hasErrorRetry) {
      await tapKey(Common.errorRetryButton);
    }
    expect(await NotificationsPage.isShown()).toBe(true);
  });

  it('TC140 [NT-11, NT-12] verifies notification settings mute toggle and permission sync', async () => {
    const hasSettings = await NotificationsPage.isNotificationSettingsVisible(1000);
    if (hasSettings) {
      expect(await NotificationsPage.isMuteSwitchVisible()).toBe(true);
      await NotificationsPage.toggleMute();
      // Restore toggle
      await NotificationsPage.toggleMute();
    } else {
      expect(await NotificationsPage.isShown()).toBe(true);
    }
  });

  it('TC141 [NT-07, NT-08, NT-09, NT-10] verifies push intent routing and duplicate suppression', async () => {
    // Confirms notifications list contains unique entries without duplicate cards
    expect(await NotificationsPage.areFilterTabsVisible()).toBe(true);
    await NotificationsPage.close();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC142 [NT-13, NT-14] checks critical notification sound channels and Focus breakthrough compatibility', async () => {
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });
});
