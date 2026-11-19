import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common, Order, OrderChat, Dashboard } from '../helpers/keys.js';

class OrderFlowPage {
  async isNewOrderDialogVisible(timeout = 5000) {
    return isKeyVisible(Common.newOrderRequestDialog, timeout);
  }

  async acceptOrder() {
    await tapKey(Common.newOrderRequestAcceptButton);
  }

  async rejectOrder() {
    await tapKey(Common.newOrderRequestRejectButton);
  }

  async isCurrentOrderPageShown(timeout = 10000) {
    return isKeyVisible(Order.currentOrderPage, timeout);
  }

  async isRouteMapVisible() {
    return isKeyVisible(Order.currentOrderMap, 5000);
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

  async tapMainAction() {
    await tapKey(Order.currentOrderCtaButton);
  }

  async isPickupPageShown(timeout = 5000) {
    return isKeyVisible(Order.pickupPage, timeout);
  }

  async confirmPickup() {
    await tapKey(Order.pickupConfirmButton);
  }

  async isDropPageShown(timeout = 5000) {
    return isKeyVisible(Order.dropPage, timeout);
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

  async tapGetNextOrder() {
    await tapKey(Order.deliveryCompleteNextOrderButton);
  }
}

export default new OrderFlowPage();
