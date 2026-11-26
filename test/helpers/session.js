import { goBack, isKeyVisible, scrollAndTapKey, tapKey, typeKey, waitForAnyKey, waitKey } from './flutter.js';
import { AccountBlocked, AppVersion, Common, Dashboard, Profile, SignIn, SignUp, Splash, VerifyOtp } from './keys.js';
import { dismissBlockingDialogs } from './dialogs.js';
import { returnToDashboard } from './navigation.js';
import { TestData, requireTestAccount } from './test-data.js';

/**
 * Login state is kept between runs (noReset in wdio.conf.js), so a run only
 * signs in when the app is actually logged out. Call from a `before` hook.
 *
 * Returns 'reused' when the saved login was used, 'signed-in' after a fresh login.
 */
export async function ensureLoggedIn() {
  requireTestAccount();
  // A picker / camera / crop screen left by an aborted run can sit on top.
  if ((await browser.getCurrentPackage().catch(() => TestData.driverAppPackage)) !== TestData.driverAppPackage) {
    await browser.execute('mobile: activateApp', { appId: TestData.driverAppPackage }).catch(() => {});
    await browser.pause(1500);
  }
  const landing = [Dashboard.page, SignIn.page, VerifyOtp.page, SignUp.page];

  let found = await waitPastSplash(landing);
  if (found === AppVersion.updateAvailableLaterButton) {
    await tapKey(found);
    found = await waitForAnyKey(landing, 20000);
  }
  if (!found && !(await isKeyVisible(Splash.page, 500))) {
    // A pushed page (left open by an aborted run) hides the dashboard key.
    await returnToDashboard();
    found = await waitForAnyKey(landing, 10000);
  }
  if (!found && (await isKeyVisible(Splash.page, 500))) {
    throw new Error(
      'App is stuck on the splash screen: the phone cannot reach the staging API ' +
        '(see "API ERROR" / "Network error" in `adb logcat | grep flutter`). Check the phone\'s network.',
    );
  }

  if (found === Dashboard.page) {
    await dismissBlockingDialogs(2000);
    await returnToDashboard();
    console.log('🔐 Saved login reused – skipping sign-in');
    return 'reused';
  }

  if (found === VerifyOtp.page || found === SignUp.page) {
    // Half-finished login from an earlier run: start again from sign-in.
    // (App back button: system Back on sign-up closes the app.)
    await goBack();
    await waitKey(SignIn.page, 10000);
  } else if (found !== SignIn.page) {
    throw new Error('App did not reach sign-in or dashboard within 60 s');
  }

  await signIn(TestData.phone, TestData.otp);
  await dismissBlockingDialogs(3000);
  console.log('🔐 Signed in with the test account');
  return 'signed-in';
}

/**
 * Waits for the first real screen after the splash. The splash shows a Retry
 * button when the backend doesn't answer: it is tapped (up to 3 times).
 * Returns the key found, or null.
 */
async function waitPastSplash(landing, timeout = 120000) {
  const end = Date.now() + timeout;
  let retries = 0;
  while (Date.now() < end) {
    const found = await waitForAnyKey(
      [...landing, AppVersion.updateAvailableLaterButton, Splash.retryButton],
      Math.min(15000, end - Date.now()),
    );
    if (found !== Splash.retryButton) {
      if (found) return found;
      if (!(await isKeyVisible(Splash.page, 500))) return null; // not splash: caller recovers
      continue;
    }
    if (retries >= 3) return null;
    retries += 1;
    console.warn(`⚠️ Splash shows Retry (backend not reachable) – retry ${retries}/3`);
    await tapKey(Splash.retryButton).catch(() => {});
  }
  return null;
}

/** Sign-in screen → OTP screen for `phone` (picks the test country first). */
export async function requestOtp(phone) {
  if (!(await isKeyVisible(Common.countryPickerSearchField, 500))) {
    await tapKey(Common.phoneCountryCodeButton);
  }
  await typeKey(Common.countryPickerSearchField, TestData.countryName);
  await tapKey(Common.countryPickerOption(TestData.countryIso));
  await typeKey(SignIn.phoneField, phone);
  await tapKey(SignIn.continueButton);
  await waitKey(VerifyOtp.page, 30000);
}

/** Enters the OTP and returns where the app went: 'dashboard' | 'signUp' | 'blocked' | null. */
export async function submitOtp(otp) {
  await typeKey(VerifyOtp.otpField, otp);
  // The OTP screen auto-submits after the last digit: tap Continue only if it is still there.
  await browser.pause(1000);
  if (await isKeyVisible(VerifyOtp.continueButton, 500)) {
    await tapKey(VerifyOtp.continueButton, 2000).catch(() => {});
  }
  const found = await waitForAnyKey([Dashboard.page, SignUp.page, AccountBlocked.page], 60000);
  return { [Dashboard.page]: 'dashboard', [SignUp.page]: 'signUp', [AccountBlocked.page]: 'blocked' }[found] ?? null;
}

/** Full sign-in from the sign-in screen to the dashboard. */
export async function signIn(phone, otp) {
  await requestOtp(phone);
  const where = await submitOtp(otp);
  if (where !== 'dashboard') throw new Error(`Sign-in with the test account ended on: ${where}`);
}

/** Logs out from any dashboard tab. Ends on the sign-in screen. */
export async function logout() {
  await returnToDashboard();
  await tapKey(Dashboard.profileTab);
  await scrollAndTapKey(Profile.logoutTile);
  await tapKey(Profile.logoutConfirmButton);
  await waitKey(SignIn.page, 20000);
}

/**
 * From any auth screen (sign-up, OTP, blocked) back to sign-in, then signs in
 * with the test account. Used to restore the saved login after auth specs.
 */
export async function restoreTestLogin() {
  for (let i = 0; i < 3 && !(await isKeyVisible(SignIn.page, 1500)); i += 1) {
    if (await isKeyVisible(AccountBlocked.continueToLoginButton, 500)) {
      await tapKey(AccountBlocked.continueToLoginButton);
    } else if (await isKeyVisible(Dashboard.page, 500)) {
      return;
    } else {
      await goBack(); // app back button: system Back on sign-up closes the app
    }
  }
  await signIn(TestData.phone, TestData.otp);
  await dismissBlockingDialogs(3000);
}
