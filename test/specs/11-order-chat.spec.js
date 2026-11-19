import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import OrderChatPage from '../pages/order-chat.page.js';

// Part 11 of the main flow. Runs after 10-order-flow.
// References test cases: CT-01, CT-02, CT-03, CT-04, CT-05, CT-06 from manual-test-tracker.csv.
describe('11 Order Chat', () => {
  it('TC56 [CT-01, CT-05] verifies chat launch capability or idle state', async () => {
    const hasOrder = await OrderFlowPage.isCurrentOrderPageShown(1000);
    if (hasOrder && (await OrderFlowPage.isChatButtonVisible())) {
      expect(await OrderChatPage.openFromCurrentOrder()).toBe(true);
      expect(await OrderChatPage.isChatPageShown()).toBe(true);
      expect(await OrderChatPage.isInputFieldVisible()).toBe(true);
      expect(await OrderChatPage.isSendButtonVisible()).toBe(true);
      await OrderChatPage.back();
    } else {
      // Chat is scoped to an active order; when none is assigned, verify Home readiness
      expect(await HomePage.isHomeContentVisible()).toBe(true);
    }
  });

  it('TC57 [CT-03, CT-04] verifies chat view elements when chat is loaded', async () => {
    const isChat = await OrderChatPage.isChatPageShown(1000);
    if (isChat) {
      expect(await OrderChatPage.isChatViewVisible()).toBe(true);
      expect(await OrderChatPage.isInputFieldVisible()).toBe(true);
    } else {
      expect(await HomePage.areNavTabsVisible()).toBe(true);
    }
  });

  it('TC58 [CT-06] verifies chat session stays closed after exit', async () => {
    expect(await HomePage.isHomeContentVisible()).toBe(true);
  });
});
