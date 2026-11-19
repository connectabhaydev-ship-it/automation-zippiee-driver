import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Onboarding, Common } from '../helpers/keys.js';

class OnboardingPage {
  async isOnboardingStepShown(stepKey, timeout = 5000) {
    return isKeyVisible(Onboarding.step(stepKey), timeout);
  }

  async isFieldVisible(fieldKey, timeout = 3000) {
    return isKeyVisible(Onboarding.field(fieldKey), timeout);
  }

  async isPrimaryButtonVisible() {
    return isKeyVisible(Onboarding.primaryButton, 5000);
  }

  async isSkipButtonVisible() {
    return isKeyVisible(Onboarding.skipButton, 3000);
  }

  async tapPrimaryButton() {
    await tapKey(Onboarding.primaryButton);
  }

  async tapSkip() {
    await tapKey(Onboarding.skipButton);
  }

  // Account verification
  async isAccountVerificationShown(timeout = 5000) {
    return isKeyVisible(Onboarding.accountVerificationPage, timeout);
  }

  async isStartDeliveringVisible() {
    return isKeyVisible(Onboarding.accountVerificationStartButton, 5000);
  }

  // Rejected page
  async isRejectedPageShown(timeout = 5000) {
    return isKeyVisible(Onboarding.rejectedPage, timeout);
  }

  async isRejectedAttentionCardVisible() {
    return isKeyVisible(Onboarding.rejectedAttentionCard, 5000);
  }

  async isViewRejectedItemsVisible() {
    return isKeyVisible(Onboarding.rejectedViewItemsButton, 5000);
  }

  // Selfie
  async isSelfiePreviewVisible() {
    return isKeyVisible(Onboarding.selfieCapturedPreview, 3000);
  }

  async isSelfieRetakeButtonVisible() {
    return isKeyVisible(Onboarding.selfieRetakeButton, 3000);
  }

  async isSelfieInfoButtonVisible() {
    return isKeyVisible(Onboarding.selfieInfoButton, 3000);
  }

  // Documents
  async isDocumentBoxVisible(code) {
    return isKeyVisible(Onboarding.documentBox(code), 3000);
  }

  async isDocumentsListVisible() {
    return isKeyVisible(Onboarding.documentsList, 3000);
  }

  // Vehicle photos
  async isPhotoTileVisible(role) {
    return isKeyVisible(Onboarding.photoTile(role), 3000);
  }

  // Work Location
  async isLocationMapShown(timeout = 5000) {
    return isKeyVisible(Onboarding.locationMapPage, timeout);
  }

  async isConfirmLocationVisible() {
    return isKeyVisible(Onboarding.locationMapConfirmButton, 3000);
  }

  async isCurrentLocationPillVisible() {
    return isKeyVisible(Onboarding.locationMapCurrentLocationButton, 3000);
  }
}

export default new OnboardingPage();
