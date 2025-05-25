import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FuelOrder } from '../../services/api';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const allOrders = await fetchWithAuth<FuelOrder[]>('/orders');
        const today = new Date().toISOString().split('T')[0]; // "2025-05-25"
        const recentOrders = allOrders
            .filter(order => order.orderDate === today)
            .slice(0, 5);
        setNotificationCount(recentOrders.length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const formatUserRole = (role: string) => {
    return role.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
      <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-20">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center lg:hidden">
            <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={onToggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-600 focus:outline-none relative">
              <Bell size={20} />
              {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notificationCount}
              </span>
              )}
            </button>

            <div className="relative">
              <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  onClick={toggleDropdown}
              >
                <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user ? formatUserRole(user.role) : 'Loading...'}</div>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                      >
                        Your Profile
                      </a>
                      <a
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                      >
                        Settings
                      </a>
                      <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

// Reusing fetchWithAuth directly since it's not exported
async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
  };

  try {
    const response = await fetch(`http://localhost:8082/api${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.indexOf('application/json') === -1) {
      const text = await response.text();
      return { message: text } as unknown as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default Header;