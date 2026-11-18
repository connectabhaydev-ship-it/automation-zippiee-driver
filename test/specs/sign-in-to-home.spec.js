import SignInPage from '../pages/sign-in.page.js';
import CountryPickerSheet from '../pages/country-picker.page.js';
import VerifyOtpPage from '../pages/verify-otp.page.js';
import HomePage from '../pages/home.page.js';
import { TestData, requireTestAccount } from '../helpers/test-data.js';

// One spec file = one app session (fresh install, logged out). The tests run
// top to bottom and each one starts where the previous one ended:
// sign-in → OTP → home. If an early test fails, the later ones fail too.
//
// Needs a staging driver account with a FIXED OTP and an approved profile
// (so login lands on the dashboard): TEST_PHONE_NUMBER / TEST_OTP in .env.
describe('Sign in → Verify OTP → Home', () => {
  before(() => {
    requireTestAccount();
  });

  describe('Sign in', () => {
    it('TC01 opens on the sign-in screen after the splash', async () => {
      await SignInPage.waitUntilShown();
      expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
      expect(await SignInPage.isContinueVisible()).toBe(true);
    });

    it('TC02 shows the title and subtitle', async () => {
      expect(await SignInPage.isTitleVisible()).toBe(true);
      expect(await SignInPage.isSubtitleVisible()).toBe(true);
    });

    it('TC03 does not move on with an empty phone number', async () => {
      await SignInPage.tapContinue();
      expect(await SignInPage.stayedOnSignIn()).toBe(true);
    });

    it('TC04 opens the country picker', async () => {
      const sheet = await SignInPage.openCountryPicker();
      expect(await sheet.isOpen()).toBe(true);
    });

    it('TC05 searches and selects the test country', async () => {
      await CountryPickerSheet.search(TestData.countryName);
      await CountryPickerSheet.select(TestData.countryIso);
      expect(await CountryPickerSheet.isClosed()).toBe(true);
      expect(await SignInPage.isDialCodeVisible(TestData.dialCode)).toBe(true);
    });

    it('TC06 does not move on with an invalid (too short) number', async () => {
      await SignInPage.enterPhone(TestData.invalidPhone);
      await SignInPage.tapContinue();
      expect(await SignInPage.stayedOnSignIn()).toBe(true);
    });

    it('TC07 clear button empties the phone number', async () => {
      // After TC06 the field is unfocused, so the ✕ is hidden and the screen is
      // idle. Focus the field first (see SignInPage.focusPhone).
      await SignInPage.focusPhone();
      expect(await SignInPage.isClearButtonVisible()).toBe(true);
      await SignInPage.clearPhone();
      // The ✕ only shows while there is text.
      expect(await SignInPage.isClearButtonVisible(2000)).toBe(false);
    });

    it('TC08 a valid number opens the OTP screen', async () => {
      await SignInPage.enterPhone(TestData.phone);
      const otpPage = await SignInPage.continueToOtp();
      expect(await otpPage.isShown()).toBe(true);
    });
  });

  describe('Verify OTP', () => {
    it('TC09 shows the OTP field, Continue and Back', async () => {
      expect(await VerifyOtpPage.isOtpFieldVisible()).toBe(true);
      expect(await VerifyOtpPage.isContinueVisible()).toBe(true);
      expect(await VerifyOtpPage.isBackVisible()).toBe(true);
    });

    it('TC10 hides "Resend OTP" while the countdown runs', async () => {
      expect(await VerifyOtpPage.isResendVisible(1500)).toBe(false);
    });

    it('TC11 does not verify an incomplete OTP', async () => {
      await VerifyOtpPage.enterOtp(TestData.otp.slice(0, 2));
      await VerifyOtpPage.tapContinue();
      expect(await VerifyOtpPage.stayedOnOtp()).toBe(true);
    });

    it('TC12 Back returns to sign-in, Continue opens the OTP screen again', async () => {
      await VerifyOtpPage.goBack();
      expect(await SignInPage.isShown()).toBe(true);
      // The number is kept; Continue requests a new OTP for it.
      await SignInPage.enterPhone(TestData.phone);
      const otpPage = await SignInPage.continueToOtp();
      expect(await otpPage.isShown()).toBe(true);
    });

    it('TC13 rejects a wrong OTP and stays on the OTP screen', async function () {
      if (!TestData.wrongOtp) this.skip(); // set TEST_WRONG_OTP to run it
      await VerifyOtpPage.enterOtp(TestData.wrongOtp);
      await VerifyOtpPage.tapContinue();
      expect(await VerifyOtpPage.stayedOnOtp(10000)).toBe(true);
    });

    it('TC14 the correct OTP logs in and opens the home screen', async () => {
      const home = await VerifyOtpPage.verify(TestData.otp);
      expect(await home.isShown()).toBe(true);
    });
  });

  describe('Home', () => {
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

    it('TC19 Wallet tab opens the wallet', async () => {
      expect(await HomePage.openWalletTab()).toBe(true);
    });

    it('TC20 Orders tab opens the order history', async () => {
      expect(await HomePage.openOrdersTab()).toBe(true);
    });

    it('TC21 Profile tab opens the profile', async () => {
      expect(await HomePage.openProfileTab()).toBe(true);
    });

    it('TC22 Home tab brings back the home screen', async () => {
      await HomePage.openHomeTab();
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    });

    it('TC23 the avatar opens the profile, Home tab comes back', async () => {
      expect(await HomePage.openProfileFromAvatar()).toBe(true);
      await HomePage.openHomeTab();
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    });
  });
});
