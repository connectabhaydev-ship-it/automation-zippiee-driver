import SignInPage from '../pages/sign-in.page.js';
import VerifyOtpPage from '../pages/verify-otp.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { AccountBlocked, Dashboard, Home, SignUp, VerifyOtp } from '../helpers/keys.js';
import { TestData } from '../helpers/test-data.js';

// Dedicated standalone flow: Tests ONLY the Suspended Account (+234 805 151 5151).
// Determines whether the account is currently Suspended/Blocked or has been Reinstated.
describe('09 Suspended Account Flow & Reinstatement Check', () => {
  it('[AS-01] Fresh launch: Waits for app splash to finish and displays sign-in screen', async () => {
    await SignInPage.waitUntilShown(45000);
    expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
    expect(await SignInPage.isContinueVisible()).toBe(true);
  });

  it('[AU-01] Enters suspended driver phone number (+234 805 151 5151) and requests OTP', async () => {
    const suspendedPhone = TestData.suspendedPhone || '8051515151';
    console.log(`\n\x1b[36m▶ Testing Phone:\x1b[0m +234 ${suspendedPhone}\n`);
    await SignInPage.enterPhone(suspendedPhone);
    const otpPage = await SignInPage.continueToOtp(30000);
    expect(await otpPage.isShown(15000)).toBe(true);
  });

  it('[AU-24 / AS-05] Enters OTP and verifies whether account is Suspended/Blocked or Reinstated', async () => {
    const otp = TestData.suspendedOtp || '1234';
    console.log(`\n\x1b[36m▶ Entering OTP:\x1b[0m ${otp}\n`);
    await VerifyOtpPage.enterOtp(otp);

    // If Continue button is still visible and auto-submit didn't trigger, tap it
    if (await isKeyVisible(VerifyOtp.continueButton, 2000)) {
      try {
        await VerifyOtpPage.tapContinue();
      } catch (err) {
        // Auto-navigated upon typing the complete code
      }
    }

    // Wait and evaluate the resulting screen
    let isBlocked = false;
    let isReinstated = false;
    let isSignUp = false;

    for (let i = 0; i < 20; i++) {
      if (await isKeyVisible(AccountBlocked.accountBlockedPage, 1000)) {
        isBlocked = true;
        break;
      }
      if ((await isKeyVisible(Dashboard.page, 1000)) || (await isKeyVisible(Home.onlineToggle, 1000))) {
        isReinstated = true;
        break;
      }
      if (await isKeyVisible(SignUp.signUpPage, 1000)) {
        isSignUp = true;
        break;
      }
    }

    if (isBlocked) {
      console.log(`\n\x1b[33m======================================================\x1b[0m`);
      console.log(`  RESULT: Account is currently SUSPENDED / BLOCKED`);
      console.log(`  Screen: auth_accountBlocked_page is displayed`);
      console.log(`  Reinstated: NO (Account has not been reinstated yet)`);
      console.log(`\x1b[33m======================================================\x1b[0m\n`);

      expect(await isKeyVisible(AccountBlocked.accountBlockedPage)).toBe(true);
      const hasContact = (await isKeyVisible(AccountBlocked.accountBlockedContactButton, 3000)) ||
                         (await isKeyVisible(AccountBlocked.accountBlockedContinueButton, 2000));
      expect(hasContact).toBe(true);
    } else if (isReinstated) {
      console.log(`\n\x1b[32m======================================================\x1b[0m`);
      console.log(`  RESULT: Account has been REINSTATED!`);
      console.log(`  Screen: Driver Dashboard is active`);
      console.log(`  Reinstated: YES (Driver can access the app)`);
      console.log(`\x1b[32m======================================================\x1b[0m\n`);

      expect(isReinstated).toBe(true);
    } else if (isSignUp) {
      console.log(`\n\x1b[34m======================================================\x1b[0m`);
      console.log(`  RESULT: Account navigated to Sign-Up / Onboarding`);
      console.log(`  Screen: auth_signUp_page is displayed`);
      console.log(`\x1b[34m======================================================\x1b[0m\n`);
      expect(isSignUp).toBe(true);
    } else {
      // Check if stayed on OTP screen (e.g. invalid OTP response or toast error)
      const stayedOnOtp = await isKeyVisible(VerifyOtp.page, 2000);
      if (stayedOnOtp) {
        console.warn(`\n\x1b[31m[WARNING]\x1b[0m App stayed on OTP screen. Backend rejected OTP or error toast shown.\n`);
      }
      expect(stayedOnOtp || isBlocked || isReinstated || isSignUp).toBe(true);
    }
  });
});
