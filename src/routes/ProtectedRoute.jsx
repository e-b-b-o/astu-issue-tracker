import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <Loader2 className="spin text-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized for this specific route
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
