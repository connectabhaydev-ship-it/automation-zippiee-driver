import { goBack, isKeyGone, isKeyVisible, scrollToKey, swipe, tapKey, typeKey } from '../helpers/flutter.js';
import { confirmIfAsked, isDriverAppInFront, uploadImage } from '../helpers/media.js';
import { TestData } from '../helpers/test-data.js';
import { dismissBlockingDialogs } from '../helpers/dialogs.js';
import ProfilePage from './profile.page.js';
import { Common, Profile } from '../helpers/keys.js';

class VehicleDetailsPage {
  /** Opens Vehicle Details. Works from the Profile list or from any dashboard tab. */
  async openFromProfile() {
    await dismissBlockingDialogs();
    if (!(await isKeyVisible(Profile.vehicleDetailsTile, 2000))) {
      if (!(await ProfilePage.open())) return false;
    }
    await tapKey(Profile.vehicleDetailsTile);
    return isKeyVisible(Profile.vehicleDetailsPage, 10000);
  }

  /** Back from Vehicle Details to the Profile list. */
  async back() {
    await goBack();
    return ProfilePage.isShown();
  }

  async isPageShown() {
    return isKeyVisible(Profile.vehicleDetailsPage, 5000);
  }

  // Content loads from the backend after the page opens: allow a slow staging.
  async isVehicleInfoCardVisible() {
    return isKeyVisible(Profile.vehicleInfoCard, 20000);
  }

  async isContentListVisible() {
    return isKeyVisible(Profile.vehicleDetailsList, 20000);
  }

  /** Reopens Vehicle Details when an earlier failure left the page. */
  async ensureOpen() {
    if (await this.isPageShown()) return true;
    return this.openFromProfile();
  }

  async isEmiToggleVisible() {
    return isKeyVisible(Profile.vehicleEmiToggle, 3000);
  }

  async toggleEmiSection() {
    if (await this.isEmiToggleVisible()) {
      await tapKey(Profile.vehicleEmiToggle);
    }
  }

  async isDocumentCardVisible(code) {
    return isKeyVisible(Profile.vehicleDocumentCard(code), 3000);
  }

  async isDocumentReplaceButtonVisible(code) {
    return isKeyVisible(Profile.vehicleDocumentReplaceButton(code), 3000);
  }

  async isDocumentCancelButtonVisible(code) {
    return isKeyVisible(Profile.vehicleDocumentCancelButton(code), 3000);
  }

  async isPhotoCardVisible(role) {
    return isKeyVisible(Profile.vehiclePhotoCard(role), 3000);
  }

  async isPhotoUploadButtonVisible(role) {
    return isKeyVisible(Profile.vehiclePhotoUploadButton(role), 3000);
  }

  async isConfirmDialogVisible() {
    return isKeyVisible(Profile.vehicleConfirmDialog, 3000);
  }

  async cancelConfirmDialog() {
    if (await isKeyVisible(Profile.vehicleConfirmCancelButton, 2000)) {
      await tapKey(Profile.vehicleConfirmCancelButton);
    }
  }

  async isRejectionSheetVisible() {
    return (
      (await isKeyVisible(Profile.rejectionViewFileButton, 3000)) ||
      (await isKeyVisible(Profile.rejectionUploadAgainButton, 3000))
    );
  }

  async enterRejectionReply(text) {
    await typeKey(Profile.rejectionReplyField, text);
  }

  async sendRejectionReply() {
    await tapKey(Profile.rejectionReplySendButton);
  }

  /**
   * Opens the image-source picker (Camera / Gallery) for a photo role
   * (FRONT, BACK, LEFT or RIGHT) via its Upload button, or Replace when a photo
   * already exists. Returns true when the picker options are shown.
   * Does NOT pick an image: the camera and gallery are native apps the
   * Flutter driver can't drive, and a real upload would change the staging
   * driver's verified documents.
   */
  async openPhotoSourcePicker(role) {
    // The photo cards are at the bottom of the list: bring the card on screen.
    await scrollToKey(Profile.vehiclePhotoCard(role), { maxSwipes: 12 });
    if (await isKeyVisible(Profile.vehiclePhotoUploadButton(role), 3000)) {
      await tapKey(Profile.vehiclePhotoUploadButton(role));
    } else if (await isKeyVisible(Profile.vehiclePhotoReplaceButton(role), 3000)) {
      await tapKey(Profile.vehiclePhotoReplaceButton(role));
    } else {
      return false;
    }
    return (
      (await isKeyVisible(Common.imageSourceCameraOption, 5000)) ||
      (await isKeyVisible(Common.imageSourceGalleryOption, 2000))
    );
  }

  async isCameraOptionVisible() {
    return isKeyVisible(Common.imageSourceCameraOption, 3000);
  }

  async isGalleryOptionVisible() {
    return isKeyVisible(Common.imageSourceGalleryOption, 3000);
  }

  /** Closes the image-source picker without choosing anything. */
  async closePhotoSourcePicker() {
    await browser.back();
    return (
      (await isKeyGone(Common.imageSourceCameraOption, 5000)) &&
      (await isKeyGone(Common.imageSourceGalleryOption, 2000))
    );
  }

  // ---------- Real uploads (photos + documents) ----------

  /** Native "Upload" buttons currently on screen (pending photos / documents). */
  async visibleUploadButtons() {
    return $$(UPLOAD_BUTTON);
  }

  /**
   * Uploads every item still showing an "Upload" button (vehicle photos and
   * ID / vehicle documents), top to bottom. Each one: gallery photo, or the
   * camera when the gallery is empty → crop ✓ → confirm dialog if asked.
   * Returns { uploaded, failed } counts.
   */
  async uploadAllPending({ prefer = 'gallery', max = 20 } = {}) {
    let uploaded = 0;
    let failed = 0;
    let emptySwipes = 0;
    for (let i = 0; i < 8; i += 1) await swipe('down'); // start at the top
    while (uploaded + failed < max && emptySwipes < 4) {
      const buttons = await this.visibleUploadButtons();
      if (!buttons.length) {
        await swipe('up');
        emptySwipes += 1;
        continue;
      }
      emptySwipes = 0;
      const before = buttons.length;
      const openSheet = async () => {
        if (await isKeyVisible(Common.imageSourceCameraOption, 500)) return true;
        const [first] = await this.visibleUploadButtons();
        if (!first) return false;
        await first.click();
        return isKeyVisible(Common.imageSourceCameraOption, 5000);
      };
      const via = await uploadImage(openSheet, { prefer });
      await confirmIfAsked(Profile.vehicleConfirmDialog, Profile.vehicleConfirmOkButton);
      if (via && (await this.waitForUploadDone(before))) {
        uploaded += 1;
        console.log(`📤 Uploaded item ${uploaded} (${via})`);
      } else {
        failed += 1;
        console.warn(`⚠️ Upload ${uploaded + failed} did not finish`);
        await this.recoverToPage();
        if (failed >= 2) break;
      }
    }
    return { uploaded, failed };
  }

  /** Waits until fewer Upload buttons are on screen than `before` (upload accepted). */
  async waitForUploadDone(before, timeout = 45000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      // Flutter keys stay "visible" under a native picker: check the app is in front.
      if ((await isDriverAppInFront(TestData.driverAppPackage)) && (await this.isPageShown())) {
        // While an item shows "Uploading…" the other Upload buttons are disabled.
        const busy = (await $$(UPLOADING)).length > 0;
        const now = (await this.visibleUploadButtons()).length;
        if (!busy && now < before) return true;
      }
      await browser.pause(1000);
    }
    return false;
  }

  /** Back to the Vehicle Details list from a picker / camera / crop screen. */
  async recoverToPage() {
    for (let i = 0; i < 3 && !(await this.isPageShown()); i += 1) {
      await browser.back();
      await browser.pause(1000);
    }
  }
}

const UPLOAD_BUTTON = 'android=new UiSelector().description("Upload")';
const UPLOADING = 'android=new UiSelector().descriptionContains("Uploading")';

export default new VehicleDetailsPage();
