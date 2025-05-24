import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Home, Package, Settings, User } from 'lucide-react';
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
                    const response = await axios.get('http://localhost:8080/api/fuel-stations/me', {
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
                        if (err.response.status === 401) {
                            setOwnerName('Authentication Failed - Invalid Token');
                        } else if (err.response.status === 404) {
                            setOwnerName('User Not Found');
                        } else if (err.response.status === 500) {
                            setOwnerName('Server Error - Check Backend Logs');
                        } else {
                            setOwnerName('Error Loading User');
                        }
                    } else if (err.request) {
                        console.error('Error fetching user details: No response received', err.message);
                        setOwnerName('Server Unreachable - Check if Backend is Running');
                    } else {
                        console.error('Error fetching user details:', err.message);
                        setOwnerName('Error Loading User');
                    }
                }
            } else {
                console.warn('No token found in localStorage');
                setOwnerName('Not Logged In');
            }
        };
        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        // Clear authentication data (e.g., JWT token)
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="fixed left-0 top-0 h-screen bg-gradient-to-br from-blue-900 to-white text-black z-50">
            <div className="h-full flex flex-col justify-between">
                {/* Logo/Brand and Menu */}
                <div>
                    <div className="p-4 border-b border-blue-800">
                        <Link to="/" className="text-xl font-bold text-black">
                            Fuel Quota
                        </Link>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-800 rounded-md transition duration-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <Home className="h-5 w-5 mr-3 text-black" />
                            Dashboard
                        </Link>
                        <Link
                            to="/orders"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-800 rounded-md transition duration-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <Package className="h-5 w-5 mr-3 text-black" />
                            Order
                        </Link>
                        <Link
                            to="/update-status"
                            className="flex items-center px-4 py-2 text-sm font-semibold hover:bg-blue-800 rounded-md transition duration-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <Settings className="h-5 w-5 mr-3 text-black" />
                            Update Status
                        </Link>
                    </div>
                </div>

                {/* User Profile and Logout */}
                <div className="p-4 border-t border-blue-800">
                    <div className="flex items-center mb-4">
                        <div>
                            <p className="text-sm font-medium text-black">{ownerName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center bg-blue-700 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                    >
                        <LogOut className="h-5 w-5 mr-2 text-black" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;