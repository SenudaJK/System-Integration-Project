import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Clock, Users, FilePlus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { Link } from 'react-router-dom';
import { stationApi } from '../../services/api';
import { Transaction, FuelStation } from '../../types';

const StationDashboard: React.FC = () => {
  const [station, setStation] = useState<FuelStation | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setIsLoading(true);
        const stationData = await stationApi.getStationDetails();
        setStation(stationData);
        
        const transactionsData = await stationApi.getDailyTransactions();
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load station dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationData();
  }, []);

  const getTotalFuelDistributed = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getUniqueVehicles = () => {
    const uniqueVehicleIds = new Set(transactions.map(t => t.vehicleId));
    return uniqueVehicleIds.size;
  };

  const transactionsColumns = [
    { 
      header: 'Vehicle',
      accessor: 'vehicleRegistration'
    },
    { 
      header: 'Fuel Type',
      accessor: 'fuelType'
    },
    { 
      header: 'Amount (L)',
      accessor: (row: Transaction) => <span className="font-medium">{row.amount}</span>
    },
    { 
      header: 'Time',
      accessor: (row: Transaction) => new Date(row.timestamp).toLocaleTimeString()
    },
    { 
      header: 'User',
      accessor: 'userName'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Station Dashboard</h1>
        <p className="text-gray-600 mt-1">
          {station?.name} - {station?.address}, {station?.city}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-800 to-blue-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Today's Transactions</h3>
              <p className="text-2xl font-bold">{transactions.length}</p>
              <p className="text-sm text-blue-100">Total records</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-600 to-teal-500 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Fuel Distributed</h3>
              <p className="text-2xl font-bold">{getTotalFuelDistributed()} L</p>
              <p className="text-sm text-teal-100">Today's volume</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-400 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Vehicles Served</h3>
              <p className="text-2xl font-bold">{getUniqueVehicles()}</p>
              <p className="text-sm text-amber-100">Unique vehicles</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Current Status</h3>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm text-indigo-100">Station is operational</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card
        title="Today's Transactions"
        subtitle="Fuel distribution records for today"
        headerActions={
          <Link to="/station/transactions">
            <Button
              size="sm"
              variant="primary"
              icon={<FilePlus size={16} />}
            >
              New Transaction
            </Button>
          </Link>
        }
      >
        <Table
          columns={transactionsColumns}
          data={transactions}
          keyField="id"
          isLoading={isLoading}
          emptyMessage="No transactions recorded today"
        />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Station Information">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Station Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.contactNumber}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.address}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.city}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.capacity} L</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{station?.status}</dd>
            </div>
          </dl>
        </Card>
        
        <Card title="Available Fuel Types">
          <div className="space-y-4">
            {station?.fuelTypes?.map((fuelType) => (
              <div key={fuelType.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">{fuelType.name}</h4>
                  <p className="text-xs text-gray-500">Unit Price: Rs. {fuelType.unitPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StationDashboard;