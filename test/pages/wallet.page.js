import { isKeyVisible, tapKey } from '../helpers/flutter.js';
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
}

export default new WalletPage();
