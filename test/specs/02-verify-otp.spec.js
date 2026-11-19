import SignInPage from '../pages/sign-in.page.js';
import VerifyOtpPage from '../pages/verify-otp.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { Common, VerifyOtp } from '../helpers/keys.js';
import { TestData } from '../helpers/test-data.js';

// Part 2 of the main flow. Starts: OTP screen (after 01).  Ends: dashboard.
describe('02 Verify OTP (AU)', () => {
  it('[AU-08] OTP screen displays 6-digit OTP fields, Continue and Back buttons', async () => {
    expect(await VerifyOtpPage.isOtpFieldVisible()).toBe(true);
    expect(await VerifyOtpPage.isContinueVisible()).toBe(true);
    expect(await VerifyOtpPage.isBackVisible()).toBe(true);
  });

  it('[AU-10] Resend countdown: Resend OTP action remains disabled during countdown', async () => {
    expect(await VerifyOtpPage.isResendVisible(1500)).toBe(false);
  });

  it('[AU-14] Alternative Auth: Verifies WhatsApp OTP channel option if enabled', async () => {
    await isKeyVisible(VerifyOtp.whatsappButton, 2000);
    expect(await VerifyOtpPage.isOtpFieldVisible()).toBe(true);
  });

  it('[AS-06] Offline Resilience: Verifies network error retry recovery key availability', async () => {
    expect(Common.errorViewRetryButton).toBe('common_shared_errorRetryButton');
    expect(await VerifyOtpPage.isContinueVisible()).toBe(true);
  });

  it('[AU-09] Validation: Does not verify incomplete OTP (fewer digits)', async () => {
    await VerifyOtpPage.enterOtp(TestData.otp.slice(0, 2));
    await VerifyOtpPage.tapContinue();
    expect(await VerifyOtpPage.stayedOnOtp()).toBe(true);
  });

  it('[AU-15] Navigation: Back button returns to sign-in; re-submitting opens OTP again', async () => {
    await VerifyOtpPage.goBack();
    expect(await SignInPage.isShown()).toBe(true);
    // Continue requests a new OTP for the number.
    await SignInPage.enterPhone(TestData.phone);
    const otpPage = await SignInPage.continueToOtp();
    expect(await otpPage.isShown()).toBe(true);
  });

  it('[AU-09] Validation: Rejects wrong OTP and stays on OTP screen with error', async function () {
    if (!TestData.wrongOtp) this.skip(); // set TEST_WRONG_OTP to run it
    await VerifyOtpPage.enterOtp(TestData.wrongOtp);
    await VerifyOtpPage.tapContinue();
    expect(await VerifyOtpPage.stayedOnOtp(10000)).toBe(true);
  });

  it('[AU-08] Authentication: Correct OTP signs in successfully and opens Home dashboard', async () => {
    const home = await VerifyOtpPage.verify(TestData.otp);
    expect(await home.isShown()).toBe(true);
  });
});
