# CarePlus Hospital - Phase 3 Implementation Guide

## Overview
Phase 3 introduces role-based authentication, appointment management, doctor prescriptions, and admin dashboards. This document details all new features and how to use them.

---

## 🔐 1. ROLE-BASED AUTHENTICATION SYSTEM

### New Files Created
- **`auth.html`** - Main login page with role selection
- **`signup.html`** - User registration page  
- **`assets/js/auth.js`** - Authentication utilities and helpers

### How It Works

#### A. Patient Login
1. Go to `auth.html`
2. Select **Patient** role
3. Enter email and password
4. Redirected to appointment booking page
5. Can access appointment history at any time

**Features:**
- Email/Password authentication via Firebase Auth
- User profile stored in Firestore `users` collection
- Session stored in `sessionStorage`
- Can book appointments, view history, and see prescriptions

#### B. Doctor Login
1. Go to `auth.html`
2. Select **Doctor** role
3. Enter email, password, and **Doctor ID**
4. Redirected to `doctor-dashboard.html`

**Features:**
- View only their assigned appointments
- Add/update prescription notes
- See patient details
- Track appointment statistics

#### C. Admin Login
1. Go to `auth.html`
2. Select **Admin** role
3. Enter email and password
4. Redirected to `admin-dashboard.html`

**Features:**
- View all appointments globally
- View all users (patients & doctors)
- Manage appointment statuses
- Monitor system statistics

### Authentication Utilities (auth.js)
```javascript
// Check if user is authenticated
isAuthenticated()

// Get current user data
getCurrentUser()  // Returns: { uid, email, role, name, doctorId }

// Check user role
hasRole(role)

// Require authentication (auto-redirect)
requireAuth()

// Require specific role (auto-redirect)
requireRole('patient' | 'doctor' | 'admin')

// Logout
logout()

// Show notifications
showNotification(message, type)  // type: 'success', 'error', 'info'
```

### Firestore Schema (users collection)
```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "name": "Full Name",
  "role": "patient|doctor|admin",
  "doctorId": "DOC-12345",  // Only for doctors
  "createdAt": "2026-02-04",
  "status": "active"
}
```

---

## 📅 2. APPOINTMENT BOOKING IMPROVEMENTS

### Date & Time Enhancements

#### Date Input Restrictions
✅ **Features:**
- Minimum date set to today
- Past dates are disabled and cannot be selected
- Validation on date input to prevent manual past date entry
- Real-time feedback to users

#### Time Slot Selection (NEW)
✅ **Optional dropdown** with predefined time slots:
- 09:00 AM - 10:00 AM
- 10:00 AM - 11:00 AM
- 11:00 AM - 12:00 PM
- 02:00 PM - 03:00 PM
- 03:00 PM - 04:00 PM
- 04:00 PM - 05:00 PM

### Implementation Details

**File Modified:** `appointment.html`

```html
<!-- Date Input (auto-validates) -->
<input type="date" class="form-control" required>

<!-- Time Slot (optional) -->
<select class="form-control">
  <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
  <!-- ... more slots ... -->
</select>
```

**Backend Changes in main.js:**
- Date validation prevents past date selection
- Appointment data includes `status: 'Pending'` by default
- Linked to authenticated user if logged in (`userId` field)

### Firestore Appointment Schema
```json
{
  "id": "appointment_id",
  "patientName": "John Doe",
  "phone": "9876543210",
  "department": "Cardiology",
  "doctor": "Dr. A. Sharma",
  "preferredDate": "2026-02-15",
  "preferredTime": "09:00-10:00",  // Optional
  "status": "Pending",  // New: Pending, Approved, Completed
  "userId": "firebase_uid",  // New: Link to user account
  "createdAt": "2026-02-04T10:30:00Z"
}
```

---

## 📋 3. PATIENT APPOINTMENT HISTORY

### New Page: `appointment-history.html`

**Features:**
- View all personal appointments
- Filter by status: All, Upcoming, Completed
- Display doctor name, department, date, and status
- View associated prescriptions
- Reschedule option (placeholder)

### UI Components

#### Filter Tabs
```
[All] [Upcoming] [Completed]
```

#### Appointment Card
```
┌─ Dr. A. Sharma (Cardiology) ──────────────── [UPCOMING] ─┐
│                                                            │
│ Appointment Date: Fri, Feb 15, 2026                       │
│ Patient Name: John Doe                                   │
│ Phone: 9876543210                                        │
│ Status: Pending                                          │
│                                                            │
│ [Reschedule] [View Prescription]                         │
│                                                            │
│ 💊 Doctor's Prescription (if available)                  │
│ Diagnosis: Common Fever                                  │
│ Medicines: Aspirin 500mg twice daily                     │
│ Notes: Rest for 48 hours                                 │
└────────────────────────────────────────────────────────────┘
```

### Status Determination
- **Upcoming**: Appointment date >= Today
- **Completed**: Appointment date < Today

### Implementation
```javascript
// Automatic filtering based on date
function getAppointmentStatus(dateString) {
  const appointmentDate = new Date(dateString);
  const today = new Date();
  return appointmentDate >= today ? 'Upcoming' : 'Completed';
}
```

---

## 💊 4. DOCTOR PRESCRIPTION FEATURE

### New Page: `doctor-dashboard.html`

**Features:**
- View only assigned appointments
- Add prescription details for each appointment
- See patient contact information
- Track prescription count

### How to Add Prescription

1. **Login as Doctor** (use doctor account with Doctor ID)
2. **View appointments** in dashboard
3. Click **[Prescription]** button next to appointment
4. Fill prescription form:
   - Diagnosis (required)
   - Medicines (required)
   - Additional Notes (optional)
5. Click **Save Prescription**

### Prescription Modal
```
┌──────────────────────────────────┐
│ Add Prescription           [X]   │
├──────────────────────────────────┤
│ Patient Name: John Doe (disabled)│
│ Diagnosis: _____________________ │
│ Medicines: _____________________ │
│           |___________________|  │
│ Notes: __________________________ │
│        |___________________|     │
│                                  │
│ [Cancel] [Save Prescription]    │
└──────────────────────────────────┘
```

### Firestore Prescription Schema
```json
{
  "id": "prescription_id",
  "appointmentId": "appointment_id",
  "diagnosis": "Common Fever",
  "medicines": "Aspirin 500mg twice daily for 5 days",
  "notes": "Rest for 48 hours, drink plenty of water",
  "doctorId": "firebase_uid",
  "doctorName": "Dr. A. Sharma",
  "createdAt": "2026-02-04T10:30:00Z"
}
```

### Patient Access
- Patients see prescriptions in their **Appointment History**
- Click **[View Prescription]** to see details
- Shows diagnosis, medicines, and notes

---

## ✅ 5. UI/NAVIGATION FIXES

### Fixed Issue: Active Tab Highlighting

**Problem:** Appointment tab stayed highlighted when navigating to other pages

**Solution:** Enhanced active link detection in `main.js`

```javascript
// BEFORE (Buggy):
if (link.href.includes(currentPath)) {
  link.classList.add('active');  // Too broad matching
}

// AFTER (Fixed):
if (linkFile === currentFile || 
    (currentFile === '' && linkFile === 'index.html')) {
  link.classList.add('active');  // Exact filename match
}
```

**Result:**
- ✅ Only current page tab is highlighted
- ✅ Other tabs remain normal blue color
- ✅ Highlighting updates correctly on navigation

### Navigation Logic
1. Extract filename from href: `doctors.html`, `index.html`
2. Get current page filename from URL
3. Compare exact match only
4. Remove `active` class from non-matching links

---

## 📊 6. ADDITIONAL SMART FEATURES

### A. Appointment Status Tracking

**Status Values:**
- `Pending` - Initial state (default)
- `Approved` - Admin/Doctor approved
- `Completed` - Appointment happened

**Visual Indicators:**
```
[PENDING]   - Yellow/Orange badge
[APPROVED]  - Green badge  
[COMPLETED] - Gray badge
```

**Admin Control:**
- Admin can change status via dashboard
- `[Approve]` and `[Complete]` buttons
- Status persists in Firestore

### B. Simple Notifications

**Notification System** (toast-style):
```javascript
showNotification(message, type)
// Types: 'success', 'error', 'info'
```

**Examples:**
```javascript
showNotification('Appointment Booked Successfully!', 'success');
showNotification('Failed to save prescription', 'error');
showNotification('Logged in as Dr. Smith', 'info');
```

**Visual Design:**
- Fixed position (top-right)
- Auto-hide after 3 seconds
- Smooth slide-in/out animation
- Color-coded by type

### C. Quick Statistics

**Admin Dashboard Shows:**
- Total Appointments
- Total Users (Patients + Doctors)
- Pending Appointments
- Total Prescriptions

**Doctor Dashboard Shows:**
- Total Appointments assigned
- Today's appointments
- Prescriptions added

### D. Search & Filter Features

**Admin Dashboard:**
- Search appointments by patient name or doctor
- Search users by name or email
- Real-time filtering as you type

**Patient History:**
- Filter appointments: All, Upcoming, Completed
- Tab-based switching

---

## 🔗 7. FIRESTORE COLLECTIONS SETUP

### Required Collections

#### 1. `users` Collection
```javascript
// Document ID: auto-generated
{
  uid: "firebase_uid",
  email: "user@example.com",
  name: "User Name",
  role: "patient|doctor|admin",
  doctorId: "DOC-123" (doctors only),
  createdAt: Timestamp,
  status: "active"
}
```

#### 2. `appointments` Collection
```javascript
{
  patientName: string,
  phone: string,
  department: string,
  doctor: string,
  preferredDate: string (YYYY-MM-DD),
  preferredTime: string (optional, HH:MM-HH:MM),
  status: "Pending|Approved|Completed",
  userId: string (optional, linked user),
  createdAt: Timestamp
}
```

#### 3. `prescriptions` Collection
```javascript
{
  appointmentId: string,
  diagnosis: string,
  medicines: string,
  notes: string,
  doctorId: string,
  doctorName: string,
  createdAt: Timestamp
}
```

#### 4. `contactMessages` Collection (Existing)
```javascript
{
  name: string,
  email: string,
  message: string,
  createdAt: Timestamp
}
```

---

## 🚀 8. TESTING SCENARIOS

### Test Data (Create in Firebase)

#### Sample Patient Account
```
Email: patient@careplus.com
Password: Patient@123
Role: patient
Name: John Patient
```

#### Sample Doctor Account
```
Email: doctor@careplus.com
Password: Doctor@123
Role: doctor
Name: Dr. A. Sharma
Doctor ID: DOC-SHARMA-001
```

#### Sample Admin Account
```
Email: admin@careplus.com
Password: Admin@123
Role: admin
Name: Admin User
```

### Test Workflows

**Workflow 1: Patient Journey**
1. Go to `signup.html` → Create patient account
2. Go to `auth.html` → Login as patient
3. Go to `appointment.html` → Book appointment
4. Go to `appointment-history.html` → View bookings
5. Wait for doctor to add prescription
6. View prescription in history

**Workflow 2: Doctor Journey**
1. Go to `signup.html` → Create doctor account (with Doctor ID)
2. Go to `auth.html` → Login as doctor
3. View assigned appointments
4. Click prescription → Add diagnosis/medicines
5. View in statistics

**Workflow 3: Admin Journey**
1. Go to `auth.html` → Login as admin
2. View all appointments globally
3. Change appointment status (Pending → Approved → Completed)
4. View all users
5. Monitor prescriptions

---

## 📁 9. NEW FILES CREATED

```
careplus/
├── auth.html                      # Phase 3: Login page
├── signup.html                    # Phase 3: Registration page
├── appointment-history.html       # Phase 3: Patient history
├── doctor-dashboard.html          # Phase 3: Doctor interface
├── admin-dashboard.html           # Phase 3: Admin interface
└── assets/js/
    └── auth.js                    # Phase 3: Auth utilities
```

---

## 📝 10. MODIFIED FILES

### index.html
- Added "Login" link in navbar
- Links to `auth.html`

### appointment.html
- Added time slot selector (optional)
- Added link to `appointment-history.html`
- Enhanced date validation in `main.js`

### assets/js/main.js
- Fixed active link highlighting (navigation)
- Enhanced date input validation
- Integrated auth check for appointment booking
- Added user prefill for logged-in patients
- Added notification system

### assets/js/firebase.js
- No changes (existing config)

---

## 🔒 11. SECURITY NOTES

✅ **Implemented:**
- Firebase Auth for all roles
- Role-based access control (code-level)
- Session storage for user data
- Firestore security rules (configure in Firebase Console)

**Recommended Firestore Rules:**
```javascript
// Patients can only read their own appointments
match /appointments/{doc} {
  allow read: if request.auth.uid == resource.data.userId;
}

// Doctors can read their assigned appointments
match /appointments/{doc} {
  allow read: if request.auth.token.role == 'doctor';
}

// Admin can read everything
match /{document=**} {
  allow read, write: if request.auth.token.role == 'admin';
}
```

---

## 🎯 12. NEXT STEPS / FUTURE ENHANCEMENTS

- [ ] Email notifications on appointment updates
- [ ] SMS reminders for upcoming appointments
- [ ] Payment integration for advanced features
- [ ] Appointment cancellation & rescheduling
- [ ] Doctor availability calendar view
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Video consultation integration
- [ ] Telemedicine capabilities
- [ ] Insurance claim processing

---

## 📞 SUPPORT

For issues or questions:
1. Check Firebase Console for auth/Firestore errors
2. Review browser console for JavaScript errors
3. Verify Firestore security rules are configured
4. Ensure all required collections exist
5. Test with sample data provided above

---

**Last Updated:** February 4, 2026  
**Phase:** 3 - Advanced Enhancements  
**Status:** ✅ Complete
