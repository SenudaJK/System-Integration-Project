import React from 'react';
import { FuelTransaction, Vehicle } from '../../types';
import { Calendar, MapPin } from 'lucide-react';

interface FuelHistoryTableProps {
  transactions: FuelTransaction[];
  vehicles: Vehicle[];
}

const FuelHistoryTable: React.FC<FuelHistoryTableProps> = ({ 
  transactions,
  vehicles 
}) => {
  // Function to get vehicle number by ID
  const getVehicleNumber = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.vehicleNumber : 'Unknown';
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="card p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
        <p className="text-neutral-500">Your fuel transaction history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Station
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm text-neutral-600">{formatDate(transaction.date)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-neutral-700">
                  {getVehicleNumber(transaction.vehicleId)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-neutral-700">{transaction.stationName}</div>
                  <div className="flex items-center text-xs text-neutral-500">
                    <MapPin size={12} className="mr-1" />
                    {transaction.stationLocation}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-neutral-700">
                  {transaction.amount} Liters
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuelHistoryTable;