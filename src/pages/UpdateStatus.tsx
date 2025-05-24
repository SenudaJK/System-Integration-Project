import React, { useState, useEffect } from 'react';
import Navbar from '../Components/NavBar';
import { FuelStationService } from '../services/FuelStationService';
import type { FuelInventoryDTO } from '../services/FuelStationService';
import { Check, X, Fuel } from 'lucide-react';

interface InventoryItem {
    id?: number;
    fuelType: string;
    amount: number;
}

const UpdateStatus: React.FC = () => {
    const [fuelStationId, setFuelStationId] = useState<number | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [consumedAmount, setConsumedAmount] = useState('');
    const [restockAmount, setRestockAmount] = useState('');
    const [fuelTypeConsumed, setFuelTypeConsumed] = useState('PETROL_92');
    const [fuelTypeRestock, setFuelTypeRestock] = useState('PETROL_92');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fuelTypes = ['PETROL_92', 'PETROL_95', 'DIESEL', 'SUPER_DIESEL', 'KEROSENE'];

    useEffect(() => {
        const fetchFuelStation = async () => {
            try {
                const data = await FuelStationService.getCurrentFuelStation();
                setFuelStationId(data.id);
                const inventoryData = await FuelStationService.getInventory(data.id);
                const formattedInventory = fuelTypes.map(type => {
                    const item = inventoryData.find(inv => inv.fuelType === type);
                    return {
                        fuelType: type,
                        amount: item ? item.amount || 0 : 0,
                    };
                });
                setInventory(formattedInventory);
            } catch (err: any) {
                setError(err.message || 'Failed to load fuel station details.');
            }
        };
        fetchFuelStation();
    }, []);

    const handleUpdateConsumed = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fuelStationId) {
            setError('Fuel station ID not available.');
            return;
        }
        const amount = parseFloat(consumedAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Consumed amount must be a positive number.');
            return;
        }

        try {
            const inventory: FuelInventoryDTO = {
                fuelType: fuelTypeConsumed,
                amount: amount,
            };
            await FuelStationService.updateFuelConsumed(fuelStationId, inventory);
            setSuccess('Fuel consumed amount updated successfully!');
            setConsumedAmount('');
            const updatedInventory = await FuelStationService.getInventory(fuelStationId);
            const formattedInventory = fuelTypes.map(type => {
                const item = updatedInventory.find(inv => inv.fuelType === type);
                return {
                    fuelType: type,
                    amount: item ? item.amount || 0 : 0,
                };
            });
            setInventory(formattedInventory);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update consumed amount.');
        }
    };

    const handleRestock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fuelStationId) {
            setError('Fuel station ID not available.');
            return;
        }
        const amount = parseFloat(restockAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Restock amount must be a positive number.');
            return;
        }

        try {
            const inventory: FuelInventoryDTO = {
                fuelType: fuelTypeRestock,
                amount: amount,
                orderDate: new Date().toISOString().split('T')[0],
            };
            await FuelStationService.restockFuelAmount(fuelStationId, inventory);
            setSuccess('Fuel restocked successfully!');
            setRestockAmount('');
            const updatedInventory = await FuelStationService.getInventory(fuelStationId);
            const formattedInventory = fuelTypes.map(type => {
                const item = updatedInventory.find(inv => inv.fuelType === type);
                return {
                    fuelType: type,
                    amount: item ? item.amount || 0 : 0,
                };
            });
            setInventory(formattedInventory);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to restock fuel.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 ml-64">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white p-6 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold">Update Fuel Status</h1>
                        <p className="mt-2 text-yellow-100">Manage your fuel inventory: restock and update consumed amounts</p>
                    </div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                            <X className="h-5 w-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            <span>{success}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {inventory.map((item) => (
                            <div key={item.fuelType} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center">
                                    <Fuel className="h-6 w-6 text-yellow-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-800">{item.fuelType.replace('_', ' ')}</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{item.amount} <span className="text-sm font-normal text-gray-500">Liters</span></p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Consumed Amount</h2>
                            <form onSubmit={handleUpdateConsumed} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Consumed Amount (Liters)</label>
                                        <input
                                            type="number"
                                            value={consumedAmount}
                                            onChange={(e) => setConsumedAmount(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            min="0.1"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                        <select
                                            value={fuelTypeConsumed}
                                            onChange={(e) => setFuelTypeConsumed(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                    className="mt-4 bg-yellow-600 text-white font-medium py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                                >
                                    Update Consumed
                                </button>
                            </form>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Restock Fuel Amount</h2>
                            <form onSubmit={handleRestock} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Restock Amount (Liters)</label>
                                        <input
                                            type="number"
                                            value={restockAmount}
                                            onChange={(e) => setRestockAmount(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            min="0.1"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                        <select
                                            value={fuelTypeRestock}
                                            onChange={(e) => setFuelTypeRestock(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                    className="mt-4 bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                >
                                    Restock Fuel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateStatus;