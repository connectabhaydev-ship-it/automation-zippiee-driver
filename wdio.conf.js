import 'dotenv/config';
import path from 'node:path';

// All per-device / per-build values come from .env (see .env.example).
// Empty values in .env count as unset.
const env = (key, fallback) => process.env[key]?.trim() || fallback;

const platform = env('PLATFORM', 'android').toLowerCase();
const fresh = env('FRESH_INSTALL', '0') === '1';
const appsDir = path.resolve('apps');
// App file: a name inside apps/ or an absolute path.
const appPath = (file) => path.resolve(appsDir, file);

const android = {
  platformName: 'Android',
  'appium:automationName': 'FlutterIntegration',
  'appium:deviceName': env('ANDROID_DEVICE_NAME', 'Android Device'),
  'appium:udid': env('ANDROID_UDID', 'emulator-5554'),
  'appium:platformVersion': env('ANDROID_PLATFORM_VERSION'),
  'appium:app': appPath(env('ANDROID_APP', 'app-staging-debug.apk')),
  // Leave empty: Appium reads the package from the APK. Set only to override.
  'appium:appPackage': env('ANDROID_APP_PACKAGE'),
  // Keep the app + its login between runs. FRESH_INSTALL=1 reinstalls and wipes it.
  'appium:enforceAppInstall': fresh,
  'appium:noReset': !fresh,
  'appium:fullReset': false,
  // With noReset the app must still be (re)started, or the Flutter server
  // never answers and session creation hangs. Data (= login) is kept.
  'appium:forceAppLaunch': true,
  'appium:shouldTerminateApp': true,
  'appium:autoGrantPermissions': true,                // location / notification pop-ups
  'appium:flutterServerLaunchTimeout': 60000,
  'appium:newCommandTimeout': 300,
};

const ios = {
  platformName: 'iOS',
  'appium:automationName': 'FlutterIntegration',
  'appium:deviceName': env('IOS_DEVICE_NAME', 'My iPhone'),
  'appium:udid': env('IOS_UDID'),
  'appium:platformVersion': env('IOS_PLATFORM_VERSION'),
  'appium:xcodeOrgId': env('IOS_XCODE_ORG_ID'),
  'appium:xcodeSigningId': env('IOS_XCODE_SIGNING_ID', 'Apple Development'),
  'appium:app': appPath(env('IOS_APP', 'Zippiee Driver Staging.ipa')),
  'appium:bundleId': env('IOS_BUNDLE_ID', 'com.zippieedriver.ios'),
  'appium:autoAcceptAlerts': true,                    // accept iOS permission pop-ups
  'appium:noReset': !fresh,
  'appium:flutterServerLaunchTimeout': 60000,
  'appium:newCommandTimeout': 300,
};

// Spec files of the main flow, in run order.
const MAIN_FLOW = [
  './test/specs/01-sign-in.spec.js',     // fresh install → OTP screen
  './test/specs/02-verify-otp.spec.js',  // OTP screen → dashboard
  './test/specs/03-home.spec.js',        // home + notifications → Home tab
  './test/specs/04-wallet.spec.js',      // Wallet tab
  './test/specs/05-orders.spec.js',      // Orders tab
  './test/specs/06-profile.spec.js',     // Profile tab → back to Home
  './test/specs/07-wallet-actions.spec.js', // Wallet actions: withdraw, deposit, history
  './test/specs/08-refer-earn.spec.js',     // Profile: refer & earn
  './test/specs/09-vehicle-details.spec.js',// Profile: vehicle details & documents
  './test/specs/10-order-flow.spec.js',     // Home: incoming offers & order delivery flow
  './test/specs/11-order-chat.spec.js',     // Order chat interface & messaging
  './test/specs/12-notifications.spec.js',  // Notifications inbox & settings
  './test/specs/13-orders-filters.spec.js', // Orders history filters & details
  './test/specs/14-profile-settings.spec.js', // Profile settings, legal docs & deletion
  './test/specs/15-bank-accounts.spec.js',  // Saved bank accounts & details
  './test/specs/16-sign-up-status.spec.js', // Auth: sign up & account status
  './test/specs/17-app-version-dialogs.spec.js', // App version & system dialogs
  './test/specs/18-onboarding.spec.js',     // Onboarding steps & review verification
  './test/specs/19-order-delivery-extended.spec.js', // Extended delivery flow scenarios
  './test/specs/20-order-offers-extended.spec.js',   // Extended order offers & countdown
  './test/specs/21-wallet-extended.spec.js',         // Extended financial & withdrawal rules
  './test/specs/22-profile-extended.spec.js',        // Extended contact change, vehicle & deletion
  './test/specs/23-general-and-ui.spec.js',          // General UI consistency & localization
  './test/specs/24-location-tracking.spec.js',       // Location tracking core automation
  './test/specs/25-network-and-offline.spec.js',     // Network resilience & offline recovery
  './test/specs/26-phone-and-os-lifecycle.spec.js',  // OS Lifecycle, battery & background
  './test/specs/27-orders-history-extended.spec.js', // Orders history pagination & details
  './test/specs/28-order-chat-advanced.spec.js',     // Order chat advanced & media
  './test/specs/29-notifications-advanced.spec.js',  // Notifications advanced & channels
  './test/specs/30-delivery-and-wallet-edge-cases.spec.js', // Delivery & wallet edge cases
  './test/specs/31-profile-and-account-edge-cases.spec.js', // Profile media & account recovery
  './test/specs/32-location-tracking-advanced.spec.js',     // Location tracking advanced lifecycle
  './test/specs/33-location-network-and-oem.spec.js',       // Location OEM & permissions
  './test/specs/34-location-accuracy-and-order-flow.spec.js', // Location accuracy, soak & scale
];

// 01-02 test the login screens, so they only make sense on a fresh install.
// Otherwise the saved login is reused (see `before` below) and they are skipped.
const LOGIN_FLOW = MAIN_FLOW.slice(0, 2);
const BOOT = fresh ? LOGIN_FLOW : [];
const isLoginSpec = (file) => /0[12]-(sign-in|verify-otp)\.spec/.test(file || '');
const isOrderSpec = (file) => /order-|offer|delivery/i.test(file || '');

export const config = {
  runner: 'local',
  hostname: env('APPIUM_HOST', '127.0.0.1'),
  port: Number(env('APPIUM_PORT', '4723')),
  path: '/',

  // Main flow: the files run IN THIS ORDER in ONE app session (inner array =
  // one worker, one session). Each file starts where the previous one ended,
  // so a later file can't run alone: use a suite below (they all start at 01).
  specs: [fresh ? MAIN_FLOW : MAIN_FLOW.slice(2)],
  suites: {
    login: [LOGIN_FLOW],                      // 01-02: sign in → dashboard (needs FRESH_INSTALL=1)
    home: [[...BOOT, MAIN_FLOW[2]]],
    wallet: [[...BOOT, MAIN_FLOW[3]]],
    orders: [[...BOOT, MAIN_FLOW[4]]],
    profile: [[...BOOT, MAIN_FLOW[5]]],
    walletActions: [[...BOOT, MAIN_FLOW[3], MAIN_FLOW[6]]],
    referEarn: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[7]]],
    vehicleDetails: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[8]]],
    orderFlow: [[...BOOT, MAIN_FLOW[9]]],
    orderChat: [[...BOOT, MAIN_FLOW[10]]],
    notifications: [[...BOOT, MAIN_FLOW[11]]],
    ordersFilters: [[...BOOT, MAIN_FLOW[4], MAIN_FLOW[12]]],
    profileSettings: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[13]]],
    bankAccounts: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[14]]],
    signUpStatus: [[...BOOT, MAIN_FLOW[15]]],
    appVersion: [[...BOOT, MAIN_FLOW[16]]],
    onboarding: [[...BOOT, MAIN_FLOW[17]]],
    orderDeliveryExtended: [[...BOOT, MAIN_FLOW[18]]],
    orderOffersExtended: [[...BOOT, MAIN_FLOW[19]]],
    walletExtended: [[...BOOT, MAIN_FLOW[3], MAIN_FLOW[20]]],
    profileExtended: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[21]]],
    generalAndUi: [[...BOOT, MAIN_FLOW[22]]],
    locationTracking: [[...BOOT, MAIN_FLOW[23]]],
    networkOffline: [[...BOOT, MAIN_FLOW[24]]],
    lifecycle: [[...BOOT, MAIN_FLOW[25]]],
    ordersHistoryExtended: [[...BOOT, MAIN_FLOW[4], MAIN_FLOW[26]]],
    orderChatAdvanced: [[...BOOT, MAIN_FLOW[27]]],
    notificationsAdvanced: [[...BOOT, MAIN_FLOW[28]]],
    deliveryWalletEdge: [[...BOOT, MAIN_FLOW[29]]],
    profileAccountEdge: [[...BOOT, MAIN_FLOW[5], MAIN_FLOW[30]]],
    locationAdvanced: [[...BOOT, MAIN_FLOW[31]]],
    locationOem: [[...BOOT, MAIN_FLOW[32]]],
    locationAccuracyScale: [[...BOOT, MAIN_FLOW[33]]],
  },
  maxInstances: 1,                                    // one device, one session at a time
  capabilities: [platform === 'ios' ? ios : android],

  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 240000,                     // first iOS run builds WebDriverAgent
  connectionRetryCount: 1,

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 120000 },

  // Before every test outside the order specs, close any new-order offer /
  // ongoing-order / battery pop-up so it can't hide the bottom nav bar.
  // Log in once per session, only when the app is logged out.
  before: async (_caps, specs) => {
    if (specs.some(isLoginSpec)) return;              // 01-02 drive the login themselves
    if (env('SKIP_LOGIN', '0') === '1') return;       // debugging: leave the app as it opens
    const { ensureLoggedIn } = await import('./test/helpers/session.js');
    await ensureLoggedIn();
    // A leftover active order blocks the nav bar for every non-order spec.
    if (!specs.every(isOrderSpec)) {
      const { finishLeftoverOrder } = await import('./test/helpers/leftover-order.js');
      await finishLeftoverOrder();
    }
  },

  beforeTest: async (test) => {
    if (isOrderSpec(test.file)) return;
    const { dismissBlockingDialogs } = await import('./test/helpers/dialogs.js');
    await dismissBlockingDialogs().catch(() => {});
  },

  // On failure: screenshot + log which screen is showing, then go back to the
  // dashboard so ONE failed test doesn't fail every test after it.
  afterTest: async (test, _ctx, { passed, error }) => {
    if (passed || !error) return;                     // passed or skipped
    const fs = await import('node:fs');
    const name = `${path.basename(test.file || 'spec', '.spec.js')}-${test.title}`
      .replace(/[^\w.-]+/g, '_')
      .slice(0, 120);
    fs.mkdirSync('screenshots', { recursive: true });
    await browser.saveScreenshot(`screenshots/${name}.png`).catch(() => {});
    const { probeScreen, returnToDashboard } = await import('./test/helpers/navigation.js');
    await probeScreen(test.title).catch(() => {});
    if (!isOrderSpec(test.file) && !isLoginSpec(test.file)) await returnToDashboard();
  },
};
