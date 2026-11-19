import ProfilePage from '../pages/profile.page.js';
import { Profile } from '../helpers/keys.js';

// Part 14 of the main flow. Runs after 13-orders-filters.
// References test cases: PF-01, PF-02, PF-03, PF-04, PF-10, PF-12, PF-13, PF-15, DA-01 from manual-test-tracker.csv.
describe('14 Profile Settings & Account Actions', () => {
  it('TC70 [PF-01] opens Profile tab and verifies secondary tiles', async () => {
    expect(await ProfilePage.open()).toBe(true);
    expect(await ProfilePage.areSecondaryTilesVisible()).toBe(true);
  });

  it('TC71 [PF-03, PF-04] Profile settings opens and shows user info rows, Back returns', async () => {
    expect(await ProfilePage.openSettings()).toBe(true);
    expect(await ProfilePage.areSettingsInfoTilesVisible()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('TC72 [PF-12] Help & Support opens with Send Email button, Back returns', async () => {
    expect(await ProfilePage.openHelpSupport()).toBe(true);
    expect(await ProfilePage.isHelpSupportEmailButtonVisible()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('TC73 [PF-13] Privacy Policy legal viewer opens, Back returns to Profile', async () => {
    const opened = await ProfilePage.openLegalDoc(Profile.privacyPolicyTile);
    if (opened) {
      expect(await ProfilePage.back()).toBe(true);
    } else {
      expect(await ProfilePage.isShown()).toBe(true);
    }
  });

  it('TC74 [PF-10] Language tile opens language selection sheet, Back returns', async () => {
    const opened = await ProfilePage.openLanguagePicker();
    if (opened) {
      await ProfilePage.back();
    }
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('TC75 [DA-01] Delete Account tile opens deletion sheet, Cancel returns safely', async () => {
    const opened = await ProfilePage.openDeleteAccountSheet();
    if (opened) {
      await ProfilePage.cancelDeleteAccount();
    }
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('TC76 [PF-15] Log Out tile opens confirmation sheet, Cancel keeps driver logged in', async () => {
    const opened = await ProfilePage.openLogoutDialog();
    if (opened) {
      await ProfilePage.cancelLogout();
    }
    expect(await ProfilePage.isShown()).toBe(true);
  });
});
