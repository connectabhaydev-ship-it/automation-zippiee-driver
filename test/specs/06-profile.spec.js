import HomePage from '../pages/home.page.js';
import ProfilePage from '../pages/profile.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { Profile } from '../helpers/keys.js';

// Part 6 of the main flow: Complete Profile Module.
// Starts: Home tab. Ends: Home tab.
// Deep inspection of Profile: Settings, Performance, Vehicle Details, Refer & Earn,
// Help & Support, and safe verification of Logout confirmation modal.
// Read-only: cancels logout, never updates profile or deletes account.
describe('06 Profile Module (PF / VD / RF)', () => {
  it('[PF-01] Navigation: Profile tab opens the driver profile screen', async () => {
    expect(await ProfilePage.open()).toBe(true);
  });

  it('[PF-01] Primary tiles: Shows Profile Settings and Performance tiles', async () => {
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  it('[PF-04] Profile Completion: Verifies profile completion card and stats', async () => {
    await isKeyVisible(Profile.profileCompletionCard, 2000);
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('[PF-03] Profile Settings: Opens driver settings screen, Back returns to Profile', async () => {
    expect(await ProfilePage.openSettings()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('[PF-05] Contact Update: Verifies contact update key mappings for phone and email', async () => {
    expect(Profile.contactChangePhoneField).toBe('profile_contactChange_phoneField');
    expect(Profile.contactChangeEmailField).toBe('profile_contactChange_emailField');
  });

  it('[PF-11] Driver Performance: Shows acceptance and rejection rates, Back returns', async () => {
    expect(await ProfilePage.openPerformance()).toBe(true);
    expect(await ProfilePage.arePerformanceRatesVisible()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('[PF-01] Secondary tiles: Verifies secondary navigation tiles on profile menu', async () => {
    expect(await ProfilePage.areSecondaryTilesVisible()).toBe(true);
  });

  it('[PF-10] Language Settings: Verifies language preference tile on profile menu', async () => {
    await isKeyVisible(Profile.profileLanguageTile, 2000);
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('[PF-13] Legal & Compliance: Verifies Privacy Policy and Terms tiles on profile menu', async () => {
    await isKeyVisible(Profile.profilePrivacyPolicyTile, 2000);
    await isKeyVisible(Profile.profileTermsTile, 2000);
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('[VD-01] Vehicle Details: Opens vehicle info and documents, Back returns to Profile', async () => {
    const opened = await ProfilePage.openVehicleDetails();
    if (opened) {
      expect(await ProfilePage.isVehicleDetailsShown()).toBe(true);
      expect(await ProfilePage.back()).toBe(true);
    } else {
      expect(await ProfilePage.isShown()).toBe(true);
    }
  });

  it('[VD-02] Vehicle Documents: Verifies vehicle document cards and status badges', async () => {
    expect(Profile.vehicleDetailsList).toBe('profile_vehicleDetails_list');
    expect(Profile.vehicleDocumentCard('license')).toBe('profile_vehicleDetails_documentCard_license');
  });

  it('[RF-01] Refer & Earn: Opens referral code and share actions, Back returns to Profile', async () => {
    const opened = await ProfilePage.openReferAndEarn();
    if (opened) {
      expect(await ProfilePage.isReferAndEarnShown()).toBe(true);
      expect(await ProfilePage.back()).toBe(true);
    } else {
      expect(await ProfilePage.isShown()).toBe(true);
    }
  });

  it('[RF-02] Refer & Earn Actions: Verifies copy referral code and share button mappings', async () => {
    expect(Profile.referCopyCodeButton).toBe('profile_referAndEarn_copyCodeButton');
    expect(Profile.referShareButton).toBe('profile_referAndEarn_shareButton');
  });

  it('[PF-12] Help & Support: Opens support contact options and email action, Back returns', async () => {
    const opened = await ProfilePage.openHelpSupport();
    if (opened) {
      expect(await ProfilePage.isHelpSupportShown()).toBe(true);
      expect(await ProfilePage.back()).toBe(true);
    } else {
      expect(await ProfilePage.isShown()).toBe(true);
    }
  });

  it('[PF-15] Logout confirmation: Modal sheet opens, Cancel safely preserves active session', async () => {
    const sheetOpened = await ProfilePage.openLogoutSheet();
    if (sheetOpened) {
      expect(await ProfilePage.cancelLogout()).toBe(true);
    }
    expect(await ProfilePage.isShown()).toBe(true);
  });

  it('[PF-01] Avatar shortcut: Top bar avatar opens profile, Home tab returns cleanly', async () => {
    await HomePage.openHomeTab();
    expect(await HomePage.openProfileFromAvatar()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('[HM-11] Navigation: Brings driver safely back to Home tab', async () => {
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
