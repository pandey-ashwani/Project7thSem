import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './pages/auth/AdminSignup';
import DoctorLogin from './pages/auth/DoctorLogin';
import PatientLogin from './pages/auth/PatientLogin';
import PatientSignup from './pages/auth/PatientSignup';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SuperAdminSignup from './pages/auth/SuperAdminSignup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientCheck from './pages/admin/PatientCheck';
import NewPatient from './pages/admin/NewPatient';
import PatientHistory from './pages/admin/PatientHistory';
import PatientProfile from './pages/admin/PatientProfile';
import DoctorList from './pages/admin/DoctorList';
import AdminProfile from './pages/admin/AdminProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import TodayAppointments from './pages/doctor/TodayAppointments';
import UpcomingAppointments from './pages/doctor/UpcomingAppointments';
import DoctorPatientHistory from './pages/doctor/DoctorPatientHistory';
import DoctorPatientDetail from './pages/doctor/DoctorPatientDetail';
import DoctorProfile from './pages/doctor/DoctorProfile';

// SuperAdmin Pages
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
import PolicyManager from './pages/superAdmin/PolicyManager';
import StatewidePatients from './pages/superAdmin/StatewidePatients';
import StatewideDoctors from './pages/superAdmin/StatewideDoctors';
import HospitalNetwork from './pages/superAdmin/HospitalNetwork';
import SuperAdminProfile from './pages/superAdmin/SuperAdminProfile';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import MedicalRecords from './pages/patient/MedicalRecords';
import PatientProfileView from './pages/patient/PatientProfile';

const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {user && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<Home />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<Navigate to="/login-admin" replace />} />
            <Route path="/register-admin" element={<AdminSignup />} />
            <Route path="/admin/signup" element={<Navigate to="/register-admin" replace />} />

            <Route path="/login-doctor" element={<DoctorLogin />} />
            <Route path="/doctor/login" element={<Navigate to="/login-doctor" replace />} />

            <Route path="/login-patient" element={<PatientLogin />} />
            <Route path="/patient/login" element={<Navigate to="/login-patient" replace />} />
            <Route path="/patient-signup" element={<PatientSignup />} />
            <Route path="/patient/signup" element={<Navigate to="/patient-signup" replace />} />

            <Route path="/superadmin-login" element={<SuperAdminLogin />} />
            <Route path="/superadmin/login" element={<Navigate to="/superadmin-login" replace />} />
            <Route path="/superadmin-signup" element={<SuperAdminSignup />} />
            <Route path="/superadmin/signup" element={<Navigate to="/superadmin-signup" replace />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/check-patient" element={<PatientCheck />} />
              <Route path="/admin/new-patient" element={<NewPatient />} />
              <Route path="/admin/patients" element={<PatientHistory />} />
              <Route path="/admin/patients/:id" element={<PatientProfile />} />
              <Route path="/admin/doctors" element={<DoctorList />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/today" element={<TodayAppointments />} />
              <Route path="/doctor/upcoming" element={<UpcomingAppointments />} />
              <Route path="/doctor/history" element={<DoctorPatientHistory />} />
              <Route path="/doctor/patients/:id" element={<DoctorPatientDetail />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
            </Route>

            {/* SuperAdmin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['superAdmin', 'superadmin']} />}>
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/policies" element={<PolicyManager />} />
              <Route path="/superadmin/patients" element={<StatewidePatients />} />
              <Route path="/superadmin/doctors" element={<StatewideDoctors />} />
              <Route path="/superadmin/hospitals" element={<HospitalNetwork />} />
              <Route path="/superadmin/profile" element={<SuperAdminProfile />} />
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/records" element={<MedicalRecords />} />
              <Route path="/patient/profile" element={<PatientProfileView />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
