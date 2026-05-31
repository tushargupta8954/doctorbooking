import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorDetails = lazy(() => import('./pages/DoctorDetails'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Appointments = lazy(() => import('./pages/Appointments'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/:id" element={<DoctorDetails />} />
            <Route path="symptom-checker" element={<SymptomChecker />} />

            {/* Protected Routes - Patient */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
              <Route path="patient/dashboard" element={<PatientDashboard />} />
              <Route path="patient/appointments" element={<Appointments />} />
              <Route path="patient/profile" element={<Profile />} />
            </Route>

            {/* Protected Routes - Doctor */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="doctor/appointments" element={<Appointments />} />
              <Route path="doctor/profile" element={<Profile />} />
              <Route path="doctor/patients" element={<PatientList />} />
            </Route>

            {/* Protected Routes - Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/doctors" element={<ManageDoctors />} />
              <Route path="admin/users" element={<ManageUsers />} />
              <Route path="admin/appointments" element={<Appointments />} />
            </Route>

            {/* Profile for all authenticated users */}
            <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;