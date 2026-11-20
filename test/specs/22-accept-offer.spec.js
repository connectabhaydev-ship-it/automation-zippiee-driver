import HomePage from '../pages/home.page.js';
import OrderFlowPage from '../pages/order-flow.page.js';
import { TestData } from '../helpers/test-data.js';

/**
 * Accept‑flow test for a debug‑generated order offer.
 * It ensures the driver is online, forces an offer, accepts it, and then
 * verifies that the app navigates to the next stage (order card on Home).
 */
describe('22 Accept generated order offer (debug)', () => {
  before(async () => {
    // Open Home and make sure the driver is online.
    await HomePage.openHomeTab();
    const online = await HomePage.goOnline();
    if (!online) {
      throw new Error('Failed to set driver online – aborting test.');
    }
  });

  it('TC‑accept‑generated‑offer', async () => {
    // 1️⃣ Force a new order to appear.
    await OrderFlowPage.generateOffer();

    // 2️⃣ Wait for the incoming‑order dialog.
    const hasOffer = await OrderFlowPage.isNewOrderDialogVisible(8000);
    expect(hasOffer).toBe(true);

    // 3️⃣ Accept the offer.
    await OrderFlowPage.acceptOrder();

    // 4️⃣ Verify the driver now sees the current order card on the Home screen.
    const cardVisible = await OrderFlowPage.isCurrentOrderCardOnHomeVisible();
    expect(cardVisible).toBe(true);

    // 5️⃣ (Optional) verify we can reach the Pickup page – a typical next step.
    const onPickup = await OrderFlowPage.isPickupPageShown(5000);
    expect(onPickup).toBe(true);
  });
});
