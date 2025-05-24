import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FuelStationService } from '../services/FuelStationService';

const OwnerLogin = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const credentials = { contactNumber, password };
            console.log('Sending login request with credentials:', credentials);
            const response = await FuelStationService.ownerLogin(credentials);
            console.log('Login response:', response);

            if (response.message === 'Login successful' && response.token) {
                localStorage.setItem('token', response.token);
                navigate('/dashboard');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred during login.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Owner Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your 10-digit contact number"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default OwnerLogin;