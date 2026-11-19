# Zippiee Driver – 05. Profile Module Report

> **Execution Timestamp:** 11/19/2026, 12:54:53 PM  
> **Total Duration:** 100.1s  
> **Summary:** 33 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Metric | Count |
|---|---|
| Total Tests | 33 |
| Passed | 33 |
| Failed | 0 |
| Skipped | 0 |
| Pass Rate | 100% |

## Detailed Test Results

### 01 Sign in

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC01 opens on the sign-in screen after the splash | 0.55s |
| ✔ Passed | TC02 shows the title and subtitle | 0.64s |
| ✔ Passed | TC03 does not move on with an empty phone number | 0.45s |
| ✔ Passed | TC04 opens the country picker | 0.52s |
| ✔ Passed | TC05 searches and selects the test country | 2.11s |
| ✔ Passed | TC06 does not move on with an invalid (too short) number | 1.55s |
| ✔ Passed | TC07 clear button empties the phone number | 6.92s |
| ✔ Passed | TC08 a valid number opens the OTP screen | 2.49s |

### 02 Verify OTP

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC09 shows the OTP field, Continue and Back | 0.03s |
| ✔ Passed | TC10 hides "Resend OTP" while the countdown runs | 1.63s |
| ✔ Passed | TC11 does not verify an incomplete OTP | 1.59s |
| ✔ Passed | TC12 Back returns to sign-in, Continue opens the OTP screen again | 3.10s |
| ✔ Passed | TC13 rejects a wrong OTP and stays on the OTP screen | 1.85s |
| ✔ Passed | TC14 the correct OTP logs in and opens the home screen | 2.40s |

### 03 Home

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC15 closes any startup prompt and shows the dashboard | 8.15s |
| ✔ Passed | TC16 shows the top bar: online toggle, notifications, avatar | 0.07s |
| ✔ Passed | TC17 shows the home content and all of today's progress tiles | 0.06s |
| ✔ Passed | TC18 shows the four bottom tabs | 0.03s |
| ✔ Passed | TC19 the bell opens Notifications | 0.51s |
| ✔ Passed | TC20 Notifications shows the All / Unread / Read tabs | 0.04s |
| ✔ Passed | TC21 switching to Unread and back to All stays on Notifications | 1.28s |
| ✔ Passed | TC22 Back returns to the home screen | 0.61s |

### 06 Profile

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC38 Profile tab opens the profile | 0.54s |
| ✔ Passed | TC39 shows the Profile settings and Performance tiles | 0.02s |
| ✔ Passed | TC40 Profile settings opens, Back returns to the profile | 1.07s |
| ✔ Passed | TC41 Performance shows the acceptance and rejection rates, Back returns | 1.68s |
| ✔ Passed | TC42 verifies secondary navigation tiles on the profile menu | 1.14s |
| ✔ Passed | TC43 Vehicle details opens, shows vehicle info, Back returns to Profile | 10.11s |
| ✔ Passed | TC44 Refer & Earn opens, displays referral code and share actions, Back returns | 12.60s |
| ✔ Passed | TC45 Help & Support opens, displays support contact action, Back returns | 12.64s |
| ✔ Passed | TC46 Logout confirmation sheet opens, Cancel preserves active session | 1.24s |
| ✔ Passed | TC47 the avatar in top bar opens the profile, Home tab comes back | 2.06s |
| ✔ Passed | TC48 brings driver safely back to Home tab | 0.66s |

