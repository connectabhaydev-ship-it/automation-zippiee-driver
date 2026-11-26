// Strategies supported by the Flutter Integration driver
const KEY = '-flutter key';
const TEXT = '-flutter text';
const TEXT_CONTAINING = '-flutter text containing';
const SEMANTICS = '-flutter semantics label';
const TYPE = '-flutter type';

async function find(using, value) {
  const ref = await browser.findElement(using, value);
  if (!ref || ref.error) {
    throw new Error(`Flutter element not found: ${using} = "${value}"`);
  }
  return $(ref);
}

async function findAll(using, value) {
  const refs = await browser.findElements(using, value);
  return Promise.all(refs.map((ref) => $(ref)));
}

export const byKey = (key) => find(KEY, key);                 // ValueKey('...')
export const byText = (text) => find(TEXT, text);              // exact visible text
export const byTextContaining = (text) => find(TEXT_CONTAINING, text);
export const bySemantics = (label) => find(SEMANTICS, label);  // Semantics(label: ...)
export const byType = (type) => find(TYPE, type);              // widget class, e.g. 'TextField'
export const allByText = (text) => findAll(TEXT, text);

// Wait until a widget is on screen (driver-side wait)
export function waitForVisible(using, value, timeout = 10000) {
  return browser.execute('flutter: waitForVisible', { locator: { using, value }, timeout });
}

// Wait until a widget is gone (e.g. a sheet closed)
export function waitForAbsent(using, value, timeout = 10000) {
  return browser.execute('flutter: waitForAbsent', { locator: { using, value }, timeout });
}

export const strategy = { KEY, TEXT, TEXT_CONTAINING, SEMANTICS, TYPE };

// ---------- Key shortcuts (keys come from test/helpers/keys.js) ----------

// Waits are polled from here with plain find-elements calls instead of the
// server's `flutter: waitForVisible` / `waitForAbsent`. The server-side wait
// loop (appium_flutter_server ElementHelper.waitFor → pumpAndSettle) can hang
// forever when the element does NOT show up in time (seen on the idle sign-in
// screen in TC07 and on the OTP screen in TC10), which blocks every command
// after it ("Guarded function conflict" / "socket hang up").
// Flutter finds only match hit-testable widgets, i.e. what the user can see.

const POLL_MS = 250;

async function isPresent(key) {
  const refs = await browser.findElements(KEY, key);
  return Array.isArray(refs) && refs.length > 0;
}

/** Polls `condition` until it is true or `timeout` ms pass. Returns the last result. */
async function poll(condition, timeout) {
  const end = Date.now() + timeout;
  for (;;) {
    if (await condition()) return true;
    if (Date.now() >= end) return false;
    await browser.pause(POLL_MS);
  }
}

/** Waits for the key, then returns the element. Throws on timeout. */
export async function waitKey(key, timeout = 10000) {
  if (!(await poll(() => isPresent(key), timeout))) {
    throw new Error(`Flutter key "${key}" not visible after ${timeout} ms`);
  }
  return byKey(key);
}

/** Waits for the key and taps it. */
export async function tapKey(key, timeout = 10000) {
  await (await waitKey(key, timeout)).click();
}

/** Waits for the key and types into it (replaces the current text). */
export async function typeKey(key, text, timeout = 10000) {
  await (await waitKey(key, timeout)).setValue(text);
}

/** True when the key shows up within `timeout` ms; never throws. */
export async function isKeyVisible(key, timeout = 3000) {
  return poll(() => isPresent(key), timeout);
}

/** True when the key is gone (or goes away) within `timeout` ms. */
export async function isKeyGone(key, timeout = 3000) {
  return poll(async () => !(await isPresent(key)), timeout);
}

/**
 * Leaves a pushed page: taps the app's back button when it has one,
 * otherwise uses the system back (Android).
 */
export async function goBack(backKey = 'common_shared_backButton') {
  if (await isKeyVisible(backKey, 2000)) {
    await tapKey(backKey);
  } else if (
    (await isPresent(NAV_BAR_KEY)) || (await isPresent(SIGN_IN_KEY)) || (await isPresent(SPLASH_KEY))
  ) {
    // Root screen (dashboard tab / sign-in / splash): system Back would close the app.
    console.warn('ℹ️ goBack skipped – already on a root screen');
  } else {
    await browser.back();
  }
}

/** Bottom nav bar item: visible only on the dashboard tabs. */
const NAV_BAR_KEY = 'dashboard_navBar_walletTab';
/** Sign-in screen: the root of the logged-out app. */
const SIGN_IN_KEY = 'auth_signIn_page';
/** Splash screen: shown while the app waits for the backend. */
const SPLASH_KEY = 'splash_splash_page';

/**
 * Waits until ANY of the keys shows up. Returns the first key found, or null
 * on timeout. Use it where the app can go to one of several screens.
 */
export async function waitForAnyKey(keys, timeout = 10000) {
  let found = null;
  await poll(async () => {
    for (const key of keys) {
      if (await isPresent(key)) {
        found = key;
        return true;
      }
    }
    return false;
  }, timeout);
  return found;
}

// ---------- Visible-text shortcuts (for widgets that have no Flutter key) ----------

async function isTextPresent(text) {
  const refs = await browser.findElements(TEXT, text).catch(() => []);
  return Array.isArray(refs) && refs.length > 0;
}

/** True when a widget with exactly this visible text shows up within `timeout` ms. */
export async function isTextVisible(text, timeout = 3000) {
  return poll(() => isTextPresent(text), timeout);
}

/** Waits for the exact visible text and taps it. Throws on timeout. */
export async function tapText(text, timeout = 10000) {
  if (!(await isTextVisible(text, timeout))) {
    throw new Error(`Flutter text "${text}" not visible after ${timeout} ms`);
  }
  await (await byText(text)).click();
}

/** Waits until ANY of the texts shows up. Returns the first found, or null. */
export async function waitForAnyText(texts, timeout = 10000) {
  let found = null;
  await poll(async () => {
    for (const t of texts) {
      if (await isTextPresent(t)) {
        found = t;
        return true;
      }
    }
    return false;
  }, timeout);
  return found;
}

// ---------- Scrolling (off-screen list items are not built by Flutter) ----------

/**
 * One short, slow native swipe in the lower-middle of the screen (many pages
 * have a pinned header in the top half). dir 'up' = reveal content below.
 * A short step (~22% of the height) never jumps over a list tile.
 */
export async function swipe(dir = 'up', fraction = 0.22) {
  const { width, height } = await browser.getWindowSize();
  const x = Math.round(width / 2);
  const low = Math.round(height * 0.78);
  const high = Math.round(low - height * fraction);
  const [fromY, toY] = dir === 'up' ? [low, high] : [high, low];
  await browser.performActions([
    {
      type: 'pointer',
      id: 'finger',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x, y: fromY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 150 },
        { type: 'pointerMove', duration: 700, x, y: toY },
        { type: 'pause', duration: 150 }, // hold before release = no fling
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await browser.releaseActions().catch(() => {});
  await browser.pause(350);
}

/**
 * Scrolls until the key is on screen. Tries downwards first, then back up.
 * Returns true when found.
 */
export async function scrollToKey(key, { maxSwipes = 10, timeout = 1500 } = {}) {
  if (await isKeyVisible(key, timeout)) return true;
  for (const dir of ['up', 'down']) {
    for (let i = 0; i < maxSwipes; i += 1) {
      await swipe(dir);
      if (await isKeyVisible(key, 500)) return true;
    }
  }
  return false;
}

/** Scrolls to the key and taps it. Throws when it never shows up. */
export async function scrollAndTapKey(key, opts) {
  if (!(await scrollToKey(key, opts))) {
    throw new Error(`Flutter key "${key}" not found after scrolling`);
  }
  await tapKey(key);
}

// ---------- Diagnostics ----------

/** Returns which of `keys` are on screen right now (one quick check each). */
export async function presentKeys(keys) {
  const found = [];
  for (const key of keys) {
    if (await isPresent(key).catch(() => false)) found.push(key);
  }
  return found;
}
