import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common, Order, OrderChat } from '../helpers/keys.js';

class OrderChatPage {
  async openFromCurrentOrder() {
    await tapKey(Order.currentOrderChatButton);
    return isKeyVisible(OrderChat.page, 10000);
  }

  async isChatPageShown(timeout = 5000) {
    return (
      (await isKeyVisible(OrderChat.page, timeout)) ||
      (await isKeyVisible(OrderChat.loadingPage, 2000))
    );
  }

  async isChatViewVisible() {
    return isKeyVisible(OrderChat.chatView, 5000);
  }

  async isMessagesListVisible() {
    return isKeyVisible(OrderChat.messagesList, 5000);
  }

  async isInputFieldVisible() {
    return isKeyVisible(OrderChat.inputField, 5000);
  }

  async isSendButtonVisible() {
    return isKeyVisible(OrderChat.sendButton, 5000);
  }

  async isAttachButtonVisible() {
    return isKeyVisible(OrderChat.attachButton, 3000);
  }

  async enterMessage(text) {
    await typeKey(OrderChat.inputField, text);
  }

  async tapSend() {
    await tapKey(OrderChat.sendButton);
  }

  async isQuickReplyVisible(replyId) {
    return isKeyVisible(OrderChat.quickReply(replyId), 3000);
  }

  async back() {
    await tapKey(Common.backButton);
  }
}

export default new OrderChatPage();
