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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [stationsData, transactionsData] = await Promise.all([
          adminApi.getFuelStations(),
          adminApi.getTransactions()
        ]);
        
        setStations(stationsData);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingStations = stations.filter(station => station.status === 'PENDING');
  const activeStations = stations.filter(station => station.status === 'APPROVED');

  const getTotalFuelDistributed = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

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

  const pendingStationsColumns = [
    { 
      header: 'Name',
      accessor: 'name'
    },
    { 
      header: 'City',
      accessor: 'city'
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

  const handleApproveStation = async (stationId: string) => {
    try {
      await adminApi.approveStation(stationId);
      // Update the local state
      setStations(prevStations => 
        prevStations.map(station => 
          station.id === stationId 
            ? { ...station, status: 'APPROVED' } 
            : station
        )
      );
    } catch (err) {
      console.error('Failed to approve station:', err);
    }
  };

  const handleDeactivateStation = async (stationId: string) => {
    try {
      await adminApi.deactivateStation(stationId);
      // Update the local state
      setStations(prevStations => 
        prevStations.map(station => 
          station.id === stationId 
            ? { ...station, status: 'DEACTIVATED' } 
            : station
        )
      );
    } catch (err) {
      console.error('Failed to deactivate station:', err);
    }
  };

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
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

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