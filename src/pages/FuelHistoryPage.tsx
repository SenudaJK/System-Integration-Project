import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FuelHistoryTable from '../components/dashboard/FuelHistoryTable';
import { FuelTransaction } from '../types';
import { Calendar, ChevronLeft, ChevronRight, Download, History } from 'lucide-react';

const FuelHistoryPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock transactions data
  const mockTransactions: FuelTransaction[] = [
    {
      id: '1',
      vehicleId: user.vehicles[0]?.id || '',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 5.2,
      stationName: 'Ceylon Petroleum - Colombo',
      stationLocation: 'Colombo 03',
    },
    {
      id: '2',
      vehicleId: user.vehicles[0]?.id || '',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 8.5,
      stationName: 'IOC Fuel Station',
      stationLocation: 'Kandy Road, Kadawatha',
    },
    {
      id: '3',
      vehicleId: user.vehicles[0]?.id || '',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 6.8,
      stationName: 'Lanka Fuel Center',
      stationLocation: 'Galle Road, Panadura',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-700">
            Fuel Consumption History
          </h1>
          
          <button className="btn-secondary flex items-center text-sm">
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
        
        {/* Filter and Date Selector */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar size={18} className="text-neutral-500 mr-2" />
              <span className="text-sm text-neutral-700">View Period:</span>
              <div className="relative ml-2">
                <select className="input-field py-1 pr-8 pl-3 text-sm appearance-none">
                  <option>Last 30 days</option>
                  <option>Last 60 days</option>
                  <option>Last 90 days</option>
                  <option>Custom range</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-neutral-500 mr-3">June 2023</span>
              <button className="p-1 rounded-full hover:bg-neutral-100">
                <ChevronLeft size={16} className="text-neutral-700" />
              </button>
              <button className="p-1 rounded-full hover:bg-neutral-100 ml-1">
                <ChevronRight size={16} className="text-neutral-700" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-sm text-neutral-500 mb-1">Total Consumption</div>
            <div className="text-2xl font-bold text-primary-700">20.5 Liters</div>
            <div className="text-xs text-neutral-500 mt-1">Last 30 days</div>
          </div>
          
          <div className="card p-4">
            <div className="text-sm text-neutral-500 mb-1">Number of Refills</div>
            <div className="text-2xl font-bold text-primary-700">3</div>
            <div className="text-xs text-neutral-500 mt-1">Last 30 days</div>
          </div>
          
          <div className="card p-4">
            <div className="text-sm text-neutral-500 mb-1">Average Per Refill</div>
            <div className="text-2xl font-bold text-primary-700">6.83 Liters</div>
            <div className="text-xs text-neutral-500 mt-1">Last 30 days</div>
          </div>
        </div>
        
        {/* Transactions Table */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary-700 mb-4 flex items-center">
            <History size={18} className="mr-2" />
            Transaction History
          </h2>
          
          {mockTransactions.length > 0 ? (
            <FuelHistoryTable 
              transactions={mockTransactions} 
              vehicles={user.vehicles}
            />
          ) : (
            <div className="card p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
              <p className="text-neutral-500">You don't have any fuel transactions yet.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-neutral-500">
            Showing <span className="font-medium">1-3</span> of <span className="font-medium">3</span> transactions
          </div>
          
          <div className="flex">
            <button className="btn-subtle py-1 px-3 text-sm mr-2 opacity-50" disabled>
              Previous
            </button>
            <button className="btn-subtle py-1 px-3 text-sm opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelHistoryPage;