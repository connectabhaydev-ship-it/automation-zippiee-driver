import {
  isKeyGone, isKeyVisible, isTextVisible, tapKey, tapText, typeKey, waitForAnyKey, waitForAnyText,
} from '../helpers/flutter.js';
import { Common, Order, Home } from '../helpers/keys.js';

// Texts from the app's assets/translations/en.json. The Current Order screen
// has NO page / map / details-card / stage-button keys in this build, only
// order_currentOrder_{call,chat,refreshRoute,startNavigation}Button, so its
// stage title and stage button are found by their visible text.
export const OrderText = {
  headingToPickup: 'Heading to Pickup',
  arrivedAtRestaurant: 'Arrived at Restaurant',
  headingToCustomer: 'Heading to Customer',
  headingToDropLocation: 'Heading to Drop Location', // shown on the customer leg in this build
  arrivedAtCustomer: 'Arrived at Customer',
  reachedDropLocationButton: 'Reached Drop Location', // customer-leg button in this build
  arrivedAtRestaurantButton: "I've arrived at restaurant",
  arrivedAtCustomerButton: "I've arrived at customer",
  pickupNotReady: 'This order is not ready for pickup yet',
  wrongOtp: 'Entered OTP is incorrect',
  orderCancelledTitle: 'Order cancelled',
};
const STAGE_TITLES = [
  OrderText.headingToPickup, OrderText.arrivedAtRestaurant,
  OrderText.headingToCustomer, OrderText.headingToDropLocation, OrderText.arrivedAtCustomer,
];
const CURRENT_ORDER_MARKERS = [
  Order.currentOrderCallButton, Order.currentOrderStartNavigationButton,
  Order.currentOrderRefreshRouteButton, Order.currentOrderChatButton,
];

class OrderFlowPage {
  async isNewOrderDialogVisible(timeout = 5000) {
    return isKeyVisible(Common.newOrderRequestDialog, timeout);
  }

  async isViewItemsButtonVisible(timeout = 3000) {
    return isKeyVisible(Common.newOrderRequestViewItemsButton, timeout);
  }

  async acceptOrder() {
    await tapKey(Common.newOrderRequestAcceptButton);
  }

  async rejectOrder() {
    await tapKey(Common.newOrderRequestRejectButton);
  }

  /** Current Order screen = any of its real keys (it has no page key). */
  async isCurrentOrderPageShown(timeout = 10000) {
    return (await waitForAnyKey(CURRENT_ORDER_MARKERS, timeout)) !== null;
  }

  /** The stage title shown on Current Order ("Heading to Pickup" …), or null. */
  async getStageTitle(timeout = 5000) {
    return waitForAnyText(STAGE_TITLES, timeout);
  }

  /** The map has no key; its refresh-route button sits on it. */
  async isRouteMapVisible() {
    return isKeyVisible(Order.currentOrderRefreshRouteButton, 5000);
  }

  async isNavigationButtonVisible() {
    return isKeyVisible(Order.currentOrderStartNavigationButton, 5000);
  }

  async isCallButtonVisible() {
    return isKeyVisible(Order.currentOrderCallButton, 5000);
  }

  async isChatButtonVisible() {
    return isKeyVisible(Order.currentOrderChatButton, 5000);
  }

  /** Stage card (title + place + address); no key, so check its title. */
  async isDetailsCardVisible() {
    return (await this.getStageTitle(5000)) !== null;
  }

  /** First of these button texts that is on screen (or null). */
  async findStageButton(texts, timeout = 5000) {
    return waitForAnyText(texts, timeout);
  }

  /** Is this exact stage button text on screen? */
  async isStageButtonVisible(text, timeout = 5000) {
    return isTextVisible(text, timeout);
  }

  async isPickupPageShown(timeout = 5000) {
    return isKeyVisible(Order.pickupPage, timeout);
  }

  async isPickupReadyBannerVisible() {
    return isKeyVisible(Order.pickupReadyBanner, 5000);
  }

  async isPickupReceiptCardVisible() {
    return isKeyVisible(Order.pickupReceiptCard, 5000);
  }

  async confirmPickup() {
    await tapKey(Order.pickupConfirmButton);
  }

  async isDropPageShown(timeout = 5000) {
    return isKeyVisible(Order.dropPage, timeout);
  }

  async isDropCustomerCardVisible() {
    return isKeyVisible(Order.dropCustomerCard, 5000);
  }

  async isDropOrderDetailsVisible() {
    return isKeyVisible(Order.dropOrderDetailsCard, 5000);
  }

  async enterDeliveryOtp(otp) {
    await typeKey(Order.dropOtpField, otp);
  }

  async confirmDelivery() {
    await tapKey(Order.dropConfirmButton);
  }

  async isDeliveryCompletePageShown(timeout = 10000) {
    return isKeyVisible(Order.deliveryCompletePage, timeout);
  }

  async isDeliveryEarningsVisible() {
    return isKeyVisible(Order.deliveryCompleteEarningsText, 5000);
  }

  async tapGetNextOrder() {
    await tapKey(Order.deliveryCompleteNextOrderButton);
  }

  async isReportIssuePageVisible(timeout = 5000) {
    return isKeyVisible(Order.reportIssuePage, timeout);
  }

  async isReportIssueSendEmailVisible() {
    return isKeyVisible(Order.reportIssueSendEmailButton, 5000);
  }

  async isCancelledDialogVisible(timeout = 5000) {
    return isKeyVisible(Order.cancelledDialog, timeout);
  }

  async confirmCancelledDialog() {
    await tapKey(Order.cancelledOkButton);
  }

  async isRatingDialogVisible(timeout = 5000) {
    return isKeyVisible(Order.ratingDialog, timeout);
  }

  async isRatingStarsVisible() {
    return isKeyVisible(Order.ratingStars, 3000);
  }

  async isRatingCommentFieldVisible() {
    return isKeyVisible(Order.ratingCommentField, 3000);
  }

  async isRatingSubmitVisible() {
    return isKeyVisible(Order.ratingSubmitButton, 3000);
  }

  async enterRatingComment(comment) {
    await typeKey(Order.ratingCommentField, comment);
  }

  async submitRating() {
    await tapKey(Order.ratingSubmitButton);
  }

  async isRateCustomerCardVisible() {
    return isKeyVisible(Order.detailsRateCustomerCard, 3000);
  }

  async tapRateCustomer() {
    await tapKey(Order.detailsRateCustomerCard);
  }

  async tapRateRestaurant() {
    await tapKey(Order.detailsRateRestaurantCard);
  }

  async isRateRestaurantCardVisible() {
    return isKeyVisible(Order.detailsRateRestaurantCard, 3000);
  }

  async isItemRowVisible(index = 0) {
    return isKeyVisible(Order.itemRow(index), 3000);
  }

  async tapItemRow(index = 0) {
    await tapKey(Order.itemRow(index));
  }

  async isCurrentOrderCardOnHomeVisible() {
    return isKeyVisible(Home.currentOrderCard, 5000);
  }

  // ---------- Lifecycle helpers (accept → pickup → drop → complete) ----------

  /** True when the order was cancelled by customer / restaurant / admin. */
  async wasCancelled() {
    return isKeyVisible(Order.cancelledDialog, 0);
  }

  /** From Home, opens the active order (tapping the current-order card). */
  async openCurrentOrderFromHome() {
    if (await this.isCurrentOrderPageShown(2000)) return true;
    // Pickup / drop screens are also "the current order".
    if ((await waitForAnyKey([Order.pickupPage, Order.dropPage, Order.deliveryCompletePage], 1000)) !== null) return true;
    if (await isKeyVisible(Home.currentOrderCard, 5000)) {
      await tapKey(Home.currentOrderCard);
    }
    return (await waitForAnyKey(
      [...CURRENT_ORDER_MARKERS, Order.pickupPage, Order.dropPage, Order.deliveryCompletePage], 15000,
    )) !== null;
  }

  /**
   * Taps the stage button (by its text) and waits for one of `nextKeys`.
   * Returns the key that appeared (or null).
   */
  async tapStageButtonAndWaitFor(buttonText, nextKeys, timeout = 20000) {
    await tapText(buttonText);
    return waitForAnyKey([...nextKeys, Order.cancelledDialog, Common.errorRetryButton], timeout);
  }

  /** Pickup page: is the "Order is ready, Pick Now" banner shown? */
  async isOrderReady(timeout = 0) {
    return isKeyVisible(Order.pickupReadyBanner, timeout);
  }

  /**
   * Error feedback after an action the app refuses: the given message text
   * (e.g. "This order is not ready for pickup yet"), a toast or a retry button.
   */
  async isErrorFeedbackShown(timeout = 5000, text = null) {
    const end = Date.now() + timeout;
    for (;;) {
      if (text && (await isTextVisible(text, 0))) return true;
      if ((await waitForAnyKey([Common.toastMessage, Common.errorRetryButton], 0)) !== null) return true;
      if (Date.now() >= end) return false;
      await browser.pause(250);
    }
  }

  /** Types the delivery code and submits it (button if shown, else auto-submit). */
  async submitDeliveryCode(code) {
    await typeKey(Order.dropOtpField, code);
    if (await isKeyVisible(Order.dropConfirmButton, 2000)) {
      await tapKey(Order.dropConfirmButton);
    }
  }

  /** Clears the delivery code field (after a wrong attempt). */
  async clearDeliveryCode() {
    const el = await $(await browser.findElement('-flutter key', Order.dropOtpField));
    await el.clearValue().catch(() => {});
  }

  async isRatingDialogClosed(timeout = 5000) {
    return isKeyGone(Order.ratingDialog, timeout);
  }
}

export default new OrderFlowPage();
