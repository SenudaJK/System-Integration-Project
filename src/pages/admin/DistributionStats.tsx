import React from 'react';
import Card from '../../components/ui/Card';
import { FuelDistribution } from '../../services/api';

interface DistributionStatsProps {
  distributions: FuelDistribution[];
}

const DistributionStats: React.FC<DistributionStatsProps> = ({ distributions }) => {
  const pendingCount = distributions.filter(d => d.status === 'PENDING').length;
  const deliveredCount = distributions.filter(d => d.status === 'DELIVERED').length;
  const cancelledCount = distributions.filter(d => d.status === 'CANCELLED').length;
  
  const totalFuelDistributed = distributions
    .filter(d => d.status === 'DELIVERED')
    .reduce((total, d) => total + d.fuelAmount, 0);
  
  const fuelByType = distributions
    .filter(d => d.status === 'DELIVERED')
    .reduce((acc, d) => {
      acc[d.fuelType] = (acc[d.fuelType] || 0) + d.fuelAmount;
      return acc;
    }, { PETROL: 0, DIESEL: 0, KEROSENE: 0 } as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Fuel Distribution by Type"
          subtitle="Total fuel delivered by type"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Petrol</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {(fuelByType.PETROL || 0).toLocaleString()} L
                </div>
                <div className="text-sm text-gray-500">
                  {totalFuelDistributed > 0 
                    ? (((fuelByType.PETROL || 0) / totalFuelDistributed) * 100).toFixed(1)
                    : 0
                  }%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Diesel</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {(fuelByType.DIESEL || 0).toLocaleString()} L
                </div>
                <div className="text-sm text-gray-500">
                  {totalFuelDistributed > 0 
                    ? (((fuelByType.DIESEL || 0) / totalFuelDistributed) * 100).toFixed(1)
                    : 0
                  }%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Kerosene</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {(fuelByType.KEROSENE || 0).toLocaleString()} L
                </div>
                <div className="text-sm text-gray-500">
                  {totalFuelDistributed > 0 
                    ? (((fuelByType.KEROSENE || 0) / totalFuelDistributed) * 100).toFixed(1)
                    : 0
                  }%
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Distribution Status Overview"
          subtitle="Current status breakdown"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Fuel Distributed</span>
              <span className="text-2xl font-bold text-gray-900">
                {totalFuelDistributed.toLocaleString()} L
              </span>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="text-sm font-medium">{deliveredCount}</span>
              </div>         
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-medium">{pendingCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="text-sm font-medium">{cancelledCount}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DistributionStats;
