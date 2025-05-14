import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Guard component for routes that require authentication
 * Redirects to login if user is not authenticated
 */
const AuthRouteGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access to child routes if authenticated
  return <Outlet />;
};

export default AuthRouteGuard;