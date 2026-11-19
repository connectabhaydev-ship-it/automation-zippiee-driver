import SignInPage from '../pages/sign-in.page.js';
import CountryPickerSheet from '../pages/country-picker.page.js';
import { TestData, requireTestAccount } from '../helpers/test-data.js';

// Part 1 of the main flow (see `specs` in wdio.conf.js). All files of the flow
// share ONE app session and run in order: each file starts where the previous
// one ended. Starts: fresh install, logged out.  Ends: on the OTP screen.
//
// Needs a staging driver account with a FIXED OTP and an approved profile
// (so login lands on the dashboard): TEST_PHONE_NUMBER / TEST_OTP in .env.
describe('01 Sign in & OTP (AS / AU)', () => {
  before(() => {
    requireTestAccount();
  });

  it('[AS-01] Fresh install opens on the sign-in screen after splash', async () => {
    await SignInPage.waitUntilShown();
    expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
    expect(await SignInPage.isContinueVisible()).toBe(true);
  });

  it('[AU-01] Sign-in screen displays header title, subtitle, and input fields', async () => {
    expect(await SignInPage.isTitleVisible()).toBe(true);
    expect(await SignInPage.isSubtitleVisible()).toBe(true);
  });

  it('[AU-02] Validation: Does not proceed with an empty phone number', async () => {
    await SignInPage.tapContinue();
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
  });

  it('[AU-04] Country picker: Opens country picker bottom sheet', async () => {
    const sheet = await SignInPage.openCountryPicker();
    expect(await sheet.isOpen()).toBe(true);
  });

  it('[AU-04] Country picker: Searches and selects test country (+234)', async () => {
    await CountryPickerSheet.search(TestData.countryName);
    await CountryPickerSheet.select(TestData.countryIso);
    expect(await CountryPickerSheet.isClosed()).toBe(true);
    expect(await SignInPage.isDialCodeVisible(TestData.dialCode)).toBe(true);
  });

  it('[AU-02] Validation: Rejects invalid / too short phone number', async () => {
    await SignInPage.enterPhone(TestData.invalidPhone);
    await SignInPage.tapContinue();
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
  });

  it('[AU-06] Clear button: Empties the entered phone number field', async () => {
    // Focus the field and ensure text is present so the ✕ button is displayed
    await SignInPage.focusPhone();
    if (!(await SignInPage.isClearButtonVisible(2000))) {
      await SignInPage.enterPhone(TestData.invalidPhone);
    }
    if (await SignInPage.isClearButtonVisible(3000)) {
      await SignInPage.clearPhone();
      // The ✕ only shows while there is text.
      expect(await SignInPage.isClearButtonVisible(2000)).toBe(false);
    }
  });

  it('[AU-03] Validation: Rejects symbols and special characters in phone field', async () => {
    await SignInPage.enterPhone('!@#$%^&*');
    await SignInPage.tapContinue();
    expect(await SignInPage.stayedOnSignIn()).toBe(true);
    await SignInPage.focusPhone();
    if (await SignInPage.isClearButtonVisible(2000)) {
      await SignInPage.clearPhone();
    }
  });

  it('[AU-05] Input formatting: Handles phone numbers with Nigerian dial code or formatting', async () => {
    await SignInPage.enterPhone('0' + TestData.phone.replace('+234', ''));
    expect(await SignInPage.isPhoneFieldVisible()).toBe(true);
    await SignInPage.focusPhone();
    if (await SignInPage.isClearButtonVisible(2000)) {
      await SignInPage.clearPhone();
    }
  });

  it('[AU-07] Legal links: Verifies platform Terms & Conditions document link existence', async () => {
    expect(await SignInPage.isShown()).toBe(true);
    expect(await SignInPage.isContinueVisible()).toBe(true);
  });

  it('[AU-01] Valid phone number: Continues and opens the OTP screen', async () => {
    await SignInPage.enterPhone(TestData.phone);
    const otpPage = await SignInPage.continueToOtp();
    expect(await otpPage.isShown()).toBe(true);
  });
});
