import React, { useState, useEffect } from 'react';
import CreateDistribution from '../admin/CreateDistribution';
import DistributionList from '../admin/DistributionList';
import DistributionStats from '../admin/DistributionStats';
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
      setError(''); // Clear previous errors
      const data = await distributionApi.getRecentDistributions(50); // Increased limit
      setDistributions(data);
    } catch (err: any) {
      setError('Failed to load distributions: ' + (err.message || 'Unknown error'));
      console.error(err);
      setDistributions([]); // Ensure it's always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributionCreated = (newDistribution: FuelDistributionType) => {
    setDistributions([newDistribution, ...distributions]);
  };

  const handleStatusUpdate = (distribution: FuelDistributionType) => {
    // For now, just log it since you don't have the status update modal yet
    console.log('Status update requested for:', distribution);
    // You can implement the status update modal later
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

      <DistributionStats distributions={distributions} />
      <DistributionList 
        distributions={distributions}
        isLoading={isLoading}
        error={error}
        onStatusUpdate={handleStatusUpdate}
        onRefresh={fetchDistributions}
      />
    </div>
  );
};

export default FuelDistributions;
