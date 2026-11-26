import 'dotenv/config';

// Test account values come from .env (see .env.example). Never hardcode a
// real phone number or OTP in a spec.
const env = (key, fallback = '') => process.env[key]?.trim() || fallback;

export const TestData = {
  /** ISO code of the country to pick on sign-in, e.g. NG. */
  countryIso: env('TEST_COUNTRY_ISO', 'NG'),
  /** Country name typed into the picker search, e.g. Nigeria. */
  countryName: env('TEST_COUNTRY_NAME', 'Nigeria'),
  /** Dial code shown after picking the country, e.g. +234. */
  dialCode: env('TEST_DIAL_CODE', '+234'),
  /** Staging driver number WITHOUT the dial code (approved driver account). */
  phone: env('TEST_PHONE_NUMBER'),
  /** Fixed staging OTP for that number. */
  otp: env('TEST_OTP'),
  /** A wrong OTP for the negative case; empty = that case is skipped. */
  wrongOtp: env('TEST_WRONG_OTP'),
  /** A number that is too short to be valid. */
  invalidPhone: env('TEST_INVALID_PHONE', '123'),
  /** A NEW unregistered 10-digit number (NG mobile format) on every read. */
  get randomPhone() {
    const prefix = ['70', '80', '81', '90', '91'][Math.floor(Math.random() * 5)];
    return prefix + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
  },
  // ---------- Bank account (added automatically when the driver has none) ----------
  /** Bank code of the dropdown option (common_dropdown_option_<code>), e.g. 044 = Access Bank. */
  bankCode: env('TEST_BANK_CODE', '044'),
  /** Text typed in the bank search box to bring that option on screen. */
  bankSearch: env('TEST_BANK_SEARCH', 'Access Bank'),
  /** 10-digit NUBAN account number. */
  bankAccountNumber: env('TEST_BANK_ACCOUNT_NO', '0690000031'),
  /** Typed only when the app can't resolve the name itself. */
  bankAccountName: env('TEST_BANK_ACCOUNT_NAME', 'Automation Test Driver'),

  /** Optional: a BLOCKED driver number for the account-blocked case (empty = skipped). */
  blockedPhone: env('TEST_BLOCKED_PHONE'),

  // ---------- Order lifecycle (10-order-flow) ----------
  /** Driver app package (the app under test). */
  driverAppPackage: env('ANDROID_APP_PACKAGE', 'dev.zippieedriver.android'),
  /** Customer app used to place the test order (installed + logged in). */
  customerAppPackage: env('CUSTOMER_APP_PACKAGE', 'dev.zippiee.android'),
  /**
   * Restaurant to order from, exactly as shown in the customer app. Must be the
   * restaurant logged in to the Restaurant Partner panel (it accepts the order
   * and marks it Ready). Empty = first restaurant in the list.
   */
  restaurantName: env('CUSTOMER_RESTAURANT'),
  /**
   * Customer's 4-digit delivery code. Empty = read it from the customer app
   * ("Your PIN"); if that fails, the test waits for you to type it.
   */
  deliveryCode: env('TEST_DELIVERY_CODE'),
  /** A wrong delivery code for the negative case (must differ from the real one). */
  wrongDeliveryCode: env('TEST_WRONG_DELIVERY_CODE', '9999'),
  /** Seconds to wait for an order offer after going ONLINE. */
  offerTimeoutSec: Number(env('ORDER_OFFER_TIMEOUT_SEC', '120')),
  /** Seconds to wait for the restaurant to mark the order ready. */
  readyTimeoutSec: Number(env('ORDER_READY_TIMEOUT_SEC', '600')),
  /** Seconds to wait for a manual step on the phone (typing the delivery code). */
  manualStepTimeoutSec: Number(env('ORDER_MANUAL_STEP_TIMEOUT_SEC', '300')),
};

export function requireTestAccount() {
  if (!TestData.phone || !TestData.otp) {
    throw new Error(
      'Set TEST_PHONE_NUMBER and TEST_OTP in .env (staging test driver with a fixed OTP).',
    );
  }
}
