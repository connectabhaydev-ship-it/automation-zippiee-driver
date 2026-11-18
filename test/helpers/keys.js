// Widget keys used by the specs. Values must match the app's
// lib/core/constants/app_test_keys.dart; the full list is in the app repo:
// docs/appium_keys_mapping.md / docs/appium_keys_mapping.xlsx.

export const Common = {
  backButton: 'common_shared_backButton',
  resendOtpButton: 'common_shared_resendOtpButton',
  onlineToggle: 'common_shared_onlineToggle',
  appBarTitle: 'common_appBar_title',
  toastMessage: 'common_toast_message',
  phoneCountryCodeButton: 'common_phoneField_countryCodeButton',
  phoneClearButton: 'common_phoneField_clearButton',
  countryPickerSearchField: 'common_countryPicker_searchField',
  countryPickerOption: (isoCode) => `common_countryPicker_option_${isoCode}`,
};

export const SignIn = {
  page: 'auth_signIn_page',
  phoneField: 'auth_signIn_phoneField',
  continueButton: 'auth_signIn_continueButton',
};

export const VerifyOtp = {
  page: 'auth_verifyOtp_page',
  otpField: 'auth_verifyOtp_otpField', // first box: type the full code
  whatsappButton: 'auth_verifyOtp_whatsappButton',
  continueButton: 'auth_verifyOtp_continueButton',
};

export const Dashboard = {
  page: 'dashboard_dashboard_page',
  homeTab: 'dashboard_navBar_homeTab',
  walletTab: 'dashboard_navBar_walletTab',
  ordersTab: 'dashboard_navBar_ordersTab',
  profileTab: 'dashboard_navBar_profileTab',
  permissionsAllowButton: 'dashboard_permissionsSheet_allowButton',
  permissionsNotNowButton: 'dashboard_permissionsSheet_notNowButton',
};

export const Home = {
  sosButton: 'home_topBar_sosButton',
  notificationsButton: 'home_topBar_notificationsButton',
  avatarButton: 'home_topBar_avatarButton',
  scrollView: 'home_home_scrollView',
  earningsTile: 'home_todayProgress_earningsTile',
  tripsTile: 'home_todayProgress_tripsTile',
  timeOnOrdersTile: 'home_todayProgress_timeOnOrdersTile',
  ratingTile: 'home_todayProgress_ratingTile',
  batteryDialogNotNowButton: 'home_batteryDialog_notNowButton',
};

export const Tabs = {
  walletList: 'wallet_wallet_list',
  ordersFilterButton: 'order_list_filterButton',
  ordersList: 'order_list_list',
  profileList: 'profile_profile_list',
};
