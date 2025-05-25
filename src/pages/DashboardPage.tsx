import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold text-primary-700 mb-2">
          Welcome to the Dashboard
        </h1>
        <p className="text-neutral-600">
          This is a placeholder for the dashboard content.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;