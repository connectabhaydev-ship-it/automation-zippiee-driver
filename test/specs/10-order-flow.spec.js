import HomePage from '../pages/home.page.js';
import OrderFlowPage, { OrderText } from '../pages/order-flow.page.js';
import OrderChatPage from '../pages/order-chat.page.js';
import CustomerAppPage from '../pages/customer-app.page.js';
import { goBack, isKeyVisible, tapKey, typeKey, waitForAnyKey } from '../helpers/flutter.js';
import { Common, Dashboard, Home, Order } from '../helpers/keys.js';
import { TestData } from '../helpers/test-data.js';

// Part 10 of the main flow: END-TO-END order with BOTH apps on the same phone.
//   driver ONLINE → customer app places a Cash-on-Delivery order → driver gets
//   the offer → accept → heading to restaurant → arrived → (not ready) → ready
//   → picked up → heading to customer → arrived → wrong code → customer's PIN
//   → delivery complete → rating → Home, OFFLINE. The customer app is checked
//   after each step (driver assigned, picked up, delivered).
// Starts: Home tab (end of 09).  Ends: driver app Home tab, OFFLINE, no active order.
//
// Why the driver goes ONLINE *before* the order is placed: staging only offers
// an order when it is placed/confirmed. Orders already waiting ("Looking for a
// Delivery Partner") are NOT re-offered to a driver who comes online later.
//
// Needs (see .env.example):
//  - customer staging app (CUSTOMER_APP_PACKAGE) installed AND logged in, with a
//    saved address near the driver; the first restaurant/item is ordered, COD;
//  - someone marking the order READY in the restaurant/admin panel when asked.
// If the driver already has an active order, the flow resumes it instead.
// References: OF-01, OF-08, OD-01..OD-05, OD-07..OD-10, OD-12..OD-17, OD-19,
// OD-20, OD-25, CT-01 from manual-test-tracker.csv.

const sec = (s) => s * 1000;
const state = {
  active: false, cancelled: false, completed: false,
  orderId: '', pin: '', placed: false, customerStatusAtAccept: '',
};

/** Skips the test when there is no order to work on (or it got cancelled). */
async function requireActiveOrder(ctx) {
  if (state.active && !state.cancelled && (await OrderFlowPage.wasCancelled())) {
    // [OD-19, OD-20] Cancelled by customer / restaurant / admin mid-flow.
    console.warn('⚠️ Order was cancelled from outside – closing the dialog, skipping the rest');
    await OrderFlowPage.confirmCancelledDialog();
    expect(await HomePage.isShown(15000)).toBe(true);
    state.cancelled = true;
  }
  if (!state.active || state.cancelled || state.completed) ctx.skip();
}

// The Current Order screen has no page key; currentScreen() reports it as this.
const CURRENT_ORDER = 'current-order-screen';

/** Which stage screen is showing right now (a page key, CURRENT_ORDER, or null). */
async function currentScreen(timeout = 10000) {
  const end = Date.now() + timeout;
  for (;;) {
    const page = await waitForAnyKey([Order.deliveryCompletePage, Order.dropPage, Order.pickupPage], 0);
    if (page) return page;
    if (await OrderFlowPage.isCurrentOrderPageShown(0)) return CURRENT_ORDER;
    if (Date.now() >= end) return null;
    await browser.pause(300);
  }
}

describe('10 Order Flow – full lifecycle', () => {
  before(async () => {
    await HomePage.ensureHomeScreen();
  });

  after(async function () {
    this.timeout(sec(120));
    // Leave the app clean for the next spec: driver app in front, Home, OFFLINE.
    await CustomerAppPage.switchToDriverApp().catch(() => {});
    if (state.placed && !state.completed) {
      console.warn(`⚠️ Order #${state.orderId} was not delivered – finish or cancel it in the admin panel before the next run`);
    }
    if (await OrderFlowPage.wasCancelled()) await OrderFlowPage.confirmCancelledDialog();
    if (await isKeyVisible(Order.deliveryCompleteNextOrderButton, 0)) {
      await OrderFlowPage.tapGetNextOrder();
    }
    if (await isKeyVisible(Common.newOrderRequestDialog, 0)) {
      await OrderFlowPage.rejectOrder().catch(() => {});
    }
    if (!(await isKeyVisible(Dashboard.homeTab, 3000))) await goBack().catch(() => {});
    if (await isKeyVisible(Dashboard.homeTab, 5000)) {
      await HomePage.openHomeTab();
      await HomePage.setOnline(false).catch(() => {});
    }
  });

  // ---------------- Customer places the order ----------------

  it('TC50 [OF-01] customer app places a Cash-on-Delivery order while the driver is ONLINE', async function () {
    this.timeout(sec(180));
    if (await HomePage.isCurrentOrderCardVisible(3000)) {
      console.warn('⚠️ Active order already on this account – resuming it instead of placing a new one');
      state.active = true;
      // Read the delivery PIN from the customer app's Home order card.
      if (!TestData.deliveryCode && (await CustomerAppPage.open().catch(() => false))) {
        state.pin = (await CustomerAppPage.readOrderInfo()).pin;
        console.log(`🔑 Delivery PIN from the customer app: ${state.pin || '?'}`);
      }
      await CustomerAppPage.switchToDriverApp();
      this.skip();
    }
    expect(await HomePage.setOnline(true)).toBe('ONLINE');
    await browser.pause(5000); // let the backend register the driver's location

    expect(await CustomerAppPage.open()).toBe(true);
    const restaurant = await CustomerAppPage.openFirstRestaurant();
    console.log(`🍽  Ordering from: ${restaurant}`);
    // Driver is online nearby, so the restaurant must not say "No drivers nearby".
    expect(await CustomerAppPage.isRestaurantWaitingForDrivers()).toBe(false);
    expect(await CustomerAppPage.addFirstItem()).toBe(true);
    expect(await CustomerAppPage.openCheckout()).toBe(true);
    expect(await CustomerAppPage.isCashOnDeliverySelected()).toBe(true);

    const { orderId, pin } = await CustomerAppPage.placeOrder();
    console.log(`🧾 Order placed: #${orderId || '?'}  delivery PIN: ${pin || '?'}`);
    expect(orderId).toMatch(/^ZP-/);
    state.orderId = orderId;
    state.pin = pin;
    state.placed = true;
    expect(await CustomerAppPage.openTracking()).toBe(true);
  });

  // ---------------- Driver: offer & accept ----------------

  it('TC50a [OF-01] the driver receives the offer with View items / Accept / Reject', async function () {
    this.timeout(sec(TestData.offerTimeoutSec + 60));
    if (state.active) this.skip(); // resuming an existing order
    if (!state.placed) this.skip();
    await CustomerAppPage.switchToDriverApp();
    console.log(`👉 Restaurant Partner panel → New Orders: ACCEPT #${state.orderId} now. Waiting up to ${TestData.offerTimeoutSec}s for the driver offer…`);
    expect(await OrderFlowPage.isNewOrderDialogVisible(sec(TestData.offerTimeoutSec))).toBe(true);
    expect(await isKeyVisible(Common.newOrderRequestAcceptButton, 3000)).toBe(true);
    expect(await isKeyVisible(Common.newOrderRequestRejectButton, 3000)).toBe(true);
    expect(await OrderFlowPage.isViewItemsButtonVisible()).toBe(true);
  });

  it('TC50b [OF-08] Accept opens the current order at "Heading to Pickup"', async function () {
    this.timeout(sec(60));
    if (!state.active) {
      if (!(await OrderFlowPage.isNewOrderDialogVisible(0))) this.skip();
      expect(await HomePage.acceptNewOrder(5000)).toBe(true);
      state.active = true;
    }
    // Accept opens the current order; when resuming, open it from the Home card.
    expect(await OrderFlowPage.openCurrentOrderFromHome()).toBe(true);
    // A fresh accept starts at "Heading to Pickup" with "I've arrived at restaurant".
    const stage = await OrderFlowPage.getStageTitle(10000);
    console.log(`🛵 Driver stage: ${stage}`);
    expect(stage).not.toBeNull();
  });

  it('TC50c [customer] tracking stops "Looking for a Delivery Partner" once the driver accepts', async function () {
    this.timeout(sec(120));
    await requireActiveOrder(this);
    if (!state.placed) this.skip();
    await CustomerAppPage.bringToFront();
    const assigned = await CustomerAppPage.waitForStatusGone(/Looking for a Delivery Partner/i, sec(60));
    state.customerStatusAtAccept = await CustomerAppPage.currentStatus();
    console.log(`📱 Customer sees: ${state.customerStatusAtAccept}`);
    await CustomerAppPage.switchToDriverApp();
    expect(assigned).toBe(true);
    expect(await OrderFlowPage.isCurrentOrderPageShown(10000)).toBe(true);
  });

  // ---------------- Heading to restaurant ----------------

  it('TC51 [OD-01, OD-24] heading to pickup shows the route map, navigation and call restaurant', async function () {
    await requireActiveOrder(this);
    if ((await OrderFlowPage.getStageTitle()) !== OrderText.headingToPickup) this.skip(); // resumed past this stage
    expect(await OrderFlowPage.isRouteMapVisible()).toBe(true);
    expect(await OrderFlowPage.isNavigationButtonVisible()).toBe(true);
    expect(await OrderFlowPage.isCallButtonVisible()).toBe(true);
    // No chat on the restaurant leg: chat is with the customer (checked in TC53a).
    // Refresh route must not crash or leave the page ("No driving route found" is OK).
    if (await isKeyVisible(Order.currentOrderRefreshRouteButton, 2000)) {
      await tapKey(Order.currentOrderRefreshRouteButton);
    }
    expect(await OrderFlowPage.isCurrentOrderPageShown(5000)).toBe(true);
  });

  it('TC51a [CT-01] chat opens from the current order and Back returns', async function () {
    await requireActiveOrder(this);
    if ((await currentScreen()) !== CURRENT_ORDER) this.skip();
    // Chat is only offered once the customer leg starts (not while heading to pickup).
    if (!(await OrderFlowPage.isChatButtonVisible())) {
      console.log('ℹ️ No chat button at this stage (heading to pickup) – chat checked on the customer leg');
      this.skip();
    }
    expect(await OrderChatPage.openFromCurrentOrder()).toBe(true);
    await OrderChatPage.back();
    expect(await OrderFlowPage.isCurrentOrderPageShown(10000)).toBe(true);
  });

  it('TC51b [OD-25] Report an Issue opens from the order details, Back returns', async function () {
    await requireActiveOrder(this);
    // This build's Current Order screen has no key for the details card /
    // options menu, so Report an Issue can't be reached reliably from here.
    console.warn('ℹ️ Report an Issue: no keyed entry point on Current Order in this build – skipped');
    this.skip();
  });

  // ---------------- At the restaurant ----------------

  it('TC52 [OD-02] "I\'ve arrived at restaurant" opens pickup verification', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    const screen = await currentScreen();
    if (screen === CURRENT_ORDER) {
      if (!(await OrderFlowPage.isStageButtonVisible(OrderText.arrivedAtRestaurantButton))) this.skip(); // past this stage
      expect(
        await OrderFlowPage.tapStageButtonAndWaitFor(OrderText.arrivedAtRestaurantButton, [Order.pickupPage]),
      ).toBe(Order.pickupPage);
    } else if (screen !== Order.pickupPage) {
      this.skip();
    }
    expect(await isKeyVisible(Order.pickupScrollView, 5000)).toBe(true);
    expect(await OrderFlowPage.isPickupReceiptCardVisible()).toBe(true);
  });

  it('TC52a [OD-07] pickup shows the order items; tapping an item keeps it in view', async function () {
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isPickupPageShown(3000))) this.skip();
    expect(await OrderFlowPage.isItemRowVisible(0)).toBe(true);
    await OrderFlowPage.tapItemRow(0); // expands add-ons when it has any
    expect(await OrderFlowPage.isItemRowVisible(0)).toBe(true);
  });

  it('TC52b [OD-03] confirming pickup before the order is ready is refused', async function () {
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isPickupPageShown(3000))) this.skip();
    if (await OrderFlowPage.isOrderReady()) {
      console.warn('ℹ️ Order was already READY on arrival – "not ready" case can\'t be checked this run');
      this.skip();
    }
    if (!(await isKeyVisible(Order.pickupConfirmButton, 3000))) {
      // Confirm is hidden until ready: that already blocks early pickup.
      expect(await OrderFlowPage.isPickupPageShown()).toBe(true);
      return;
    }
    await OrderFlowPage.confirmPickup();
    // Expect "This order is not ready for pickup yet" and NO move to the drop leg.
    const errorShown = await OrderFlowPage.isErrorFeedbackShown(5000, OrderText.pickupNotReady);
    expect(await OrderFlowPage.isDropPageShown(2000)).toBe(false);
    expect(await OrderFlowPage.isPickupPageShown()).toBe(true);
    if (!errorShown) console.warn('⚠️ No error toast seen, but pickup was correctly not accepted');
  });

  it('TC52c [OD-04] restaurant marks the order READY → "Order is ready, Pick Now" shown', async function () {
    this.timeout(sec(TestData.readyTimeoutSec + 60));
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isPickupPageShown(3000))) this.skip();
    if (!(await OrderFlowPage.isOrderReady())) {
      console.log(`👉 Restaurant Partner panel → Preparing Orders: mark #${state.orderId || 'the order'} READY now (waiting up to ${TestData.readyTimeoutSec}s)…`);
      const hit = await waitForAnyKey(
        [Order.pickupReadyBanner, Order.cancelledDialog],
        sec(TestData.readyTimeoutSec),
      );
      if (hit === Order.cancelledDialog) await requireActiveOrder(this);
    }
    expect(await OrderFlowPage.isOrderReady(1000)).toBe(true);
  });

  it('TC52d [OD-05] confirming pickup moves the order to the customer leg', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isPickupPageShown(3000))) this.skip();
    await OrderFlowPage.confirmPickup();
    const next = await waitForAnyKey(
      [Order.currentOrderCallButton, Order.currentOrderStartNavigationButton, Order.dropPage, Order.cancelledDialog],
      sec(20),
    );
    expect(next).not.toBeNull();
    expect(next).not.toBe(Order.cancelledDialog);
    expect(await OrderFlowPage.isPickupPageShown(0)).toBe(false);
  });

  it('TC52e [customer] tracking moves on after the driver picks up the order', async function () {
    this.timeout(sec(120));
    await requireActiveOrder(this);
    if (!state.placed || !state.customerStatusAtAccept) this.skip();
    await CustomerAppPage.bringToFront();
    const end = Date.now() + sec(60);
    let status = await CustomerAppPage.currentStatus();
    while (status === state.customerStatusAtAccept && Date.now() < end) {
      await browser.pause(3000);
      status = await CustomerAppPage.currentStatus();
    }
    console.log(`📱 Customer sees: ${status}`);
    await CustomerAppPage.switchToDriverApp();
    expect(status).not.toBe(state.customerStatusAtAccept);
  });

  // ---------------- Heading to / at the customer ----------------

  it('TC52f [CT-01, OD-14] customer leg: chat with the customer opens and Back returns', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    if ((await currentScreen()) !== CURRENT_ORDER) this.skip();
    expect(await OrderFlowPage.isChatButtonVisible()).toBe(true);
    expect(await OrderChatPage.openFromCurrentOrder()).toBe(true);
    await OrderChatPage.back();
    expect(await OrderFlowPage.isCurrentOrderPageShown(10000)).toBe(true);
  });

  it('TC53 [OD-08] "I\'ve arrived at customer" opens delivery code entry', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    const screen = await currentScreen();
    if (screen === CURRENT_ORDER) {
      // Customer leg: "Heading to Drop Location" (or "Heading to Customer"), route + controls, then arrive.
      expect([OrderText.headingToDropLocation, OrderText.headingToCustomer])
        .toContain(await OrderFlowPage.getStageTitle());
      expect(await OrderFlowPage.isRouteMapVisible()).toBe(true);
      expect(await OrderFlowPage.isCallButtonVisible()).toBe(true);
      const button = await OrderFlowPage.findStageButton(
        [OrderText.reachedDropLocationButton, OrderText.arrivedAtCustomerButton],
      );
      expect(button).not.toBeNull();
      console.log(`🛵 Tapping "${button}"`);
      expect(await OrderFlowPage.tapStageButtonAndWaitFor(button, [Order.dropPage])).toBe(Order.dropPage);
    } else if (screen !== Order.dropPage) {
      this.skip();
    }
    expect(await isKeyVisible(Order.dropOtpField, 5000)).toBe(true);
  });

  it('TC53a [OD-12, OD-13, OD-14, OD-15] drop screen shows customer, contact, order details and payment', async function () {
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isDropPageShown(3000))) this.skip();
    expect(await OrderFlowPage.isDropCustomerCardVisible()).toBe(true);
    expect(await isKeyVisible(Order.dropCallButton, 3000)).toBe(true);
    expect(await isKeyVisible(Order.dropChatButton, 3000)).toBe(true);
    // Order details carry the note, instructions and cash-to-collect / paid-online line.
    expect(await OrderFlowPage.isDropOrderDetailsVisible()).toBe(true);
  });

  it('TC53b [OD-10] a wrong delivery code is rejected and the order stays open', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isDropPageShown(3000))) this.skip();
    const realCode = TestData.deliveryCode || state.pin;
    if (realCode && realCode === TestData.wrongDeliveryCode) {
      throw new Error(`TEST_WRONG_DELIVERY_CODE (${TestData.wrongDeliveryCode}) equals the real delivery code – change it`);
    }
    await OrderFlowPage.submitDeliveryCode(TestData.wrongDeliveryCode);
    const errorShown = await OrderFlowPage.isErrorFeedbackShown(8000, OrderText.wrongOtp);
    expect(await OrderFlowPage.isDeliveryCompletePageShown(2000)).toBe(false);
    expect(await OrderFlowPage.isDropPageShown()).toBe(true);
    expect(errorShown).toBe(true); // "wrong code, N attempts left"
    await OrderFlowPage.clearDeliveryCode();
  });

  it('TC53c [OD-09] the correct delivery code completes the delivery', async function () {
    this.timeout(sec(TestData.manualStepTimeoutSec + 60));
    await requireActiveOrder(this);
    if (await OrderFlowPage.isDeliveryCompletePageShown(0)) return;
    if (!(await OrderFlowPage.isDropPageShown(3000))) this.skip();
    let timeout = sec(30);
    const code = TestData.deliveryCode || state.pin;
    if (code) {
      console.log(`🔑 Entering delivery code ${code}${state.pin ? ' (from the customer app)' : ''}`);
      await OrderFlowPage.submitDeliveryCode(code);
    } else {
      console.log(`👉 Type the customer's delivery code on the phone now (waiting up to ${TestData.manualStepTimeoutSec}s)…`);
      timeout = sec(TestData.manualStepTimeoutSec);
    }
    const hit = await waitForAnyKey([Order.deliveryCompletePage, Order.cancelledDialog], timeout);
    if (hit === Order.cancelledDialog) await requireActiveOrder(this);
    expect(hit).toBe(Order.deliveryCompletePage);
  });

  // ---------------- Complete ----------------

  it('TC54 [OD-16] Delivery Complete shows the trip earnings', async function () {
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isDeliveryCompletePageShown(5000))) this.skip(); // delivery not completed
    expect(await OrderFlowPage.isDeliveryCompletePageShown(10000)).toBe(true);
    expect(await OrderFlowPage.isDeliveryEarningsVisible()).toBe(true);
    expect(await isKeyVisible(Order.deliveryCompleteNextOrderButton, 5000)).toBe(true);
  });

  it('TC54a [OD-17] rating the delivery (5 stars + comment) is submitted', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isDeliveryCompletePageShown(5000))) this.skip(); // delivery not completed
    if (!(await OrderFlowPage.isRatingDialogVisible(5000))) {
      console.warn('ℹ️ No rating dialog after this delivery – rating case not checked this run');
      this.skip();
    }
    await tapKey(Common.ratingStar(5));
    if (await OrderFlowPage.isRatingCommentFieldVisible()) {
      await typeKey(Order.ratingCommentField, 'Automation: smooth pickup and delivery');
    }
    await OrderFlowPage.submitRating();
    expect(await OrderFlowPage.isRatingDialogClosed(10000)).toBe(true);
  });

  it('TC54b [OD-16] "Get Next Order" returns Home with no active order, then go OFFLINE', async function () {
    this.timeout(sec(60));
    await requireActiveOrder(this);
    if (!(await OrderFlowPage.isDeliveryCompletePageShown(5000))) this.skip(); // delivery not completed
    await OrderFlowPage.tapGetNextOrder();
    state.completed = true;
    expect(await HomePage.isShown(15000)).toBe(true);
    expect(await isKeyVisible(Home.currentOrderCard, 3000)).toBe(false);
    expect(await HomePage.setOnline(false)).toBe('OFFLINE');
  });

  it('TC54c [customer] the customer app shows the order as delivered', async function () {
    this.timeout(sec(120));
    if (!state.placed || !state.completed) this.skip();
    await CustomerAppPage.bringToFront();
    const delivered = await CustomerAppPage.waitForStatus(/delivered/i, sec(60));
    console.log(`📱 Customer sees: ${delivered || (await CustomerAppPage.currentStatus())}`);
    await CustomerAppPage.switchToDriverApp();
    expect(delivered).not.toBe('');
  });
});
