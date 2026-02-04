# CarePlus Hospital Website

Professional Hospital Management Website built with HTML, CSS, JavaScript, and Firebase.

## 📱 Phases

### Phase 1 ✅ (Complete)
- Static UI with responsive design
- Department and doctor pages
- Contact form

### Phase 2 ✅ (Complete)
- Firebase integration (Auth & Firestore)
- Appointment booking
- Admin access via hidden login

### Phase 3 ✅ (Complete - NEW)
**Advanced Enhancements with Role-Based System:**
- 🔐 **3-Role Authentication**: Patient, Doctor, Admin
- 📅 **Enhanced Appointments**: Date validation, time slots, status tracking
- 📋 **Patient History**: View appointments and prescriptions
- 💊 **Doctor Prescriptions**: Add diagnosis, medicines, notes
- 🛡️ **Admin Dashboard**: Manage all appointments, users, prescriptions
- ⚡ **Smart Features**: Notifications, statistics, search/filter

## 🚀 Key Features

### Authentication (Phase 3)
- **Patient Role**: Book appointments, view history, see prescriptions
- **Doctor Role**: View assigned appointments, add prescriptions
- **Admin Role**: View all data, manage statuses, monitor system

### Appointment Management (Phase 3)
- Date validation (today + future dates only)
- Optional time slot selection
- Status tracking (Pending → Approved → Completed)
- Patient appointment history with filtering

### Prescriptions (Phase 3)
- Doctors add diagnosis, medicines, and notes
- Linked to specific appointments
- Visible in patient history

### Admin Dashboard (Phase 3)
- View all appointments globally
- View all users (patients & doctors)
- View all prescriptions
- Manage appointment statuses
- Search and filter capabilities

## 📁 New Pages (Phase 3)

| Page | URL | Purpose |
|------|-----|---------|
| Login | `auth.html` | Role-based authentication |
| Sign Up | `signup.html` | User registration |
| My Appointments | `appointment-history.html` | Patient history & prescriptions |
| Doctor Dashboard | `doctor-dashboard.html` | Doctor interface |
| Admin Dashboard | `admin-dashboard.html` | System administration |

## 🔧 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Auth, Firebase Firestore
- **Authentication**: Email/Password (Firebase Auth)
- **Database**: Firestore (NoSQL)
- **Hosting Ready**: Vercel (static site)

## 📖 Documentation

- **[PHASE3_GUIDE.md](PHASE3_GUIDE.md)** - Complete technical guide with implementation details
- **[PHASE3_SUMMARY.md](PHASE3_SUMMARY.md)** - High-level overview and architecture
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup and testing guide
- **[PHASE3_CHECKLIST.md](PHASE3_CHECKLIST.md)** - Implementation verification checklist

## 🚀 Quick Start

### Step 1: Create Test Accounts in Firebase
```
PATIENT:
Email: patient@careplus.com
Password: Patient@123

DOCTOR:
Email: doctor@careplus.com
Password: Doctor@123
Doctor ID: DOC-SHARMA-001

ADMIN:
Email: admin@careplus.com
Password: Admin@123
```

### Step 2: Add User Profiles to Firestore `users` Collection
```json
{
  "uid": "[firebase_uid]",
  "email": "user@careplus.com",
  "name": "User Name",
  "role": "patient|doctor|admin",
  "doctorId": "DOC-ID" (doctors only),
  "status": "active"
}
```

### Step 3: Test the System
1. Open `auth.html`
2. Select role and login
3. Explore role-specific features

## 🧪 Test Workflows

### Patient Journey
1. Sign up at `signup.html`
2. Login at `auth.html`
3. Book appointment at `appointment.html`
4. View history at `appointment-history.html`
5. See prescriptions (after doctor adds them)

### Doctor Journey
1. Login at `auth.html` (with Doctor ID)
2. View `doctor-dashboard.html`
3. Click [Prescription] to add details
4. Prescription available in patient history

### Admin Journey
1. Login at `auth.html`
2. Access `admin-dashboard.html`
3. Manage all appointments and users
4. Update appointment statuses

## 📊 Firestore Collections

```
users/
  - uid, email, name, role, doctorId, status

appointments/
  - patientName, phone, department, doctor
  - preferredDate, preferredTime, status
  - userId (linked to user)

prescriptions/
  - appointmentId, diagnosis, medicines, notes
  - doctorId, doctorName, createdAt

contactMessages/
  - name, email, message, createdAt
```

## 🔐 Security

✅ **Implemented:**
- Firebase Authentication (built-in security)
- Role-based access control
- Session management
- Proper logout functionality

⚠️ **Configure in Firebase Console:**
- Firestore security rules
- Authentication methods
- Email verification (optional)

## 📱 Responsive Design

✅ Fully responsive for:
- Mobile (< 480px)
- Tablet (480px - 1024px)
- Desktop (> 1024px)

## 🌐 Deployment

### Vercel Deployment
```bash
1. Push to GitHub
2. Connect GitHub to Vercel
3. Vercel auto-deploys on push
```

### Firebase Setup (Before Deployment)
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add security rules
5. Update config in `assets/js/firebase.js`

## ⚡ Features

### Phase 1 Features ✅
- Responsive UI with Apple-inspired design
- Department and service pages
- Doctor directory with filtering
- Contact form

### Phase 2 Features ✅
- Firebase authentication
- Firestore appointment storage
- Admin access (hidden login)
- Real-time data sync

### Phase 3 Features ✅ (NEW)
- Multi-role authentication (Patient/Doctor/Admin)
- Enhanced appointment system
- Patient appointment history
- Doctor prescription management
- Admin control dashboard
- Appointment status tracking
- Toast notifications
- Search and filter capabilities
- Statistics dashboard
- Date and time validation

## 📞 Support

For issues or questions:
1. Check [PHASE3_GUIDE.md](PHASE3_GUIDE.md) for detailed documentation
2. Review [QUICK_START.md](QUICK_START.md) for setup help
3. Check [PHASE3_CHECKLIST.md](PHASE3_CHECKLIST.md) for verification
4. Review Firebase Console for data/auth issues
5. Check browser console for JavaScript errors

## 🎯 Project Status

✅ **Phase 1**: Complete (Static UI)
✅ **Phase 2**: Complete (Firebase Integration)
✅ **Phase 3**: Complete (Advanced Enhancements)

**Overall Status**: 🚀 **Production Ready**

## 📝 License

This project is part of an internship/RTR program for hospital management system development.

## 👥 Contributors

- Development Team
- Phase 3: Role-based system, prescriptions, admin dashboard

---

**Last Updated**: February 4, 2026  
**Current Version**: Phase 3 ✅  
**Status**: Ready for Deployment 🚀
