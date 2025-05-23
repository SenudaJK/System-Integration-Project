import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import FuelDistributions from './pages/admin/FuelDistribution';
import StationDashboard from './pages/station/Dashboard';
import AdminRouteGuard from './components/guards/AdminRouteGuard';
import AuthRouteGuard from './components/guards/AuthRouteGuard';
import UserRouteGuard from './components/guards/UserRouteGuard';
import StationManagerRouteGuard from './components/guards/StationManagerRouteGuard';
import Layout from './components/layout/Layout';
import Unauthorized from './pages/Unauthorized';
import VehicleTypesList from './pages/admin/VehicleTypesList';
import EditVehicleType from './pages/admin/EditVehicleType';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes for all authenticated users */}
          <Route element={<AuthRouteGuard />}>
            <Route element={<Layout />}>
              {/* Admin routes */}
              <Route path="admin" element={<AdminRouteGuard />}>
                <Route path="dashboard" element={<Dashboard />} />
                {/* Other admin routes */}
              </Route>
              
              {/* User routes */}
              <Route path="user" element={<UserRouteGuard />}>
                <Route path="dashboard" element={<UserDashboard />} />
                {/* Other user routes */}
              </Route>
              
              {/* Station manager routes */}
              <Route path="station" element={<StationManagerRouteGuard />}>
                <Route path="dashboard" element={<StationDashboard />} />
                {/* Other station manager routes */}
              </Route>
            </Route>
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;