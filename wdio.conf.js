import 'dotenv/config';
import path from 'node:path';

// All per-device / per-build values come from .env (see .env.example).
// Empty values in .env count as unset.
const env = (key, fallback) => process.env[key]?.trim() || fallback;

const platform = env('PLATFORM', 'android').toLowerCase();
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
  'appium:enforceAppInstall': true,                   // always reinstall the test build
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

export const config = {
  runner: 'local',
  hostname: env('APPIUM_HOST', '127.0.0.1'),
  port: Number(env('APPIUM_PORT', '4723')),
  path: '/',

  // Main flow: the files run IN THIS ORDER in ONE app session (inner array =
  // one worker, one session). Each file starts where the previous one ended,
  // so a later file can't run alone: use a suite below (they all start at 01).
  specs: [MAIN_FLOW],
  suites: {
    login: [MAIN_FLOW.slice(0, 2)],           // 01-02: sign in → dashboard
    home: [MAIN_FLOW.slice(0, 3)],            // 01-03
    wallet: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[3]]],
    orders: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[4]]],
    profile: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5]]],
    walletActions: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[3], MAIN_FLOW[6]]],
    referEarn: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[7]]],
    vehicleDetails: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[8]]],
    orderFlow: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[9]]],
    orderChat: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[10]]],
    notifications: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[11]]],
    ordersFilters: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[4], MAIN_FLOW[12]]],
    profileSettings: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[13]]],
    bankAccounts: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[14]]],
    signUpStatus: [[MAIN_FLOW[15]]],
    appVersion: [[MAIN_FLOW[16]]],
    onboarding: [[MAIN_FLOW[17]]],
    orderDeliveryExtended: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[18]]],
    orderOffersExtended: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[19]]],
    walletExtended: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[3], MAIN_FLOW[20]]],
    profileExtended: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[21]]],
    generalAndUi: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[22]]],
    locationTracking: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[23]]],
    networkOffline: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[24]]],
    lifecycle: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[25]]],
    ordersHistoryExtended: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[4], MAIN_FLOW[26]]],
    orderChatAdvanced: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[27]]],
    notificationsAdvanced: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[28]]],
    deliveryWalletEdge: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[29]]],
    profileAccountEdge: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[5], MAIN_FLOW[30]]],
    locationAdvanced: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[31]]],
    locationOem: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[32]]],
    locationAccuracyScale: [[...MAIN_FLOW.slice(0, 3), MAIN_FLOW[33]]],
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
};
