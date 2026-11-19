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
| `npm run test:android` | all 6 files, in order |
| `npx wdio run wdio.conf.js --suite login` | 01–02 (sign in → dashboard) |
| `npx wdio run wdio.conf.js --suite home` | 01–03 |
| `npx wdio run wdio.conf.js --suite wallet` | 01–03 + 04 |
| `npx wdio run wdio.conf.js --suite orders` | 01–03 + 05 |
| `npx wdio run wdio.conf.js --suite profile` | 01–03 + 06 |

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
# automation-zippiee-customer
