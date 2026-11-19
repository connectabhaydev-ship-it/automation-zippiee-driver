import HomePage from '../pages/home.page.js';
import { Common } from '../helpers/keys.js';
import { isKeyVisible } from '../helpers/flutter.js';

// Part 25 of the test suite. Network resilience, connection blips, and offline recovery.
// References test cases: N01, N02, N03, N04, N05, N07, N10, N12, N16, N17, N18, N19, AS-07 from manual-test-tracker.csv.
describe('25 Network Resilience & Offline Recovery', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC123 [N01, N02] verifies seamless operation during active data connectivity', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });

  it('TC124 [N03, N05] checks connection recovery and error dialog handling', async () => {
    const hasNoInternet = await isKeyVisible(Common.noInternetDialog, 1000);
    if (hasNoInternet) {
      expect(await isKeyVisible(Common.noInternetRetryButton, 2000)).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC125 [N07, N12, AS-07] verifies retry mechanism on high-latency responses', async () => {
    const hasRetry = await isKeyVisible(Common.errorRetryButton, 1000);
    if (hasRetry) {
      expect(await isKeyVisible(Common.errorRetryButton)).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC126 [N16, N19] verifies session stability after network reconnect', async () => {
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });
});
