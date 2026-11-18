import { isKeyGone, isKeyVisible, tapKey, typeKey, waitKey } from '../helpers/flutter.js';
import { Common, Dashboard, SignIn, VerifyOtp } from '../helpers/keys.js';
import HomePage from './home.page.js';

class VerifyOtpPage {
  async isShown(timeout = 10000) {
    return isKeyVisible(VerifyOtp.page, timeout);
  }

  async isOtpFieldVisible() {
    return isKeyVisible(VerifyOtp.otpField);
  }

  async isContinueVisible() {
    return isKeyVisible(VerifyOtp.continueButton);
  }

  async isBackVisible() {
    return isKeyVisible(Common.backButton);
  }

  /** Types the code into the first box; the app spreads it over all boxes. */
  async enterOtp(code) {
    await typeKey(VerifyOtp.otpField, code);
  }

  async tapContinue() {
    await tapKey(VerifyOtp.continueButton);
  }

  /** Enters the code, taps Continue and waits for the dashboard. */
  async verify(code, timeout = 60000) {
    await this.enterOtp(code);
    await this.tapContinue();
    await waitKey(Dashboard.page, timeout);
    return HomePage;
  }

  /** True when the app did NOT leave the OTP screen for the dashboard. */
  async stayedOnOtp(timeout = 6000) {
    return (await isKeyGone(Dashboard.page, timeout)) && this.isShown(3000);
  }

  /** "Resend OTP" only shows once the countdown ends. */
  async isResendVisible(timeout = 3000) {
    return isKeyVisible(Common.resendOtpButton, timeout);
  }

  async goBack() {
    await tapKey(Common.backButton);
    await waitKey(SignIn.page);
  }
}

export default new VerifyOtpPage();
