import SignUpPage from '../pages/sign-up.page.js';
import { TestData } from '../helpers/test-data.js';
import { goBack } from '../helpers/flutter.js';
import { logout, requestOtp, restoreTestLogin, submitOtp } from '../helpers/session.js';

// Part 16. Auth: sign-up with a NEW number, and the account-blocked screen.
// Logs the test driver out, reaches the sign-up form with an unregistered
// number (staging accepts TEST_OTP for any number), then signs the test driver
// back in so the specs after this one keep a logged-in app.
// Does NOT tap "Create Account" (that would register a driver every run).
// References test cases: AU-18, AU-19, AU-22, AU-24, AU-27 from manual-test-tracker.csv.
describe('16 Sign Up & Account Status', () => {
  let newPhone = '';

  before(async function () {
    this.timeout(180000);
    await logout();
    newPhone = TestData.randomPhone;
    console.log(`📱 Unregistered number for sign-up: ${newPhone}`);
    await requestOtp(newPhone);
    const where = await submitOtp(TestData.otp);
    if (where !== 'signUp') throw new Error(`New number ${newPhone} did not reach sign-up (got: ${where})`);
  });

  after(async function () {
    this.timeout(180000);
    await restoreTestLogin();
  });

  it('TC81 [AU-18, AU-19] a new number lands on the sign-up form with all fields', async () => {
    expect(await SignUpPage.isSignUpPageShown()).toBe(true);
    expect(await SignUpPage.isFullNameFieldVisible()).toBe(true);
    expect(await SignUpPage.isEmailFieldVisible()).toBe(true);
    expect(await SignUpPage.isDobFieldVisible()).toBe(true);
    expect(await SignUpPage.isNinFieldVisible()).toBe(true);
    expect(await SignUpPage.isCreateAccountButtonVisible()).toBe(true);
  });

  it('TC82 [AU-22] shows the referral code entry field', async () => {
    expect(await SignUpPage.isReferralCodeFieldVisible()).toBe(true);
  });

  it('TC83 [AU-24, AU-27] a blocked account shows Contact Support and Continue to Login', async function () {
    if (!TestData.blockedPhone) {
      console.warn('ℹ️ TC83 skipped: set TEST_BLOCKED_PHONE in .env to a blocked staging driver');
      this.skip();
    }
    await goBack(); // sign-up → sign-in (app back button)
    await requestOtp(TestData.blockedPhone);
    expect(await submitOtp(TestData.otp)).toBe('blocked');
    expect(await SignUpPage.isContactSupportButtonVisible()).toBe(true);
    expect(await SignUpPage.isContinueToLoginButtonVisible()).toBe(true);
  });
});
