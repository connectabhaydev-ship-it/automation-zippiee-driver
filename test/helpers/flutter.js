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
  } else {
    await browser.back();
  }
}

/**
 * Scrolls the scrollable element down by `dy` pixels (negative = scroll down / swipe up).
 */
export async function scrollDown(scrollableKey, dy = -350) {
  try {
    const el = await waitKey(scrollableKey, 5000);
    await browser.execute('flutter:scroll', el, {
      dx: 0,
      dy: dy,
      durationMilliseconds: 300,
      frequency: 60,
    });
    await browser.pause(500);
  } catch {
    try {
      const { width, height } = await browser.getWindowSize();
      const midX = Math.round(width / 2);
      const startY = Math.round(height * 0.7);
      const endY = Math.round(height * 0.35);
      await browser
        .action('pointer')
        .move({ x: midX, y: startY })
        .down()
        .pause(100)
        .move({ duration: 400, x: midX, y: endY })
        .up()
        .perform();
      await browser.pause(500);
    } catch {}
  }
}

/**
 * Scrolls the scrollable element up by `dy` pixels (positive = scroll up / swipe down).
 */
export async function scrollUp(scrollableKey, dy = 350) {
  try {
    const el = await waitKey(scrollableKey, 5000);
    await browser.execute('flutter:scroll', el, {
      dx: 0,
      dy: dy,
      durationMilliseconds: 300,
      frequency: 60,
    });
    await browser.pause(500);
  } catch {
    try {
      const { width, height } = await browser.getWindowSize();
      const midX = Math.round(width / 2);
      const startY = Math.round(height * 0.35);
      const endY = Math.round(height * 0.7);
      await browser
        .action('pointer')
        .move({ x: midX, y: startY })
        .down()
        .pause(100)
        .move({ duration: 400, x: midX, y: endY })
        .up()
        .perform();
      await browser.pause(500);
    } catch {}
  }
}

/**
 * Repeatedly checks for targetKey, scrolling down if not visible.
 */
export async function scrollUntilKeyVisible(scrollableKey, targetKey, maxScrolls = 4, dy = -350) {
  for (let i = 0; i < maxScrolls; i++) {
    if (await isKeyVisible(targetKey, 1000)) return true;
    await scrollDown(scrollableKey, dy);
  }
  return isKeyVisible(targetKey, 2000);
}
