# Phase 3.1 Quick Test Guide

## What's New in Phase 3.1?

Phase 3.1 refines authentication and improves appointment booking UX based on assessment feedback:

### 1. **Phone-Based OTP Login** ✅
- Patients now login via phone number + 6-digit OTP
- Simpler, more secure than email signup
- New page: `patient-login.html`

### 2. **Removed Patient Email Signup** ✅
- Admin and doctor accounts are now pre-defined only
- No more email-based signups (more controlled)
- Use `auth.html` for doctor/admin, `patient-login.html` for patients

### 3. **Appointment Auth Check** ✅
- Must be logged in to book appointments
- Clicking "Book Appointment" without login → redirects to auth
- Visitors can still browse site freely

### 4. **Doctor Details & Availability** ✅
- Before booking, see doctor specialization and experience
- Visual indicator: Green (Available) vs Red (On Leave)
- If doctor is on leave → time slots disabled + alert shown

### 5. **Appointment Reminders** ✅
- Get browser notification 24 hours before appointment
- Fallback: Browser alert if notifications denied

---

## Test Scenarios

### Scenario 1: Patient Login (OTP)
**Goal**: Test new phone-based OTP login

1. Start fresh (clear sessionStorage, close private window)
2. Go to: `patient-login.html`
3. Enter phone: `9876543210`
4. Check browser console → Look for: `[DEMO] OTP for 9876543210: [6-digit code]`
5. Copy the 6-digit code
6. Enter OTP digits (auto-advances between fields)
7. Click "Verify OTP"
8. Should redirect to `appointment.html` ✓

**Expected Result**: Successfully logged in as patient, can book appointments

---

### Scenario 2: Visitor Cannot Book (Auth Check)
**Goal**: Verify appointment booking requires login

1. Clear sessionStorage (logout)
2. Go to: `index.html`
3. Click "Book an Appointment" button
4. Alert appears: "Please login first to book an appointment"
5. Redirected to `auth.html`

**Expected Result**: Unauthorized access blocked ✓

---

### Scenario 3: Doctor Selection & Availability
**Goal**: Test doctor info display and availability indicators

**After logging in as patient:**

1. Go to: `appointment.html` (or click Book Appointment after login)
2. Select "Dr. A. Sharma (Cardiology)"
3. Check below dropdown:
   - Shows: Name, Specialization, Experience (15 years), Focus area
   - Green badge: "✓ Available Today"
   - Time slot selector is **ENABLED** ✓

4. Now select "Dr. S. Gupta (Cardiology)"
5. Alert appears: "Dr. S. Gupta is currently on leave..."
6. Check below dropdown:
   - Shows: His info
   - Red badge: "⊘ On Leave"
   - Time slot selector is **DISABLED** (grayed out) ✓

**Expected Result**: Doctor info displays correctly, availability controls time slots ✓

---

### Scenario 4: Appointment Reminders
**Goal**: Test reminder system for upcoming appointments

1. Login as patient
2. Book appointment for **tomorrow** (use tomorrow's date)
3. Navigate to: `appointment-history.html`
4. Within 1 second, you should see:
   - Browser notification: "Appointment Reminder 🏥"
   - Or alert box if notifications disabled
   - Shows: "Your appointment with [Doctor] is scheduled for tomorrow"

**Expected Result**: Reminder appears for appointments within 24 hours ✓

---

### Scenario 5: Doctor/Admin Login (No Changes)
**Goal**: Verify doctor and admin login still work

1. Go to: `auth.html`
2. Select "Doctor" → Login with:
   - Email: `doctor@careplus.com`
   - Password: `Doctor@123`
3. Should redirect to `doctor-dashboard.html` ✓

4. Logout, select "Admin" → Login with:
   - Email: `admin@careplus.com`
   - Password: `Admin@123`
5. Should redirect to `admin-dashboard.html` ✓

**Expected Result**: Doctor/admin authentication unchanged ✓

---

## Login Credentials

### Patient (OTP)
- **Phone**: `9876543210`
- **OTP**: Check console (demo shows OTP)
- **Location**: `patient-login.html`

### Doctor (Email)
- **Email**: `doctor@careplus.com`
- **Password**: `Doctor@123`
- **Location**: `auth.html` → Select "Doctor"

### Admin (Email)
- **Email**: `admin@careplus.com`
- **Password**: `Admin@123`
- **Location**: `auth.html` → Select "Admin"

---

## Doctor Availability Reference

| Doctor | Availability | Status |
|--------|--------------|--------|
| Dr. A. Sharma (Cardiology) | Available | ✓ Can book |
| Dr. Priya Patel (Neurology) | Available | ✓ Can book |
| Dr. R. Singh (Pediatrics) | Available | ✓ Can book |
| **Dr. S. Gupta (Cardiology)** | **On Leave** | ❌ Cannot book |
| Dr. K. Rao (Neurology) | Available | ✓ Can book |
| Dr. M. Nair (Pediatrics) | Available | ✓ Can book |

---

## Files Changed

### New Files
- ✅ `patient-login.html` - Phone OTP login page

### Modified Files
- ✅ `auth.html` - Removed patient signup
- ✅ `appointment.html` - Added doctor info card
- ✅ `appointment-history.html` - Added reminder system
- ✅ `assets/js/main.js` - Added doctor info logic

---

## Common Issues & Fixes

### Issue: OTP not showing
- **Fix**: Open browser console (F12) → Look for `[DEMO] OTP` message
- **Reason**: Demo mode prints OTP to console only

### Issue: Time slots won't enable
- **Fix**: Select an available doctor, not one on leave
- **Reason**: On-leave doctors have slots disabled

### Issue: No reminder notification
- **Fix**: Appointment must be within 24 hours of now
- **Fix**: Allow browser notifications when prompted
- **Fallback**: Will show alert box if notifications denied

### Issue: Can't login as patient
- **Fix**: Make sure you're on `patient-login.html` not `auth.html`
- **Fix**: Patient login uses phone OTP, not email password

### Issue: Doctor info card not showing
- **Fix**: Select a doctor from the dropdown
- **Fix**: Card appears after selection, not by default

---

## What This Fixes (Assessment Feedback)

✅ **Problem**: Visitor could see appointment button but couldn't use it  
✅ **Solution**: Added auth check, clear redirect to login

✅ **Problem**: Patient signup was unnecessarily complex  
✅ **Solution**: Phone OTP is simpler, matches real hospital workflows

✅ **Problem**: Admin/doctor accounts could be created by anyone  
✅ **Solution**: Pre-defined accounts only, controlled by hospital

✅ **Problem**: No way to see doctor info before booking  
✅ **Solution**: Doctor details card shows specialization, experience, focus

✅ **Problem**: No indicator if doctor was available  
✅ **Solution**: Green/red availability badge, disables booking if unavailable

✅ **Problem**: No reminder for upcoming appointments  
✅ **Solution**: Browser notifications remind patients 24 hours before

---

## Browser Console Output (Expected)

When logging in as patient via OTP:
```
[DEMO] OTP for 9876543210: 547382
Patient session created successfully
Redirecting to appointment.html...
```

When checking reminders:
```
Setting reminder for appointment: Dr. A. Sharma on 2026-01-15
Reminder triggered: Appointment Reminder 🏥
```

---

## Performance Notes

- ✅ Fast OTP generation (no server call)
- ✅ Doctor info loaded instantly (in-memory database)
- ✅ Reminders use efficient sessionStorage deduplication
- ✅ No unnecessary API calls or page reloads

---

## Next Steps After Testing

If everything works:
1. Commit changes: `git add . && git commit -m "Phase 3.1: Auth & UX refinements"`
2. Push to GitHub: `git push`
3. Review PHASE3_1_CHANGES.md for complete documentation
4. Consider Phase 3.2: Real Firebase Phone Auth, email confirmations

---

**Last Updated**: 2026  
**Status**: Phase 3.1 Complete ✅  
**Test Coverage**: 5 scenarios covered  
**Expected Pass Rate**: 100%  
