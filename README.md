# SwasthyaSankalp – Healthcare Management System (MERN Stack)

**SwasthyaSankalp** is an authoritative, multi-tier healthcare management and early symptom surveillance platform built using the modern **MERN Stack**:
- **MongoDB** (with Mongoose ODM & Atlas replication)
- **Express.js** (modular REST API with Controllers, Services, and Validators)
- **React.js** (Vite SPA with Context, React Router, Recharts, and Lucide icons)
- **Node.js** (v20+ runtime with JWT authentication)

---

## 🏗️ Architecture Overview

```text
SwasthyaSankalp/
│
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection bootstrap
│   │   └── passport.js               # Passport strategies (backward compatibility)
│   │
│   ├── models/                       # Mongoose schemas with validation
│   │   ├── admin.js                  # Hospital Administrator
│   │   ├── doctor.js                 # Medical Practitioner
│   │   ├── patient.js                # Patient (Aadhaar, Consultations, Appointments)
│   │   ├── superAdmin.js             # State Health Authority
│   │   ├── policy.js                 # Public Health Directives
│   │   └── index.js                  # Models aggregator
│   │
│   ├── controllers/                  # HTTP Request & Response Handlers
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   └── superAdminController.js
│   │
│   ├── services/                     # Core Business Logic & DB Transactions
│   │   ├── authService.js
│   │   ├── adminService.js
│   │   ├── doctorService.js
│   │   ├── patientService.js
│   │   └── superAdminService.js
│   │
│   ├── routes/                       # Thin REST API Endpoint Definitions
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── superAdminRoutes.js
│   │
│   ├── middleware/                   # Security, Authorization & Error Handling
│   │   ├── authMiddleware.js         # JWT verification & user session loader
│   │   ├── roleMiddleware.js         # Role-based security boundary
│   │   ├── errorMiddleware.js        # Centralized error handler (no DB leaks)
│   │   └── validationMiddleware.js   # Input validation runner
│   │
│   ├── validators/                   # Client Input Schema Validation
│   │   ├── authValidator.js
│   │   ├── adminValidator.js
│   │   ├── doctorValidator.js
│   │   ├── patientValidator.js
│   │   └── superAdminValidator.js
│   │
│   ├── utils/
│   │   ├── response.js               # Consistent JSON response utilities
│   │   └── errors.js                 # Custom error hierarchy
│   │
│   ├── app.js                        # Express app configuration & middleware
│   ├── server.js                     # Server listener bootloader
│   ├── package.json
│   └── .env
│
├── frontend/                         # Modern React Single Page Application (SPA)
│   ├── src/
│   │   ├── api/                      # Centralized API Services
│   │   │   ├── client.js             # Axios client with JWT interceptor
│   │   │   ├── authApi.js            # Auth API
│   │   │   ├── adminApi.js           # Admin API
│   │   │   ├── doctorApi.js          # Doctor API
│   │   │   ├── patientApi.js         # Patient API
│   │   │   └── superAdminApi.js      # SuperAdmin API
│   │   │
│   │   ├── components/               # Modular Reusable UI Components
│   │   │   ├── Navbar.jsx            # Dynamic responsive navigation bar
│   │   │   ├── Sidebar.jsx           # Role-based sidebar drawer
│   │   │   ├── PageHeader.jsx        # Standardized page title & actions
│   │   │   ├── StatCard.jsx          # Metric cards
│   │   │   ├── DataTable.jsx         # Search, sort, paginate & action table
│   │   │   ├── Badge.jsx             # Status & category badges
│   │   │   ├── Modal.jsx             # Accessible modal dialogs
│   │   │   ├── ConfirmDialog.jsx     # Action confirmation modals
│   │   │   ├── EmptyState.jsx        # Clean zero-data illustrations
│   │   │   ├── LoadingState.jsx      # Loading spinners & skeletons
│   │   │   ├── Toast.jsx             # Floating notification alerts
│   │   │   └── ProtectedRoute.jsx    # Role-based frontend route protection
│   │   │
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx      # Landing & marketing layout
│   │   │   └── DashboardLayout.jsx   # Role portal layout
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Persistent JWT auth state provider
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── auth/                 # Sign In / Sign Up for each role
│   │   │   ├── admin/                # Admin triage, verification & rosters
│   │   │   ├── doctor/               # OPD Queue, Rx creator & patient records
│   │   │   ├── patient/              # Citizen portal, masked Aadhaar & Rx
│   │   │   └── superAdmin/           # State surveillance, charts & policy CRUD
│   │   │
│   │   ├── App.jsx                   # Central route tree
│   │   ├── main.jsx                  # React root mount
│   │   └── index.css                 # Modern healthcare CSS design tokens
│   │
│   ├── vite.config.js                # Vite build & proxy config
│   └── package.json
│
├── .env                              # Environment variables (PORT, MONGODB_URI, SESSION_SECRET)
└── README.md
```

---

## 🚀 How to Run

Open two terminal tabs:

### Terminal 1 — Backend:
```powershell
cd backend
npm run dev
```
* **Backend API Base**: [http://localhost:8080/api](http://localhost:8080/api)
* **Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

### Terminal 2 — Frontend:
```powershell
cd frontend
npm run dev
```
* **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Authentication & Role Security

* **JWT (JSON Web Tokens)**: Issued upon successful login with 7-day expiration.
* **Header Authorization**: Frontend Axios interceptor sends `Authorization: Bearer <token>` on all requests.
* **Role-Based Middleware Boundaries**:
  - `/api/admin/*` requires `admin` role.
  - `/api/doctor/*` requires `doctor` role.
  - `/api/patient/*` requires `patient` role.
  - `/api/superadmin/*` requires `superAdmin` role.
* **Persistent Session Recovery**: `/api/auth/me` validates the token on load and restores authenticated user state.
* **Privacy Compliance**: Citizen Aadhaar numbers are masked by default (`•••• •••• 1234`) with a toggle on the citizen portal.

---

## 🏥 Key Feature Workflows

### 1. Hospital Admin
- **Aadhaar Verification**: Real-time 12-digit format check against MongoDB database.
- **Onboarding Flow**: Prefills patient details if not registered; directs to patient profile if already registered.
- **Doctor Assignment**: Select a doctor from the hospital roster, set diagnosis/symptoms, and schedule visits.
- **End Consultation**: Closes active treatment and archives record to consultation history.
- **Doctor Roster**: Onboard doctors with specialization, qualification, and experience.

### 2. Doctor / Medical Specialist
- **OPD Queue**: View today's active appointments and consultations.
- **Upcoming Schedule**: Review future scheduled patient visits.
- **Patient Clinical Details**: Comprehensive history of prior consultations and medications.
- **Digital Prescription Creator**: Prescribe medicines with dosage, duration, and instructions directly to the patient's record.
- **Doctor Profile**: Update personal credentials, phone, and qualification.

### 3. Citizen / Patient
- **Personal Dashboard**: View current active treatment, assigned physician, and next visit.
- **Digital Health ID**: 12-digit Aadhaar health identity with secure privacy masking.
- **Consultation & Prescription Timeline**: Access all past digital prescriptions and medicines.

### 4. State SuperAdmin
- **Real-Time Analytics**: Statewide totals (patients, doctors, hospitals, districts, active policies).
- **Surveillance Charts**: Recharts visualizations for disease distribution, hospital caseloads, and district spread.
- **Policy Governance (CRUD)**: Create, Read, Update, and Delete public health policies with status badges.
- **Statewide Patient & Doctor Registries**: Cross-district search and filtering.
