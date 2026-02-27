import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Toast from './components/common/Toast';
import FloatingChatbot from './components/chatbot/FloatingChatbot';

// Lazy loaded pages
const Landing          = lazy(() => import('./pages/Landing'));
const Login            = lazy(() => import('./pages/Login'));
const Register         = lazy(() => import('./pages/Register'));
const Profile          = lazy(() => import('./pages/student/Profile'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StaffDashboard   = lazy(() => import('./pages/staff/StaffDashboard'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));

const ForgotPassword   = lazy(() => import('./pages/ForgotPassword'));

const GlobalLoader = () => (
  <div className="global-loader-container">
    <div className="spinner" />
  </div>
);

// Smart redirect based on role
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role?.toLowerCase()}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard — protected */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardRedirect />} />
                  
                  {/* Shared Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* Student Only */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="student" element={<StudentDashboard />} />
                  </Route>

                  {/* Staff Only */}
                  <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
                    <Route path="staff" element={<StaffDashboard />} />
                  </Route>

                  {/* Admin Only */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="analytics" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminDashboard />} />
                    <Route path="documents" element={<AdminDashboard />} />
                  </Route>
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Toast />
              <FloatingChatbot />
            </Suspense>
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
