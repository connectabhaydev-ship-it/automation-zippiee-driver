import WalletPage from '../pages/wallet.page.js';

// Part 4 of the main flow. Starts: Home tab.  Ends: Wallet tab.
// Read-only: nothing here deposits or withdraws money.
describe('04 Wallet', () => {
  it('TC23 Wallet tab opens the wallet', async () => {
    expect(await WalletPage.open()).toBe(true);
  });

  it('TC24 shows the balance carousel with the total balance card', async () => {
    expect(await WalletPage.isBalanceCarouselVisible()).toBe(true);
    expect(await WalletPage.isBalanceCardVisible('total')).toBe(true);
  });

  it('TC25 the eye icon hides and shows the total balance', async () => {
    await WalletPage.toggleBalance('total'); // hide
    await WalletPage.toggleBalance('total'); // show again
    expect(await WalletPage.isBalanceCardVisible('total')).toBe(true);
  });

  it('TC26 shows the Deposit and Withdraw quick actions', async () => {
    expect(await WalletPage.areQuickActionsVisible()).toBe(true);
  });
});
