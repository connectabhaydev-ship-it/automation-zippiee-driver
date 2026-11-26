import { goBack, isKeyGone, isKeyVisible, tapKey, typeKey, waitForAnyKey } from '../helpers/flutter.js';
import { TestData } from '../helpers/test-data.js';
import { Common, Dashboard, Profile, Wallet } from '../helpers/keys.js';

class BankAccountsPage {
  async openFromProfile() {
    await tapKey(Dashboard.profileTab);
    await tapKey(Profile.bankAccountsTile);
    return isKeyVisible(Wallet.savedBankAccountsPage, 10000);
  }

  async isSavedBankAccountsPageShown(timeout = 5000) {
    return isKeyVisible(Wallet.savedBankAccountsPage, timeout);
  }

  async isAddButtonVisible() {
    return (
      (await isKeyVisible(Wallet.savedBankAccountsAddButton, 3000)) ||
      (await isKeyVisible(Wallet.savedBankAccountsEmptyAddButton, 3000))
    );
  }

  async tapAddAccount() {
    if (await isKeyVisible(Wallet.savedBankAccountsAddButton, 2000)) {
      await tapKey(Wallet.savedBankAccountsAddButton);
    } else if (await isKeyVisible(Wallet.savedBankAccountsEmptyAddButton, 2000)) {
      await tapKey(Wallet.savedBankAccountsEmptyAddButton);
    }
    return isKeyVisible(Wallet.bankDetailsPage, 10000);
  }

  async isBankDetailsPageShown(timeout = 5000) {
    return isKeyVisible(Wallet.bankDetailsPage, timeout);
  }

  async isBankDropdownVisible() {
    return isKeyVisible(Wallet.bankDetailsBankDropdown, 5000);
  }

  async isAccountNumberFieldVisible() {
    return isKeyVisible(Wallet.bankDetailsAccountNumberField, 5000);
  }

  async isAccountNameFieldVisible() {
    return isKeyVisible(Wallet.bankDetailsAccountNameField, 5000);
  }

  async isSaveButtonVisible() {
    return isKeyVisible(Wallet.bankDetailsSaveButton, 5000);
  }

  async enterAccountNumber(num) {
    await typeKey(Wallet.bankDetailsAccountNumberField, num);
  }

  async isDeleteDialogShown(timeout = 3000) {
    return isKeyVisible(Wallet.deleteBankAccountDialog, timeout);
  }

  async cancelDelete() {
    if (await isKeyVisible(Wallet.deleteBankAccountCancelButton, 2000)) {
      await tapKey(Wallet.deleteBankAccountCancelButton);
    }
  }

  async back() {
    await goBack();
  }

  /** True when at least one saved account is listed (Saved Bank Accounts page). */
  async hasSavedAccount(timeout = 8000) {
    const found = await waitForAnyKey(
      [Wallet.savedBankAccountsList, Wallet.savedBankAccountsEmptyAddButton],
      timeout,
    );
    return found === Wallet.savedBankAccountsList;
  }

  /**
   * Fills the Bank Details form (already open) and saves it.
   * Bank → account number → account name (typed only if the app did not
   * resolve it) → Save. Returns true when the form closed after saving.
   */
  async fillAndSave({
    bankCode = TestData.bankCode,
    bankSearch = TestData.bankSearch,
    accountNumber = TestData.bankAccountNumber,
    accountName = TestData.bankAccountName,
  } = {}) {
    await tapKey(Wallet.bankDetailsBankDropdown);
    await typeKey(Common.dropdownSearchField, bankSearch);
    await tapKey(Common.dropdownOption(bankCode));
    await typeKey(Wallet.bankDetailsAccountNumberField, accountNumber);
    // Name lookup runs after the 10th digit; when it fails the field turns editable.
    await browser.pause(6000);
    const nameEl = await $(await browser.findElement('-flutter key', Wallet.bankDetailsAccountNameField));
    const resolved = (await nameEl.getText().catch(() => '')).trim();
    if (!resolved || /enter name|will appear/i.test(resolved)) {
      await typeKey(Wallet.bankDetailsAccountNameField, accountName);
    }
    console.log(`🏦 Saving bank account ${bankSearch} ${accountNumber} (${resolved || accountName})`);
    await browser.hideKeyboard().catch(() => {});
    await tapKey(Wallet.bankDetailsSaveButton);
    return isKeyGone(Wallet.bankDetailsPage, 20000);
  }

  /**
   * Makes sure the driver has a bank account: opens Profile → Bank Accounts
   * and adds the .env test account when the list is empty.
   * Returns 'existing' | 'added' | 'failed'. Ends on Saved Bank Accounts.
   */
  async ensureOne() {
    if (!(await this.openFromProfile())) return 'failed';
    if (await this.hasSavedAccount()) return 'existing';
    if (!(await this.tapAddAccount())) return 'failed';
    if (!(await this.fillAndSave())) {
      console.warn(
        '⚠️ Bank account was not saved – the backend checks the account with the bank. ' +
          'Set a REAL account in .env: TEST_BANK_CODE / TEST_BANK_SEARCH / TEST_BANK_ACCOUNT_NO / TEST_BANK_ACCOUNT_NAME',
      );
      await this.back();
      return 'failed';
    }
    return (await this.hasSavedAccount(15000)) ? 'added' : 'failed';
  }
}

export default new BankAccountsPage();
