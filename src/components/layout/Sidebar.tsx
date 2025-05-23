import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  BarChart2, 
  Users, 
  Map, 
  FilePlus, 
  Droplet, 
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 transition-colors ${
        active
          ? 'bg-blue-800 text-white'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen = false, 
  onCloseMobile 
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
    const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/admin/stations', label: 'Fuel Stations', icon: <Map size={20} /> },
    { to: '/admin/transactions', label: 'Transactions', icon: <BarChart2 size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { to: '/admin/vehicle-types', label: 'Vehicle Types', icon: <Truck size={20} /> },
    { to: '/admin/fuel-distributions', label: 'Fuel Distributions', icon: <Droplet size={20} /> },
  ];
  
  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/admin/fuel-distributions', label: 'Fuel Distributions', icon: <Truck size={20} /> },
    { to: '/quota', label: 'Fuel Quota', icon: <Droplet size={20} /> },
  ];
  
  const stationLinks = [
    { to: '/station', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/station/transactions', label: 'Record Transaction', icon: <FilePlus size={20} /> },
    { to: '/station/reports', label: 'Reports', icon: <BarChart2 size={20} /> },
  ];
  
  const links = user?.role === 'ROLE_ADMIN' 
    ? adminLinks 
    : user?.role === 'ROLE_STATION_MANAGER' 
      ? stationLinks 
      : userLinks;

  return (
    <div
      className={`bg-white border-r border-gray-200 w-64 fixed h-full overflow-auto transition-transform transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 z-30`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Droplet className="h-8 w-8 text-blue-800" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">FuelQuota</h1>
        </div>
        
        <div className="flex-grow p-4">
          <nav className="space-y-1">
            {links.map((link) => (
              <SidebarItem
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                active={isActive(link.to)}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={isActive('/settings')}
          />
          <SidebarItem
            to="/profile"
            icon={<User size={20} />}
            label="Profile"
            active={isActive('/profile')}
          />
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;