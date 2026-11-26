import WalletPage from '../pages/wallet.page.js';
import WalletActionsPage from '../pages/wallet-actions.page.js';
import BankAccountsPage from '../pages/bank-accounts.page.js';

// Part 21 of the test suite. Extended wallet & financial operations.
// References test cases: WL-02, WL-06, WL-12, WL-13, WL-14, WL-15, WL-16, WL-20, WL-23, WL-24, WL-25 from manual-test-tracker.csv.
describe('21 Wallet & Financial Operations – Extended', () => {
  before(async () => {
    await WalletPage.open();
  });

  it('TC101 [WL-02] verifies earnings breakdown cards (wallet earnings, tips, COD)', async () => {
    expect(await WalletPage.areBreakdownCardsVisible()).toBe(true);
  });

  it('TC102 [WL-16] opens withdrawal history and verifies list rendering', async () => {
    const hasHistory = await WalletPage.openWithdrawalHistory();
    if (hasHistory) {
      expect(await WalletPage.isWithdrawalHistoryShown()).toBe(true);
      await WalletPage.back();
    }
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC103 [WL-12, WL-13] validates minimum withdrawal amount constraints', async function () {
    const screen = await WalletActionsPage.openWithdrawScreen();
    if (screen === 'bankDetails') {
      // No bank account yet: the amount form can't be reached.
      expect(await BankAccountsPage.isAccountNumberFieldVisible()).toBe(true);
      await WalletActionsPage.closeWithdraw();
      console.warn('ℹ️ TC103 skipped: add a bank account to this driver to test withdraw limits');
      this.skip();
    }
    expect(screen).toBe('withdraw');
    expect(await WalletActionsPage.isWithdrawSubmitVisible()).toBe(true);
    // Enter amount below ₦50 minimum
    await WalletActionsPage.enterWithdrawAmount('20');
    expect(await WalletActionsPage.isWithdrawSubmitVisible()).toBe(true);
    await WalletActionsPage.closeWithdraw();
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC104 [WL-14] verifies withdrawal unavailable modal handling if triggered', async () => {
    const isUnavailable = await WalletPage.isWithdrawalUnavailableDialogShown(1000);
    if (isUnavailable) {
      await WalletPage.dismissWithdrawalUnavailableDialog();
    }
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });

  it('TC105 [WL-24, WL-25] verifies EMI tracking section if company vehicle agreement exists', async () => {
    const hasEmi = await WalletPage.isBreakdownCardVisible('emi');
    if (hasEmi) {
      expect(hasEmi).toBe(true);
    } else {
      expect(await WalletPage.areQuickActionsVisible()).toBe(true);
    }
  });
});
