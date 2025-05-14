import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fuel, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Don't show header on the landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container-custom mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Fuel size={24} className="text-white" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Fuel Quota Management System
              </h1>
              <p className="text-xs text-primary-100">Ministry of Energy, Sri Lanka</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium hover:text-primary-200 transition-colors ${
                    location.pathname === '/dashboard' ? 'text-white' : 'text-primary-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/fuel-history" 
                  className={`text-sm font-medium hover:text-primary-200 transition-colors ${
                    location.pathname === '/fuel-history' ? 'text-white' : 'text-primary-100'
                  }`}
                >
                  Fuel History
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium text-primary-100 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium hover:text-primary-200 transition-colors ${
                    location.pathname === '/login' ? 'text-white' : 'text-primary-100'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`text-sm font-medium bg-white text-primary-700 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="flex items-center space-x-1 text-sm font-medium text-primary-100 hover:text-white transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-medium bg-white text-primary-700 px-3 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;