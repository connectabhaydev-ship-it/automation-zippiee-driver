import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common, OrderChat, Orders } from '../helpers/keys.js';

class OrderChatPage {
  async isChatPageShown(timeout = 10000) {
    return isKeyVisible(Orders.orderChatPage, timeout);
  }

  async areChatElementsVisible() {
    return (
      (await isKeyVisible(OrderChat.inputField, 5000)) &&
      (await isKeyVisible(OrderChat.sendButton, 5000))
    );
  }

  async sendMessage(message) {
    await typeKey(OrderChat.inputField, message);
    await tapKey(OrderChat.sendButton);
  }

  async closeChat() {
    await tapKey(Common.backButton);
  }
}

export default new OrderChatPage();
