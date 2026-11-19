import SignInPage from '../pages/sign-in.page.js';
import CountryPickerSheet from '../pages/country-picker.page.js';
import { TestData } from '../helpers/test-data.js';

/**
 * Sign‑in tests that use a brand‑new random phone number on each run.
 * The expectation is that the app will stay on the sign‑in screen because the
 * number is not registered in the staging environment.
 */
describe('01 Sign‑in – Random phone number (negative flow)', () => {
  it('opens the sign‑in screen', async () => {
    await SignInPage.waitUntilShown();
    expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
    expect(await SignInPage.isContinueVisible()).toBe(true);
  });

  it('opens the country picker and selects the test country', async () => {
    const sheet = await SignInPage.openCountryPicker();
    expect(await sheet.isOpen()).toBe(true);
    await CountryPickerSheet.search(TestData.countryName);
    await CountryPickerSheet.select(TestData.countryIso);
    expect(await CountryPickerSheet.isClosed()).toBe(true);
    expect(await SignInPage.isDialCodeVisible(TestData.dialCode)).toBe(true);
  });

  it('enters a fresh random phone number and stays on sign‑in', async () => {
    await SignInPage.enterPhone(TestData.randomPhone);
    await SignInPage.tapContinue();
    // The OTP screen should NOT appear because this number is not registered.
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
  });
});
