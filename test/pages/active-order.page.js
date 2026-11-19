import { isKeyVisible, tapKey, typeKey, waitKey } from '../helpers/flutter.js';
import { Common, Orders } from '../helpers/keys.js';

class ActiveOrderPage {
  /** Checks if the incoming order request dialog is shown. */
  async isIncomingOrderDialogShown(timeout = 5000) {
    return isKeyVisible(Common.newOrderRequestDialog, timeout);
  }

  async acceptIncomingOrder() {
    await tapKey(Common.newOrderRequestAcceptButton);
  }

  async rejectIncomingOrder() {
    await tapKey(Common.newOrderRequestRejectButton);
  }

  /** Current order tracking page. */
  async isCurrentOrderPageShown(timeout = 10000) {
    return isKeyVisible(Orders.currentOrderPage, timeout);
  }

  async areCurrentOrderControlsVisible() {
    return (
      (await isKeyVisible(Orders.currentOrderDetailsCard, 5000)) &&
      (await isKeyVisible(Orders.currentOrderCallButton, 5000)) &&
      (await isKeyVisible(Orders.currentOrderChatButton, 5000)) &&
      (await isKeyVisible(Orders.currentOrderCtaButton, 5000))
    );
  }

  /** Pickup verification screen. */
  async isPickupPageShown(timeout = 10000) {
    return isKeyVisible(Orders.pickupPage, timeout);
  }

  async confirmPickup() {
    await tapKey(Orders.pickupConfirmButton);
  }

  /** Drop / Delivery screen with customer OTP. */
  async isDropPageShown(timeout = 10000) {
    return isKeyVisible(Orders.dropPage, timeout);
  }

  async enterDeliveryOtp(otp) {
    await typeKey(Orders.dropOtpField, otp);
  }

  async confirmDelivery() {
    await tapKey(Orders.dropConfirmButton);
  }

  /** Delivery complete screen. */
  async isDeliveryCompleteShown(timeout = 10000) {
    return isKeyVisible(Orders.deliveryCompletePage, timeout);
  }

  async tapNextOrder() {
    await tapKey(Orders.deliveryCompleteNextOrderButton);
  }
}

export default new ActiveOrderPage();
