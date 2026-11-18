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
