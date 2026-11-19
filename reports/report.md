# Zippiee Driver – Test Execution Report

> **Execution Timestamp:** 11/19/2026, 1:32:55 PM  
> **Total Duration:** 165.0s  
> **Summary:** 70 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Metric | Count |
|---|---|
| Total Tests | 70 |
| Passed | 70 |
| Failed | 0 |
| Skipped | 0 |
| Pass Rate | 100% |

## Detailed Test Results

### 01 Sign in & OTP (AS / AU)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [AS-01] Fresh install opens on the sign-in screen after splash | 0.63s |
| ✔ Passed | [AU-01] Sign-in screen displays header title, subtitle, and input fields | 0.53s |
| ✔ Passed | [AU-02] Validation: Does not proceed with an empty phone number | 0.46s |
| ✔ Passed | [AU-04] Country picker: Opens country picker bottom sheet | 0.52s |
| ✔ Passed | [AU-04] Country picker: Searches and selects test country (+234) | 2.19s |
| ✔ Passed | [AU-02] Validation: Rejects invalid / too short phone number | 1.61s |
| ✔ Passed | [AU-06] Clear button: Empties the entered phone number field | 6.79s |
| ✔ Passed | [AU-03] Validation: Rejects symbols and special characters in phone field | 4.46s |
| ✔ Passed | [AU-05] Input formatting: Handles phone numbers with Nigerian dial code or formatting | 2.11s |
| ✔ Passed | [AU-07] Legal links: Verifies platform Terms & Conditions document link existence | 0.04s |
| ✔ Passed | [AU-01] Valid phone number: Continues and opens the OTP screen | 2.54s |

### 02 Verify OTP (AU)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [AU-08] OTP screen displays 6-digit OTP fields, Continue and Back buttons | 0.04s |
| ✔ Passed | [AU-10] Resend countdown: Resend OTP action remains disabled during countdown | 1.67s |
| ✔ Passed | [AU-14] Alternative Auth: Verifies WhatsApp OTP channel option if enabled | 0.04s |
| ✔ Passed | [AS-06] Offline Resilience: Verifies network error retry recovery key availability | 0.02s |
| ✔ Passed | [AU-09] Validation: Does not verify incomplete OTP (fewer digits) | 1.61s |
| ✔ Passed | [AU-15] Navigation: Back button returns to sign-in; re-submitting opens OTP again | 3.19s |
| ✔ Passed | [AU-09] Validation: Rejects wrong OTP and stays on OTP screen with error | 1.82s |
| ✔ Passed | [AU-08] Authentication: Correct OTP signs in successfully and opens Home dashboard | 2.92s |

### 03 Home & Notifications (PR / HM / NT)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [PR-01] Startup prompts: Closes battery/location prompts and shows the driver dashboard | 8.31s |
| ✔ Passed | [HM-06] Top bar: Shows Online/Offline toggle, notifications bell, and profile avatar | 0.04s |
| ✔ Passed | [HM-02] Safety Controls: Verifies SOS emergency button on dashboard top bar | 2.24s |
| ✔ Passed | [HM-07] Dashboard metrics: Shows home content and today's progress tiles | 0.07s |
| ✔ Passed | [HM-08] Dashboard Scroll: Verifies home dashboard scroll view container | 0.01s |
| ✔ Passed | [HM-11] Navigation: Bottom bar displays all 4 primary tabs (Home, Orders, Wallet, Profile) | 0.04s |
| ✔ Passed | [NT-01] Notifications: Bell icon opens the Notifications screen | 0.56s |
| ✔ Passed | [NT-01] Notification filter tabs: Displays All / Unread / Read tabs | 0.05s |
| ✔ Passed | [NT-02] Notifications List: Verifies notifications scrollable list view container | 0.29s |
| ✔ Passed | [NT-03] Mark All Read: Verifies mark-all-as-read action button is present | 2.23s |
| ✔ Passed | [NT-04] Notification tabs: Switching to Unread and back to All stays on Notifications | 1.09s |
| ✔ Passed | [NT-06] Notification navigation: Back button returns cleanly to Home dashboard | 0.69s |

### 04 Wallet Module (WL)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [WL-01] Navigation: Wallet tab opens the driver wallet screen | 1.35s |
| ✔ Passed | [WL-01] Balance display: Balance carousel shows Total balance card | 2.26s |
| ✔ Passed | [WL-01] Withdrawable balance: Verifies Withdrawable card is accessible in carousel | 4.36s |
| ✔ Passed | [WL-02] Earnings Breakdown: Verifies earnings breakdown cards in wallet view | 2.20s |
| ✔ Passed | [WL-08] Privacy toggle: Eye icon hides and shows total balance | 3.04s |
| ✔ Passed | [WL-01] Quick actions: Shows Deposit and Withdraw action buttons | 0.03s |
| ✔ Passed | [WL-04] Bank Accounts: Verifies saved bank account management key availability | 0.02s |
| ✔ Passed | [WL-09] Deposit flow: Deposit action opens Deposit screen with amount field, Back returns | 1.24s |
| ✔ Passed | [WL-10] Withdraw flow: Withdraw action opens Withdraw screen or zero-balance prompt, Back returns | 16.22s |
| ✔ Passed | [WL-11] Balance Limits: Verifies withdrawable balance limits and prompt resilience | 4.48s |
| ✔ Passed | [WL-15] Transaction history: History link opens past transactions list, Back returns | 1.27s |
| ✔ Passed | [WL-21] Transaction Search: Verifies transaction history search and filter capability | 1.16s |
| ✔ Passed | [HM-11] Navigation: Safely returns driver back to Home tab | 0.79s |

### 05 Orders Module (OH)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [OH-01] Navigation: Orders tab opens the order history screen | 0.54s |
| ✔ Passed | [OH-05] Status chips: Displays All / Completed / Cancelled / Rejected tabs | 0.06s |
| ✔ Passed | [OH-05] Filter navigation: Switching to Completed and back to All stays on Orders | 1.81s |
| ✔ Passed | [OH-03] List Interaction: Verifies order history list container structure | 0.03s |
| ✔ Passed | [OH-07] Order filters: Filter button opens options bottom sheet, Close button exits | 1.36s |
| ✔ Passed | [OH-06] Date Filters: Verifies date range filter options in filter bottom sheet | 1.22s |
| ✔ Passed | [OH-01] Order list: Verifies order history list view is rendered on screen | 0.02s |
| ✔ Passed | [OH-09] Order Details: Verifies order card detail elements and item list structure | 0.00s |
| ✔ Passed | [HM-11] Navigation: Safely returns driver back to Home tab | 0.80s |

### 06 Profile Module (PF / VD / RF)

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | [PF-01] Navigation: Profile tab opens the driver profile screen | 0.57s |
| ✔ Passed | [PF-01] Primary tiles: Shows Profile Settings and Performance tiles | 0.03s |
| ✔ Passed | [PF-04] Profile Completion: Verifies profile completion card and stats | 0.04s |
| ✔ Passed | [PF-03] Profile Settings: Opens driver settings screen, Back returns to Profile | 1.07s |
| ✔ Passed | [PF-05] Contact Update: Verifies contact update key mappings for phone and email | 0.00s |
| ✔ Passed | [PF-11] Driver Performance: Shows acceptance and rejection rates, Back returns | 1.38s |
| ✔ Passed | [PF-01] Secondary tiles: Verifies secondary navigation tiles on profile menu | 1.21s |
| ✔ Passed | [PF-10] Language Settings: Verifies language preference tile on profile menu | 2.29s |
| ✔ Passed | [PF-13] Legal & Compliance: Verifies Privacy Policy and Terms tiles on profile menu | 4.43s |
| ✔ Passed | [VD-01] Vehicle Details: Opens vehicle info and documents, Back returns to Profile | 10.24s |
| ✔ Passed | [VD-02] Vehicle Documents: Verifies vehicle document cards and status badges | 0.00s |
| ✔ Passed | [RF-01] Refer & Earn: Opens referral code and share actions, Back returns to Profile | 12.72s |
| ✔ Passed | [RF-02] Refer & Earn Actions: Verifies copy referral code and share button mappings | 0.01s |
| ✔ Passed | [PF-12] Help & Support: Opens support contact options and email action, Back returns | 12.87s |
| ✔ Passed | [PF-15] Logout confirmation: Modal sheet opens, Cancel safely preserves active session | 1.27s |
| ✔ Passed | [PF-01] Avatar shortcut: Top bar avatar opens profile, Home tab returns cleanly | 2.10s |
| ✔ Passed | [HM-11] Navigation: Brings driver safely back to Home tab | 0.69s |

