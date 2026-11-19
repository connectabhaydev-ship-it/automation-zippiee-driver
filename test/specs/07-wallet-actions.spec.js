import WalletActionsPage from '../pages/wallet-actions.page.js';
import WalletPage from '../pages/wallet.page.js';

// Part 7 of the main flow. Runs after 06-profile.
// References test cases: WL-10, WL-11, WL-17, WL-18, WL-19, WL-22 from manual-test-tracker.csv.
describe('07 Wallet Actions', () => {
  it('TC36 [WL-10, WL-11] opens the Withdraw page with amount field and submit action', async () => {
    expect(await WalletActionsPage.openWithdraw()).toBe(true);
    expect(await WalletActionsPage.isWithdrawSubmitVisible()).toBe(true);
  });

  it('TC37 [WL-10] Back leaves the Withdraw page and returns to the wallet', async () => {
    await WalletActionsPage.closeWithdraw();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC38 [WL-17, WL-19] opens the Deposit page with amount field and Add Funds action', async () => {
    expect(await WalletActionsPage.openDeposit()).toBe(true);
    expect(await WalletActionsPage.isDepositAddFundsVisible()).toBe(true);
  });

  it('TC39 [WL-18] Back leaves the Deposit page and returns to the wallet', async () => {
    await WalletActionsPage.closeDeposit();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC40 [WL-22] opens Transaction History from the wallet, Back returns', async () => {
    expect(await WalletActionsPage.openTransactionHistory()).toBe(true);
    await WalletActionsPage.closeTransactionHistory();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });
});
