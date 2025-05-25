import React, { useState, useEffect } from 'react';
import Navbar from '../Components/NavBar';
import { FuelStationService } from '../services/FuelStationService';
import { X, Fuel } from 'lucide-react';

interface InventoryItem {
    id?: number;
    fuelType: string;
    amount: number;
}

const Dashboard: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [fuelStationId, setFuelStationId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const fuelTypes = ['PETROL_92', 'PETROL_95', 'DIESEL', 'SUPER_DIESEL', 'KEROSENE'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fuelStation = await FuelStationService.getCurrentFuelStation();
                setFuelStationId(fuelStation.id ?? null);

                if (!fuelStation.id) throw new Error("Fuel station ID is missing");
                const inventoryData = await FuelStationService.getInventory(fuelStation.id);
                const formattedInventory = fuelTypes.map(type => {
                    const item = inventoryData.find(inv => inv.fuelType === type);
                    return {
                        fuelType: type,
                        amount: item ? item.amount || 0 : 0,
                    };
                });
                setInventory(formattedInventory);

                const allOrders = await FuelStationService.getAllOrders();
                const today = new Date().toISOString().split('T')[0];
                const todayOrders = allOrders.filter((order: any) => order.orderDate === today);
                setOrders(todayOrders);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data.');
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 ml-64">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold">Fuel Station Dashboard</h1>
                        <p className="mt-2 text-blue-100">Manage your fuel inventory and orders efficiently</p>
                    </div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                            <X className="h-5 w-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {inventory.map((item) => (
                            <div key={item.fuelType} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Fuel className="h-6 w-6 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-gray-800">{item.fuelType.replace('_', ' ')}</h3>
                                    </div>
                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${item.amount < 100 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.amount < 100 ? 'Low' : 'In Stock'}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{item.amount} <span className="text-sm font-normal text-gray-500">Liters</span></p>
                                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.amount < 100 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min((item.amount / 1000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Today’s Orders</h2>
                            <p className="text-gray-600 text-sm mt-1">Orders placed on {new Date().toLocaleDateString()}</p>
                        </div>
                        {orders.length === 0 ? (
                            <div className="p-6 text-gray-500 text-center">No orders placed today.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-sm font-medium">
                                        <th className="p-4 text-left">Order ID</th>
                                        <th className="p-4 text-left">Amount (Liters)</th>
                                        <th className="p-4 text-left">Fuel Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order: any) => (
                                        <tr key={order.orderId} className="border-t text-gray-700 hover:bg-gray-50 transition duration-150">
                                            <td className="p-4">{order.orderId}</td>
                                            <td className="p-4 font-medium">{order.orderAmount}</td>
                                            <td className="p-4">{order.fuelType.replace('_', ' ')}</td>
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

export default Dashboard;