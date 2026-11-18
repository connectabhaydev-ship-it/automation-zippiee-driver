import SignInPage from '../pages/sign-in.page.js';
import VerifyOtpPage from '../pages/verify-otp.page.js';
import { TestData } from '../helpers/test-data.js';

// Part 2 of the main flow. Starts: OTP screen (after 01).  Ends: dashboard.
describe('02 Verify OTP', () => {
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
    // Continue requests a new OTP for the number.
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
