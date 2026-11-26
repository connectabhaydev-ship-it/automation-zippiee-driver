import { isKeyVisible, isTextVisible, tapKey, tapText, waitForAnyKey } from './flutter.js';
import { Common, Dashboard, Home, Order } from './keys.js';
import { returnToDashboard } from './navigation.js';
import { TestData } from './test-data.js';
import OrderFlowPage, { OrderText } from '../pages/order-flow.page.js';
import CustomerAppPage from '../pages/customer-app.page.js';
import HomePage from '../pages/home.page.js';

/**
 * An order left active by an aborted 10-order-flow run blocks the nav bar,
 * covers the bottom of every tab and fails 03 TC15a. This finishes it:
 *   customer leg (heading to / arrived at customer) → enter the customer's
 *   PIN (from .env or read in the customer app) → Delivery Complete → Home.
 * Orders still on the restaurant leg need the restaurant to mark them ready,
 * so they are only reported.
 *
 * Returns 'none' | 'completed' | 'blocked'. Never throws.
 */
export async function finishLeftoverOrder() {
  try {
    await returnToDashboard();
    await tapKey(Dashboard.homeTab, 5000).catch(() => {});
    if (!(await HomePage.isCurrentOrderCardVisible(4000))) return 'none';

    console.warn('⚠️ Active order left from an earlier run – trying to finish it');
    await OrderFlowPage.openCurrentOrderFromHome();

    // Customer leg, still driving: tap "Reached Drop Location" / "I've arrived at customer".
    if (!(await OrderFlowPage.isDropPageShown(3000))) {
      for (const btn of [OrderText.reachedDropLocationButton, OrderText.arrivedAtCustomerButton]) {
        if (await isTextVisible(btn, 1500)) {
          await tapText(btn);
          break;
        }
      }
    }
    if (!(await OrderFlowPage.isDropPageShown(10000))) {
      console.warn('⚠️ Leftover order is still on the restaurant leg – finish or cancel it in the admin panel');
      await returnToDashboard();
      return 'blocked';
    }

    let pin = TestData.deliveryCode;
    if (!pin && (await CustomerAppPage.open().catch(() => false))) {
      pin = (await CustomerAppPage.readOrderInfo()).pin;
    }
    await CustomerAppPage.switchToDriverApp();
    if (!pin) {
      console.warn('⚠️ Could not read the delivery PIN – set TEST_DELIVERY_CODE or finish the order by hand');
      await returnToDashboard();
      return 'blocked';
    }
    await OrderFlowPage.openCurrentOrderFromHome();
    console.log(`🔑 Completing the leftover order with PIN ${pin}`);
    await OrderFlowPage.submitDeliveryCode(pin);
    const hit = await waitForAnyKey([Order.deliveryCompletePage, Order.cancelledDialog], 30000);
    if (hit === Order.cancelledDialog) {
      await OrderFlowPage.confirmCancelledDialog();
    } else if (hit === Order.deliveryCompletePage) {
      if (await OrderFlowPage.isRatingDialogVisible(4000)) {
        await tapKey(Common.ratingStar(5)).catch(() => {});
        await OrderFlowPage.submitRating().catch(() => {});
      }
      await OrderFlowPage.tapGetNextOrder();
    } else {
      console.warn('⚠️ Delivery code was not accepted for the leftover order');
      return 'blocked';
    }
    await returnToDashboard();
    if (await isKeyVisible(Home.currentOrderCard, 3000)) return 'blocked';
    await HomePage.setOnline(false).catch(() => {});
    console.log('✅ Leftover order finished');
    return 'completed';
  } catch (err) {
    console.warn(`⚠️ Leftover-order clean-up failed: ${err.message}`);
    await CustomerAppPage.switchToDriverApp().catch(() => {});
    await returnToDashboard();
    return 'blocked';
  }
}
