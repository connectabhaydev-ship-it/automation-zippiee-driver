import { goBack, isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
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
}

export default new BankAccountsPage();
