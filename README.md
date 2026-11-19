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
Expected: **48 passing** across all 6 core modules in `MAIN_FLOW`.

### Automated HTML & Markdown Test Reports
On **every test run**, WebdriverIO automatically generates interactive test reports inside `./reports/`:
- **`reports/index.html`**: A standalone, interactive HTML report with metrics (pass rate, passed, failed, duration), interactive filter buttons (All / Passed / Failed / Skipped), instant search bar, progress bar, and expandable error logs.
- **`reports/report.md`**: Markdown summary ready for CI/CD pipelines or PR comments.
- **`reports/report.json`**: Machine-readable JSON test execution log.

Open the HTML report in your browser at any time:
```bash
open reports/index.html
```

## How the specs run (in sequence, one session)
The specs are split by screen into numbered files. They run **one after another, in
one app session**: each file completes its module step-by-step and returns to the Home tab. The order is set by `MAIN_FLOW` in `wdio.conf.js`:

```js
const MAIN_FLOW = [
  './test/specs/01-sign-in.spec.js',     // 1. Auth: Sign In & Phone Validation (11 tests: AS-01, AU-01..07)
  './test/specs/02-verify-otp.spec.js',  // 2. Auth: Verify OTP & Resilience (8 tests: AU-08..15, AS-06)
  './test/specs/03-home.spec.js',        // 3. Home & Notifications (12 tests: PR-01, HM-01..11, NT-01..06)
  './test/specs/04-wallet.spec.js',      // 4. Wallet Module (13 tests: WL-01..21)
  './test/specs/05-orders.spec.js',      // 5. Orders Module (9 tests: OH-01..09)
  './test/specs/06-profile.spec.js',     // 6. Profile Module (17 tests: PF-01..15, VD-01..02, RF-01..02)
  './test/specs/07-sign-up.spec.js',     // 7. Sign-Up & Registration (3 tests: OB-01..02, AS-04, AU-24)
  './test/specs/08-active-order.spec.js',// 8. Active Order Lifecycle (7 tests: OF-01, OD-01..06, CT-01)
];
specs: [MAIN_FLOW],   // inner array = one worker, ONE app session, this order
```

### Run all of it, or module-by-module with separate reports
You can execute individual modules and generate dedicated reports for each:

| Command | Suite | Module Tested & Tracker Coverage | Output Report Directory |
|---|---|---|---|
| `npm run test:modules` | All | Runs each module one by one sequentially | Generates separate reports + Master Dashboard |
| `npm run test:module:auth` | `auth` | 01. Auth (Sign In & OTP) (`AS-01..06`, `AU-01..16`) | `reports/01-auth/index.html` |
| `npm run test:module:home` | `home` | 02. Home & Notifications (`PR-01..03`, `HM-01..15`, `NT-01..05`) | `reports/02-home/index.html` |
| `npm run test:module:wallet` | `wallet` | 03. Wallet Module (`WL-01..25`) | `reports/03-wallet/index.html` |
| `npm run test:module:orders` | `orders` | 04. Orders Module (`OH-01..11`) | `reports/04-orders/index.html` |
| `npm run test:module:profile` | `profile` | 05. Profile Module (`PF-01..17`, `VD-01..09`, `RF-01..05`) | `reports/05-profile/index.html` |
| `npm run test:module:signup` | `signup` | 06. Sign-Up & Registration (`AU-18..27`) | `reports/06-signup/index.html` |
| `npm run test:module:active-order` | `activeOrder` | 07. Active Order & Delivery Flow (`OF-01..17`, `OD-01..26`, `CT-01..08`) | `reports/07-activeOrder/index.html` |
| `npm run test:android` | Main flow | Complete regression (all 6 modules in 1 session) | `reports/index.html` |

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

### Main Flow (Sequential Single-Session TC01 – TC48)
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
| TC25 | 04-wallet | Verifies withdrawable balance card is accessible in carousel |
| TC26 | 04-wallet | Eye icon hides / shows the total balance |
| TC27 | 04-wallet | Deposit and Withdraw quick actions shown |
| TC28 | 04-wallet | Deposit quick action opens Deposit screen with amount field, Back returns |
| TC29 | 04-wallet | Withdraw quick action opens Withdraw screen or zero-balance prompt, Back returns |
| TC30 | 04-wallet | Transaction history link opens Transaction history, Back returns |
| TC31 | 04-wallet | Brings driver back to Home tab |
| TC32 | 05-orders | Orders tab opens order history |
| TC33 | 05-orders | All / Completed / Cancelled / Rejected tabs shown |
| TC34 | 05-orders | Completed tab, then All: stays on Orders |
| TC35 | 05-orders | Order filter button opens filter options sheet, close button exits |
| TC36 | 05-orders | Verifies order history list is rendered on screen |
| TC37 | 05-orders | Returns driver back to Home tab |
| TC38 | 06-profile | Profile tab opens the profile |
| TC39 | 06-profile | Profile settings + Performance tiles shown |
| TC40 | 06-profile | Profile settings opens; Back → profile |
| TC41 | 06-profile | Performance shows acceptance + rejection rates; Back → profile |
| TC42 | 06-profile | Verifies secondary navigation tiles (Vehicle, Refer, Help, Logout) |
| TC43 | 06-profile | Vehicle details opens, shows vehicle info, Back returns to Profile |
| TC44 | 06-profile | Refer & Earn opens, displays referral code and share actions, Back returns |
| TC45 | 06-profile | Help & Support opens, displays support contact action, Back returns |
| TC46 | 06-profile | Logout confirmation sheet opens, Cancel preserves active session |
| TC47 | 06-profile | Avatar in top bar opens profile, Home tab comes back |
| TC48 | 06-profile | Returns driver safely back to Home tab |

### Standalone Suites (Isolated TC49 – TC56)
| # | File | Case |
|---|---|---|
| TC49 | 07-sign-up | Verifies Sign Up page fields, NIN tooltip, and Create Account button |
| TC50 | 07-sign-up | Verifies Account Blocked screen and support contact action |
| TC51 | 08-active-order | Handles new order request dialog elements when dispatched |
| TC52 | 08-active-order | Verifies in-progress order tracking card and contact options |
| TC53 | 08-active-order | Verifies order chat messaging controls when active |
| TC54 | 08-active-order | Verifies order pickup confirmation screen controls |
| TC55 | 08-active-order | Verifies drop-off customer delivery OTP screen controls |
| TC56 | 08-active-order | Verifies delivery completed summary screen and next order action |

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
