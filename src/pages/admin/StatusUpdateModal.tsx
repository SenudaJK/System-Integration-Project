import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { distributionApi, FuelDistribution } from '../../services/api';

interface StatusUpdateModalProps {
  isOpen: boolean;
  distribution: FuelDistribution | null;
  onClose: () => void;
  onStatusUpdate: (updatedDistribution: FuelDistribution) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  distribution,
  onClose,
  onStatusUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleStatusUpdate = async (newStatus: string) => {
    if (!distribution) return;
    
    setIsUpdating(true);
    setError('');
    
    try {
      const updated = await distributionApi.updateDistributionStatus(
        parseInt(distribution.id), 
        newStatus
      );
      onStatusUpdate(updated);
      onClose();
    } catch (err: any) {
      setError('Failed to update status: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!distribution) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Distribution Status"
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900">Distribution Details</h4>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><strong>Reference:</strong> {distribution.distributionReference || 'N/A'}</p>
            <p><strong>Station:</strong> {distribution.fuelStation.name}</p>
            <p><strong>Amount:</strong> {distribution.fuelAmount.toLocaleString()} L of {distribution.fuelType}</p>
            <p><strong>Current Status:</strong> 
              <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                distribution.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                distribution.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {distribution.status}
              </span>
            </p>
            {distribution.notes && (
              <p><strong>Notes:</strong> {distribution.notes}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Update Status:</h5>
          
          <div className="grid grid-cols-2 gap-3">            
            <Button
              onClick={() => handleStatusUpdate('DELIVERED')}
              className="bg-green-600 hover:bg-green-700"
              disabled={distribution.status === 'DELIVERED' || distribution.status === 'CANCELLED' || isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Mark Delivered'}
            </Button>
            
            <Button
              onClick={() => handleStatusUpdate('CANCELLED')}
              className="bg-red-600 hover:bg-red-700"
              disabled={distribution.status === 'DELIVERED' || distribution.status === 'CANCELLED' || isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Cancel Distribution'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StatusUpdateModal;
