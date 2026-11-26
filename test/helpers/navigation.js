import * as Keys from './keys.js';
import { goBack, isKeyVisible, presentKeys } from './flutter.js';
import { dismissBlockingDialogs } from './dialogs.js';

const { Dashboard, SignIn, SignUp, VerifyOtp, AccountBlocked } = Keys;
/** Logged-out screens: Back there leads out of the app, so recovery stops. */
const AUTH_KEYS = [SignIn.page, SignUp.page, VerifyOtp.page, AccountBlocked.page, Keys.Splash.page];

/** Every static key string in keys.js (function keys are skipped). */
const ALL_KEYS = Object.values(Keys)
  .filter((group) => group && typeof group === 'object')
  .flatMap((group) => Object.values(group))
  .filter((v) => typeof v === 'string');

/** Keys that name a whole screen or overlay: enough to tell where the app is. */
const SCREEN_KEYS = [...new Set(ALL_KEYS.filter((k) => /_(page|dialog|sheet|list|tab)$/i.test(k)))];

/** Logs which screens / dialogs are showing. With PROBE_ALL=1 logs every visible key. */
export async function probeScreen(label = '') {
  const keys = process.env.PROBE_ALL === '1' ? [...new Set(ALL_KEYS)] : SCREEN_KEYS;
  const found = await presentKeys(keys);
  console.log(`🔎 Screen probe${label ? ` [${label}]` : ''}: ${found.join(', ') || '(no known key)'}`);
  return found;
}

/** True when the bottom nav bar is visible (= on a dashboard tab, nothing pushed). */
export function isOnDashboard(timeout = 1500) {
  return isKeyVisible(Dashboard.walletTab, timeout);
}

/**
 * Brings the app back to a dashboard tab: closes known pop-ups and presses
 * Back until the nav bar shows. Returns true on success. Never throws.
 */
export async function returnToDashboard(maxBacks = 4) {
  try {
    for (let i = 0; i <= maxBacks; i += 1) {
      await dismissBlockingDialogs().catch(() => {});
      if (await isOnDashboard()) return true;
      if ((await presentKeys(AUTH_KEYS)).length) return false; // logged out: session.js handles it
      if (i < maxBacks) await goBack().catch(() => browser.back());
    }
  } catch {
    /* ignore */
  }
  return false;
}
