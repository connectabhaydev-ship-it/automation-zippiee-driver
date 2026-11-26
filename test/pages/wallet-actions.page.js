import { goBack, isKeyVisible, tapKey, typeKey, waitForAnyKey } from '../helpers/flutter.js';
import { Dashboard, Wallet, Common } from '../helpers/keys.js';
import HomePage from '../pages/home.page.js';

class WalletActionsPage {
  /**
   * Taps Withdraw and reports where the app went:
   *  'withdraw'    – the withdraw form
   *  'bankDetails' – no bank account saved yet, the app asks to add one first
   *  'unavailable' – the "withdrawal unavailable" dialog
   *  null          – none of these within 10 s
   */
  async openWithdrawScreen() {
    await tapKey(Dashboard.walletTab);
    await tapKey(Wallet.withdrawButton);
    // The withdraw page shows for a moment before it redirects to Bank Details
    // (no saved account), so wait for its submit button, not the page key.
    const found = await waitForAnyKey(
      [Wallet.withdrawSubmitButton, Wallet.bankDetailsPage, Wallet.withdrawalUnavailableDialog],
      10000,
    );
    return (
      {
        [Wallet.withdrawSubmitButton]: 'withdraw',
        [Wallet.bankDetailsPage]: 'bankDetails',
        [Wallet.withdrawalUnavailableDialog]: 'unavailable',
      }[found] ?? null
    );
  }

  /** True only when the withdraw form itself opened. */
  async openWithdraw() {
    return (await this.openWithdrawScreen()) === 'withdraw';
  }

  async isWithdrawPageShown() {
    return isKeyVisible(Wallet.withdrawPage, 5000);
  }

  async enterWithdrawAmount(amount) {
    await typeKey(Wallet.withdrawAmountField, amount);
  }

  async isWithdrawSubmitVisible() {
    return isKeyVisible(Wallet.withdrawSubmitButton, 5000);
  }

  /** Leaves the withdraw form, the bank-details redirect or the unavailable dialog. */
  async closeWithdraw() {
    if (await isKeyVisible(Wallet.withdrawalUnavailableOkButton, 500)) {
      await tapKey(Wallet.withdrawalUnavailableOkButton);
      return;
    }
    // Bank Details is pushed on top of Saved Bank Accounts: back out of both.
    for (let i = 0; i < 3 && !(await isKeyVisible(Wallet.depositButton, 1500)); i += 1) {
      await goBack();
    }
  }

  async openDeposit() {
    await tapKey(Dashboard.walletTab);
    await tapKey(Wallet.depositButton);
    return isKeyVisible(Wallet.depositPage, 10000);
  }

  async isDepositPageShown() {
    return isKeyVisible(Wallet.depositPage, 5000);
  }

  async enterDepositAmount(amount) {
    await typeKey(Wallet.depositAmountField, amount);
  }

  async isDepositAddFundsVisible() {
    return isKeyVisible(Wallet.depositAddFundsButton, 5000);
  }

  async closeDeposit() {
    await goBack();
  }

  async openTransactionHistory() {
    await tapKey(Dashboard.walletTab);
    await tapKey(Wallet.transactionHistoryLink);
    return isKeyVisible(Wallet.transactionHistoryPage, 10000);
  }

  async isTransactionHistoryShown() {
    return isKeyVisible(Wallet.transactionHistoryPage, 5000);
  }

  async closeTransactionHistory() {
    await goBack();
  }
}

export default new WalletActionsPage();
