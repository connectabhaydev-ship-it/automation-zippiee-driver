# Zippiee Driver – 04. Orders Module Report

> **Execution Timestamp:** 11/19/2026, 12:51:43 PM  
> **Total Duration:** 60.9s  
> **Summary:** 28 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Metric | Count |
|---|---|
| Total Tests | 28 |
| Passed | 28 |
| Failed | 0 |
| Skipped | 0 |
| Pass Rate | 100% |

## Detailed Test Results

### 01 Sign in

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC01 opens on the sign-in screen after the splash | 0.56s |
| ✔ Passed | TC02 shows the title and subtitle | 0.51s |
| ✔ Passed | TC03 does not move on with an empty phone number | 0.42s |
| ✔ Passed | TC04 opens the country picker | 0.55s |
| ✔ Passed | TC05 searches and selects the test country | 2.07s |
| ✔ Passed | TC06 does not move on with an invalid (too short) number | 1.64s |
| ✔ Passed | TC07 clear button empties the phone number | 6.82s |
| ✔ Passed | TC08 a valid number opens the OTP screen | 2.52s |

### 02 Verify OTP

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC09 shows the OTP field, Continue and Back | 0.04s |
| ✔ Passed | TC10 hides "Resend OTP" while the countdown runs | 1.65s |
| ✔ Passed | TC11 does not verify an incomplete OTP | 1.57s |
| ✔ Passed | TC12 Back returns to sign-in, Continue opens the OTP screen again | 3.26s |
| ✔ Passed | TC13 rejects a wrong OTP and stays on the OTP screen | 1.79s |
| ✔ Passed | TC14 the correct OTP logs in and opens the home screen | 2.79s |

### 03 Home

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC15 closes any startup prompt and shows the dashboard | 8.27s |
| ✔ Passed | TC16 shows the top bar: online toggle, notifications, avatar | 0.03s |
| ✔ Passed | TC17 shows the home content and all of today's progress tiles | 0.06s |
| ✔ Passed | TC18 shows the four bottom tabs | 0.05s |
| ✔ Passed | TC19 the bell opens Notifications | 0.52s |
| ✔ Passed | TC20 Notifications shows the All / Unread / Read tabs | 0.03s |
| ✔ Passed | TC21 switching to Unread and back to All stays on Notifications | 1.18s |
| ✔ Passed | TC22 Back returns to the home screen | 0.57s |

### 05 Orders

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC32 Orders tab opens the order history | 0.51s |
| ✔ Passed | TC33 shows the All / Completed / Cancelled / Rejected tabs | 0.03s |
| ✔ Passed | TC34 switching to Completed and back to All stays on Orders | 1.18s |
| ✔ Passed | TC35 Order filter button opens filter options sheet, close button exits | 1.25s |
| ✔ Passed | TC36 verifies order history list is rendered on screen | 0.02s |
| ✔ Passed | TC37 returns driver back to Home tab | 0.77s |

