import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Package, Settings, User } from 'lucide-react';
import axios from 'axios';

const NavBar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState('Loading...');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8082/api/fuel-stations/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = response.data;
                    setOwnerName(data.ownerName || 'Unknown User');
                } catch (err: any) {
                    if (err.response) {
                        console.error(
                            'Error fetching user details:',
                            `Status: ${err.response.status}, Response: ${JSON.stringify(err.response.data)}`
                        );
                        setOwnerName('Authentication Failed');
                    } else if (err.request) {
                        console.error('Error fetching user details: No response received', err.message);
                        setOwnerName('Server Unreachable');
                    } else {
                        console.error('Error fetching user details:', err.message);
                        setOwnerName('Error Loading User');
                    }
                }
            } else {
                console.warn('No token found in localStorage');
                setOwnerName('Not Logged In');
                navigate('/login');
            }
        };
        fetchUserDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="fixed left-0 top-0 h-screen bg-gradient-to-br from-blue-900 to-gray-800 text-white z-50 w-64">
            <div className="h-full flex flex-col justify-between">
                <div>
                    <div className="p-4 border-b border-gray-700">
                        <Link to="/dashboard" className="text-xl font-bold text-white">
                            Fuel Quota
                        </Link>
                    </div>
                    <div className="mt-6 space-y-2">
                        <button
                            onClick={toggleMobileMenu}
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-700 rounded-md transition duration-200 sm:hidden"
                        >
                            <Home className="h-5 w-5 mr-3" />
                            Toggle Menu
                        </button>
                        <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-700 rounded-md transition duration-200"
                        >
                            <Home className="h-5 w-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link
                            to="/orders"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-700 rounded-md transition duration-200"
                        >
                            <Package className="h-5 w-5 mr-3" />
                            Orders
                        </Link>
                        <Link
                            to="/update-status"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-700 rounded-md transition duration-200"
                        >
                            <Settings className="h-5 w-5 mr-3" />
                            Update Status
                        </Link>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-4">
                        <User className="h-5 w-5 mr-2" />
                        <p className="text-sm font-medium">{ownerName}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-200"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;