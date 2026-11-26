import { isKeyVisible, tapKey, waitForAnyKey } from './flutter.js';
import { Common } from './keys.js';

// Native screens met while picking an image (driven through UiAutomator2 with
// `android=` locators; the Flutter driver passes them on):
//  - Gallery → Android Photo Picker (com.google.android.photopicker); photos are
//    labelled "Photo taken on <date>".
//  - Camera  → the app's own Flutter camera screen; its round shutter has no
//    key, so it is tapped by position (bottom centre).
//  - Both    → uCrop "Crop Photo" screen; ✓ is <app package>:id/menu_crop.

const PHOTO = 'android=new UiSelector().descriptionStartsWith("Photo taken on")';
const PHOTO_PICKER = 'android=new UiSelector().packageName("com.google.android.photopicker")';
const PICKER_DONE = 'android=new UiSelector().packageName("com.google.android.photopicker").text("Done")';
const CROP_DONE = 'android=new UiSelector().resourceIdMatches(".*:id/menu_crop")';

/** True when the driver app (not a picker / camera / crop screen) is in front. */
export async function isDriverAppInFront(driverPackage) {
  const pkg = await browser.getCurrentPackage().catch(() => '');
  const activity = await browser.getCurrentActivity().catch(() => '');
  return pkg === driverPackage && !/ucrop|crop/i.test(activity);
}

async function firstNative(selector) {
  const els = await $$(selector);
  return els.length ? els[0] : null;
}

async function waitNative(selector, timeout = 10000) {
  const end = Date.now() + timeout;
  for (;;) {
    const el = await firstNative(selector).catch(() => null);
    if (el) return el;
    if (Date.now() >= end) return null;
    await browser.pause(400);
  }
}

/** Confirms the uCrop screen when it shows (it does after both camera and gallery). */
async function confirmCrop(timeout = 10000) {
  const done = await waitNative(CROP_DONE, timeout);
  if (done) {
    await done.click();
    return true;
  }
  return false;
}

/**
 * With the Camera / Gallery sheet open: picks the newest photo in the gallery.
 * Returns false (and closes the gallery) when there is no photo to pick.
 */
async function pickFromGallery() {
  await tapKey(Common.imageSourceGalleryOption);
  if (!(await waitNative(PHOTO_PICKER, 10000))) return false;
  const photo = await waitNative(PHOTO, 5000);
  if (!photo) {
    console.warn('ℹ️ Gallery has no photos');
    await browser.back();
    await browser.pause(1000);
    return false;
  }
  await photo.click();
  // The picker opens in multi-select mode on some phones: confirm with Done.
  const done = await waitNative(PICKER_DONE, 3000);
  if (done) await done.click();
  await confirmCrop();
  return true;
}

/** With the Camera / Gallery sheet open: takes a photo with the in-app camera. */
async function takeWithCamera() {
  await tapKey(Common.imageSourceCameraOption);
  await browser.pause(3000); // camera preview start-up
  const { width, height } = await browser.getWindowSize();
  await browser.execute('mobile: clickGesture', {
    x: Math.round(width / 2),
    y: Math.round(height * 0.895),
  });
  return confirmCrop(15000);
}

/**
 * Uploads an image through the app's Camera / Gallery sheet.
 * `openSheet` must open that sheet (it is called again for the camera fallback).
 * Gallery first; when the gallery is empty, the camera takes a photo.
 * Returns 'gallery' | 'camera' | null.
 */
export async function uploadImage(openSheet, { prefer = 'gallery' } = {}) {
  if (!(await openSheet())) return null;
  if (prefer === 'gallery') {
    if (await pickFromGallery()) return 'gallery';
    console.log('📷 No usable gallery photo – using the camera');
    if (!(await isKeyVisible(Common.imageSourceCameraOption, 1500)) && !(await openSheet())) return null;
  }
  return (await takeWithCamera()) ? 'camera' : null;
}

/**
 * After an upload, the app may ask to confirm replacing a reviewed item
 * (`confirmKey` dialog). Taps OK when it shows. Never throws.
 */
export async function confirmIfAsked(dialogKey, okKey, timeout = 4000) {
  if ((await waitForAnyKey([dialogKey], timeout)) === dialogKey) {
    await tapKey(okKey).catch(() => {});
    return true;
  }
  return false;
}
