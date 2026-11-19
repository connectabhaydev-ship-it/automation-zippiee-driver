import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common, Order, OrderChat, Dashboard, Home } from '../helpers/keys.js';

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

  async isDetailsCardVisible() {
    return isKeyVisible(Order.currentOrderDetailsCard, 5000);
  }

  async tapMainAction() {
    await tapKey(Order.currentOrderCtaButton);
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
}

export default new OrderFlowPage();
