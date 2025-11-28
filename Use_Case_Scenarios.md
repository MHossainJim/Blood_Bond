# Blood Bond - Use Case Scenarios

## Document Overview
**Project:** Blood Bond  
**Version:** 1.0  
**Date:** November 29, 2025  
**Purpose:** This document outlines comprehensive use case scenarios for the Blood Bond web platform

---

## Table of Contents
1. [System Overview](#system-overview)
2. [User Personas](#user-personas)
3. [Use Case Scenarios](#use-case-scenarios)
4. [Workflow Diagrams](#workflow-diagrams)
5. [Edge Cases](#edge-cases)

---

## System Overview

Blood Bond is a web-based blood donation management platform that connects blood donors with recipients in need. The system facilitates:
- Donor registration and profile management
- Blood request creation and management
- Real-time matching between donors and recipients
- Campaign organization for blood drives
- Eligibility verification for donations

---

## User Personas

### Persona 1: Sarah Ahmed - Regular Blood Donor
**Age:** 28  
**Occupation:** Software Engineer  
**Location:** Dhaka, Bangladesh  
**Blood Type:** O+  
**Tech Savvy:** High  
**Motivation:** Wants to help save lives and regularly donates blood

### Persona 2: Dr. Kamal Hassan - Hospital Staff
**Age:** 45  
**Occupation:** Emergency Room Doctor  
**Location:** Chittagong Medical College Hospital  
**Tech Savvy:** Medium  
**Motivation:** Needs quick access to blood donors for emergency patients

### Persona 3: Fatima Begum - Patient's Family Member
**Age:** 35  
**Occupation:** Teacher  
**Location:** Sylhet  
**Blood Type:** Need B+ for husband  
**Tech Savvy:** Low to Medium  
**Motivation:** Urgently needs blood for her husband's surgery

---

## Use Case Scenarios

### Use Case 1: New Donor Registration and Profile Setup

**Actor:** Sarah Ahmed (First-time User)  
**Goal:** Register as a blood donor and complete eligibility profile  
**Preconditions:** None  
**Postconditions:** User has active account with complete eligibility information

**Main Success Scenario:**

1. Sarah visits Blood Bond homepage
2. She clicks "Sign Up" button
3. She enters her credentials:
   - Full name: Sarah Ahmed
   - Email: sarah.ahmed@email.com
   - Phone: +8801711234567
   - Password: ********
   - Role: Donor
4. System validates information and creates account
5. Sarah is redirected to login page
6. She logs in with credentials
7. Sarah navigates to Profile page
8. She sees "Donor Eligibility" form with incomplete status message
9. Sarah fills in eligibility information:
   - NID Number: 1234567890123
   - Blood Group: O+
   - Age: 28
   - Address: House 45, Road 12, Dhanmondi, Dhaka
10. She clicks "Save Changes"
11. System displays: "Eligibility complete: you can donate/request without extra form"
12. Sarah's profile is now complete

**Alternative Flows:**

- **A1:** Email already exists
  - System shows error: "Email already registered"
  - Sarah uses different email or proceeds to login
  
- **A2:** Invalid NID format
  - System validates and prompts for correction
  - Sarah re-enters valid NID

**Technical Details:**
- Data stored in `bb_users` localStorage
- Session created in `bb_session` localStorage
- Eligibility checked via: `nid && blood_group && age && address`

---

### Use Case 2: Eligible Donor Making Quick Donation

**Actor:** Sarah Ahmed (Registered, Eligible Donor)  
**Goal:** Offer blood donation to recipient in need  
**Preconditions:** 
- Sarah is logged in
- Sarah has completed eligibility (NID, blood group, age, address)  
**Postconditions:** Donation request recorded in system

**Main Success Scenario:**

1. Sarah logs into Blood Bond
2. She navigates to Home page
3. She clicks "View as Donor" button
4. System displays list of recipients needing blood
5. Sarah sees "Patient: Karim - B+ Blood needed at Sylhet General"
6. She clicks "Donate" button on the card
7. **System checks eligibility (complete) - Modal bypassed**
8. System automatically submits donation with Sarah's profile data:
   - Name: Sarah Ahmed
   - Phone: +8801711234567
   - Blood Group: O+
   - NID: 1234567890123
   - Address: Dhanmondi, Dhaka
9. Alert displays: "Submitted successfully"
10. Entry saved to `bb_donations` localStorage
11. Hospital/recipient receives notification (future feature)

**Alternative Flows:**

- **A1:** Sarah's eligibility incomplete
  - System opens modal form
  - Sarah fills remaining required fields
  - Submits donation manually

---

### Use Case 3: Emergency Blood Request by Patient Family

**Actor:** Fatima Begum (Recipient - Incomplete Profile)  
**Goal:** Create urgent blood request for hospitalized family member  
**Preconditions:** Fatima has Blood Bond account  
**Postconditions:** Blood request visible to eligible donors

**Main Success Scenario:**

1. Fatima logs into Blood Bond
2. She navigates to "Requests" page
3. She clicks "My Sent Requests" tab
4. System displays "Create Request" card
5. She clicks "Create Request" button
6. Modal form opens with fields:
   - Full name: Mahmud Begum (Patient)
   - Phone number: +8801855123456
   - Address: Sylhet General Hospital, Room 302
   - Blood group: B
   - RH factor: Positive (+)
   - Gender: Male
   - Date blood needed: 2025-12-01
7. She fills all required information
8. She clicks "Submit Request"
9. System validates all fields are complete
10. Request saved with:
    - Unique ID: timestamp
    - Blood type: B+
    - Created by: fatima.begum@email.com
    - Status: Active
11. Success message: "Request created"
12. Modal closes after 600ms
13. Request appears in "My Sent Requests" list
14. Request visible to donors viewing "View as Donor"

**Alternative Flows:**

- **A1:** Missing required field
  - System shows error: "Please fill all required fields"
  - Fatima completes missing information
  
- **A2:** Invalid date (past date)
  - System validates and requests future date

---

### Use Case 4: Hospital Staff Reviewing Incoming Requests

**Actor:** Dr. Kamal Hassan (Hospital Staff)  
**Goal:** Review and respond to blood donation offers  
**Preconditions:** Dr. Kamal logged in as Hospital role  
**Postconditions:** Donation requests accepted or rejected

**Main Success Scenario:**

1. Dr. Kamal logs into Blood Bond
2. He navigates to "Requests" page
3. Default view shows "Incoming Requests"
4. System displays list of pending donation offers:
   - Anita D. - B+ Blood at Square Hospital (2 hours ago)
   - Rahul S. - B+ Blood at Square Hospital (2 hours ago)
   - Multiple other requests
5. Dr. Kamal reviews first request (Anita D.)
6. He verifies blood type matches patient need (B+)
7. He clicks "Accept" button
8. System records acceptance
9. Alert displays: "Request accepted! ID: 1"
10. Request status updated to "Accepted"
11. Donor (Anita) receives notification (future feature)

**Alternative Flows:**

- **A1:** Blood type doesn't match
  - Dr. Kamal clicks "Reject" button
  - System records rejection
  - Alert: "Request rejected! ID: 1"
  
- **A2:** Donor no longer available
  - Dr. Kamal attempts to contact donor
  - If unreachable, rejects request

---

### Use Case 5: Donor Browsing Available Recipients

**Actor:** Sarah Ahmed (Eligible Donor)  
**Goal:** Find recipients in need and offer blood  
**Preconditions:** Sarah logged in, eligibility complete  
**Postconditions:** Sarah aware of current blood needs

**Main Success Scenario:**

1. Sarah logs into Blood Bond homepage
2. By default, system shows "View as Recipient" (showing donors)
3. Sarah clicks "View as Donor" button (red, elevated when active)
4. System switches view to show recipients needing blood
5. Display shows cards for:
   - Patient: Hasan - A+ at Dhaka Medical
   - Patient: Sultana - O- at City Hospital
   - Patient: Karim - B+ at Sylhet General
   - Patient: Rina - AB+ at Khulna Hospital
   - Patient: Jamil - A- at Rajshahi Clinic
6. Each card shows:
   - Patient initials/avatar
   - Blood type badge (red)
   - Hospital location
   - Public location label
7. Sarah can scroll through available recipients
8. She selects recipient matching her willingness
9. Clicks "Donate" button
10. System auto-submits (bypasses form due to eligibility)
11. Confirmation received

**Alternative Flows:**

- **A1:** No matching blood type
  - Sarah continues browsing
  - May register interest for future needs

---

### Use Case 6: Profile Update After Initial Registration

**Actor:** Sarah Ahmed (Registered Donor, Incomplete Eligibility)  
**Goal:** Complete donor eligibility to enable quick donations  
**Preconditions:** Sarah has account but incomplete profile  
**Postconditions:** Sarah becomes eligible donor with complete information

**Main Success Scenario:**

1. Sarah logs in and clicks profile avatar
2. She navigates to Profile page
3. Profile shows:
   - Avatar (editable)
   - Name: Sarah Ahmed
   - Blood badge: (empty or old value)
   - Willing to Donate toggle: ON
   - Email (locked): sarah.ahmed@email.com
   - Phone (locked): +8801711234567
4. "Donor Eligibility" section shows:
   - NID Number: (empty)
   - Blood Group: (empty)
   - Age: (empty)
   - Address: (empty)
   - Status: "Complete eligibility (NID, blood group, age, address) to skip forms on homepage"
5. Sarah fills all fields:
   - NID: 1234567890123
   - Blood Group: O+
   - Age: 28
   - Address: House 45, Road 12, Dhanmondi, Dhaka
6. She clicks "Save Changes"
7. System validates all fields
8. Success message: "Profile updated successfully!" (green)
9. Status updates to: "Eligibility complete: you can donate/request without extra form" (green)
10. Blood badge on profile header updates to O+
11. Sarah can now make instant donations without forms

**Alternative Flows:**

- **A1:** Age below 18
  - System accepts but may warn about donation eligibility rules
  - May restrict donation features (future enhancement)

---

### Use Case 7: Campaign Registration

**Actor:** Sarah Ahmed (Donor)  
**Goal:** Register for upcoming blood donation campaign  
**Preconditions:** Sarah logged in  
**Postconditions:** Sarah registered for campaign event

**Main Success Scenario:**

1. Sarah navigates to "Campaigns" page
2. System displays available campaigns:
   - City Blood Drive - Dhaka Central Park - 2025-12-10
   - University Donation Camp - Chittagong University - 2026-01-15
3. Each campaign card shows:
   - Campaign title
   - Location
   - Date
   - "Register" button (red)
4. Sarah clicks "Register" on City Blood Drive
5. System records registration
6. Alert: "Registered for City Blood Drive"
7. Button changes to "Registered" (disabled, gray)
8. Confirmation email sent (future feature)

---

### Use Case 8: Search and Filter Donors

**Actor:** Fatima Begum (Recipient looking for specific blood type)  
**Goal:** Find donors with B+ blood type in specific location  
**Preconditions:** Fatima logged in, viewing "View as Recipient"  
**Postconditions:** Filtered list of matching donors displayed

**Main Success Scenario:**

1. Fatima on homepage, "View as Recipient" active
2. System displays all available donors
3. She sees blood group filter dropdown (if available)
4. She selects "B+" from filter
5. System filters donor list to show only B+ donors
6. She sees search box (if available)
7. She types "Sylhet" in search
8. System filters further to show B+ donors in Sylhet area
9. Filtered results show:
   - Kamal Hasan - B+ - Sylhet
10. She clicks "Request" on matching donor
11. Request submitted

**Note:** Current implementation has filter controls prepared but may need full integration.

---

## Workflow Diagrams

### Overall User Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├──────────┐
       │          │
   ┌───▼───┐  ┌──▼────┐
   │ Login │  │ Signup│
   └───┬───┘  └───┬───┘
       └──────┬───┘
              │
        ┌─────▼─────┐
        │ Dashboard │
        │   (Home)  │
        └─────┬─────┘
              │
    ┌─────────┼─────────┬──────────┐
    │         │         │          │
┌───▼───┐ ┌──▼──┐ ┌────▼────┐ ┌───▼────┐
│Profile│ │Reqs │ │Campaigns│ │ Logout │
└───────┘ └─────┘ └─────────┘ └────────┘
```

### Donation Flow (Eligible Donor)

```
┌──────────────┐
│ View as Donor│
│  (Click tab) │
└──────┬───────┘
       │
┌──────▼────────┐
│ See Recipients│
│     List      │
└──────┬────────┘
       │
┌──────▼────────┐
│ Click "Donate"│
└──────┬────────┘
       │
┌──────▼────────────┐
│ Check Eligibility │
└──────┬────────────┘
       │
  ┌────┴────┐
  │Complete?│
  └────┬────┘
       │
    ┌──┴──┐
   Yes    No
    │      │
    │   ┌──▼────────┐
    │   │ Open Modal│
    │   │Fill Fields│
    │   └──┬────────┘
    │      │
    └──────┤
           │
    ┌──────▼────────┐
    │Auto-Submit to │
    │  bb_donations │
    └──────┬────────┘
           │
    ┌──────▼────────┐
    │Success Alert  │
    └───────────────┘
```

### Request Creation Flow

```
┌──────────────┐
│ Requests Tab │
└──────┬───────┘
       │
┌──────▼────────────┐
│ My Sent Requests  │
│    (Click tab)    │
└──────┬────────────┘
       │
┌──────▼────────────┐
│ Create Request Btn│
│  (in card)        │
└──────┬────────────┘
       │
┌──────▼────────────┐
│  Modal Opens with │
│   Request Form    │
└──────┬────────────┘
       │
┌──────▼────────────┐
│ Fill All Fields:  │
│ • Name            │
│ • Phone           │
│ • Address         │
│ • Blood Group     │
│ • RH Factor       │
│ • Gender          │
│ • Date Needed     │
└──────┬────────────┘
       │
┌──────▼────────────┐
│ Submit Request    │
└──────┬────────────┘
       │
┌──────▼────────────┐
│ Validate Fields   │
└──────┬────────────┘
       │
  ┌────┴────┐
  │Complete?│
  └────┬────┘
       │
    ┌──┴──┐
   Yes    No
    │      │
    │   ┌──▼────────┐
    │   │Show Error │
    │   └───────────┘
    │
┌───▼────────────┐
│ Save to        │
│ bb_requests    │
└───┬────────────┘
    │
┌───▼────────────┐
│Success Message │
│ Modal Closes   │
└────────────────┘
```

---

## Edge Cases

### Edge Case 1: Incomplete Eligibility Attempting Quick Donate
**Scenario:** Donor without complete profile clicks "Donate"  
**Expected:** System opens modal form for manual entry  
**Actual Behavior:** Modal displays with empty/partial fields

### Edge Case 2: Donor Below Legal Age (< 18)
**Scenario:** User registers with age 16  
**Current:** System accepts but should validate donation rules  
**Recommendation:** Add age validation and warnings

### Edge Case 3: Duplicate NID Registration
**Scenario:** Two users attempt to register with same NID  
**Current:** No validation  
**Recommendation:** Add NID uniqueness check

### Edge Case 4: Expired Blood Request
**Scenario:** Request date has passed  
**Current:** Still visible in list  
**Recommendation:** Filter or mark expired requests

### Edge Case 5: Session Timeout
**Scenario:** User idle for extended period  
**Current:** Session persists in localStorage  
**Recommendation:** Add session expiry mechanism

### Edge Case 6: Browser Storage Cleared
**Scenario:** User clears browser cache/localStorage  
**Current:** All data lost (client-side only)  
**Recommendation:** Implement backend persistence

### Edge Case 7: Multiple Tabs Open
**Scenario:** User operates Blood Bond in multiple browser tabs  
**Current:** Changes may not sync across tabs  
**Recommendation:** Add storage event listeners for sync

### Edge Case 8: Network Interruption During Submit
**Scenario:** Network drops while submitting request  
**Current:** May lose data (localStorage is synchronous)  
**Recommendation:** Add retry logic or draft saving

---

## Data Storage Schema

### localStorage Keys

| Key | Purpose | Example Structure |
|-----|---------|-------------------|
| `bb_session` | Current user session | `{userId: 123, role: "donor", identifier: "email@x.com"}` |
| `bb_users` | All registered users | `[{id, name, email, phone, nid, blood_group, age, address, picture, willingToDonate}]` |
| `bb_requests` | Blood requests | `[{id, name, phone, address, blood_group, rh, gender, need_date, createdBy, time}]` |
| `bb_donations` | Donation records | `[{id, actionType, fullname, phone, email, address, blood_group, nid}]` |
| `bb_campaigns` | Available campaigns | `[{id, title, location, date}]` |
| `bb_demo_donors` | Sample donor data | `[{id, name, phone, address, blood, age, last}]` |
| `bb_demo_recipients` | Sample recipients | `[{id, name, phone, address, blood, age, neededBy}]` |

---

## User Acceptance Criteria

### For Donors:
✅ Can register and create profile  
✅ Can complete eligibility information  
✅ Can make quick donations when eligible  
✅ Can view recipients needing blood  
✅ Can register for campaigns  
✅ Can update profile and picture  
✅ Can toggle willingness to donate  

### For Recipients/Hospitals:
✅ Can create blood requests with full details  
✅ Can view incoming donation offers  
✅ Can accept/reject donation requests  
✅ Can view own sent requests  
✅ Can search for specific blood types  

### For System:
✅ Validates required fields before submission  
✅ Persists data in localStorage  
✅ Manages user sessions  
✅ Provides clear feedback messages  
✅ Responsive design for mobile/desktop  
✅ Accessible navigation and controls  

---

## Future Enhancements

1. **Real-time Notifications**
   - Email/SMS when donation accepted
   - Push notifications for urgent requests

2. **Backend Integration**
   - Replace localStorage with database
   - API for data persistence and retrieval

3. **Advanced Matching**
   - Location-based donor matching
   - Blood compatibility checking
   - Distance calculation

4. **Verification System**
   - NID verification via national database
   - Hospital verification for authenticity
   - Blood type verification certificates

5. **Donation History**
   - Track past donations
   - Donation frequency tracking
   - Health eligibility reminders (e.g., 3-month intervals)

6. **Analytics Dashboard**
   - Donation statistics
   - Blood type availability charts
   - Campaign success metrics

7. **Multi-language Support**
   - Bengali language option
   - Other regional languages

---

## Conclusion

Blood Bond provides a streamlined platform for connecting blood donors with recipients in need. The system prioritizes user experience by:

- Simplifying the donation process for eligible donors
- Enabling quick request creation for urgent needs
- Maintaining comprehensive user profiles
- Facilitating campaign management

This use case document serves as a comprehensive guide for understanding user interactions, system flows, and expected behaviors within the Blood Bond platform.

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Prepared By:** Blood Bond Development Team  
**Contact:** support@bloodbond.com (placeholder)
