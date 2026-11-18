import { isKeyGone, isKeyVisible, tapKey, typeKey } from '../helpers/flutter.js';
import { Common } from '../helpers/keys.js';

class CountryPickerSheet {
  async isOpen(timeout = 10000) {
    return isKeyVisible(Common.countryPickerSearchField, timeout);
  }

  async search(text) {
    await typeKey(Common.countryPickerSearchField, text);
  }

  /** Taps a country row by ISO code (e.g. NG). The sheet closes. */
  async select(isoCode) {
    await tapKey(Common.countryPickerOption(isoCode));
  }

  async isClosed(timeout = 5000) {
    return isKeyGone(Common.countryPickerSearchField, timeout);
  }
}

export default new CountryPickerSheet();
