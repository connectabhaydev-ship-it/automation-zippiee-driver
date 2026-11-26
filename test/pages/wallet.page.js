import { goBack, isKeyVisible, scrollToKey, swipe, tapKey } from '../helpers/flutter.js';
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
    await this.scrollToTop();
    return (
      (await isKeyVisible(Wallet.depositButton)) && (await isKeyVisible(Wallet.withdrawButton))
    );
  }

  async isBreakdownCardVisible(type) {
    return isKeyVisible(Wallet.breakdownCard(type), 3000);
  }

  /** The breakdown cards sit below the balance carousel: scrolls to each one. */
  async areBreakdownCardsVisible() {
    let ok = true;
    for (const type of ['walletEarnings', 'tips', 'cashOnDelivery']) {
      if (!(await scrollToKey(Wallet.breakdownCard(type), { maxSwipes: 4 }))) {
        console.warn(`⚠️ Breakdown card "${type}" not found`);
        ok = false;
      }
    }
    await this.scrollToTop();
    return ok;
  }

  async scrollToTop() {
    for (let i = 0; i < 4 && !(await isKeyVisible(Wallet.depositButton, 500)); i += 1) {
      await swipe('down');
    }
  }

  async isWithdrawalSeeAllVisible() {
    return scrollToKey(Wallet.withdrawalSeeAllButton, { maxSwipes: 4 });
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
