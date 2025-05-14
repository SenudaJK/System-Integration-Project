import React, { useState, useEffect } from 'react';
import { BarChart2, Map, Users, AlertTriangle, TrendingUp, Check, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { adminApi } from '../../services/api';
import { FuelStation, Transaction } from '../../types';

const Dashboard: React.FC = () => {
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this to trigger refreshes

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const [stationsData, transactionsData] = await Promise.all([
          adminApi.getFuelStations() as Promise<FuelStation[]>,
          adminApi.getTransactions() as Promise<Transaction[]>
        ]);
        
        console.log('Fetched stations:', stationsData);
        console.log('Fetched transactions:', transactionsData);
        
        setStations(stationsData);
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  // Filter stations by status
  const pendingStations = stations.filter(station => station.status === 'PENDING');
  const activeStations = stations.filter(station => station.status === 'APPROVED');

  // Calculate total fuel distributed
  const getTotalFuelDistributed = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Get appropriate status badge for a station
  const getStationStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'DEACTIVATED':
        return <Badge variant="danger">Deactivated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Column definitions for transactions table
  const recentTransactionsColumns = [
    { 
      header: 'Station',
      accessor: 'stationName'
    },
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
      header: 'Date',
      accessor: (row: Transaction) => new Date(row.timestamp).toLocaleDateString()
    }
  ];

  // Column definitions for pending stations table
  const pendingStationsColumns = [
    { 
      header: 'Name',
      accessor: 'name'
    },
    { 
      header: 'Location',
      accessor: 'location'
    },
    { 
      header: 'Status',
      accessor: (row: FuelStation) => getStationStatusBadge(row.status)
    },
    { 
      header: 'Actions',
      accessor: (row: FuelStation) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => handleApproveStation(row.id)}
            icon={<Check size={14} />}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeactivateStation(row.id)}
            icon={<X size={14} />}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  // Handle station approval
  const handleApproveStation = async (stationId: string) => {
    try {
      await adminApi.approveStation(stationId);
      
      // Update local state
      setStations(prevStations => 
        prevStations.map(station => 
          station.id === stationId 
            ? { ...station, status: 'APPROVED' } 
            : station
        )
      );
      
      // Alternatively, refresh the data completely
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to approve station:', err);
      // Add error notification here if needed
    }
  };

  // Handle station deactivation
  const handleDeactivateStation = async (stationId: string) => {
    try {
      await adminApi.deactivateStation(stationId);
      
      // Update local state
      setStations(prevStations => 
        prevStations.map(station => 
          station.id === stationId 
            ? { ...station, status: 'DEACTIVATED' } 
            : station
        )
      );
      
      // Alternatively, refresh the data completely
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to deactivate station:', err);
      // Add error notification here if needed
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setRefreshTrigger(prev => prev + 1)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage the fuel quota system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-800 to-blue-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Map className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Fuel Stations</h3>
              <p className="text-2xl font-bold">{activeStations.length}</p>
              <p className="text-sm text-blue-100">Active stations</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-600 to-teal-500 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Pending Stations</h3>
              <p className="text-2xl font-bold">{pendingStations.length}</p>
              <p className="text-sm text-teal-100">Awaiting approval</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-400 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Transactions</h3>
              <p className="text-2xl font-bold">{transactions.length}</p>
              <p className="text-sm text-amber-100">Total records</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Fuel Distributed</h3>
              <p className="text-2xl font-bold">{getTotalFuelDistributed()} L</p>
              <p className="text-sm text-indigo-100">Total volume</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Pending Station Approvals"
          subtitle="Stations waiting for administrative approval"
        >
          <Table
            columns={pendingStationsColumns}
            data={pendingStations}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No pending stations to approve"
          />
        </Card>
        
        <Card
          title="Recent Transactions"
          subtitle="Latest fuel distributions across all stations"
          headerActions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {/* View all transactions */}}
            >
              View All
            </Button>
          }
        >
          <Table
            columns={recentTransactionsColumns}
            data={transactions.slice(0, 5)}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No transactions recorded yet"
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;