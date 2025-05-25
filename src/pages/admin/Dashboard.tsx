import React, { useState, useEffect } from 'react';
import { BarChart2, Map, Users, AlertTriangle, TrendingUp, Check, X, Phone, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Alert from '../../components/ui/Alert';
import { adminApi, distributionApi, FuelDistribution, FuelOrder } from '../../services/api';

interface FuelStation {
  id: number;
  name: string;
  location: string;
  ownerName: string;
  contactNumber: string;
  active: boolean;
  createdAt: string;
  status?: 'APPROVED' | 'PENDING' | 'DEACTIVATED';
}

interface Distributions {
  distributions: FuelDistribution[];
}

interface Transaction {
  id: string;
  stationName: string;
  vehicleRegistration: string;
  fuelType: string;
  amount: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [distributions, setDistributions] = useState<FuelDistribution[]>([]);
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FuelOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const stationsData = await adminApi.getFuelStations() as FuelStation[];
        const processedStations = stationsData.map((station: FuelStation) => ({
          ...station,
          status: station.active ? 'APPROVED' as 'APPROVED' : 'PENDING' as 'PENDING'
        }));
        console.log('Fetched stations:', processedStations);
        setStations(processedStations);

        try {
          const transactionsData = await adminApi.getTransactions() as Transaction[];
          console.log('Fetched transactions:', transactionsData);
          setTransactions(transactionsData);
        } catch (transactionError) {
          console.error('Transaction fetch error:', transactionError);
          setTransactions([]);
        }

        try {
          const distributionsData = await distributionApi.getRecentDistributions(100);
          console.log('Fetched distributions:', distributionsData);
          setDistributions(distributionsData);
        } catch (distributionError) {
          console.error('Distribution fetch error:', distributionError);
          setDistributions([]);
        }

        try {
          // Fetch all orders and filter for recent ones (e.g., today's orders)
          const allOrders = await fetchWithAuth<FuelOrder[]>('/orders');
          console.log('Fetched orders:', allOrders);
          const today = new Date().toISOString().split('T')[0]; // "2025-05-25"
          const recentOrders = allOrders
              .filter(order => order.orderDate === today)
              .slice(0, 5); // Limit to 5 recent orders
          setOrders(recentOrders);
        } catch (orderError) {
          console.error('Order fetch error:', orderError);
          setOrders([]);
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]);

  const handleViewOrderDetails = async (orderId: number) => {
    try {
      // Fetch all orders and find the specific order
      const allOrders = await fetchWithAuth<FuelOrder[]>('/orders');
      const orderDetails = allOrders.find(order => order.orderId === orderId);
      if (orderDetails) {
        setSelectedOrder(orderDetails);
      } else {
        throw new Error('Order not found');
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError('Failed to load order details.');
    }
  };

  const pendingStations = stations.filter(station => !station.active);
  const activeStations = stations.filter(station => station.active);

  const getTotalFuelDistributed = () => {
    const deliveredDistributions = distributions.filter(dist => dist.status === 'DELIVERED');
    const totalLiters = deliveredDistributions.reduce((total, distribution) => {
      return total + (distribution.fuelAmount || 0);
    }, 0);
    return totalLiters;
  };

  const getStationStatusBadge = (active: boolean) => {
    return active
        ? <Badge variant="success">Active</Badge>
        : <Badge variant="warning">Inactive</Badge>;
  };

  const fuelStationsColumns = [
    {
      header: 'Name',
      accessor: (row: FuelStation) => row.name
    },
    {
      header: 'Location',
      accessor: (row: FuelStation) => row.location
    },
    {
      header: 'Owner',
      accessor: (row: FuelStation) => row.ownerName
    },
    {
      header: 'Contact',
      accessor: (row: FuelStation) => (
          <div className="flex items-center">
            <Phone size={14} className="mr-1" />
            {row.contactNumber}
          </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: FuelStation) => getStationStatusBadge(row.active)
    },
    {
      header: 'Actions',
      accessor: (row: FuelStation) => (
          <div className="flex space-x-2">
            {!row.active ? (
                <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleActivateStation(row.id)}
                    icon={<Check size={14} />}
                >
                  Activate
                </Button>
            ) : (
                <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeactivateStation(row.id)}
                    icon={<X size={14} />}
                >
                  Deactivate
                </Button>
            )}
          </div>
      )
    }
  ];

  const recentTransactionsColumns = [
    {
      header: 'Station',
      accessor: (row: Transaction) => row.stationName
    },
    {
      header: 'Vehicle',
      accessor: (row: Transaction) => row.vehicleRegistration
    },
    {
      header: 'Fuel Type',
      accessor: (row: Transaction) => row.fuelType
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

  const recentOrdersColumns = [
    {
      header: 'Order ID',
      accessor: (row: FuelOrder) => row.orderId
    },
    {
      header: 'Fuel Type',
      accessor: (row: FuelOrder) => row.fuelType.replace('_', ' ')
    },
    {
      header: 'Amount (L)',
      accessor: (row: FuelOrder) => <span className="font-medium">{row.orderAmount}</span>
    },
    {
      header: 'Actions',
      accessor: (row: FuelOrder) => (
          <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewOrderDetails(row.orderId)}
              icon={<Eye size={14} />}
          >
            View Details
          </Button>
      )
    }
  ];

  const handleActivateStation = async (stationId: number) => {
    try {
      await adminApi.approveStation(stationId.toString());
      setStations(prevStations =>
          prevStations.map(station =>
              station.id === stationId
                  ? { ...station, active: true }
                  : station
          )
      );
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to activate station:', err);
    }
  };

  const handleDeactivateStation = async (stationId: number) => {
    try {
      await adminApi.deactivateStation(stationId.toString());
      setStations(prevStations =>
          prevStations.map(station =>
              station.id === stationId
                  ? { ...station, active: false }
                  : station
          )
      );
      setRefreshTrigger(prev => prev + 1);
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

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the fuel quota system</p>
        </div>

        {orders.length > 0 && (
            <div className="space-y-4">
              {orders.map(order => (
                  <Alert
                      key={order.orderId}
                      variant="info"
                      title={`New Fuel Order #${order.orderId}`}
                      onClose={() => setOrders(orders.filter(o => o.orderId !== order.orderId))}
                  >
                    <p>
                      A new order for {order.orderAmount} liters of {order.fuelType.replace('_', ' ')} has been placed by {order.stationName}.
                    </p>
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleViewOrderDetails(order.orderId)}
                    >
                      View Details
                    </Button>
                  </Alert>
              ))}
            </div>
        )}

        {selectedOrder && (
            <Card
                title={`Order Details #${selectedOrder.orderId}`}
                subtitle="Full details of the selected fuel order"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Order ID</h4>
                    <p className="text-gray-900">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Order Date</h4>
                    <p className="text-gray-900">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Fuel Type</h4>
                    <p className="text-gray-900">{selectedOrder.fuelType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Amount</h4>
                    <p className="text-gray-900">{selectedOrder.orderAmount} Liters</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Fuel Station ID</h4>
                    <p className="text-gray-900">{selectedOrder.fuelStationId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Fuel Station Name</h4>
                    <p className="text-gray-900">{selectedOrder.stationName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Location</h4>
                    <p className="text-gray-900">{selectedOrder.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Owner Name</h4>
                    <p className="text-gray-900">{selectedOrder.ownerName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Contact Number</h4>
                    <p className="text-gray-900">{selectedOrder.contactNumber}</p>
                  </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
        )}

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
                <h3 className="text-lg font-semibold">Inactive Stations</h3>
                <p className="text-2xl font-bold">{pendingStations.length}</p>
                <p className="text-sm text-teal-100">Awaiting activation</p>
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
                <p className="text-2xl font-bold">{getTotalFuelDistributed().toLocaleString()} L</p>
                <p className="text-sm text-indigo-100">Total volume</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
              title="All Fuel Stations"
              subtitle="Manage and monitor all registered fuel stations"
          >
            <Table
                columns={fuelStationsColumns}
                data={stations}
                keyField="id"
                isLoading={isLoading}
                emptyMessage="No fuel stations found"
            />
          </Card>

          {orders.length > 0 && (
              <Card
                  title="Recent Fuel Orders"
                  subtitle="Latest fuel orders from all stations"
              >
                <Table
                    columns={recentOrdersColumns}
                    data={orders}
                    keyField="orderId"
                    isLoading={isLoading}
                    emptyMessage="No recent orders"
                />
              </Card>
          )}

          {transactions.length > 0 && (
              <Card
                  title="Recent Transactions"
                  subtitle="Latest fuel distributions across all stations"
                  headerActions={
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* View all transactions */ }}
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
          )}
        </div>
      </div>
  );
};

// Reusing fetchWithAuth directly since it's not exported
async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
  };

  try {
    const response = await fetch(`http://localhost:8082/api${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.indexOf('application/json') === -1) {
      const text = await response.text();
      return { message: text } as unknown as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default Dashboard;