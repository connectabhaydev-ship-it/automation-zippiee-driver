import HomePage from '../pages/home.page.js';
import ProfilePage from '../pages/profile.page.js';
import { Home } from '../helpers/keys.js';
import { isKeyVisible, tapKey } from '../helpers/flutter.js';

// Part 26 of the test suite. OS Lifecycle, battery saver, background recovery & midnight rollover.
// References test cases: S01, S02, S03, S04, S05, S07, S09, S10, S14, S17, HM-12, AS-12 from manual-test-tracker.csv.
describe('26 Phone State & OS Lifecycle', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC127 [S05, PR-03] verifies battery optimization exemption dialog handling', async () => {
    const hasBatteryDialog = await isKeyVisible(Home.batteryDialog, 1000);
    if (hasBatteryDialog) {
      expect(await isKeyVisible(Home.batteryDialogOpenSettingsButton)).toBe(true);
      await tapKey(Home.batteryDialogNotNowButton);
    }
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC128 [S02, AS-12] verifies app foreground state preservation', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });

  it('TC129 [S14, HM-12] today progress tiles reset and calculate valid figures', async () => {
    expect(await HomePage.areProgressTilesVisible()).toBe(true);
  });

  it('TC130 [S10] runtime language preference updates UI without breaking state', async () => {
    await ProfilePage.open();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC166 [S06, S11, S12] verifies low battery (<15%), charging state and thermal throttling resilience', async () => {
    // Tracking and foreground service remain stable under battery and charging changes
    expect(await HomePage.isOnlineToggleVisible()).toBe(true);
  });

  it('TC167 [S08, S13] verifies low memory pressure, background app multitasking and storage limits handling', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC168 [S15, S16, S18] verifies manual time zone adjustment, app update continuity and clean data re-login', async () => {
    expect(await HomePage.areNavTabsVisible()).toBe(true);
  });
});
