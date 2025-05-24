import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fuel Order Management</h1>

            {/* Create Order Form */}
            <form onSubmit={handleCreateOrder} className="mb-8 p-4 bg-gray-100 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Order Date</label>
                        <input
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Order Amount (Liters)</label>
                        <input
                            type="number"
                            value={orderAmount}
                            onChange={(e) => setOrderAmount(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Fuel Type</label>
                        <select
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create Order
                </button>
            </form>

            {/* Orders Table */}
            <div className="bg-white shadow rounded">
                <h2 className="text-xl font-semibold p-4">Current Orders</h2>
                {orders.length === 0 ? (
                    <p className="p-4 text-gray-500">No orders found.</p>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Order ID</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Amount (Liters)</th>
                            <th className="p-2 text-left">Fuel Type</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId} className="border-t">
                                <td className="p-2">{order.orderId}</td>
                                <td className="p-2">{order.orderDate}</td>
                                <td className="p-2">{order.orderAmount}</td>
                                <td className="p-2">{order.fuelType.replace('_', ' ')}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDeleteOrder(order.orderId)}
                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderPage;