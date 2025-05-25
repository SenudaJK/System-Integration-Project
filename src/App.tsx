import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import VehicleTypeRegistration from './pages/admin/VehicleTypeRegistration';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FuelHistoryPage from './pages/FuelHistoryPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import QrCodePage from './pages/QrCodePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
               <Route path="/dashboard" element={<DashboardPage />} /> 
              <Route path="/fuel-history" element={<FuelHistoryPage />} />
               <Route path="/qr-code" element={<QrCodePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />          {/* Protected routes for all authenticated users */}
          <Route element={<AuthRouteGuard />}>
            <Route element={<Layout />}>
              
              {/* Admin routes */}
              <Route path="admin" element={<AdminRouteGuard />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="vehicle-types" element={<VehicleTypesList />} />
                <Route path="vehicle-types/new" element={<EditVehicleType />} />
                <Route path="vehicle-types/edit/:id" element={<EditVehicleType />} />
                <Route path="vehicle-types/register" element={<VehicleTypeRegistration />} />
                <Route path="fuel-distributions" element={<FuelDistributions />} />
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