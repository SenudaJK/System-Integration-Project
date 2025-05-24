import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import Navbar from '../Components/NavBar';

interface Order {
    orderId: number;
    orderDate: string;
    orderAmount: number;
    fuelType: string;
}

const fuelTypes = ['PETROL_92', 'PETROL_95', 'DIESEL', 'SUPER_DIESEL', 'KEROSENE'];

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDate, setOrderDate] = useState('');
    const [orderAmount, setOrderAmount] = useState('');
    const [fuelType, setFuelType] = useState(fuelTypes[0]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch all orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            setOrders(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate inputs
        if (!orderDate || !orderAmount || !fuelType) {
            setError('All fields are required.');
            return;
        }
        const amount = parseFloat(orderAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Order amount must be a positive number.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/orders', {
                orderDate,
                orderAmount: amount,
                fuelType,
            });
            setSuccess('Order created successfully!');
            setOrders([...orders, response.data]);
            // Reset form
            setOrderDate('');
            setOrderAmount('');
            setFuelType(fuelTypes[0]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create order. Please try again.');
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/orders/${orderId}`);
            setOrders(orders.filter((order) => order.orderId !== orderId));
            setSuccess('Order deleted successfully!');
            setError('');
        } catch (err) {
            setError('Failed to delete order. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-6 ml-64">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Fuel Order Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage fuel orders efficiently</p>
                    </div>

                    {/* Create Order Form */}
                    <div className="bg-gradient-to-br from-green-600 to-white text-gray-900 rounded-lg shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Create New Order</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md mb-4 flex items-center">
                                <X className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-md mb-4 flex items-center">
                                <Check className="h-5 w-5 mr-2" />
                                <span>{success}</span>
                            </div>
                        )}
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Order Date</label>
                                    <input
                                        type="date"
                                        value={orderDate}
                                        onChange={(e) => setOrderDate(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Order Amount (Liters)</label>
                                    <input
                                        type="number"
                                        value={orderAmount}
                                        onChange={(e) => setOrderAmount(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Fuel Type</label>
                                    <select
                                        value={fuelType}
                                        onChange={(e) => setFuelType(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        {fuelTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-green-100 text-green-800 font-medium py-2 px-4 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            >
                                Create Order
                            </button>
                        </form>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900">Current Orders</h2>
                            <p className="text-gray-600 text-sm mt-1">View and manage all fuel orders</p>
                        </div>
                        {orders.length === 0 ? (
                            <div className="p-6 text-gray-500 text-center">No orders found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-sm font-medium">
                                        <th className="p-3 text-left">Order ID</th>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Amount (Liters)</th>
                                        <th className="p-3 text-left">Fuel Type</th>
                                        <th className="p-3 text-left">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.orderId} className="border-t text-gray-700 hover:bg-gray-50 transition duration-150">
                                            <td className="p-3">{order.orderId}</td>
                                            <td className="p-3">{order.orderDate}</td>
                                            <td className="p-3 font-medium">{order.orderAmount}</td>
                                            <td className="p-3">{order.fuelType.replace('_', ' ')}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteOrder(order.orderId)}
                                                    className="bg-red-500 text-white font-medium py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;