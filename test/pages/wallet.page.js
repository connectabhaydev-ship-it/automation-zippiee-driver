import { goBack, isKeyVisible, tapKey } from '../helpers/flutter.js';
import { Dashboard, Wallet } from '../helpers/keys.js';

class WalletPage {
  async open() {
    await tapKey(Dashboard.walletTab);
    return isKeyVisible(Wallet.list, 20000);
  }

  async isBalanceCarouselVisible() {
    return isKeyVisible(Wallet.balanceCarousel, 10000);
  }

  async isBalanceCardVisible(card = 'total', timeout = 10000) {
    return (
      (await isKeyVisible(Wallet.balanceCard(card), timeout)) ||
      (await isKeyVisible(Wallet.visibilityToggle(card), 2000))
    );
  }

  /** Taps the eye icon on a balance card (show / hide the amount). */
  async toggleBalance(card = 'total', timeout = 10000) {
    await tapKey(Wallet.visibilityToggle(card), timeout);
  }

  async areQuickActionsVisible() {
    return (
      (await isKeyVisible(Wallet.depositButton)) && (await isKeyVisible(Wallet.withdrawButton))
    );
  }

  async isBreakdownCardVisible(type) {
    return isKeyVisible(Wallet.breakdownCard(type), 3000);
  }

  async areBreakdownCardsVisible() {
    for (const type of ['walletEarnings', 'tips', 'cashOnDelivery']) {
      if (!(await isKeyVisible(Wallet.breakdownCard(type), 2000))) return false;
    }
    return true;
  }

  async isWithdrawalSeeAllVisible() {
    return isKeyVisible(Wallet.withdrawalSeeAllButton, 3000);
  }

  async openWithdrawalHistory() {
    if (await this.isWithdrawalSeeAllVisible()) {
      await tapKey(Wallet.withdrawalSeeAllButton);
      return isKeyVisible(Wallet.withdrawalHistoryPage, 10000);
    }
    return false;
  }

  async isWithdrawalHistoryShown(timeout = 5000) {
    return isKeyVisible(Wallet.withdrawalHistoryPage, timeout);
  }

  async isWithdrawalUnavailableDialogShown(timeout = 3000) {
    return isKeyVisible(Wallet.withdrawalUnavailableDialog, timeout);
  }

  async dismissWithdrawalUnavailableDialog() {
    if (await isKeyVisible(Wallet.withdrawalUnavailableOkButton, 2000)) {
      await tapKey(Wallet.withdrawalUnavailableOkButton);
    }
  }

  async isEmiTrackingPageShown(timeout = 5000) {
    return isKeyVisible(Wallet.emiTrackingPage, timeout);
  }

  async isTransactionDetailsPageShown(timeout = 5000) {
    return isKeyVisible(Wallet.transactionDetailsPage, timeout);
  }

  async back() {
    await goBack();
  }
}

export default new WalletPage();
