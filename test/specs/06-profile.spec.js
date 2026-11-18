import HomePage from '../pages/home.page.js';
import ProfilePage from '../pages/profile.page.js';

// Part 6 (last) of the main flow. Starts: Orders tab.  Ends: Home tab.
// Read-only: opens pages and comes back, changes nothing.
describe('06 Profile', () => {
  it('TC30 Profile tab opens the profile', async () => {
    expect(await ProfilePage.open()).toBe(true);
  });

  it('TC31 shows the Profile settings and Performance tiles', async () => {
    expect(await ProfilePage.areMainTilesVisible()).toBe(true);
  });

  it('TC32 Profile settings opens, Back returns to the profile', async () => {
    expect(await ProfilePage.openSettings()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('TC33 Performance shows the acceptance and rejection rates, Back returns', async () => {
    expect(await ProfilePage.openPerformance()).toBe(true);
    expect(await ProfilePage.arePerformanceRatesVisible()).toBe(true);
    expect(await ProfilePage.back()).toBe(true);
  });

  it('TC34 Home tab brings back the home screen', async () => {
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });

  it('TC35 the avatar opens the profile, Home tab comes back', async () => {
    expect(await HomePage.openProfileFromAvatar()).toBe(true);
    await HomePage.openHomeTab();
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
