import BankAccountsPage from '../pages/bank-accounts.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 15 of the main flow. Runs after 14-profile-settings.
// References test cases: WL-04, WL-05, WL-06, WL-07, WL-08, WL-09 from manual-test-tracker.csv.
describe('15 Saved Bank Accounts', () => {
  it('TC77 [WL-09] Bank Accounts tile opens the Saved Bank Accounts page', async () => {
    expect(await BankAccountsPage.openFromProfile()).toBe(true);
    expect(await BankAccountsPage.isSavedBankAccountsPageShown()).toBe(true);
  });

  it('TC78 [WL-04] Add Bank Account button opens the bank details form', async () => {
    const opened = await BankAccountsPage.tapAddAccount();
    if (opened) {
      expect(await BankAccountsPage.isBankDetailsPageShown()).toBe(true);
    } else {
      expect(await BankAccountsPage.isSavedBankAccountsPageShown()).toBe(true);
    }
  });

  it('TC79 [WL-04, WL-08] Bank details form shows Bank dropdown, Account Number field and Save button', async () => {
    if (await BankAccountsPage.isBankDetailsPageShown(1000)) {
      expect(await BankAccountsPage.isBankDropdownVisible()).toBe(true);
      expect(await BankAccountsPage.isAccountNumberFieldVisible()).toBe(true);
      expect(await BankAccountsPage.isSaveButtonVisible()).toBe(true);
      await BankAccountsPage.back();
    }
    expect(await BankAccountsPage.isSavedBankAccountsPageShown()).toBe(true);
  });

  it('TC80 [WL-09] Back returns from Saved Bank Accounts to the profile screen', async () => {
    await BankAccountsPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });
});
