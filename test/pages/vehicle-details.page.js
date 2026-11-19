import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common, Dashboard, Profile } from '../helpers/keys.js';

class VehicleDetailsPage {
  async openFromProfile() {
    await tapKey(Dashboard.profileTab);
    await tapKey(Profile.vehicleDetailsTile);
    return isKeyVisible(Profile.vehicleDetailsPage, 10000);
  }

  async isPageShown() {
    return isKeyVisible(Profile.vehicleDetailsPage, 5000);
  }

  async isVehicleInfoCardVisible() {
    return isKeyVisible(Profile.vehicleInfoCard, 5000);
  }

  async isContentListVisible() {
    return isKeyVisible(Profile.vehicleDetailsList, 5000);
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

  async uploadPhoto(role, source = 'camera') {
    // Open the upload button for the given role (selfie or vehicle)
    await tapKey(Profile.vehiclePhotoUploadButton(role));
    // Choose the source option (camera or gallery)
    if (source === 'camera' && await isKeyVisible(Common.imageSourceCameraOption, 5000)) {
      await tapKey(Common.imageSourceCameraOption);
    } else if (source === 'gallery' && await isKeyVisible(Common.imageSourceGalleryOption, 5000)) {
      await tapKey(Common.imageSourceGalleryOption);
    } else {
      // Fallback: if specific option not visible, try tapping any visible source option
      if (await isKeyVisible(Common.imageSourceCameraOption, 2000)) {
        await tapKey(Common.imageSourceCameraOption);
      } else if (await isKeyVisible(Common.imageSourceGalleryOption, 2000)) {
        await tapKey(Common.imageSourceGalleryOption);
      }
    }
    // Wait for the uploaded photo card to become visible
    await waitKey(Profile.vehiclePhotoCard(role), 20000);
    return true;
  }
}

export default new VehicleDetailsPage();
