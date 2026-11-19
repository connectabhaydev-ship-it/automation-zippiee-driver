import ReferEarnPage from '../pages/refer-earn.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 8 of the main flow. Runs from Profile.
// References test cases: RF-01, RF-02, RF-03, AS-13, AS-14 from manual-test-tracker.csv.
describe('08 Refer & Earn', () => {
  it('TC41 [RF-01] Refer & Earn tile opens the referral screen', async () => {
    expect(await ReferEarnPage.openFromProfile()).toBe(true);
  });

  it('TC42 [RF-02] shows the referral code text and copy button', async () => {
    expect(await ReferEarnPage.isReferralCodeVisible()).toBe(true);
    expect(await ReferEarnPage.isCopyButtonVisible()).toBe(true);
  });

  it('TC43 [RF-03] shows the share invite link button', async () => {
    expect(await ReferEarnPage.isShareButtonVisible()).toBe(true);
  });

  it('TC44 [RF-01] shows the earn per referral stats overview', async () => {
    expect(await ReferEarnPage.isStatsCardVisible()).toBe(true);
  });

  it('TC45 [RF-01] Back returns to the profile screen', async () => {
    await ReferEarnPage.back();
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });
});
