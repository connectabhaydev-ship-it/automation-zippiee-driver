import { byText, byType, isKeyGone, isKeyVisible, tapKey, typeKey, waitForAnyKey, waitKey } from '../helpers/flutter.js';
import { Common, SignIn, Splash, VerifyOtp } from '../helpers/keys.js';
import CountryPickerSheet from './country-picker.page.js';
import VerifyOtpPage from './verify-otp.page.js';

class SignInPage {
  /** Waits for sign-in after the splash screen (first launch can be slow). */
  // The splash shows "Something went wrong" + Retry when the staging API is
  // unreachable: Retry is tapped up to 3 times, then it fails with a clear message.
  async waitUntilShown(timeout = 60000) {
    const end = Date.now() + timeout;
    let retries = 0;
    while (Date.now() < end) {
      const found = await waitForAnyKey([SignIn.page, Splash.retryButton], end - Date.now());
      if (found === SignIn.page) return;
      if (found !== Splash.retryButton) break;
      if (retries >= 3) {
        throw new Error('Splash still shows "Something went wrong" after 3 retries: the staging API is not reachable (check the backend server).');
      }
      retries += 1;
      console.warn(`⚠️ Splash shows Retry (backend not reachable) – retry ${retries}/3`);
      await tapKey(Splash.retryButton).catch(() => {});
      await browser.pause(2000);
    }
    await waitKey(SignIn.page, 1000);                // timed out: throws the usual error
  }

  async isShown(timeout = 3000) {
    return isKeyVisible(SignIn.page, timeout);
  }

  async isTitleVisible() {
    return (await byText('Sign in to your account')).isDisplayed();
  }

  async isSubtitleVisible() {
    return (await byText('Login or create an account')).isDisplayed();
  }

  async isPhoneFieldVisible() {
    return isKeyVisible(SignIn.phoneField);
  }

  async isContinueVisible() {
    return isKeyVisible(SignIn.continueButton);
  }

  async openCountryPicker() {
    await tapKey(Common.phoneCountryCodeButton);
    return CountryPickerSheet;
  }

  async isDialCodeVisible(dialCode) {
    return (await byText(dialCode)).isDisplayed();
  }

  async enterPhone(number) {
    await typeKey(SignIn.phoneField, number);
  }

  /** Taps the phone field to focus it (the ✕ only shows while it is focused). */
  async focusPhone() {
    await tapKey(SignIn.phoneField);
  }

  async isClearButtonVisible(timeout = 5000) {
    return isKeyVisible(Common.phoneClearButton, timeout);
  }

  async clearPhone() {
    if (await this.isClearButtonVisible(2000)) {
      await tapKey(Common.phoneClearButton);
    } else {
      await (await waitKey(SignIn.phoneField)).clearValue();
    }
  }

  /** Taps Continue. Sends an OTP when the number is valid. */
  async tapContinue() {
    await tapKey(SignIn.continueButton);
  }

  /** Taps Continue and waits for the OTP screen. */
  async continueToOtp(timeout = 30000) {
    await this.tapContinue();
    await waitKey(VerifyOtp.page, timeout);
    return VerifyOtpPage;
  }

  /** True when tapping Continue did NOT open the OTP screen. */
  async stayedOnSignIn(timeout = 4000) {
    return (await isKeyGone(VerifyOtp.page, timeout)) && this.isShown();
  }
}

export default new SignInPage();
