import { isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { SignUp, AccountBlocked, Common } from '../helpers/keys.js';

class SignUpPage {
  async isSignUpPageShown(timeout = 5000) {
    return isKeyVisible(SignUp.page, timeout);
  }

  async isFullNameFieldVisible() {
    return isKeyVisible(SignUp.fullNameField, 5000);
  }

  async isEmailFieldVisible() {
    return isKeyVisible(SignUp.emailField, 5000);
  }

  async isDobFieldVisible() {
    return isKeyVisible(SignUp.dobField, 5000);
  }

  async isNinFieldVisible() {
    return isKeyVisible(SignUp.ninField, 5000);
  }

  async isNinInfoButtonVisible() {
    return isKeyVisible(SignUp.ninInfoButton, 3000);
  }

  async isReferralCodeFieldVisible() {
    return isKeyVisible(SignUp.referralCodeField, 5000);
  }

  async isCreateAccountButtonVisible() {
    return isKeyVisible(SignUp.createAccountButton, 5000);
  }

  async enterFullName(name) {
    await typeKey(SignUp.fullNameField, name);
  }

  async enterEmail(email) {
    await typeKey(SignUp.emailField, email);
  }

  async enterNin(nin) {
    await typeKey(SignUp.ninField, nin);
  }

  async enterReferralCode(code) {
    await typeKey(SignUp.referralCodeField, code);
  }

  async tapCreateAccount() {
    await tapKey(SignUp.createAccountButton);
  }

  // Account Blocked / Suspended states
  async isAccountBlockedPageShown(timeout = 5000) {
    return isKeyVisible(AccountBlocked.page, timeout);
  }

  async isContactSupportButtonVisible() {
    return isKeyVisible(AccountBlocked.contactSupportButton, 5000);
  }

  async isContinueToLoginButtonVisible() {
    return isKeyVisible(AccountBlocked.continueToLoginButton, 5000);
  }

  async tapContinueToLogin() {
    await tapKey(AccountBlocked.continueToLoginButton);
  }
}

export default new SignUpPage();
