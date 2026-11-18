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

export const config = {
  runner: 'local',
  hostname: env('APPIUM_HOST', '127.0.0.1'),
  port: Number(env('APPIUM_PORT', '4723')),
  path: '/',

  specs: ['./test/specs/**/*.spec.js'],
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
