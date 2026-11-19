# Zippiee Driver – Appium UI tests (JS)

WebdriverIO + Mocha + Appium **Flutter Integration** driver. Follows the team setup guide:
https://claude.ai/artifact/KCuUhzdDaYG7AfiyJ5vUVK

## Prerequisites (one time per machine)

| Tool | Version | Check |
|---|---|---|
| Node.js | 20+ | `node -v` |
| Java JDK | 17 | `java -version` |
| Android Studio + SDK (platform-tools, build-tools, an emulator or USB phone) | latest | `adb devices` |
| Xcode + command line tools (iOS only, macOS only) | latest | `xcodebuild -version` |

Add to `~/.zshrc` (Android), then `source ~/.zshrc`:
```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
```

### Appium server + drivers
Appium is installed globally, not inside this project.
```bash
npm install -g appium                       # Appium server (3.x)
appium -v                                   # check

# Drivers
appium driver install --source npm appium-flutter-integration-driver   # Flutter Integration (used by the tests)
appium driver install uiautomator2          # Android
appium driver install xcuitest              # iOS (macOS only)

appium driver list --installed              # should list flutter-integration, uiautomator2, xcuitest
npm run doctor                              # checks the Flutter + Android driver setup
```
Update later with `npm install -g appium@latest` and
`appium driver update flutter-integration uiautomator2 xcuitest`.

### Start the Appium server
```bash
appium                                       # listens on http://127.0.0.1:4723
```
Leave it running in its own terminal. If you change the host or port
(`appium --address 0.0.0.0 --port 4724`), set `APPIUM_HOST` / `APPIUM_PORT` in `.env`.

## Project setup
```bash
git clone <repo-url>
cd zippiee-driver-automation
npm ci                  # installs exact versions from package-lock.json (npm install also works)
cp .env.example .env    # then fill in your values (step 2 below)
```

1. Put the test builds in `apps/`:
   - Android APK — package `dev.zippieedriver.android`
   - iOS IPA — bundle `com.zippieedriver.ios` (registered iPhones only)
   The build must come from the app branch with the widget keys
   (`appium_value_keys`), built from `integration_test/appium_test.dart` (staging).
2. Fill in `.env`. Everything that changes per
   device or build lives there: device UDID/name/OS version, app file names
   (`ANDROID_APP`, `IOS_APP`), package/bundle id, Apple Team ID, Appium host/port,
   and the **staging test account** (`TEST_PHONE_NUMBER`, `TEST_OTP`).
   No edits to `wdio.conf.js` needed.

## Run
```bash
appium                 # terminal 1, leave running
npm run test:android   # terminal 2 (emulator/phone must show in `adb devices`)
npm run test:ios       # real iPhone, unlocked, Developer Mode on
```
Expected: **35 passing** (34 passing + 1 pending when `TEST_WRONG_OTP` is empty).

## How the specs run (in sequence, one session)
The specs are split by screen into numbered files. They run **one after another, in
one app session**: each file starts where the previous one ended (sign-in → OTP →
home → wallet → orders → profile). The order is set by `MAIN_FLOW` in `wdio.conf.js`:

```js
const MAIN_FLOW = [
  './test/specs/01-sign-in.spec.js',     // fresh install → OTP screen
  './test/specs/02-verify-otp.spec.js',  // OTP screen → dashboard
  './test/specs/03-home.spec.js',        // home + notifications → Home tab
  './test/specs/04-wallet.spec.js',      // Wallet tab
  './test/specs/05-orders.spec.js',      // Orders tab
  './test/specs/06-profile.spec.js',     // Profile tab → back to Home
];
specs: [MAIN_FLOW],   // inner array = one worker, ONE app session, this order
```

### Run all of it, or only part of it
| Command | Runs |
|---|---|
| `npm run test:android` | all spec files, in sequence |
| `npx wdio run wdio.conf.js --suite login` | 01–02 (sign in → dashboard) |
| `npx wdio run wdio.conf.js --suite home` | 01–03 |
| `npx wdio run wdio.conf.js --suite wallet` | 01–03 + 04 |
| `npx wdio run wdio.conf.js --suite orders` | 01–03 + 05 |
| `npx wdio run wdio.conf.js --suite profile` | 01–03 + 06 |
| `npx wdio run wdio.conf.js --suite walletActions` | 01–03 + 04 + 07 |
| `npx wdio run wdio.conf.js --suite referEarn` | 01–03 + 06 + 08 |
| `npx wdio run wdio.conf.js --suite vehicleDetails` | 01–03 + 06 + 09 |
| `npx wdio run wdio.conf.js --suite orderFlow` | 01–03 + 10 |
| `npx wdio run wdio.conf.js --suite orderChat` | 01–03 + 11 |
| `npx wdio run wdio.conf.js --suite notifications` | 01–03 + 12 |
| `npx wdio run wdio.conf.js --suite ordersFilters` | 01–03 + 05 + 13 |
| `npx wdio run wdio.conf.js --suite profileSettings` | 01–03 + 06 + 14 |
| `npx wdio run wdio.conf.js --suite bankAccounts` | 01–03 + 06 + 15 |
| `npx wdio run wdio.conf.js --suite signUpStatus` | 16 (standalone) |
| `npx wdio run wdio.conf.js --suite appVersion` | 17 (standalone) |
| `npx wdio run wdio.conf.js --suite onboarding` | 18 (standalone) |
| `npx wdio run wdio.conf.js --suite orderDeliveryExtended` | 01–03 + 19 |
| `npx wdio run wdio.conf.js --suite orderOffersExtended` | 01–03 + 20 |
| `npx wdio run wdio.conf.js --suite walletExtended` | 01–03 + 04 + 21 |
| `npx wdio run wdio.conf.js --suite profileExtended` | 01–03 + 06 + 22 |
| `npx wdio run wdio.conf.js --suite generalAndUi` | 01–03 + 23 |
| `npx wdio run wdio.conf.js --suite locationTracking` | 01–03 + 24 |
| `npx wdio run wdio.conf.js --suite networkOffline` | 01–03 + 25 |
| `npx wdio run wdio.conf.js --suite lifecycle` | 01–03 + 26 |
| `npx wdio run wdio.conf.js --suite ordersHistoryExtended` | 01–03 + 05 + 27 |
| `npx wdio run wdio.conf.js --suite orderChatAdvanced` | 01–03 + 28 |
| `npx wdio run wdio.conf.js --suite notificationsAdvanced` | 01–03 + 29 |
| `npx wdio run wdio.conf.js --suite deliveryWalletEdge` | 01–03 + 30 |
| `npx wdio run wdio.conf.js --suite profileAccountEdge` | 01–03 + 06 + 31 |
| `npx wdio run wdio.conf.js --suite locationAdvanced` | 01–03 + 32 |
| `npx wdio run wdio.conf.js --suite locationOem` | 01–03 + 33 |
| `npx wdio run wdio.conf.js --suite locationAccuracyScale` | 01–03 + 34 |

Put `PLATFORM=ios` in front for iOS, e.g. `PLATFORM=ios npx wdio run wdio.conf.js --suite wallet`.
Add `--bail 1` to stop at the first failing test.

### Rules for this setup
- Files after `01` depend on it: if sign-in fails, the rest fail too.
- **Don't run a later file alone with `--spec`.** It would start logged out on the
  sign-in screen. Use a suite: every suite starts with `01` and `02`, so it logs in first.
- Each file must end on a screen the next one can start from. Tabs (Wallet, Orders,
  Profile) are opened from the bottom bar, so any tab is fine; a pushed page
  (e.g. Notifications, Profile settings) must be closed with Back first.

### Adding a new spec file
1. Create `test/specs/07-<name>.spec.js` with one `describe('07 <Name>', ...)`.
2. Add it to the end of `MAIN_FLOW` in `wdio.conf.js` (and a suite if you want to run
   it alone: `[[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[6]]]`).
3. Start it from the screen `06` ends on (Home tab), and end on a screen with the
   bottom bar.

To run files in **separate** sessions instead (each one reinstalls the app and starts
logged out), use a flat list: `specs: ['./test/specs/**/*.spec.js']`. Every file must
then log in by itself.

## Test cases
| # | File | Case |
|---|---|---|
| TC01 | 01-sign-in | Opens on sign-in after the splash; phone field + Continue shown |
| TC02 | 01-sign-in | Title and subtitle shown |
| TC03 | 01-sign-in | Empty number → Continue does not open OTP |
| TC04 | 01-sign-in | Country code opens the country picker |
| TC05 | 01-sign-in | Search + pick the test country → sheet closes, dial code shown |
| TC06 | 01-sign-in | Too-short number → Continue does not open OTP |
| TC07 | 01-sign-in | ✕ clears the number (✕ disappears) |
| TC08 | 01-sign-in | Valid number → OTP screen (sends an OTP) |
| TC09 | 02-verify-otp | OTP field, Continue and Back shown |
| TC10 | 02-verify-otp | "Resend OTP" hidden while the countdown runs |
| TC11 | 02-verify-otp | Incomplete OTP → stays on OTP |
| TC12 | 02-verify-otp | Back → sign-in; Continue → OTP again (sends a 2nd OTP) |
| TC13 | 02-verify-otp | Wrong OTP → stays on OTP (skipped unless `TEST_WRONG_OTP` set) |
| TC14 | 02-verify-otp | Correct OTP → dashboard |
| TC15 | 03-home | Closes the permissions sheet / battery dialog if shown; dashboard shown |
| TC16 | 03-home | Top bar: online toggle, notifications, avatar |
| TC17 | 03-home | Home content + all 4 "Today's progress" tiles |
| TC18 | 03-home | 4 bottom tabs shown |
| TC19 | 03-home | Bell opens Notifications |
| TC20 | 03-home | Notifications: All / Unread / Read tabs shown |
| TC21 | 03-home | Unread tab, then All: stays on Notifications |
| TC22 | 03-home | Back → home screen |
| TC23 | 04-wallet | Wallet tab opens the wallet |
| TC24 | 04-wallet | Balance carousel + total balance card shown |
| TC25 | 04-wallet | Eye icon hides / shows the total balance |
| TC26 | 04-wallet | Deposit and Withdraw quick actions shown (not tapped) |
| TC27 | 05-orders | Orders tab opens order history |
| TC28 | 05-orders | All / Completed / Cancelled / Rejected tabs shown |
| TC29 | 05-orders | Completed tab, then All: stays on Orders |
| TC30 | 06-profile | Profile tab opens the profile |
| TC31 | 06-profile | Profile settings + Performance tiles shown |
| TC32 | 06-profile | Profile settings opens; Back → profile |
| TC33 | 06-profile | Performance shows acceptance + rejection rates; Back → profile |
| TC34 | 06-profile | Home tab brings back home |
| TC35 | 06-profile | Avatar opens profile; Home tab comes back |
| TC36 | 07-wallet-actions | [WL-10, WL-11] Opens Withdraw page with amount field and submit action |
| TC37 | 07-wallet-actions | [WL-10] Back leaves Withdraw page and returns to wallet |
| TC38 | 07-wallet-actions | [WL-17, WL-19] Opens Deposit page with amount field and Add Funds action |
| TC39 | 07-wallet-actions | [WL-18] Back leaves Deposit page and returns to wallet |
| TC40 | 07-wallet-actions | [WL-22] Opens Transaction History from wallet, Back returns |
| TC41 | 08-refer-earn | [RF-01] Refer & Earn tile opens referral screen |
| TC42 | 08-refer-earn | [RF-02] Shows referral code text and copy button |
| TC43 | 08-refer-earn | [RF-03] Shows share invite link button |
| TC44 | 08-refer-earn | [RF-01] Shows earn per referral stats overview |
| TC45 | 08-refer-earn | [RF-01] Back returns to profile screen |
| TC46 | 09-vehicle-details | [VD-01] Vehicle Details tile opens vehicle info screen |
| TC47 | 09-vehicle-details | [VD-01] Shows vehicle information card |
| TC48 | 09-vehicle-details | [VD-01] Shows vehicle documents and photos content list |
| TC49 | 09-vehicle-details | [VD-01] Back returns to profile screen |
| TC50 | 10-order-flow | [OF-01, OF-08] Checks for incoming order offer dialog or home status |
| TC51 | 10-order-flow | [OD-01, OD-24] Checks current order map and navigation controls |
| TC52 | 10-order-flow | [OD-02, OD-05] Checks pickup verification elements and ready banner |
| TC53 | 10-order-flow | [OD-08, OD-09] Checks drop-off and delivery verification controls |
| TC54 | 10-order-flow | [OD-16] Checks delivery complete screen structure and Next Order CTA |
| TC55 | 10-order-flow | [OD-25] Checks report issue interface from active order |
| TC56 | 11-order-chat | [CT-01, CT-05] Verifies chat launch capability or idle state |
| TC57 | 11-order-chat | [CT-03, CT-04] Verifies chat view elements and message input |
| TC58 | 11-order-chat | [CT-06] Verifies chat session closure and clean return |
| TC59 | 12-notifications | [NT-01] Opens notifications inbox from home top bar |
| TC60 | 12-notifications | [NT-03] Verifies "Mark all read" button presence and tap action |
| TC61 | 12-notifications | [NT-04] Cycles through Unread, Read, and All filter tabs |
| TC62 | 12-notifications | [NT-02] Checks notifications list container rendering |
| TC63 | 12-notifications | [NT-01] Back returns to home screen and confirms clean closure |
| TC64 | 13-orders-filters | [OH-01] Opens Orders tab and verifies header filter action |
| TC65 | 13-orders-filters | [OH-05, OH-06] Opens filter sheet and checks date quick filter chips |
| TC66 | 13-orders-filters | [OH-05] Checks status filter chips in filter sheet |
| TC67 | 13-orders-filters | [OH-07] Checks sort option chips in filter sheet |
| TC68 | 13-orders-filters | [OH-08] Applies or clears filter and returns to orders list |
| TC69 | 13-orders-filters | [OH-01] Confirms orders screen remains healthy and reactive |
| TC70 | 14-profile-settings | [PF-01] Opens Profile tab and verifies secondary tiles |
| TC71 | 14-profile-settings | [PF-03, PF-04] Profile settings shows user info rows, Back returns |
| TC72 | 14-profile-settings | [PF-12] Help & Support opens with Send Email button, Back returns |
| TC73 | 14-profile-settings | [PF-13] Privacy Policy legal viewer opens, Back returns to Profile |
| TC74 | 14-profile-settings | [PF-10] Language tile opens language selection sheet, Back returns |
| TC75 | 14-profile-settings | [DA-01] Delete Account tile opens deletion sheet, Cancel returns safely |
| TC76 | 14-profile-settings | [PF-15] Log Out tile opens confirmation sheet, Cancel keeps driver logged in |
| TC77 | 15-bank-accounts | [WL-09] Bank Accounts tile opens Saved Bank Accounts page |
| TC78 | 15-bank-accounts | [WL-04] Add Bank Account button opens bank details form |
| TC79 | 15-bank-accounts | [WL-04, WL-08] Bank details shows Bank dropdown, Account Number field, and Save button |
| TC80 | 15-bank-accounts | [WL-09] Back returns from Saved Bank Accounts to profile screen |
| TC81 | 16-sign-up-status | [AU-18, AU-19] Verifies sign-up form components when on sign-up flow |
| TC82 | 16-sign-up-status | [AU-22] Verifies referral code entry field |
| TC83 | 16-sign-up-status | [AU-24, AU-27] Verifies account blocked interface elements |
| TC84 | 17-app-version-dialogs | [AS-08, AS-09] Verifies version update dialog handling |
| TC85 | 17-app-version-dialogs | [AS-06, GN-01] Verifies no-internet error dialog handling capability |
| TC86 | 17-app-version-dialogs | [PR-01, PR-04] Verifies permission settings prompt handling capability |
| TC87 | 18-onboarding | [OB-01, OB-03] Verifies onboarding form progress and primary action |
| TC88 | 18-onboarding | [OB-07, OB-08] Verifies work location map elements when on location step |
| TC89 | 18-onboarding | [OB-10, OB-12] Verifies selfie capture step guidelines and retake options |
| TC90 | 18-onboarding | [OB-17, OB-20] Verifies document upload list and document boxes |
| TC91 | 18-onboarding | [OB-26, OB-27, OB-28] Verifies account verification or rejected status screen |
| TC92 | 19-order-delivery-extended | [OD-03, OD-07] Verifies order items list and expandable add-ons |
| TC93 | 19-order-delivery-extended | [OD-10, OD-11] Verifies delivery code input and retry limits handling |
| TC94 | 19-order-delivery-extended | [OD-12, OD-13] Checks payment method indication on drop screen |
| TC95 | 19-order-delivery-extended | [OD-14, OD-15] Customer instructions and direct call/message controls |
| TC96 | 19-order-delivery-extended | [OD-17, OD-18] Customer and restaurant star rating dialog submission |
| TC97 | 19-order-delivery-extended | [OD-19, OD-20] Order cancellation confirmation dialog handling |
| TC98 | 20-order-offers-extended | [OF-12] Rejects an incoming order offer with reason |
| TC99 | 20-order-offers-extended | [OF-16] Verifies offer display integrity when driver is on another screen |
| TC100 | 20-order-offers-extended | [OF-06, OF-07] Verifies countdown timer resync resilience |
| TC101 | 21-wallet-extended | [WL-02] Verifies earnings breakdown cards (wallet earnings, tips, COD) |
| TC102 | 21-wallet-extended | [WL-16] Opens withdrawal history and verifies list rendering |
| TC103 | 21-wallet-extended | [WL-12, WL-13] Validates minimum withdrawal amount constraints |
| TC104 | 21-wallet-extended | [WL-14] Verifies withdrawal unavailable modal handling if triggered |
| TC105 | 21-wallet-extended | [WL-24, WL-25] Verifies EMI tracking section if agreement exists |
| TC106 | 22-profile-extended | [PF-05, PF-07] Verifies contact change entry sheet from profile settings |
| TC107 | 22-profile-extended | [VD-03, VD-04] Verifies document replacement cancellation and review status |
| TC108 | 22-profile-extended | [VD-05, VD-06] Verifies document rejection sheet and team reply interaction |
| TC109 | 22-profile-extended | [RF-04, RF-05] Verifies referrals history list and reward stats |
| TC110 | 22-profile-extended | [DA-02, DA-03] Verifies account deletion safeguards against active deliveries |
| TC111 | 23-general-and-ui | [GN-05] Verifies UI rendering integrity and visual consistency across tabs |
| TC112 | 23-general-and-ui | [GN-08] Verifies sheet and dialog dismiss (✕) buttons operate consistently |
| TC113 | 23-general-and-ui | [GN-06] Verifies backward navigation integrity using app and system back |
| TC114 | 23-general-and-ui | [GN-09] Verifies absence of raw localization translation keys in the UI |
| TC115 | 23-general-and-ui | [GN-12, GN-13] Sensitive screen preview and security safeguards |
| TC116 | 24-location-tracking | [T01, T10] Verifies online toggle activates location tracking service |
| TC117 | 24-location-tracking | [T07, T08] Verifies stationary vs motion state map stability |
| TC118 | 24-location-tracking | [T09, R01] Going offline halts location tracking and clears tracking state |
| TC119 | 24-location-tracking | [T11] Ongoing order strictly prevents driver from going offline |
| TC120 | 24-location-tracking | [T14] Rapid toggle interaction is debounced without conflicting loops |
| TC121 | 24-location-tracking | [P03] Location services requirement dialog validation |
| TC122 | 24-location-tracking | [U01, R02, R03] Privacy guarantee: zero coordinate emission after logout |
| TC123 | 25-network-and-offline | [N01, N02] Verifies seamless operation during active data connectivity |
| TC124 | 25-network-and-offline | [N03, N05] Checks connection recovery and error dialog handling |
| TC125 | 25-network-and-offline | [N07, N12, AS-07] Verifies retry mechanism on high-latency responses |
| TC126 | 25-network-and-offline | [N16, N19] Verifies session stability after network reconnect |
| TC127 | 26-phone-and-os-lifecycle | [S05, PR-03] Verifies battery optimization exemption dialog handling |
| TC128 | 26-phone-and-os-lifecycle | [S02, AS-12] Verifies app foreground state preservation |
| TC129 | 26-phone-and-os-lifecycle | [S14, HM-12] Today progress tiles reset and calculate valid figures |
| TC130 | 26-phone-and-os-lifecycle | [S10] Runtime language preference updates UI without breaking state |
| TC131 | 27-orders-history-extended | [OH-02] Verifies orders list pagination scrolling without duplicates |
| TC132 | 27-orders-history-extended | [OH-03] Verifies pull to refresh reloads order history smoothly |
| TC133 | 27-orders-history-extended | [OH-04] Verifies clean empty state presentation |
| TC134 | 27-orders-history-extended | [OH-10] Verifies cancellation reason display on cancelled orders |
| TC135 | 27-orders-history-extended | [OH-11] Opening an active order from history resumes its step |
| TC136 | 28-order-chat-advanced | [CT-05] Verifies chat lock protection before an order is active |
| TC137 | 28-order-chat-advanced | [CT-07] Verifies file attachment action visibility in chat input bar |
| TC138 | 28-order-chat-advanced | [CT-02, CT-08] Verifies chat message history ordering and delivery state |
| TC139 | 29-notifications-advanced | [NT-05, NT-15] Verifies error retry handling on notification fetch timeout |
| TC140 | 29-notifications-advanced | [NT-11, NT-12] Verifies notification settings mute toggle and permission sync |
| TC141 | 29-notifications-advanced | [NT-07, NT-08, NT-09, NT-10] Verifies push intent routing and duplicate suppression |
| TC142 | 29-notifications-advanced | [NT-13, NT-14] Checks critical notification sound channels and Focus mode breakthrough |
| TC143 | 30-delivery-and-wallet-edge-cases | [OD-19, OD-23] Pickup cancellation and server stage synchronization |
| TC144 | 30-delivery-and-wallet-edge-cases | [OD-21] Stage transition network error and idempotent retry check |
| TC145 | 30-delivery-and-wallet-edge-cases | [OD-24, OD-26] External intent fallback when navigation or mail apps unavailable |
| TC146 | 30-delivery-and-wallet-edge-cases | [WL-03] Wallet network failure recovery and retry button |
| TC147 | 30-delivery-and-wallet-edge-cases | [WL-21] Interrupted deposit payment status recovery check |
| TC148 | 31-profile-and-account-edge-cases | [PF-02] Verifies profile photo change camera trigger and crop modal |
| TC149 | 31-profile-and-account-edge-cases | [PF-14] Send feedback tile opens feedback interface |
| TC150 | 31-profile-and-account-edge-cases | [DA-05, DA-06] Account deletion blocker failure and recovery window handling |
| TC151 | 31-profile-and-account-edge-cases | [AS-11, PF-17] Offline logout and session expiration message handling |
| TC152 | 31-profile-and-account-edge-cases | [AU-13, GN-11] SMS OTP code parsing and app cache stability check |
| TC153 | 32-location-tracking-advanced | [T02] Tracking remains active across all app tabs |
| TC154 | 32-location-tracking-advanced | [T03, T04, T05, T06] Foreground service persists during minimization & overlay navigation |
| TC155 | 32-location-tracking-advanced | [T13, T15] Cold GPS start handling and offline retry resilience |
| TC156 | 32-location-tracking-advanced | [T16, T17, T18, T19] Split screen, activity restoration, and push wake-up idempotency |
| TC157 | 33-location-network-and-oem | [O01-O12] Android OEM battery management & foreground service resilience |
| TC158 | 33-location-network-and-oem | [I01-I10] iOS location authorization and background refresh handling |
| TC159 | 33-location-network-and-oem | [P04-P10] Permission downgrade, approximate location & auto-reset recovery |
| TC160 | 33-location-network-and-oem | [N06, N08, N11, N14, N20] Carrier SIM switching, data saver, and hotspot coexistence |
| TC161 | 34-location-accuracy-and-order-flow | [A01-A15] GPS accuracy benchmarks: heading, velocity, and stationary holds |
| TC162 | 34-location-accuracy-and-order-flow | [F01-F11] End-to-end order flow location tracking continuity & ETA recalculation |
| TC163 | 34-location-accuracy-and-order-flow | [U02-U07, R04-R05] Account switching, token refresh, and privacy customer access window |
| TC164 | 34-location-accuracy-and-order-flow | [X01-X05] Coexistence with music streaming, navigation, and mock GPS detection |
| TC165 | 34-location-accuracy-and-order-flow | [K01-K03, G01-G05] Shift soak stability, reconnect storm resilience, and scale readiness |
| TC166 | 26-phone-and-os-lifecycle | [S06, S11, S12] Verifies low battery (<15%), charging state and thermal resilience |
| TC167 | 26-phone-and-os-lifecycle | [S08, S13] Verifies low memory pressure, multitasking and storage limits handling |
| TC168 | 26-phone-and-os-lifecycle | [S15, S16, S18] Verifies manual time zone change, app update continuity and re-login |

The tests after login are read-only: they open screens and come back, and never
deposit, withdraw, edit the profile or log out.

## Layout
```
wdio.conf.js                  # one config, PLATFORM=ios switches platform
test/helpers/flutter.js       # byKey / byText ... + waitKey / tapKey / typeKey / isKeyVisible / goBack
test/helpers/keys.js          # widget keys used by the specs (match the app's AppTestKeys)
test/helpers/test-data.js     # test account values from .env
test/pages/                   # page objects: sign-in, country picker, verify OTP, home,
                              #   notifications, wallet, orders, profile
test/specs/                   # 01-…06- spec files, run in order (see MAIN_FLOW)
```

## Rules
- Use **keys** (`test/helpers/keys.js`), not text. The full key list is in the app
  repo: `docs/appium_keys_mapping.md` / `docs/appium_keys_mapping.xlsx` (also shared
  as the "Key mapping" Google Sheet).
- Only use the staging **test** number from `.env`: Continue on sign-in sends a real OTP.
- The OTP key is the first box: type the whole code there, the app fills every box.
- One run per device at a time. No `browser.pause` — use waits.
- The app build uses the **staging** backend.
