import { isKeyVisible, tapKey, typeKey, waitKey } from '../helpers/flutter.js';
import { Dashboard, Wallet, Common } from '../helpers/keys.js';

class WalletActionsPage {
  async openWithdraw() {
    await tapKey(Dashboard.walletTab);
    await tapKey(Wallet.withdrawButton);
    return isKeyVisible(Wallet.withdrawPage, 10000);
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

  async closeWithdraw() {
    await tapKey(Common.backButton);
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
    await tapKey(Common.backButton);
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
    await tapKey(Common.backButton);
  }
}

export default new WalletActionsPage();
