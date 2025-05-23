import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Truck, Edit, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FuelDistribution } from '../../services/api';

interface DistributionListProps {
  distributions: FuelDistribution[];
  isLoading: boolean;
  error: string;
  onStatusUpdate: (distribution: FuelDistribution) => void;
  onRefresh: () => void;
}

const DistributionList: React.FC<DistributionListProps> = ({ 
  distributions, 
  isLoading, 
  error,
  onStatusUpdate,
  onRefresh 
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'IN_TRANSIT':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredDistributions = distributions.filter(distribution => {
    const statusMatch = statusFilter === 'ALL' || distribution.status === statusFilter;
    const typeMatch = fuelTypeFilter === 'ALL' || distribution.fuelType === fuelTypeFilter;
    const searchMatch = searchTerm === '' || 
      distribution.distributionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.fuelStation.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && typeMatch && searchMatch;
  });

  return (
    <Card
      title="Fuel Distributions"
      subtitle={`${filteredDistributions.length} distributions found`}
      headerActions={
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by reference or station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <select
              value={fuelTypeFilter}
              onChange={(e) => setFuelTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="KEROSENE">Kerosene</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              icon={<Filter size={14} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading distributions...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <strong>Error:</strong> {error}
          <button 
            onClick={onRefresh}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredDistributions.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No distributions found</h3>
          <p className="text-gray-500">
            {distributions.length === 0 
              ? "No distributions have been created yet." 
              : "No distributions match your current filters."
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDistributions.map((distribution) => (
                <tr key={distribution.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {distribution.distributionReference || 'N/A'}
                    </div>
                    {distribution.notes && (
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {distribution.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {distribution.fuelStation.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {distribution.fuelStation.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {distribution.fuelType}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {distribution.fuelAmount.toLocaleString()} L
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(distribution.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        distribution.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        distribution.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        distribution.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {distribution.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(distribution.distributionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusUpdate(distribution)}
                      icon={<Edit size={14} />}
                      disabled={distribution.status === 'DELIVERED' || distribution.status === 'CANCELLED'}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default DistributionList;
