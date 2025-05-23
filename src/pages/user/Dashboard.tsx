import React, { useState, useEffect } from 'react';
import { Car, Droplet, Clock, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';
import { Vehicle, Transaction } from '../../types';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const vehiclesData = await userApi.getVehicles();
        if (Array.isArray(vehiclesData)) {
          setVehicles(vehiclesData as Vehicle[]);
        } else {
          setVehicles([]);
          setError('Failed to load vehicles data');
        }
        
        // For demo purposes, we're using admin transactions
        // In a real app, you'd have a specific endpoint for user transactions
        const transactionsData = await fetch('/mockData/userTransactions.json')
          .then(res => res.json())
          .catch(() => []);
        
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getTotalRemainingQuota = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.remainingQuota, 0);
  };

  const getAverageQuotaUsage = () => {
    if (vehicles.length === 0) return 0;
    
    const totalQuota = vehicles.reduce((sum, vehicle) => sum + vehicle.quotaAmount, 0);
    const remainingQuota = getTotalRemainingQuota();
    const usedQuota = totalQuota - remainingQuota;
    
    return (usedQuota / totalQuota) * 100;
  };

  const vehiclesColumns = [
    { 
      header: 'Registration No.',
      accessor: 'registrationNumber' as keyof Vehicle
    },
    { 
      header: 'Vehicle Type',
      accessor: 'vehicleType' as keyof Vehicle
    },
    { 
      header: 'Fuel Type',
      accessor: 'fuelType' as keyof Vehicle
    },
    { 
      header: 'Remaining Quota',
      accessor: (row: Vehicle) => (
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-blue-500 mr-1" />
          <span className="font-medium">{row.remainingQuota} L</span>
        </div>
      )
    },
    { 
      header: 'Actions',
      accessor: (row: Vehicle) => (
        <Link to={`/quota?vehicleId=${row.id}`}>
          <Button size="sm" variant="outline">
            Request Quota
          </Button>
        </Link>
      )
    }
  ];

  const transactionsColumns = [
    { 
      header: 'Station',
      accessor: 'stationName' as keyof Transaction
    },
    { 
      header: 'Vehicle',
      accessor: 'vehicleRegistration' as keyof Transaction
    },
    { 
      header: 'Amount (L)',
      accessor: (row: Transaction) => <span className="font-medium">{row.amount}</span>
    },
    { 
      header: 'Date',
      accessor: (row: Transaction) => new Date(row.timestamp).toLocaleDateString()
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Manage your vehicles and fuel quota</p>
      </div>
      
      {vehicles.length === 0 && (
        <Alert variant="info" title="No Vehicles Registered">
          You haven't registered any vehicles yet. 
          <Link to="/vehicles" className="ml-1 font-medium underline">
            Register a vehicle
          </Link> to start managing your fuel quota.
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-800 to-blue-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Car className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">My Vehicles</h3>
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-sm text-blue-100">Registered vehicles</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-600 to-teal-500 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Droplet className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Remaining Quota</h3>
              <p className="text-2xl font-bold">{getTotalRemainingQuota()} L</p>
              <p className="text-sm text-teal-100">Total available fuel</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-400 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Quota Usage</h3>
              <p className="text-2xl font-bold">{getAverageQuotaUsage().toFixed(1)}%</p>
              <p className="text-sm text-amber-100">Average consumption</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card
          title="My Vehicles"
          subtitle="Manage your registered vehicles and fuel quota"
          headerActions={
            <Link to="/vehicles">
              <Button size="sm" variant="primary">
                Register New
              </Button>
            </Link>
          }
        >
          <Table
            columns={vehiclesColumns}
            data={vehicles}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No vehicles registered yet"
          />
        </Card>
        
        <Card
          title="Recent Fuel Transactions"
          subtitle="Your recent fuel quota usage history"
        >
          <Table
            columns={transactionsColumns}
            data={transactions}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No transaction history available"
          />
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;