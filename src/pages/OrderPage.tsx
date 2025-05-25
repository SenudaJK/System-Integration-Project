import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Send } from 'lucide-react';
import Navbar from '../Components/NavBar';
import { FuelStationService } from '../services/FuelStationService';
import { useNavigate } from 'react-router-dom';

interface Order {
    orderId?: number;
    orderDate: string;
    orderAmount: number;
    fuelType: string;
    localId?: number; // Temporary ID for UI tracking
    sent?: boolean; // Track if order is sent
    deleted?: boolean; // Track if order is deleted
}

const fuelTypes = ['PETROL_92', 'PETROL_95', 'DIESEL', 'SUPER_DIESEL', 'KEROSENE'];

const OrderPage: React.FC = () => {
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [orderAmount, setOrderAmount] = useState('');
    const [fuelType, setFuelType] = useState(fuelTypes[0]);
    const [fuelStationId, setFuelStationId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await FuelStationService.getCurrentFuelStation();
                setFuelStationId(data.id);
                setError('');
            } catch (err) {
                setError('Failed to fetch fuel station details.');
            }
        };
        fetchData();
    }, []);

    const handleAddOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const amount = parseFloat(orderAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Order amount must be a positive number.');
            return;
        }

        const newOrder: Order = {
            orderDate: new Date().toISOString().split('T')[0],
            orderAmount: amount,
            fuelType,
            localId: Date.now(), // Unique temporary ID
            sent: false,
            deleted: false,
        };
        setPendingOrders([...pendingOrders, newOrder]);
        setOrderAmount('');
        setFuelType(fuelTypes[0]);
        setSuccess('Order added to pending list!');
    };

    const handleSendOrder = async (localId: number) => {
        const orderToSend = pendingOrders.find(order => order.localId === localId);
        if (!orderToSend || !fuelStationId) return;

        try {
            await axios.post('http://localhost:8082/api/orders', {
                orderDate: orderToSend.orderDate,
                orderAmount: orderToSend.orderAmount,
                fuelType: orderToSend.fuelType,
                fuelStationId,
            }, { headers: FuelStationService.getAuthHeaders() });
            setSuccess('Order sent successfully!');
            setPendingOrders(pendingOrders.map(order =>
                order.localId === localId ? { ...order, sent: true } : order
            ));
            navigate('/dashboard'); // Redirect to Dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send order.');
        }
    };

    const handleDeleteOrder = (localId: number) => {
        if (!window.confirm('Are you sure you want to remove this order?')) return;
        setPendingOrders(pendingOrders.map(order =>
            order.localId === localId ? { ...order, deleted: true } : order
        ));
        setSuccess('Order removed from pending list!');
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
                        <form onSubmit={handleAddOrder} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                Add Order
                            </button>
                        </form>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
                            <p className="text-gray-600 text-sm mt-1">Review and send your orders</p>
                        </div>
                        {pendingOrders.length === 0 ? (
                            <div className="p-6 text-gray-500 text-center">No pending orders.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-sm font-medium">
                                        <th className="p-3 text-left">Temp ID</th>
                                        <th className="p-3 text-left">Amount (Liters)</th>
                                        <th className="p-3 text-left">Fuel Type</th>
                                        <th className="p-3 text-left">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pendingOrders.map((order) => (
                                        <tr key={order.localId} className="border-t text-gray-700 hover:bg-gray-50">
                                            <td className="p-3">{order.localId}</td>
                                            <td className="p-3 font-medium">{order.orderAmount}</td>
                                            <td className="p-3">{order.fuelType.replace('_', ' ')}</td>
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() => handleSendOrder(order.localId!)}
                                                    disabled={order.sent || order.deleted}
                                                    className={`flex items-center justify-center ${order.sent || order.deleted ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-1 px-3 rounded-md focus:outline-none focus:ring-2 ${order.sent || order.deleted ? 'focus:ring-gray-400' : 'focus:ring-blue-500'}`}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.localId!)}
                                                    disabled={order.sent || order.deleted}
                                                    className={`flex items-center justify-center ${order.sent || order.deleted ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white font-medium py-1 px-3 rounded-md focus:outline-none focus:ring-2 ${order.sent || order.deleted ? 'focus:ring-gray-400' : 'focus:ring-red-500'}`}
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