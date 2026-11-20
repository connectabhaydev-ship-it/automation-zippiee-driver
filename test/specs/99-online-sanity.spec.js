// Sanity test to verify driver can go online and offline via toggle
import HomePage from '../pages/home.page.js';

describe('99 Online Toggle Sanity', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('should set driver online', async () => {
    const result = await HomePage.goOnline();
    expect(result).toBe(true);
    // verify UI shows online state via label text or toggle color if needed
  });

  it('should set driver offline', async () => {
    const result = await HomePage.goOffline();
    expect(result).toBe(true);
  });
});
