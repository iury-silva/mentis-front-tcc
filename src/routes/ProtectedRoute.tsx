// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth'; // Using the @/ path alias

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Roles permitidas
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Added loading

  if (loading) {
    // You can render a more sophisticated loading spinner or component here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const hasAccess = allowedRoles.some((role) => user.role.includes(role));
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
