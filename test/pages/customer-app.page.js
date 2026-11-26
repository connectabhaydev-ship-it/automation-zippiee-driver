import { TestData } from '../helpers/test-data.js';

/**
 * Customer app ("Zippiee Staging", dev.zippiee.android) driven in the SAME
 * Appium session as the driver app.
 *
 * The customer build has no Appium Flutter server, so it can't be found by
 * Flutter keys. The Flutter Integration driver passes every non-Flutter locator
 * (here: `android=` UiSelector) to UiAutomator2, which reads the app's
 * accessibility labels (content-desc). Flutter merges a widget's texts into
 * one label joined by new lines, e.g. "Place order\n₦4,058.43", so lookups
 * use "contains" / "starts with" on those labels.
 *
 * Needs: the customer app installed on the phone and ALREADY LOGGED IN with a
 * saved delivery address (the test never logs it in or out).
 */

const byDesc = (text) => `android=new UiSelector().descriptionContains("${text}")`;
const byDescStart = (text) => `android=new UiSelector().descriptionStartsWith("${text}")`;
const byDescRegex = (regex) => `android=new UiSelector().descriptionMatches("${regex}")`;

// Lookups often match several widgets (e.g. two restaurant rows) and this
// WebdriverIO version refuses `$()` on multiple matches, so always take the
// first element of `$$()`.
async function first(selector) {
  const els = await $$(selector);
  return els.length ? els[0] : null;
}

async function isShown(selector, timeout = 5000) {
  const end = Date.now() + timeout;
  for (;;) {
    if (await first(selector)) return true;
    if (Date.now() >= end) return false;
    await browser.pause(300);
  }
}

async function tap(selector, timeout = 10000) {
  if (!(await isShown(selector, timeout))) throw new Error(`Customer app: not found ${selector}`);
  await (await first(selector)).click();
}

/** Taps an element near its TOP edge (big cards can sit under the bottom tab bar). */
async function tapTopOf(el) {
  const r = await browser.getElementRect(el.elementId);
  await browser.execute('mobile: clickGesture', {
    x: Math.round(r.x + r.width / 2),
    y: Math.round(r.y + Math.min(r.height / 2, 80)),
  });
}

/**
 * Slow swipe (no fling): a fast swipe keeps the Flutter list scrolling past
 * the target. `direction` 'up' moves the content up (shows what's below).
 */
async function gentleSwipe(direction = 'up', percent = 0.5) {
  const { width, height } = await browser.getWindowSize();
  await browser.execute('mobile: swipeGesture', {
    left: Math.round(width * 0.1), top: Math.round(height * 0.4),
    width: Math.round(width * 0.8), height: Math.round(height * 0.3),
    direction, percent, speed: 600,
  });
  await browser.pause(700); // let the list settle before reading positions
}

const swipeUp = () => gentleSwipe('up', 0.6);

/** Scrolls the customer screen until the selector exists (max `swipes`). */
async function scrollTo(selector, swipes = 6) {
  for (let i = 0; i <= swipes; i += 1) {
    if (await isShown(selector, 1500)) return true;
    await swipeUp();
  }
  return false;
}

/** All accessibility labels currently on screen, joined (for status checks). */
async function screenText() {
  const xml = await browser.getPageSource();
  return [...xml.matchAll(/content-desc="([^"]*)"/g)]
    .map((m) => m[1].replace(/&#10;/g, '\n').replace(/&amp;/g, '&'))
    .join('\n');
}

class CustomerAppPage {
  /**
   * Restarts the customer app so it always starts on Home, whatever screen it
   * was left on (restaurant page, tracking, cart…).
   */
  async open() {
    await browser.execute('mobile: terminateApp', { appId: TestData.customerAppPackage });
    await browser.execute('mobile: activateApp', { appId: TestData.customerAppPackage });
    return isShown(byDesc('DELIVERING TO YOU'), 30000);
  }

  /** Switches back to the driver app (Flutter session target). */
  async switchToDriverApp() {
    await browser.execute('mobile: activateApp', { appId: TestData.driverAppPackage });
    await browser.pause(1500);
  }

  /** "No drivers nearby" banner: the backend sees no ONLINE driver near the restaurant. */
  async isNoDriversBannerShown(timeout = 3000) {
    return isShown(byDesc('No drivers nearby'), timeout);
  }

  /**
   * Opens the restaurant named in CUSTOMER_RESTAURANT (must be the one logged
   * in to the Restaurant Partner panel), or the first one in
   * "N RESTAURANTS DELIVERING TO YOU" when not set. Returns its name.
   */
  async openFirstRestaurant() {
    // List rows read "<name>\n<rating>\n<x> mins | <y> km". On Home only those
    // rows START with the restaurant name (deal cards start with the rating).
    const row = TestData.restaurantName
      ? byDescStart(TestData.restaurantName.replace(/"/g, '\\"'))
      : byDescRegex('(?s).*mins [|] .*km.*');
    if (!(await scrollTo(row))) {
      throw new Error(
        TestData.restaurantName
          ? `Customer app: restaurant "${TestData.restaurantName}" is not delivering to this address (closed / offline in the panel?)`
          : 'Customer app: no restaurant delivering to this address',
      );
    }
    const el = await this.bringIntoTapZone(row);
    const label = await el.getAttribute('content-desc');
    await tapTopOf(el);
    if (!(await isShown(byDesc('View Map'), 15000))) {
      throw new Error(`Customer app: restaurant page did not open (${label.split('\n')[0]})`);
    }
    return label.split('\n')[0].trim();
  }

  /**
   * Makes sure the element's tap point (near its top edge) is on screen and
   * NOT under the bottom tab bar or the top bar; scrolls a little up/down only
   * when needed. Returns the element.
   */
  async bringIntoTapZone(selector) {
    const { height } = await browser.getWindowSize();
    const minY = height * 0.12; // below the status/top bar
    const maxY = height * 0.85; // above the bottom tab bar
    let lastDirection = 'up';
    for (let i = 0; i < 6; i += 1) {
      const el = await first(selector);
      if (el) {
        const r = await browser.getElementRect(el.elementId);
        const tapY = r.y + Math.min(r.height / 2, 80);
        if (tapY >= minY && tapY <= maxY) return el;
        lastDirection = tapY > maxY ? 'up' : 'down';
        await gentleSwipe(lastDirection, 0.5);
      } else {
        // Overshot: scroll back the other way a little.
        await gentleSwipe(lastDirection === 'up' ? 'down' : 'up', 0.4);
      }
    }
    throw new Error(`Customer app: could not bring ${selector} into a tappable position`);
  }

  /** On the restaurant page this turns true when no driver is available. */
  async isRestaurantWaitingForDrivers() {
    return this.isNoDriversBannerShown(2000);
  }

  /** Adds the first available menu item (first required option, no extras). */
  async addFirstItem() {
    const add = byDescRegex('(?s)Add.Add.*'); // label "Add\nAdd +"
    if (!(await scrollTo(add))) throw new Error('Customer app: no "Add" button on the menu');
    await tap(add);
    // Customisation sheet: required size etc. The Add button shows the price.
    if (await isShown(byDescStart('Add ₦'), 5000)) {
      const firstRadio = await first('android=new UiSelector().className("android.widget.RadioButton")');
      if (firstRadio && (await firstRadio.getAttribute('checked')) !== 'true') {
        await firstRadio.click();
      }
      await tap(byDescStart('Add ₦'));
    }
    return isShown(byDesc('item added'), 10000);
  }

  /** "Continue" in the cart bar → checkout. */
  async openCheckout() {
    await tap(byDesc('Continue'));
    return isShown(byDescStart('Place order'), 15000);
  }

  /** Checkout pays with cash (COD)? */
  async isCashOnDeliverySelected() {
    return (await isShown(byDesc('Pay using cash'), 3000)) || isShown(byDesc('COD'), 1000);
  }

  /**
   * Places the order. Returns { orderId, pin } read from the "Order Placed"
   * screen (pin = 4-digit delivery code the driver must enter).
   */
  async placeOrder() {
    await tap(byDescStart('Place order'));
    if (!(await isShown(byDesc('Your Order ID'), 30000))) {
      throw new Error('Customer app: "Order Placed" screen did not appear');
    }
    return this.readOrderInfo();
  }

  /** Reads order ID and delivery PIN from the Order Placed / tracking screen. */
  async readOrderInfo() {
    const text = await screenText();
    const orderId = (text.match(/#\s?(ZP-[A-Z0-9]+)/) || [])[1] || '';
    // "…Share PIN with your Delivery Partner\n1\n2\n3\n4" (tracking) or
    // "…Delivery Partner\n1 2 3 4" (Home card).
    const pinBlock = (text.match(/PIN with your Delivery Partner\s*((?:\d\s*){4})/) || [])[1] || '';
    const pin = pinBlock.replace(/\D/g, '').slice(0, 4);
    return { orderId, pin };
  }

  /** Opens tracking for the order just placed (Order Placed → Track Order). */
  async openTracking() {
    if (await isShown(byDesc('Track Order'), 3000)) await tap(byDesc('Track Order'));
    return isShown(byDesc('Your PIN'), 15000);
  }

  /**
   * Waits until the tracking screen text matches `regex` (the app updates it
   * live). Returns the matching text or ''.
   */
  async waitForStatus(regex, timeout = 60000) {
    const end = Date.now() + timeout;
    for (;;) {
      const text = await screenText();
      const hit = text.match(regex);
      if (hit) return hit[0];
      if (Date.now() >= end) return '';
      await browser.pause(2000);
    }
  }

  /** Brings the customer app to the front where it was left (e.g. tracking). */
  async bringToFront() {
    await browser.execute('mobile: activateApp', { appId: TestData.customerAppPackage });
    await browser.pause(1500);
  }

  /** Waits until `regex` is NO LONGER on screen. True when it went away. */
  async waitForStatusGone(regex, timeout = 60000) {
    const end = Date.now() + timeout;
    for (;;) {
      if (!regex.test(await screenText())) return true;
      if (Date.now() >= end) return false;
      await browser.pause(2000);
    }
  }

  /** Tracking header text (status + sub status) for logs. */
  async currentStatus() {
    const text = await screenText();
    return text.split('\n').slice(0, 6).join(' | ');
  }
}

export default new CustomerAppPage();
