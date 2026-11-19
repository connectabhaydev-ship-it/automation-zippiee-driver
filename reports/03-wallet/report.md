# Zippiee Driver – 03. Wallet Module Report

> **Execution Timestamp:** 11/19/2026, 12:49:26 PM  
> **Total Duration:** 88.0s  
> **Summary:** 31 Passed, 0 Failed, 0 Skipped (100% Pass Rate)

| Metric | Count |
|---|---|
| Total Tests | 31 |
| Passed | 31 |
| Failed | 0 |
| Skipped | 0 |
| Pass Rate | 100% |

## Detailed Test Results

### 01 Sign in

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC01 opens on the sign-in screen after the splash | 0.58s |
| ✔ Passed | TC02 shows the title and subtitle | 0.54s |
| ✔ Passed | TC03 does not move on with an empty phone number | 0.43s |
| ✔ Passed | TC04 opens the country picker | 0.52s |
| ✔ Passed | TC05 searches and selects the test country | 2.07s |
| ✔ Passed | TC06 does not move on with an invalid (too short) number | 1.57s |
| ✔ Passed | TC07 clear button empties the phone number | 6.89s |
| ✔ Passed | TC08 a valid number opens the OTP screen | 2.58s |

### 02 Verify OTP

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC09 shows the OTP field, Continue and Back | 0.04s |
| ✔ Passed | TC10 hides "Resend OTP" while the countdown runs | 1.66s |
| ✔ Passed | TC11 does not verify an incomplete OTP | 1.57s |
| ✔ Passed | TC12 Back returns to sign-in, Continue opens the OTP screen again | 3.42s |
| ✔ Passed | TC13 rejects a wrong OTP and stays on the OTP screen | 1.80s |
| ✔ Passed | TC14 the correct OTP logs in and opens the home screen | 2.71s |

### 03 Home

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC15 closes any startup prompt and shows the dashboard | 8.23s |
| ✔ Passed | TC16 shows the top bar: online toggle, notifications, avatar | 0.04s |
| ✔ Passed | TC17 shows the home content and all of today's progress tiles | 0.07s |
| ✔ Passed | TC18 shows the four bottom tabs | 0.04s |
| ✔ Passed | TC19 the bell opens Notifications | 0.52s |
| ✔ Passed | TC20 Notifications shows the All / Unread / Read tabs | 0.06s |
| ✔ Passed | TC21 switching to Unread and back to All stays on Notifications | 1.26s |
| ✔ Passed | TC22 Back returns to the home screen | 0.56s |

### 04 Wallet

| Status | Test Title | Duration |
|---|---|---|
| ✔ Passed | TC23 Wallet tab opens the wallet | 1.33s |
| ✔ Passed | TC24 shows the balance carousel with the total balance card | 2.20s |
| ✔ Passed | TC25 verifies withdrawable balance card is accessible in carousel | 4.39s |
| ✔ Passed | TC26 the eye icon hides and shows the total balance | 3.06s |
| ✔ Passed | TC27 shows the Deposit and Withdraw quick actions | 0.02s |
| ✔ Passed | TC28 Deposit quick action opens Deposit screen with amount field, Back returns | 1.19s |
| ✔ Passed | TC29 Withdraw quick action opens Withdraw screen or zero-balance prompt, Back returns | 16.26s |
| ✔ Passed | TC30 Transaction history link opens Transaction history, Back returns | 1.26s |
| ✔ Passed | TC31 brings driver back to Home tab | 0.78s |

