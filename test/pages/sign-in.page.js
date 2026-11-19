import { byText, byType, isKeyGone, isKeyVisible, tapKey, typeKey, waitKey } from '../helpers/flutter.js';
import { Common, SignIn, VerifyOtp } from '../helpers/keys.js';
import CountryPickerSheet from './country-picker.page.js';
import VerifyOtpPage from './verify-otp.page.js';

class SignInPage {
  /** Waits for sign-in after the splash screen (first launch can be slow). */
  async waitUntilShown(timeout = 60000) {
    await waitKey(SignIn.page, timeout);
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

  async isClearButtonVisible(timeout = 3000) {
    return isKeyVisible(Common.phoneClearButton, timeout);
  }

  async clearPhone() {
    await tapKey(Common.phoneClearButton);
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
