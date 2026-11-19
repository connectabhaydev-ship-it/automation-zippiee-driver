import { isKeyVisible, tapKey, typeKey, waitKey } from '../helpers/flutter.js';
import { Common, SignUp } from '../helpers/keys.js';

class SignUpPage {
  async isShown(timeout = 10000) {
    return isKeyVisible(SignUp.signUpPage, timeout);
  }

  async areFieldsVisible() {
    return (
      (await isKeyVisible(SignUp.signUpFullNameField, 5000)) &&
      (await isKeyVisible(SignUp.signUpEmailField, 5000)) &&
      (await isKeyVisible(SignUp.signUpCreateAccountButton, 5000))
    );
  }

  async enterFullName(name) {
    await typeKey(SignUp.signUpFullNameField, name);
  }

  async enterEmail(email) {
    await typeKey(SignUp.signUpEmailField, email);
  }

  async enterReferralCode(code) {
    if (await isKeyVisible(SignUp.signUpReferralCodeField, 3000)) {
      await typeKey(SignUp.signUpReferralCodeField, code);
    }
  }

  async tapCreateAccount() {
    await tapKey(SignUp.signUpCreateAccountButton);
  }
}

export default new SignUpPage();
