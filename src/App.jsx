import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Toast from './components/common/Toast';

// Lazy loaded pages for performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/student/Profile'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Global Loader for Suspense fallback
const GlobalLoader = () => (
  <div className="global-loader-container">
    <div className="spinner"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard Routes wrapped in Layout */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  {/* Common Dashboard Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* Role Specific Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route path="student" element={<StudentDashboard />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
                    <Route path="staff" element={<StaffDashboard />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="admin" element={<AdminDashboard />} />
                  </Route>

                  {/* Fallback for /dashboard to redirect based on role */}
                  <Route path="" element={<Navigate to="/dashboard/profile" replace />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <Toast />
            </Suspense>
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
