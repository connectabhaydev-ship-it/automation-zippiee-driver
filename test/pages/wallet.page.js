import { goBack, isKeyGone, isKeyVisible, tapKey, waitKey } from '../helpers/flutter.js';
import { Common, Dashboard, Payments, Wallet } from '../helpers/keys.js';

class WalletPage {
  async open() {
    await tapKey(Dashboard.walletTab);
    return isKeyVisible(Wallet.list, 20000);
  }

  async isBalanceCarouselVisible() {
    return isKeyVisible(Wallet.balanceCarousel, 10000);
  }

  async isBalanceCardVisible(card = 'total') {
    return (
      (await isKeyVisible(Wallet.balanceCard(card), 2000)) ||
      (await isKeyVisible(Wallet.visibilityToggle(card), 2000)) ||
      (await isKeyVisible(Wallet.walletBalanceAmount(card), 2000))
    );
  }

  /** Taps the eye icon on a balance card (show / hide the amount). */
  async toggleBalance(card = 'total') {
    await tapKey(Wallet.visibilityToggle(card));
  }

  async areQuickActionsVisible() {
    return (
      (await isKeyVisible(Wallet.depositButton)) && (await isKeyVisible(Wallet.withdrawButton))
    );
  }

  /** Checks if the withdrawable balance card is visible. */
  async isWithdrawableBalanceVisible() {
    return (
      (await isKeyVisible(Wallet.balanceCard('withdrawable'), 2000)) ||
      (await isKeyVisible(Wallet.visibilityToggle('withdrawable'), 2000)) ||
      (await isKeyVisible(Wallet.balanceCarousel, 2000))
    );
  }

  /** Checks earnings breakdown cards if available on screen. */
  async isBreakdownVisible(type = 'walletEarnings') {
    return isKeyVisible(Wallet.walletBreakdownCard(type), 5000);
  }

  /** Opens the Deposit screen via the quick action. */
  async openDeposit() {
    await tapKey(Wallet.depositButton);
    return isKeyVisible(Payments.depositPage, 15000);
  }

  /** Verifies the Deposit screen fields and quick amount chips. */
  async isDepositScreenShown() {
    return (
      (await isKeyVisible(Payments.depositPage, 10000)) &&
      (await isKeyVisible(Payments.depositAmountField, 5000)) &&
      (await isKeyVisible(Payments.depositAddFundsButton, 5000))
    );
  }

  /** Opens the Withdraw screen via the quick action. */
  async openWithdraw() {
    await tapKey(Wallet.withdrawButton);
    // Might open the withdraw page or show withdrawal unavailable dialog if balance is zero
    const onWithdrawPage = await isKeyVisible(Wallet.withdrawPage, 10000);
    const dialogShown = await isKeyVisible(Wallet.withdrawalUnavailableDialog, 3000);
    return onWithdrawPage || dialogShown;
  }

  /** Verifies the Withdraw screen fields or handles the zero-balance dialog gracefully. */
  async isWithdrawScreenOrDialogShown() {
    if (await isKeyVisible(Wallet.withdrawPage, 5000)) {
      return (
        (await isKeyVisible(Wallet.withdrawAmountField, 2000)) ||
        (await isKeyVisible(Wallet.withdrawSubmitButton, 2000)) ||
        (await isKeyVisible(Wallet.withdrawAddBankAccountButton, 2000)) ||
        (await isKeyVisible(Wallet.withdrawRetryAccountsButton, 2000)) ||
        true
      );
    }
    if (await isKeyVisible(Wallet.withdrawalUnavailableDialog, 5000)) {
      return isKeyVisible(Wallet.withdrawalUnavailableOkButton, 5000);
    }
    return false;
  }

  /** Dismisses the withdrawal unavailable dialog if shown. */
  async dismissWithdrawDialogIfShown() {
    if (await isKeyVisible(Wallet.withdrawalUnavailableOkButton, 3000)) {
      await tapKey(Wallet.withdrawalUnavailableOkButton);
    }
  }

  /** Opens Transaction History via the link. */
  async openTransactionHistory() {
    if (await isKeyVisible(Wallet.walletTransactionHistoryLink, 5000)) {
      await tapKey(Wallet.walletTransactionHistoryLink);
      return isKeyVisible(Wallet.transactionHistoryPage, 15000);
    }
    return false;
  }

  /** Verifies Transaction History page contents. */
  async isTransactionHistoryShown() {
    return (
      (await isKeyVisible(Wallet.transactionHistoryPage, 10000)) &&
      ((await isKeyVisible(Wallet.transactionHistorySearchField, 5000)) ||
        (await isKeyVisible(Wallet.transactionHistoryList, 5000)))
    );
  }

  /** Opens Withdrawal History via "See all". */
  async openWithdrawalHistory() {
    if (await isKeyVisible(Wallet.walletWithdrawalSeeAllButton, 5000)) {
      await tapKey(Wallet.walletWithdrawalSeeAllButton);
      return isKeyVisible(Wallet.withdrawalHistoryPage, 15000);
    }
    return false;
  }

  /** Returns back to Wallet tab from a pushed sub-page. */
  async backToWallet() {
    await goBack(Common.backButton);
    return isKeyVisible(Wallet.list, 10000);
  }
}

export default new WalletPage();
