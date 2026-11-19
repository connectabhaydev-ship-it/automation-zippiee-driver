import SignInPage from '../pages/sign-in.page.js';
import CountryPickerSheet from '../pages/country-picker.page.js';
import { TestData, requireTestAccount } from '../helpers/test-data.js';

// Part 1 of the main flow (see `specs` in wdio.conf.js). All files of the flow
// share ONE app session and run in order: each file starts where the previous
// one ended. Starts: fresh install, logged out.  Ends: on the OTP screen.
//
// Needs a staging driver account with a FIXED OTP and an approved profile
// (so login lands on the dashboard): TEST_PHONE_NUMBER / TEST_OTP in .env.
describe('01 Sign in', () => {
  before(() => {
    requireTestAccount();
  });
  

  it('TC01 opens on the sign-in screen after the splash', async () => {
    await SignInPage.waitUntilShown();
    expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
    expect(await SignInPage.isContinueVisible()).toBe(true);
  });

  it('TC02 shows the title and subtitle', async () => {
    expect(await SignInPage.isTitleVisible()).toBe(true);
    expect(await SignInPage.isSubtitleVisible()).toBe(true);
  });

  it('TC03 does not move on with an empty phone number', async () => {
    await SignInPage.tapContinue();
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
  });

  it('TC04 opens the country picker', async () => {
    const sheet = await SignInPage.openCountryPicker();
    expect(await sheet.isOpen()).toBe(true);
  });

  it('TC05 searches and selects the test country', async () => {
    await CountryPickerSheet.search(TestData.countryName);
    await CountryPickerSheet.select(TestData.countryIso);
    expect(await CountryPickerSheet.isClosed()).toBe(true);
    expect(await SignInPage.isDialCodeVisible(TestData.dialCode)).toBe(true);
  });

  it('TC06 does not move on with an invalid (too short) number', async () => {
    await SignInPage.enterPhone(TestData.invalidPhone);
    await SignInPage.tapContinue();
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
  });

  it('TC07 clear button empties the phone number', async () => {
    // After TC06 the field is unfocused, so the ✕ is hidden and the screen is
    // idle. Focus the field first (see SignInPage.focusPhone).
    await SignInPage.focusPhone();
    expect(await SignInPage.isClearButtonVisible()).toBe(true);
    await SignInPage.clearPhone();
    // The ✕ only shows while there is text.
    expect(await SignInPage.isClearButtonVisible(2000)).toBe(false);
  });

  it('TC08 a valid number opens the OTP screen', async () => {
    await SignInPage.enterPhone(TestData.phone);
    const otpPage = await SignInPage.continueToOtp();
    expect(await otpPage.isShown()).toBe(true);
  });
});
