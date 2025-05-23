import React, { useState, useEffect } from 'react';
import CreateDistribution from '../admin/CreateDistribution';
import Card from '../../components/ui/Card';
import { distributionApi, FuelDistribution as FuelDistributionType } from '../../services/api';

const FuelDistributions: React.FC = () => {
  const [distributions, setDistributions] = useState<FuelDistributionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistributions();
  }, []);
  const fetchDistributions = async () => {
    try {
      setIsLoading(true);
      const data = await distributionApi.getRecentDistributions(10);
      setDistributions(data);
    } catch (err) {
      setError('Failed to load distributions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributionCreated = (newDistribution: FuelDistributionType) => {
    setDistributions([newDistribution, ...distributions]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fuel Distribution Management</h1>
          <p className="text-gray-600 mt-1">Create and manage fuel distributions to stations</p>
        </div>
        <CreateDistribution onDistributionCreated={handleDistributionCreated} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Total Distributions</h3>
            <p className="text-3xl font-bold mt-2">{distributions.length}</p>
            <p className="text-sm text-blue-100 mt-1">All time</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-500 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Pending</h3>
            <p className="text-3xl font-bold mt-2">
              {distributions.filter(d => d.status === 'PENDING').length}
            </p>
            <p className="text-sm text-green-100 mt-1">Awaiting dispatch</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-500 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Delivered</h3>
            <p className="text-3xl font-bold mt-2">
              {distributions.filter(d => d.status === 'DELIVERED').length}
            </p>
            <p className="text-sm text-purple-100 mt-1">Successfully completed</p>
          </div>
        </Card>
      </div>

      {/* Recent Distributions */}
      <Card
        title="Recent Distributions"
        subtitle="Latest fuel distribution orders"
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : distributions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No distributions found. Create your first distribution to get started.
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
                    Fuel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (L)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {distributions.map((distribution) => (
                  <tr key={distribution.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {distribution.distributionReference}
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {distribution.fuelType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {distribution.fuelAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        distribution.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        distribution.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        distribution.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {distribution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(distribution.distributionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FuelDistributions;
