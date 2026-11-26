import { isKeyVisible, tapKey, waitForAnyKey } from './flutter.js';
import { Common, Dashboard, Home } from './keys.js';

// Pop-up → the button that closes it without changing anything.
const CLOSERS = [
  [Home.ongoingOrderDialog, Home.ongoingOrderDialogOkButton],
  [Home.batteryDialog, Home.batteryDialogNotNowButton],
  [Common.permissionSettingsDialog, Common.permissionSettingsNotNowButton],
  [Dashboard.permissionsNotNowButton, Dashboard.permissionsNotNowButton],
];

/**
 * Closes pop-ups that can show over ANY screen and hide the nav bar / online
 * toggle: the "ongoing order" info dialog, the battery-optimisation dialog,
 * the permission-settings dialog and the permissions sheet.
 * An incoming "new order" offer is only LOGGED, never rejected: a rejected or
 * missed offer is not offered to this driver again, which breaks the
 * end-to-end order test.
 *
 * `waitMs` = how long to watch for a pop-up that is about to appear (e.g. right
 * after tapping the online toggle). 0 = check once, no waiting (cheap).
 * Returns true when something was closed.
 */
export async function dismissBlockingDialogs(waitMs = 0) {
  let closed = false;
  if (await isKeyVisible(Common.newOrderRequestDialog, 0)) {
    console.warn('⚠️ A new-order offer is on screen – leaving it (not rejecting)');
  }
  const dialogKeys = CLOSERS.map(([dialog]) => dialog);
  // Up to 3 pop-ups can stack (e.g. permissions sheet, then battery dialog).
  for (let i = 0; i < 3; i += 1) {
    const found = await waitForAnyKey(dialogKeys, i === 0 ? waitMs : 1000);
    if (!found) break;
    const [, button] = CLOSERS.find(([dialog]) => dialog === found);
    console.log(`ℹ️ Closing pop-up: ${found}`);
    await tapKey(button, 3000).catch(() => {});
    closed = true;
  }
  return closed;
}
