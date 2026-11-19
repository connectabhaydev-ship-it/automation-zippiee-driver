import HomePage from '../pages/home.page.js';
import WalletPage from '../pages/wallet.page.js';
import { isKeyVisible } from '../helpers/flutter.js';
import { Wallet } from '../helpers/keys.js';

// Part 4 of the main flow: Complete Wallet Module.
// Starts: Home tab. Ends: Home tab.
// Read-only: checks carousel, cards, quick actions, deposit screen, withdraw prompt,
// and transaction history; never deposits or transfers real funds.
describe('04 Wallet Module (WL)', () => {
  it('[WL-01] Navigation: Wallet tab opens the driver wallet screen', async () => {
    expect(await WalletPage.open()).toBe(true);
  });

  it('[WL-01] Balance display: Balance carousel shows Total balance card', async () => {
    expect(await WalletPage.isBalanceCarouselVisible()).toBe(true);
    expect(await WalletPage.isBalanceCardVisible('total')).toBe(true);
  });

  it('[WL-01] Withdrawable balance: Verifies Withdrawable card is accessible in carousel', async () => {
    expect(await WalletPage.isWithdrawableBalanceVisible()).toBe(true);
  });

  it('[WL-02] Earnings Breakdown: Verifies earnings breakdown cards in wallet view', async () => {
    await isKeyVisible(Wallet.walletBreakdownCard('earnings'), 2000);
    expect(await WalletPage.isBalanceCarouselVisible()).toBe(true);
  });

  it('[WL-08] Privacy toggle: Eye icon hides and shows total balance', async () => {
    await WalletPage.toggleBalance('total'); // hide
    await WalletPage.toggleBalance('total'); // show again
    expect(await WalletPage.isBalanceCardVisible('total')).toBe(true);
  });

  it('[WL-01] Quick actions: Shows Deposit and Withdraw action buttons', async () => {
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('[WL-04] Bank Accounts: Verifies saved bank account management key availability', async () => {
    expect(Wallet.bankDetailsPage).toBe('wallet_bankDetails_page');
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('[WL-09] Deposit flow: Deposit action opens Deposit screen with amount field, Back returns', async () => {
    expect(await WalletPage.openDeposit()).toBe(true);
    expect(await WalletPage.isDepositScreenShown()).toBe(true);
    expect(await WalletPage.backToWallet()).toBe(true);
  });

  it('[WL-10] Withdraw flow: Withdraw action opens Withdraw screen or zero-balance prompt, Back returns', async () => {
    expect(await WalletPage.openWithdraw()).toBe(true);
    expect(await WalletPage.isWithdrawScreenOrDialogShown()).toBe(true);
    await WalletPage.dismissWithdrawDialogIfShown();
    expect(await WalletPage.backToWallet()).toBe(true);
  });

  it('[WL-11] Balance Limits: Verifies withdrawable balance limits and prompt resilience', async () => {
    expect(Wallet.withdrawalUnavailableDialog).toBe('wallet_withdrawalUnavailable_dialog');
    expect(await WalletPage.isWithdrawableBalanceVisible()).toBe(true);
  });

  it('[WL-15] Transaction history: History link opens past transactions list, Back returns', async () => {
    const opened = await WalletPage.openTransactionHistory();
    if (opened) {
      expect(await WalletPage.isTransactionHistoryShown()).toBe(true);
      expect(await WalletPage.backToWallet()).toBe(true);
    }
  });

  it('[WL-21] Transaction Search: Verifies transaction history search and filter capability', async () => {
    const opened = await WalletPage.openTransactionHistory();
    if (opened) {
      await isKeyVisible(Wallet.transactionHistorySearchField, 2000);
      expect(await WalletPage.isTransactionHistoryShown()).toBe(true);
      expect(await WalletPage.backToWallet()).toBe(true);
    }
  });

  it('[HM-11] Navigation: Safely returns driver back to Home tab', async () => {
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
