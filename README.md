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
Run only this flow: `npx wdio run wdio.conf.js --spec test/specs/sign-in-to-home.spec.js`

### Running several spec files one after another
`npm run test:android` / `npm run test:ios` already run **every** file in
`test/specs/` one after another: `maxInstances: 1` in `wdio.conf.js` means only one
file runs at a time. Each file gets a fresh app session (the app is reinstalled), so
a spec must not rely on another spec having run first.

- **Order**: files run in alphabetical order. To fix the order, prefix the names
  (`01-sign-in-to-home.spec.js`, `02-orders.spec.js`, ...).
- **Pick some files, in your order**:
  ```bash
  npx wdio run wdio.conf.js --spec test/specs/a.spec.js --spec test/specs/b.spec.js
  PLATFORM=ios npx wdio run wdio.conf.js --spec test/specs/a.spec.js --spec test/specs/b.spec.js
  ```
- **Stop at the first failure**: add `--bail 1`.

Expected: **23 passing** (22 passing + 1 pending when `TEST_WRONG_OTP` is empty).

## Test cases — `test/specs/sign-in-to-home.spec.js`
One app session, top to bottom: each case starts where the previous one ended.

| # | Screen | Case |
|---|---|---|
| TC01 | Sign in | Opens on sign-in after the splash; phone field + Continue shown |
| TC02 | Sign in | Title and subtitle shown |
| TC03 | Sign in | Empty number → Continue does not open OTP |
| TC04 | Sign in | Country code opens the country picker |
| TC05 | Sign in | Search + pick the test country → sheet closes, dial code shown |
| TC06 | Sign in | Too-short number → Continue does not open OTP |
| TC07 | Sign in | ✕ clears the number (✕ disappears) |
| TC08 | Sign in | Valid number → OTP screen (sends an OTP) |
| TC09 | Verify OTP | OTP field, Continue and Back shown |
| TC10 | Verify OTP | "Resend OTP" hidden while the countdown runs |
| TC11 | Verify OTP | Incomplete OTP → stays on OTP |
| TC12 | Verify OTP | Back → sign-in; Continue → OTP again (sends a 2nd OTP) |
| TC13 | Verify OTP | Wrong OTP → stays on OTP (skipped unless `TEST_WRONG_OTP` set) |
| TC14 | Verify OTP | Correct OTP → dashboard |
| TC15 | Home | Closes the permissions sheet / battery dialog if shown; dashboard shown |
| TC16 | Home | Top bar: online toggle, notifications, avatar |
| TC17 | Home | Home content + all 4 "Today's progress" tiles |
| TC18 | Home | 4 bottom tabs shown |
| TC19 | Home | Wallet tab opens the wallet |
| TC20 | Home | Orders tab opens order history |
| TC21 | Home | Profile tab opens the profile |
| TC22 | Home | Home tab brings back home |
| TC23 | Home | Avatar opens profile; Home tab comes back |

## Layout
```
wdio.conf.js                  # one config, PLATFORM=ios switches platform
test/helpers/flutter.js       # byKey / byText ... + waitKey / tapKey / typeKey / isKeyVisible
test/helpers/keys.js          # widget keys used by the specs (match the app's AppTestKeys)
test/helpers/test-data.js     # test account values from .env
test/pages/                   # page objects: sign-in, country picker, verify OTP, home
test/specs/                   # specs
```

## Rules
- Use **keys** (`test/helpers/keys.js`), not text. The full key list is in the app
  repo: `docs/appium_keys_mapping.md` / `docs/appium_keys_mapping.xlsx`.
- Only use the staging **test** number from `.env`: Continue on sign-in sends a real OTP.
- The OTP key is the first box: type the whole code there, the app fills every box.
- One run per device at a time. No `browser.pause` — use waits.
- The app build uses the **staging** backend.
