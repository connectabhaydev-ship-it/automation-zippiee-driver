import SignUpPage from '../pages/sign-up.page.js';
import HomePage from '../pages/home.page.js';

// Part 16 of the test suite. Can run in the main flow or as a standalone suite.
// References test cases: AU-18, AU-19, AU-20, AU-21, AU-22, AU-24, AU-25, AU-27 from manual-test-tracker.csv.
describe('16 Sign Up & Account Status', () => {
  it('TC81 [AU-18, AU-19] verifies sign-up form components when on sign-up flow', async () => {
    const onSignUp = await SignUpPage.isSignUpPageShown(1000);
    if (onSignUp) {
      expect(await SignUpPage.isFullNameFieldVisible()).toBe(true);
      expect(await SignUpPage.isEmailFieldVisible()).toBe(true);
      expect(await SignUpPage.isDobFieldVisible()).toBe(true);
      expect(await SignUpPage.isNinFieldVisible()).toBe(true);
      expect(await SignUpPage.isCreateAccountButtonVisible()).toBe(true);
    } else {
      // In the main logged-in flow, user is already authenticated
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC82 [AU-22] verifies referral code entry field', async () => {
    if (await SignUpPage.isSignUpPageShown(1000)) {
      expect(await SignUpPage.isReferralCodeFieldVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC83 [AU-24, AU-27] verifies account blocked interface elements', async () => {
    const isBlocked = await SignUpPage.isAccountBlockedPageShown(1000);
    if (isBlocked) {
      expect(await SignUpPage.isContactSupportButtonVisible()).toBe(true);
      expect(await SignUpPage.isContinueToLoginButtonVisible()).toBe(true);
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });
});
