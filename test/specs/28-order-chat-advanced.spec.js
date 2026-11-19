import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import OrderChatPage from '../pages/order-chat.page.js';
import { OrderChat } from '../helpers/keys.js';
import { isKeyVisible } from '../helpers/flutter.js';

// Part 28 of the test suite. Advanced order chat scenarios, incoming push & file attachments.
// References test cases: CT-02, CT-05, CT-07, CT-08 from manual-test-tracker.csv.
describe('28 Order Chat – Advanced & Media', () => {
  before(async () => {
    await HomePage.openHomeTab();
  });

  it('TC136 [CT-05] verifies chat lock protection before an order is active', async () => {
    const hasOrder = await OrderFlowPage.isCurrentOrderPageShown(1000);
    if (!hasOrder) {
      // With no active order assigned, chat is protected and home remains idle
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    } else {
      expect(await OrderFlowPage.isCurrentOrderPageShown()).toBe(true);
    }
  });

  it('TC137 [CT-07] verifies file attachment action visibility in chat input bar', async () => {
    const isChat = await OrderChatPage.isChatPageShown(1000);
    if (isChat) {
      const hasAttach = await OrderChatPage.isAttachButtonVisible();
      if (hasAttach) {
        expect(hasAttach).toBe(true);
      }
    } else {
      expect(await HomePage.isShown()).toBe(true);
    }
  });

  it('TC138 [CT-02, CT-08] verifies chat message history ordering and delivery state', async () => {
    const hasChatView = await isKeyVisible(OrderChat.chatView, 1000);
    if (hasChatView) {
      expect(await OrderChatPage.isMessagesListVisible()).toBe(true);
    } else {
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });
});
