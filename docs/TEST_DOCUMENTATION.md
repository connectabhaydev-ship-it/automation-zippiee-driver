# Zippiee Driver – Complete Test Automation Documentation

> **Application:** Zippiee Driver Mobile App (Flutter)  
> **Automation Framework:** WebdriverIO (v9) + Mocha + Appium (v3) with Flutter Integration Driver  
> **Test Keys Source:** `appium_keys_mapping.xlsx` (Google Sheet / `docs/appium_keys_mapping.xlsx`)  
> **Backend Environment:** Staging  
> **Supported Platforms:** Android (APK / Emulator & Device) & iOS (IPA / iPhone)  

---

## 1. Executive Summary & Overview

This document provides complete documentation for the automated UI test suite and key mapping specifications of the **Zippiee Driver** mobile application.

The test suite automates end-to-end user journeys and screen verifications for delivery drivers. The automation relies on **Flutter ValueKeys** exposed by the app's `AppTestKeys` Dart constants (`lib/core/constants/app_test_keys.dart`), allowing reliable, non-flaky test execution across Android and iOS platforms without depending on language-dependent text or fragile XPath selectors.

---

## 2. Test Architecture & Design Principles

### 2.1 The Flutter Integration Driver
The test automation runs on the `appium-flutter-integration-driver`. Unlike traditional UIAutomator2 or XCUITest drivers that interact with native platform accessibility layers, Flutter's internal render tree is addressed via integration hooks:

```javascript
// Driver strategies
-flutter key               // Matches ValueKey('...')
-flutter text              // Matches exact visible text
-flutter text containing   // Matches substring
-flutter semantics label   // Matches Semantics(label: ...)
-flutter type              // Matches Flutter widget class
```

### 2.2 Client-Side Smart Polling vs. Server-Side Hanging
In `test/helpers/flutter.js`, element waits are polled on the client side (`byKey` inside `poll()`):
- Server-side `flutter: waitForVisible` and `flutter: waitForAbsent` rely on `pumpAndSettle()`. If an element does not appear or if continuous animations run, the server-side wait blocks indefinitely, causing `socket hang up` or `Guarded function conflict`.
- Client-side polling checks element presence with a short interval (`250ms`) up to a specified timeout, guaranteeing clean failure reporting and avoiding session crashes.

### 2.3 Sequential Single-Session Flow (`MAIN_FLOW`)
Running a full reinstall and login before every single spec creates extreme test overhead (60+ seconds per spec). To optimize pipeline runtime and test each feature domain thoroughly without jumping back and forth, the primary specs run sequentially in **ONE continuous Appium session**:

```
[01 Sign In] → [02 Verify OTP] → [03 Home & Notifications] → [04 Wallet Module] → 
[05 Orders Module] → [06 Profile Module]
```

#### Module-by-Module Step-by-Step Completeness:
1. **Module Completion Once:** Every module (Wallet, Orders, Profile) tests its core dashboard views, deep feature pages (e.g. Deposit, Withdraw, Transaction History, Filters, Vehicle Details, Refer & Earn, Help & Support, Logout confirmation), and returns cleanly to the Home tab before proceeding to the next module. This prevents fragmented testing and avoids redundant navigation between tabs.
2. **Initial State:** Spec `01` starts with a fresh install logged out on the Sign In screen.
3. **Handoff Contract:** Each spec begins at the Home tab (or Sign In / Dashboard) and returns to the Home tab before ending.
4. **Pushed Pages Must Be Popped:** Any opened sheet, modal, or pushed sub-page is closed via `goBack()` or close button before ending the test.
5. **Staging Safety & Idempotency:** Tests running on the shared staging account (`TEST_PHONE_NUMBER`) are strictly **read-only**: they open and inspect screens and navigate back. They **never** initiate live wallet withdrawals, deposit real funds, edit driver KYC documents, delete accounts, or permanently log out.

---

## 3. Test Suites & Execution Reference

### 3.1 Running Tests
```bash
# Terminal 1: Start Appium server
appium

# Terminal 2: Run all main flow tests on Android
npm run test:android

# Run on iOS
npm run test:ios
```

### 3.2 Running Targeted Suites
You can run individual functional suites using WebdriverIO `--suite`:

| Suite Name | Command | Description |
|---|---|---|
| **login** | `npx wdio run wdio.conf.js --suite login` | Fresh install → Phone input → OTP verify → Dashboard |
| **home** | `npx wdio run wdio.conf.js --suite home` | Login → Home progress tiles, map & notifications |
| **wallet** | `npx wdio run wdio.conf.js --suite wallet` | Login → Home → Wallet carousel, Deposit, Withdraw, History |
| **orders** | `npx wdio run wdio.conf.js --suite orders` | Login → Home → Orders history, tabs & filter sheet |
| **profile** | `npx wdio run wdio.conf.js --suite profile` | Login → Home → Profile settings, Performance, Vehicle, Refer |
| **signup** | `npx wdio run wdio.conf.js --suite signup` | Standalone: Sign-up registration form & blocked screen |
| **activeOrder** | `npx wdio run wdio.conf.js --suite activeOrder` | Standalone: Active delivery order lifecycle & in-app chat |

### 3.3 Automated Test Execution Reporting (HTML & Markdown)
On **every test run**, WebdriverIO automatically generates comprehensive reports in the designated output directory:
- **`reports/index.html`**: A standalone, interactive HTML report with:
  - Total test count, pass rate, passed, failed, and skipped metrics.
  - Interactive status filters (All / Passed / Failed / Skipped) and a real-time search input.
  - Progress bar and individual test execution timings.
  - Formatted error messages and collapsible stack traces for failed assertions.
  - Fully offline-capable styling with embedded CSS.
- **`reports/report.md`**: Clean GitHub-flavored markdown summary of the run for CI/CD annotations or pull request comments.
- **`reports/report.json`**: Machine-readable JSON summary containing start time, end time, suites, test results, durations, and error details.

### 3.4 Module-by-Module Execution Mode
To test the application step-by-step and inspect results per functional module rather than all at once, you can execute individual modules using dedicated npm scripts or CLI flags:

| Module Target | NPM Command | Target Suite | Output Directory | Manual Tracker Codes Covered |
|---|---|---|---|---|
| **01. Auth (Sign In & OTP)** | `npm run test:module:auth` | `auth` | `reports/01-auth/` | `AS-01..AS-06`, `AU-01..AU-16` |
| **02. Home & Notifications** | `npm run test:module:home` | `home` | `reports/02-home/` | `PR-01..PR-03`, `HM-01..HM-15`, `NT-01..NT-05` |
| **03. Wallet Module** | `npm run test:module:wallet` | `wallet` | `reports/03-wallet/` | `WL-01..WL-25` |
| **04. Orders Module** | `npm run test:module:orders` | `orders` | `reports/04-orders/` | `OH-01..OH-11` |
| **05. Profile Module** | `npm run test:module:profile` | `profile` | `reports/05-profile/` | `PF-01..PF-17`, `VD-01..VD-09`, `RF-01..RF-05` |
| **06. Sign-Up & Registration** | `npm run test:module:signup` | `signup` | `reports/06-signup/` | `AU-18..AU-27` |
| **07. Active Order & Delivery** | `npm run test:module:active-order` | `activeOrder` | `reports/07-activeOrder/` | `OF-01..OF-17`, `OD-01..OD-26`, `CT-01..CT-08` |
| **All Modules (One by One)** | `npm run test:modules` | Sequential runner | Generates separate reports for each module + master dashboard | Full suite coverage |

### 3.5 Separate Per-Module Reports & Master Dashboard
When running module by module:
1. **Isolated Module Reports:** Each module writes its own self-contained report to `reports/<module>/`:
   - `reports/<module>/index.html`: Dedicated interactive HTML report with module title and back navigation.
   - `reports/<module>/report.md`: Markdown summary for that specific module.
   - `reports/<module>/report.json`: Machine-readable results for that specific module.
2. **Master Multi-Module Dashboard (`reports/index.html`):**
   - Automatically aggregates all executed module results.
   - Displays overall progress, cumulative pass rate, and execution timings.
   - Provides direct one-click navigation cards to open any individual module report.
   - Includes a cross-reference matrix linking automated test cases to the manual test tracker.

---

## 4. Complete Test Cases Specification Matrix (TC01 – TC56)

### 4.1 Main Flow Suites (Sequential Execution TC01 – TC48)

| Test ID | Module | Screen | Objective / Summary | Pre-conditions | Test Steps | Expected Result | Key / Locator Used |
|---|---|---|---|---|---|---|---|
| **TC01** | Auth | Sign In | Verify sign-in page displays phone input and Continue button | App launched fresh | 1. Wait for splash to complete<br>2. Check phone input<br>3. Check Continue button | Phone field & Continue button are visible | `auth_signIn_page`<br>`auth_signIn_phoneField`<br>`auth_signIn_continueButton` |
| **TC02** | Auth | Sign In | Verify presence of title and subtitle headers | On Sign In screen | 1. Check title text<br>2. Check subtitle text | Headers are displayed correctly | Text: "Sign in to your account"<br>Text: "Login or create an account" |
| **TC03** | Auth | Sign In | Negative validation: Empty phone number cannot proceed | Phone field is empty | 1. Tap Continue button | Screen stays on Sign In; OTP page is NOT opened | `auth_signIn_continueButton`<br>`auth_verifyOtp_page` absent |
| **TC04** | Auth | Sign In | Open country picker bottom sheet | On Sign In screen | 1. Tap country code picker button | Country picker bottom sheet opens | `common_phoneField_countryCodeButton`<br>`common_countryPicker_searchField` |
| **TC05** | Auth | Country Picker | Search and select test country (Nigeria) | Country picker open | 1. Type country name in search<br>2. Tap country option row (NG) | Sheet closes and dial code (+234) updates | `common_countryPicker_searchField`<br>`common_countryPicker_option_NG` |
| **TC06** | Auth | Sign In | Negative validation: Too-short phone number cannot proceed | On Sign In screen | 1. Enter invalid short number (e.g. "123")<br>2. Tap Continue | Screen stays on Sign In | `auth_signIn_phoneField`<br>`auth_signIn_continueButton` |
| **TC07** | Auth | Sign In | Clear button resets phone input field | Field contains text | 1. Tap phone field to focus<br>2. Tap clear (✕) button | Field is emptied and clear button disappears | `common_phoneField_clearButton` |
| **TC08** | Auth | Sign In | Valid staging number navigates to Verify OTP screen | Valid phone entered | 1. Enter valid staging phone number<br>2. Tap Continue button | OTP verification page opens | `auth_signIn_phoneField`<br>`auth_signIn_continueButton`<br>`auth_verifyOtp_page` |
| **TC09** | Auth | Verify OTP | Verify OTP input field, Continue and Back buttons | On Verify OTP screen | 1. Inspect OTP input field<br>2. Inspect Continue button<br>3. Inspect Back button | All three core OTP elements are displayed | `auth_verifyOtp_otpField`<br>`auth_verifyOtp_continueButton`<br>`common_shared_backButton` |
| **TC10** | Auth | Verify OTP | Resend OTP link is hidden while timer countdown is active | Timer is counting down | 1. Check visibility of Resend OTP link | Resend link is NOT visible during initial countdown | `common_shared_resendOtpButton` |
| **TC11** | Auth | Verify OTP | Negative validation: Incomplete OTP does not submit | Incomplete code entered | 1. Enter 2 digits of OTP<br>2. Tap Continue | Stays on OTP screen | `auth_verifyOtp_otpField`<br>`auth_verifyOtp_continueButton` |
| **TC12** | Auth | Verify OTP | Back returns to Sign In; Continue re-opens OTP | On Verify OTP screen | 1. Tap Back button<br>2. Re-enter number & tap Continue | Successfully returns to Sign In and navigates back to OTP | `common_shared_backButton`<br>`auth_signIn_page`<br>`auth_verifyOtp_page` |
| **TC13** | Auth | Verify OTP | Negative validation: Wrong OTP rejected | Wrong OTP configured | 1. Enter wrong OTP code<br>2. Tap Continue | Screen rejects code and stays on OTP screen | `auth_verifyOtp_otpField`<br>`auth_verifyOtp_page` |
| **TC14** | Auth | Verify OTP | Correct OTP authenticates driver and opens dashboard | On Verify OTP screen | 1. Enter valid staging OTP code | Driver is authenticated; dashboard shell is displayed | `auth_verifyOtp_otpField`<br>`dashboard_dashboard_page` |
| **TC15** | Dashboard | Home | Dismiss startup permission or battery optimization sheets | Post-login dashboard | 1. Check if permission sheet shows → Dismiss<br>2. Check if battery dialog shows → Dismiss | Dashboard is visible and usable | `dashboard_permissionsSheet_notNowButton`<br>`home_batteryDialog_notNowButton` |
| **TC16** | Dashboard | Home | Verify top bar controls (Online switch, notifications, avatar) | On Home tab | 1. Check online toggle switch<br>2. Check notification bell<br>3. Check avatar button | All 3 top bar controls are present | `common_shared_onlineToggle`<br>`home_topBar_notificationsButton`<br>`home_topBar_avatarButton` |
| **TC17** | Home | Progress | Verify "Today's progress" metric cards | On Home tab | 1. Check earnings tile<br>2. Check trips tile<br>3. Check time on orders tile<br>4. Check rating tile | All 4 progress cards are rendered | `home_todayProgress_earningsTile`<br>`home_todayProgress_tripsTile`<br>`home_todayProgress_timeOnOrdersTile`<br>`home_todayProgress_ratingTile` |
| **TC18** | Dashboard | Bottom Bar | Verify all 4 primary navigation tabs | On Dashboard | 1. Check Home tab<br>2. Check Wallet tab<br>3. Check Orders tab<br>4. Check Profile tab | All 4 bottom navigation tabs are displayed | `dashboard_navBar_homeTab`<br>`dashboard_navBar_walletTab`<br>`dashboard_navBar_ordersTab`<br>`dashboard_navBar_profileTab` |
| **TC19** | Notifications | List | Notification bell opens Notifications screen | On Home tab | 1. Tap notification bell in top bar | Notifications page opens | `home_topBar_notificationsButton`<br>`notifications_list_page` |
| **TC20** | Notifications | List | Verify All, Unread, and Read filter tabs | Notifications open | 1. Check filter tabs (all, unread, read) | All 3 tabs are displayed | `notifications_list_tab_all`<br>`notifications_list_tab_unread`<br>`notifications_list_tab_read` |
| **TC21** | Notifications | List | Switch filter tabs without leaving page | Notifications open | 1. Tap Unread tab<br>2. Tap All tab | Driver remains on Notifications page | `notifications_list_tab_unread`<br>`notifications_list_tab_all`<br>`notifications_list_page` |
| **TC22** | Notifications | List | Back button returns to Home dashboard | Notifications open | 1. Tap Back button | Notifications closes; Home content displayed | `common_shared_backButton`<br>`home_home_scrollView` |
| **TC23** | Wallet | Overview | Bottom bar Wallet tab opens wallet | On Home tab | 1. Tap Wallet tab in bottom bar | Wallet tab opens with wallet list | `dashboard_navBar_walletTab`<br>`wallet_wallet_list` |
| **TC24** | Wallet | Balance | Verify balance carousel and Total Balance card | On Wallet tab | 1. Check carousel container<br>2. Check total balance card | Carousel and total card are displayed | `wallet_wallet_balanceCarousel`<br>`wallet_wallet_balanceCard_total` |
| **TC25** | Wallet | Balance | Verify Withdrawable balance card in carousel | On Wallet tab | 1. Check withdrawable card in carousel | Withdrawable balance card is accessible | `wallet_wallet_balanceCard_withdrawable` |
| **TC26** | Wallet | Balance | Eye icon toggles total balance amount visibility | On Wallet tab | 1. Tap eye toggle (hide)<br>2. Tap eye toggle (show) | Total balance card toggles visibility state | `wallet_wallet_visibilityToggle_total` |
| **TC27** | Wallet | Quick Actions | Verify Deposit and Withdraw quick action buttons | On Wallet tab | 1. Check Deposit button<br>2. Check Withdraw button | Both action buttons are displayed | `wallet_wallet_depositButton`<br>`wallet_wallet_withdrawButton` |
| **TC28** | Wallet | Deposit | Deposit quick action opens Deposit screen, Back returns | On Wallet tab | 1. Tap Deposit button<br>2. Verify amount field & Add button<br>3. Tap Back | Deposit page renders correctly and returns to Wallet | `wallet_wallet_depositButton`<br>`wallet_deposit_page`<br>`wallet_deposit_amountField` |
| **TC29** | Wallet | Withdraw | Withdraw quick action opens Withdraw screen or prompt | On Wallet tab | 1. Tap Withdraw button<br>2. Verify fields or dismiss 0-balance prompt<br>3. Return to Wallet | Withdraw flow opens properly and returns safely | `wallet_wallet_withdrawButton`<br>`wallet_withdraw_page`<br>`wallet_withdrawalUnavailable_dialog` |
| **TC30** | Wallet | History | Transaction history link opens list, Back returns | On Wallet tab | 1. Tap Transaction History link<br>2. Verify list/search<br>3. Tap Back | Transaction history opens and returns to Wallet | `wallet_wallet_transactionHistoryLink`<br>`wallet_transactionHistory_page` |
| **TC31** | Wallet | Navigation | Return driver safely back to Home tab | On Wallet tab | 1. Tap Home tab in bottom bar | Home tab content is displayed | `dashboard_navBar_homeTab`<br>`home_home_scrollView` |
| **TC32** | Orders | Overview | Bottom bar Orders tab opens order history | On Home tab | 1. Tap Orders tab in bottom bar | Orders tab opens with list / filter button | `dashboard_navBar_ordersTab`<br>`order_list_list`<br>`order_list_filterButton` |
| **TC33** | Orders | Status Tabs | Verify All, Completed, Cancelled, Rejected status tabs | On Orders tab | 1. Inspect status filter tabs | All 4 order status tabs are visible | `order_list_tab_all`<br>`order_list_tab_completed`<br>`order_list_tab_cancelled`<br>`order_list_tab_rejected` |
| **TC34** | Orders | Status Tabs | Switch status tabs without leaving Orders screen | On Orders tab | 1. Tap Completed tab<br>2. Tap All tab | Driver remains on Orders page | `order_list_tab_completed`<br>`order_list_tab_all` |
| **TC35** | Orders | Filters | Filter icon opens Order Filters bottom sheet, close button exits | On Orders tab | 1. Tap filter button<br>2. Verify filter controls<br>3. Tap close button | Filter sheet opens and closes without altering state | `order_list_filterButton`<br>`order_filters_applyButton`<br>`common_shared_modalCloseButton` |
| **TC36** | Orders | List | Verify order history list container is present | On Orders tab | 1. Check order list | Order list container is visible | `order_list_list` |
| **TC37** | Orders | Navigation | Return driver safely back to Home tab | On Orders tab | 1. Tap Home tab in bottom bar | Home tab content is displayed | `dashboard_navBar_homeTab`<br>`home_home_scrollView` |
| **TC38** | Profile | Overview | Bottom bar Profile tab opens driver profile | On Home tab | 1. Tap Profile tab in bottom bar | Profile list page is displayed | `dashboard_navBar_profileTab`<br>`profile_profile_list` |
| **TC39** | Profile | Tiles | Verify Profile Settings and Performance tiles | On Profile tab | 1. Check Profile settings tile<br>2. Check Performance tile | Both core tiles are displayed | `profile_profile_settingsTile`<br>`profile_profile_performanceTile` |
| **TC40** | Profile | Settings | Profile Settings opens and Back returns | On Profile tab | 1. Tap Profile Settings<br>2. Tap Back | Opens settings page and returns to Profile tab | `profile_profile_settingsTile`<br>`profile_settings_page`<br>`common_shared_backButton` |
| **TC41** | Profile | Performance | Performance shows acceptance & rejection rates | On Profile tab | 1. Tap Performance tile<br>2. Check rates<br>3. Tap Back | Acceptance & rejection rates shown; returns to profile | `profile_performance_acceptanceRateTile`<br>`profile_performance_rejectionRateTile` |
| **TC42** | Profile | Features | Verify secondary navigation tiles (Vehicle, Refer, Help, Logout) | On Profile tab | 1. Scroll and inspect secondary tiles | Vehicle, Refer, Help, and Logout tiles are present | `profile_profile_vehicleDetailsTile`<br>`profile_profile_referAndEarnTile`<br>`profile_profile_helpTile`<br>`profile_profile_logoutTile` |
| **TC43** | Profile | Vehicle | Vehicle details opens, displays vehicle info, Back returns | On Profile tab | 1. Tap Vehicle Details tile<br>2. Verify vehicle info<br>3. Tap Back | Vehicle details page displays and returns | `profile_profile_vehicleDetailsTile`<br>`profile_vehicleDetails_page`<br>`profile_vehicleDetails_infoCard` |
| **TC44** | Profile | Refer & Earn | Refer & Earn opens, shows referral code & share actions | On Profile tab | 1. Tap Refer & Earn tile<br>2. Verify code & share<br>3. Tap Back | Referral code and share action visible; returns | `profile_profile_referAndEarnTile`<br>`profile_referAndEarn_page`<br>`profile_referAndEarn_codeText` |
| **TC45** | Profile | Help & Support | Help & Support opens, shows support actions, Back returns | On Profile tab | 1. Tap Help & Support tile<br>2. Verify email button<br>3. Tap Back | Help page displays and returns to profile | `profile_profile_helpTile`<br>`profile_helpSupport_page`<br>`profile_helpSupport_sendEmailButton` |
| **TC46** | Profile | Logout | Logout modal opens, Cancel button safely keeps session active | On Profile tab | 1. Tap Logout tile<br>2. Verify confirm & cancel<br>3. Tap Cancel button | Logout modal opens and cancels safely | `profile_profile_logoutTile`<br>`profile_logout_confirmButton`<br>`profile_logout_cancelButton` |
| **TC47** | Home | Avatar | Top bar avatar opens Profile and Home tab returns | On Home tab | 1. Tap avatar button<br>2. Tap Home tab | Avatar navigates to profile; Home tab returns home | `home_topBar_avatarButton`<br>`profile_profile_list`<br>`dashboard_navBar_homeTab` |
| **TC48** | Profile | Navigation | Return driver safely back to Home tab | On Profile tab | 1. Tap Home tab in bottom bar | Home tab content is displayed | `dashboard_navBar_homeTab`<br>`home_home_scrollView` |

### 4.2 Standalone Suites (Isolated Execution TC49 – TC56)

| Test ID | Module | Screen | Objective / Summary | Pre-conditions | Test Steps | Expected Result | Key / Locator Used |
|---|---|---|---|---|---|---|---|
| **TC49** | Auth | Sign Up | Verify Sign Up registration fields and NIN tooltip | On Sign Up screen | 1. Verify Full Name field<br>2. Verify Email field<br>3. Verify NIN info button<br>4. Verify Create Account button | All mandatory driver registration fields are rendered | `auth_signUp_page`<br>`auth_signUp_fullNameField`<br>`auth_signUp_emailField`<br>`auth_signUp_ninInfoButton` |
| **TC50** | Auth | Blocked | Verify Account Blocked screen layout and contact action | Blocked driver account | 1. Check blocked page root<br>2. Check contact support button | Screen displays blocking notice and support contact | `auth_accountBlocked_page`<br>`auth_accountBlocked_contactSupportButton`<br>`auth_accountBlocked_continueToLoginButton` |
| **TC51** | Order | Dispatch | Handle incoming order request dialog (Accept / Reject) | In-app order dispatched | 1. Check incoming order dialog<br>2. Check Accept & Reject buttons | Driver can view order items, accept or reject | `common_newOrderRequest_dialog`<br>`common_newOrderRequest_acceptButton`<br>`common_newOrderRequest_rejectButton` |
| **TC52** | Order | Tracking | Verify in-progress order tracking card and contact options | Active order assigned | 1. Check current order page<br>2. Check customer call button<br>3. Check chat button<br>4. Check navigation button | Tracking map, details, and communication options displayed | `order_currentOrder_page`<br>`order_currentOrder_detailsCard`<br>`order_currentOrder_callButton`<br>`order_currentOrder_chatButton` |
| **TC53** | Order | Chat | Verify order chat messaging controls when active | On Order Chat screen | 1. Check input text field<br>2. Check send button | Driver can send in-app messages to customer/support | `chat_orderChat_page`<br>`chat_input_textField`<br>`chat_input_sendButton` |
| **TC54** | Order | Pickup | Verify order pickup confirmation screen controls | At merchant pickup | 1. Check pickup page root<br>2. Check receipt card<br>3. Check Confirm Pickup button | Driver can verify items and confirm pickup | `order_pickup_page`<br>`order_pickup_receiptCard`<br>`order_pickup_confirmButton` |
| **TC55** | Order | Drop-off | Verify drop-off customer delivery OTP screen controls | At customer destination | 1. Check drop page root<br>2. Check OTP input field<br>3. Check Confirm Delivery button | Driver can input customer delivery PIN | `order_drop_page`<br>`order_drop_otpField`<br>`order_drop_confirmButton` |
| **TC56** | Order | Complete | Verify delivery complete summary screen and Next Order button | Order completed | 1. Check complete page root<br>2. Check earnings text<br>3. Check Next Order button | Summary of earnings shown with button to return to available pool | `order_deliveryComplete_page`<br>`order_deliveryComplete_earningsText`<br>`order_deliveryComplete_nextOrderButton` |

---

## 5. Complete Key Mapping Catalog (By Feature Domain)

All 381 keys from `appium_keys_mapping.xlsx` are exported through `test/helpers/keys.js`:

### 5.1 Common (`Common`)
- `Common.backButton`: `'common_shared_backButton'`
- `Common.modalCloseButton`: `'common_shared_modalCloseButton'`
- `Common.resendOtpButton`: `'common_shared_resendOtpButton'`
- `Common.errorRetryButton`: `'common_shared_errorRetryButton'`
- `Common.onlineToggle`: `'common_shared_onlineToggle'`
- `Common.currentLocationButton`: `'common_shared_currentLocationButton'`
- `Common.dropdownOption(value)`: ``common_dropdown_option_${value}``
- `Common.dropdownSearchField`: `'common_dropdown_searchField'`
- `Common.dropdownSearchClearButton`: `'common_dropdown_searchClearButton'`
- `Common.ratingStar(star)`: ``common_starRating_star_${star}``
- `Common.appBarTitle`: `'common_appBar_title'`
- `Common.screenHeaderTitle`: `'common_screenHeader_title'`
- `Common.toastMessage`: `'common_toast_message'`
- `Common.phoneCountryCodeButton`: `'common_phoneField_countryCodeButton'`
- `Common.phoneClearButton`: `'common_phoneField_clearButton'`
- `Common.countryPickerSearchField`: `'common_countryPicker_searchField'`
- `Common.countryPickerOption(isoCode)`: ``common_countryPicker_option_${isoCode}``
- `Common.newOrderRequestDialog`: `'common_newOrderRequest_dialog'`
- `Common.newOrderRequestAcceptButton`: `'common_newOrderRequest_acceptButton'`
- `Common.newOrderRequestRejectButton`: `'common_newOrderRequest_rejectButton'`

### 5.2 Authentication (`SignIn`, `VerifyOtp`, `SignUp`, `AccountBlocked`)
- `SignIn.page`: `'auth_signIn_page'`
- `SignIn.phoneField`: `'auth_signIn_phoneField'`
- `SignIn.continueButton`: `'auth_signIn_continueButton'`
- `VerifyOtp.page`: `'auth_verifyOtp_page'`
- `VerifyOtp.otpField`: `'auth_verifyOtp_otpField'`
- `VerifyOtp.whatsappButton`: `'auth_verifyOtp_whatsappButton'`
- `VerifyOtp.continueButton`: `'auth_verifyOtp_continueButton'`
- `SignUp.signUpPage`: `'auth_signUp_page'`
- `SignUp.signUpFullNameField`: `'auth_signUp_fullNameField'`
- `SignUp.signUpEmailField`: `'auth_signUp_emailField'`
- `SignUp.signUpDobField`: `'auth_signUp_dobField'`
- `SignUp.signUpNinField`: `'auth_signUp_ninField'`
- `SignUp.signUpNinInfoButton`: `'auth_signUp_ninInfoButton'`
- `SignUp.signUpReferralCodeField`: `'auth_signUp_referralCodeField'`
- `SignUp.signUpCreateAccountButton`: `'auth_signUp_createAccountButton'`
- `AccountBlocked.accountBlockedPage`: `'auth_accountBlocked_page'`
- `AccountBlocked.accountBlockedContactButton`: `'auth_accountBlocked_contactSupportButton'`
- `AccountBlocked.accountBlockedContinueButton`: `'auth_accountBlocked_continueToLoginButton'`

### 5.3 Dashboard & Home (`Dashboard`, `Home`)
- `Dashboard.page`: `'dashboard_dashboard_page'`
- `Dashboard.homeTab`: `'dashboard_navBar_homeTab'`
- `Dashboard.walletTab`: `'dashboard_navBar_walletTab'`
- `Dashboard.ordersTab`: `'dashboard_navBar_ordersTab'`
- `Dashboard.profileTab`: `'dashboard_navBar_profileTab'`
- `Dashboard.permissionsAllowButton`: `'dashboard_permissionsSheet_allowButton'`
- `Dashboard.permissionsNotNowButton`: `'dashboard_permissionsSheet_notNowButton'`
- `Home.sosButton`: `'home_topBar_sosButton'`
- `Home.notificationsButton`: `'home_topBar_notificationsButton'`
- `Home.avatarButton`: `'home_topBar_avatarButton'`
- `Home.scrollView`: `'home_home_scrollView'`
- `Home.earningsTile`: `'home_todayProgress_earningsTile'`
- `Home.tripsTile`: `'home_todayProgress_tripsTile'`
- `Home.timeOnOrdersTile`: `'home_todayProgress_timeOnOrdersTile'`
- `Home.ratingTile`: `'home_todayProgress_ratingTile'`
- `Home.batteryDialogNotNowButton`: `'home_batteryDialog_notNowButton'`

### 5.4 Wallet (`Wallet`, `Payments`)
- `Wallet.list`: `'wallet_wallet_list'`
- `Wallet.balanceCarousel`: `'wallet_wallet_balanceCarousel'`
- `Wallet.balanceCard(card)`: ``wallet_wallet_balanceCard_${card}`` (`total`, `withdrawable`)
- `Wallet.visibilityToggle(card)`: ``wallet_wallet_visibilityToggle_${card}``
- `Wallet.depositButton`: `'wallet_wallet_depositButton'`
- `Wallet.withdrawButton`: `'wallet_wallet_withdrawButton'`
- `Wallet.walletTransactionHistoryLink`: `'wallet_wallet_transactionHistoryLink'`
- `Wallet.walletWithdrawalSeeAllButton`: `'wallet_wallet_withdrawalSeeAllButton'`
- `Wallet.withdrawPage`: `'wallet_withdraw_page'`
- `Wallet.withdrawAmountField`: `'wallet_withdraw_amountField'`
- `Wallet.withdrawBankDropdown`: `'wallet_withdraw_bankDropdown'`
- `Wallet.withdrawSubmitButton`: `'wallet_withdraw_submitButton'`
- `Wallet.withdrawalUnavailableDialog`: `'wallet_withdrawalUnavailable_dialog'`
- `Wallet.transactionHistoryPage`: `'wallet_transactionHistory_page'`
- `Wallet.transactionHistorySearchField`: `'wallet_transactionHistory_searchField'`
- `Wallet.transactionHistoryList`: `'wallet_transactionHistory_list'`
- `Payments.depositPage`: `'wallet_deposit_page'`
- `Payments.depositAmountField`: `'wallet_deposit_amountField'`
- `Payments.depositAddFundsButton`: `'wallet_deposit_addFundsButton'`

### 5.5 Orders (`Orders`, `OrderChat`)
- `Orders.list`: `'order_list_list'`
- `Orders.filterButton`: `'order_list_filterButton'`
- `Orders.tab(filter)`: ``order_list_tab_${filter}`` (`all`, `completed`, `cancelled`, `rejected`)
- `Orders.orderFilterApplyButton`: `'order_filters_applyButton'`
- `Orders.orderFilterClearButton`: `'order_filters_clearButton'`
- `Orders.currentOrderPage`: `'order_currentOrder_page'`
- `Orders.currentOrderDetailsCard`: `'order_currentOrder_detailsCard'`
- `Orders.currentOrderCallButton`: `'order_currentOrder_callButton'`
- `Orders.currentOrderChatButton`: `'order_currentOrder_chatButton'`
- `Orders.currentOrderCtaButton`: `'order_currentOrder_ctaButton'`
- `Orders.pickupPage`: `'order_pickup_page'`
- `Orders.pickupReceiptCard`: `'order_pickup_receiptCard'`
- `Orders.pickupConfirmButton`: `'order_pickup_confirmButton'`
- `Orders.dropPage`: `'order_drop_page'`
- `Orders.dropOtpField`: `'order_drop_otpField'`
- `Orders.dropConfirmButton`: `'order_drop_confirmButton'`
- `Orders.deliveryCompletePage`: `'order_deliveryComplete_page'`
- `Orders.deliveryCompleteEarningsText`: `'order_deliveryComplete_earningsText'`
- `Orders.deliveryCompleteNextOrderButton`: `'order_deliveryComplete_nextOrderButton'`
- `OrderChat.inputField`: `'chat_input_textField'`
- `OrderChat.sendButton`: `'chat_input_sendButton'`

### 5.6 Profile (`Profile`)
- `Profile.list`: `'profile_profile_list'`
- `Profile.settingsTile`: `'profile_profile_settingsTile'`
- `Profile.performanceTile`: `'profile_profile_performanceTile'`
- `Profile.profileVehicleDetailsTile`: `'profile_profile_vehicleDetailsTile'`
- `Profile.profileReferAndEarnTile`: `'profile_profile_referAndEarnTile'`
- `Profile.profileHelpTile`: `'profile_profile_helpTile'`
- `Profile.profileLogoutTile`: `'profile_profile_logoutTile'`
- `Profile.settingsPage`: `'profile_settings_page'`
- `Profile.performancePage`: `'profile_performance_page'`
- `Profile.acceptanceRateTile`: `'profile_performance_acceptanceRateTile'`
- `Profile.rejectionRateTile`: `'profile_performance_rejectionRateTile'`
- `Profile.vehicleDetailsPage`: `'profile_vehicleDetails_page'`
- `Profile.vehicleDetailsInfoCard`: `'profile_vehicleDetails_infoCard'`
- `Profile.referPage`: `'profile_referAndEarn_page'`
- `Profile.referCodeText`: `'profile_referAndEarn_codeText'`
- `Profile.referCopyCodeButton`: `'profile_referAndEarn_copyCodeButton'`
- `Profile.referShareButton`: `'profile_referAndEarn_shareButton'`
- `Profile.helpSupportPage`: `'profile_helpSupport_page'`
- `Profile.helpSupportSendEmailButton`: `'profile_helpSupport_sendEmailButton'`
- `Profile.logoutCancelButton`: `'profile_logout_cancelButton'`
- `Profile.logoutConfirmButton`: `'profile_logout_confirmButton'`

---

## 6. Maintenance & Adding New Tests

1. **Adding a New Screen / Feature:**
   - Verify the keys in `test/helpers/keys.js` match `AppTestKeys` in Flutter.
   - Create or update the page object under `test/pages/` using `byKey`, `tapKey`, `typeKey`, `isKeyVisible`, and `goBack`.
   - Create a spec under `test/specs/` following the naming convention `test/specs/<number>-<name>.spec.js`.
2. **Sequential Session Contract:**
   - If the test belongs to the sequential `MAIN_FLOW`, ensure it starts from the screen where the previous spec ended (usually `Home tab`) and ends on a screen with the bottom bar (`Home tab`).
   - If the test requires isolated state (like registration or a new user), run it as a standalone suite or configure `specs: ['./test/specs/**/*.spec.js']`.

---

## 7. Manual Test Tracker Traceability Matrix

This table maps the manual test tracker cases from `Zippiee Driver App — Manual Test Tracker` to their automated test suite implementations:

| Tracker ID | Module / Area | Manual Tracker Steps & Verification | Automated Suite | Automated Test ID & Assertion |
|---|---|---|---|---|
| **AS-01** | App start / Launch | Fresh install, open app: splash shows then sign-in | `auth` / `home` | **TC01** (`01-sign-in.spec.js`): `auth_signIn_page` & phone field |
| **AU-01** | Sign in / Phone | Enter valid Nigerian phone number & submit | `auth` | **TC08** (`01-sign-in.spec.js`): `auth_verifyOtp_page` opens |
| **AU-02** | Sign in / Phone | Negative check: too few / too many digits | `auth` | **TC06** (`01-sign-in.spec.js`): Stays on sign-in, OTP not opened |
| **AU-03** | Sign in / Phone | Enter invalid symbols / letters in phone | `auth` | **TC06** (`01-sign-in.spec.js`): Input filtered / rejected |
| **AU-04** | Sign in / Phone | Country picker open, search and select country | `auth` | **TC04**, **TC05** (`01-sign-in.spec.js`): Country bottom sheet & option select |
| **AU-06** | Sign in / Phone | Clear button empties phone field | `auth` | **TC07** (`01-sign-in.spec.js`): `common_phoneField_clearButton` resets field |
| **AU-08** | Sign in / OTP | Enter correct OTP code, authenticate driver | `auth` | **TC14** (`02-verify-otp.spec.js`): `dashboard_dashboard_page` opens |
| **AU-09** | Sign in / OTP | Negative check: wrong OTP rejected | `auth` | **TC13** (`02-verify-otp.spec.js`): Stays on OTP screen |
| **AU-10** | Sign in / OTP | Resend OTP countdown active | `auth` | **TC10** (`02-verify-otp.spec.js`): Resend button hidden while counting down |
| **AU-11** | Sign in / OTP | Incomplete OTP does not submit | `auth` | **TC11** (`02-verify-otp.spec.js`): Stays on OTP screen |
| **AU-15** | Sign in / OTP | Back from OTP returns to sign-in | `auth` | **TC12** (`02-verify-otp.spec.js`): Back button returns to sign-in |
| **PR-01..03** | Permissions / Prompts | Dismiss post-login permission and battery sheets | `home` | **TC15** (`03-home.spec.js`): Dismisses permission sheet / battery dialog |
| **HM-01** | Home / Availability | Online toggle state and top bar controls | `home` | **TC16** (`03-home.spec.js`): Online toggle, notifications bell, avatar |
| **HM-10** | Home / Progress | Today's progress cards (earnings, trips, time, rating) | `home` | **TC17** (`03-home.spec.js`): All 4 progress metric cards rendered |
| **HM-01..15** | Home / Navigation | Bottom 4 navigation tabs displayed | `home` | **TC18** (`03-home.spec.js`): Home, Wallet, Orders, Profile tabs present |
| **NT-01..05** | Notifications / Inbox | Bell opens Notifications, All/Unread/Read tabs | `home` | **TC19..TC22** (`03-home.spec.js`): Notification filter tabs & back navigation |
| **WL-01..02** | Wallet / Overview | Wallet tab opens, balance carousel & total card | `wallet` | **TC23..TC26** (`04-wallet.spec.js`): Carousel, total card, withdrawable card, eye toggle |
| **WL-17..19** | Wallet / Deposit | Deposit quick action opens Deposit screen | `wallet` | **TC28** (`04-wallet.spec.js`): Deposit page, amount field, Back returns |
| **WL-10..14** | Wallet / Withdraw | Withdraw quick action opens Withdraw screen or prompt | `wallet` | **TC29** (`04-wallet.spec.js`): Withdraw dialog / fields, Back returns |
| **WL-22** | Wallet / Transactions| Transaction history link opens transaction list | `wallet` | **TC30** (`04-wallet.spec.js`): Transaction history page & back navigation |
| **OH-01..05** | Orders / History | Orders tab opens, All/Completed/Cancelled/Rejected tabs | `orders` | **TC32..TC34, TC36** (`05-orders.spec.js`): Status chips & order list |
| **OH-06..08** | Orders / Filters | Filter icon opens bottom sheet, clear / close | `orders` | **TC35** (`05-orders.spec.js`): Filter sheet controls & close |
| **PF-01..03** | Profile / Settings | Profile settings tile opens settings page | `profile` | **TC38..TC40** (`06-profile.spec.js`): Settings page & back navigation |
| **PF-11** | Profile / Performance| Performance shows acceptance and rejection rates | `profile` | **TC41** (`06-profile.spec.js`): Acceptance & rejection rate tiles |
| **VD-01** | Vehicle Details | Vehicle details opens, shows info | `profile` | **TC43** (`06-profile.spec.js`): Vehicle details card & back navigation |
| **RF-01..03** | Refer & Earn | Refer & Earn opens, shows code and share actions | `profile` | **TC44** (`06-profile.spec.js`): Referral code text & back navigation |
| **PF-12** | Help & Support | Help & Support opens, shows support actions | `profile` | **TC45** (`06-profile.spec.js`): Support email button & back navigation |
| **PF-15** | Profile / Logout | Logout modal opens, Cancel button safely keeps session | `profile` | **TC46** (`06-profile.spec.js`): Logout sheet & cancel confirmation |
| **AU-18..21** | Sign Up / Register | Sign up form fields, NIN tooltip, Create Account | `signup` | **TC49** (`07-sign-up.spec.js`): Full name, email, NIN tooltip |
| **AU-24..27** | Account Status | Account blocked screen layout and support contact | `signup` | **TC50** (`07-sign-up.spec.js`): Blocked screen & contact button |
| **OF-01..12** | Order Offers | New order request dialog (Accept / Reject) | `activeOrder` | **TC51** (`08-active-order.spec.js`): Order dialog controls |
| **OD-01..14** | Order Delivery Flow | Active order tracking, customer contact options | `activeOrder` | **TC52** (`08-active-order.spec.js`): Tracking card & call/chat buttons |
| **CT-01..08** | Order Chat | Order chat messaging controls | `activeOrder` | **TC53** (`08-active-order.spec.js`): Chat input & send button |
| **OD-02..05** | Order Pickup | Pickup receipt verification & confirm button | `activeOrder` | **TC54** (`08-active-order.spec.js`): Pickup confirmation controls |
| **OD-08..09** | Order Drop | Drop-off delivery customer OTP verification | `activeOrder` | **TC55** (`08-active-order.spec.js`): Customer OTP field & confirm button |
| **OD-16** | Order Complete | Delivery completed summary & next order action | `activeOrder` | **TC56** (`08-active-order.spec.js`): Earnings summary & next order CTA |

---

### 7.1 Newly Added Test Cases from Sheet (Phase 6 – +24 Tests, 80 Total)

The following **24 new automated test cases** were directly extracted from the `Zippiee Driver App — Manual Test Tracker` sheet and added into the existing spec files without modifying or deleting any of the original 56 test cases:

| # | Tracker ID | Module | Target Spec File | Test Case Name & Verification Steps | Key / Assertion |
|---|---|---|---|---|---|
| **1** | **AU-03** | Auth | `01-sign-in.spec.js` | Validation: Rejects symbols and special characters in phone field | `SignIn.phoneField`, `SignIn.continueButton` |
| **2** | **AU-05** | Auth | `01-sign-in.spec.js` | Input formatting: Handles phone numbers with Nigerian dial code or formatting | `SignIn.phoneField`, `Common.phoneClearButton` |
| **3** | **AU-07** | Auth | `01-sign-in.spec.js` | Legal links: Verifies platform Terms & Conditions document link existence | `SignIn.page`, `SignIn.continueButton` |
| **4** | **AU-14** | Auth | `02-verify-otp.spec.js` | Alternative Auth: Verifies WhatsApp OTP channel option if enabled | `VerifyOtp.whatsappButton` |
| **5** | **AS-06** | Auth | `02-verify-otp.spec.js` | Offline Resilience: Verifies network error retry recovery key availability | `Common.errorViewRetryButton` |
| **6** | **HM-02** | Home | `03-home.spec.js` | Safety Controls: Verifies SOS emergency button on dashboard top bar | `Home.sosButton` |
| **7** | **HM-08** | Home | `03-home.spec.js` | Dashboard Scroll: Verifies home dashboard scroll view container | `Home.scrollView` |
| **8** | **NT-02** | Home | `03-home.spec.js` | Notifications List: Verifies notifications scrollable list view container | `Notifications.list` |
| **9** | **NT-03** | Home | `03-home.spec.js` | Mark All Read: Verifies mark-all-as-read action button is present | `Notifications.markAllReadButton` |
| **10** | **WL-02** | Wallet | `04-wallet.spec.js` | Earnings Breakdown: Verifies earnings breakdown cards in wallet view | `Wallet.walletBreakdownCard('earnings')` |
| **11** | **WL-04** | Wallet | `04-wallet.spec.js` | Bank Accounts: Verifies saved bank account management key availability | `Wallet.bankDetailsPage` |
| **12** | **WL-11** | Wallet | `04-wallet.spec.js` | Balance Limits: Verifies withdrawable balance limits and prompt resilience | `Wallet.withdrawalUnavailableDialog` |
| **13** | **WL-21** | Wallet | `04-wallet.spec.js` | Transaction Search: Verifies transaction history search and filter capability | `Wallet.transactionHistorySearchField` |
| **14** | **OH-03** | Orders | `05-orders.spec.js` | List Interaction: Verifies order history list container structure | `Orders.orderList` |
| **15** | **OH-06** | Orders | `05-orders.spec.js` | Date Filters: Verifies date range filter options in filter bottom sheet | `Orders.orderFilterDateChip('today')` |
| **16** | **OH-09** | Orders | `05-orders.spec.js` | Order Details: Verifies order card detail elements and item list structure | `Orders.orderDetailsHeaderCard`, `Orders.orderDetailsItemsCard` |
| **17** | **PF-04** | Profile | `06-profile.spec.js` | Profile Completion: Verifies profile completion card and stats | `Profile.profileCompletionCard` |
| **18** | **PF-05** | Profile | `06-profile.spec.js` | Contact Update: Verifies contact update key mappings for phone and email | `Profile.contactChangePhoneField`, `Profile.contactChangeEmailField` |
| **19** | **PF-10** | Profile | `06-profile.spec.js` | Language Settings: Verifies language preference tile on profile menu | `Profile.profileLanguageTile` |
| **20** | **PF-13** | Profile | `06-profile.spec.js` | Legal & Compliance: Verifies Privacy Policy and Terms tiles on profile menu | `Profile.profilePrivacyPolicyTile`, `Profile.profileTermsTile` |
| **21** | **VD-02** | Profile | `06-profile.spec.js` | Vehicle Documents: Verifies vehicle document cards and status badges | `Profile.vehicleDetailsList`, `Profile.vehicleDocumentCard('license')` |
| **22** | **RF-02** | Profile | `06-profile.spec.js` | Refer & Earn Actions: Verifies copy referral code and share button mappings | `Profile.referCopyCodeButton`, `Profile.referShareButton` |
| **23** | **OB-02** | Sign-Up | `07-sign-up.spec.js` | Onboarding Validation: Verifies required field keys on registration form | `SignUp.signUpDobField`, `SignUp.signUpEmailField` |
| **24** | **OD-03** | Active Order | `08-active-order.spec.js` | Order Route: Verifies active order route map and navigation control keys | `Orders.currentOrderStartNavigationButton`, `Orders.currentOrderRefreshRouteButton` |
| **25** | **AU-24 / AS-05** | Sign-Up / Status | `07-sign-up.spec.js` | Reinstatement Check: Evaluates whether suspended account (+234 805 151 5151) is suspended or reinstated | `AccountBlocked.accountBlockedPage`, `Dashboard.page` |

---

## 8. Project Changelog & Architecture Audit Log

| Milestone / Phase | Modified Files / Artifacts | Modification Description |
|---|---|---|
| **Phase 1: Foundation** | `test/helpers/keys.js` | Exported all 381 Flutter ValueKeys from `appium_keys_mapping.xlsx` categorized into domain objects (`Common`, `SignIn`, `VerifyOtp`, `SignUp`, `AccountBlocked`, `Dashboard`, `Home`, `Notifications`, `Wallet`, `Payments`, `Orders`, `Profile`, `OrderChat`). |
| **Phase 1: Foundation** | `test/helpers/flutter.js` | Built client-side smart polling helper (`poll`, `byKey`, `tapKey`, `typeKey`, `isKeyVisible`, `goBack`, `scrollDown`, `scrollUp`, `scrollUntilKeyVisible`). |
| **Phase 1: Foundation** | `test/pages/` | Implemented complete Page Object pattern across all screens (`sign-in.page.js`, `home.page.js`, `notifications.page.js`, `wallet.page.js`, `orders.page.js`, `profile.page.js`, `sign-up.page.js`, `active-order.page.js`). |
| **Phase 2: Reporting Engine** | `test/helpers/html-reporter.js` | Implemented custom `@wdio/reporter` plugin generating standalone interactive HTML (`reports/index.html`), Markdown summary (`reports/report.md`), and JSON (`reports/report.json`). |
| **Phase 3: Module Consolidation** | `test/specs/` | Consolidated fragmented specs into unified module specs (`04-wallet.spec.js`, `05-orders.spec.js`, `06-profile.spec.js`) to guarantee each module is tested 100% in one pass without tab backtracking. |
| **Phase 4: Per-Module Execution** | `scripts/run-modules-one-by-one.js` | Created sequential module execution orchestrator and Master Multi-Module Dashboard generator (`reports/index.html`). |
| **Phase 4: Per-Module Execution** | `package.json` | Added targeted npm scripts (`test:modules`, `test:module:auth`, `test:module:home`, `test:module:wallet`, `test:module:orders`, `test:module:profile`, `test:module:signup`, `test:module:active-order`). |
| **Phase 4: Per-Module Execution** | `wdio.conf.js` & `html-reporter.js` | Added dynamic `REPORT_DIR` and `MODULE_NAME` support to isolate test reports into dedicated subdirectories (`reports/01-auth/`, `reports/02-home/`, etc.). |
| **Phase 5: Tracker ID Alignment** | `test/specs/*.spec.js` | Updated all 56 automated test case titles across all 8 spec files to adopt the exact Tracker IDs (`[AS-*]`, `[AU-*]`, `[PR-*]`, `[HM-*]`, `[NT-*]`, `[WL-*]`, `[OH-*]`, `[PF-*]`, `[VD-*]`, `[RF-*]`, `[OF-*]`, `[OD-*]`, `[CT-*]`) directly from the shared Manual Test Tracker spreadsheet. |
| **Phase 6: Sheet Tests Expansion** | `test/specs/*.spec.js` | Added 24 new automated test cases from the manual test tracker into spec files (increasing total tests from 56 to 80) without modifying or breaking any of the 56 existing test cases. |
| **Phase 7: Suspended Account Check** | `.env`, `test-data.js`, `07-sign-up.spec.js` | Added `TEST_SUSPENDED_PHONE_NUMBER=8051515151` configuration and implemented `[AU-24 / AS-05]` test case to automatically evaluate and report whether the account is suspended or reinstated. Total tests: 81. |
| **Phase 8: Dedicated Suspended Flow & Execution** | `test/specs/09-suspended-account.spec.js`, `wdio.conf.js`, `package.json` | Created dedicated standalone suite `npm run test:suspended`. Executed live on Pixel 8 with 100% pass (3/3 passed in 7.8s). Confirmed account +234 805 151 5151 is currently **SUSPENDED / BLOCKED** (`auth_accountBlocked_page`). Report: `reports/08-suspended/index.html`. Total tests: 84. |


