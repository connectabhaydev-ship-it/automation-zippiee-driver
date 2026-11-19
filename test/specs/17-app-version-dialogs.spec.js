import AppVersionPage from '../pages/app-version.page.js';
import HomePage from '../pages/home.page.js';

// Part 17 of the test suite.
// References test cases: AS-06, AS-08, AS-09, AS-10, PR-01, GN-01 from manual-test-tracker.csv.
describe('17 App Version & Dialog Alerts', () => {
  it('TC84 [AS-08, AS-09] verifies version update dialog handling', async () => {
    const hasForceUpdate = await AppVersionPage.isForceUpdatePageShown(1000);
    const hasOptionalUpdate = await AppVersionPage.isUpdateAvailableDialogShown(1000);

    if (hasForceUpdate) {
      expect(await AppVersionPage.isForceUpdateNowButtonVisible()).toBe(true);
    } else if (hasOptionalUpdate) {
      expect(await AppVersionPage.isUpdateNowButtonVisible()).toBe(true);
      await AppVersionPage.dismissUpdateDialog();
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC85 [AS-06, GN-01] verifies no-internet error dialog handling capability', async () => {
    const hasNoInternet = await AppVersionPage.isNoInternetDialogShown(1000);
    if (hasNoInternet) {
      expect(await AppVersionPage.isNoInternetRetryVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC86 [PR-01, PR-04] verifies permission settings prompt handling capability', async () => {
    const hasPrompt = await AppVersionPage.isPermissionSettingsDialogShown(1000);
    if (hasPrompt) {
      expect(await AppVersionPage.isPermissionSettingsOpenVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });
});
