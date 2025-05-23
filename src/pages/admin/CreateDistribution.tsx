import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { distributionApi, FuelDistribution } from '../../services/api';

interface CreateDistributionProps {
  onDistributionCreated: (newDistribution: FuelDistribution) => void;
}

const CreateDistribution: React.FC<CreateDistributionProps> = ({ onDistributionCreated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [createForm, setCreateForm] = useState({
    fuelStationId: '',
    fuelAmount: '',
    fuelType: 'PETROL',
    notes: ''
  });

  const handleCreateDistribution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!createForm.fuelStationId || !createForm.fuelAmount) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const fuelAmount = parseFloat(createForm.fuelAmount);
      if (fuelAmount <= 0) {
        setError('Fuel amount must be greater than 0');
        setIsSubmitting(false);
        return;
      }

      const newDistribution = await distributionApi.createDistribution({
        fuelStationId: parseInt(createForm.fuelStationId),
        fuelAmount: fuelAmount,
        fuelType: createForm.fuelType as 'PETROL' | 'DIESEL' | 'KEROSENE',
        notes: createForm.notes || undefined
      });
      
      onDistributionCreated(newDistribution);
      setShowCreateModal(false);
      resetForm();
      
      // Show success message (you can implement a toast notification here)
      alert('Distribution created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create distribution. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCreateForm({ fuelStationId: '', fuelAmount: '', fuelType: 'PETROL', notes: '' });
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <>
      <Button
        onClick={() => {
          resetForm();
          setShowCreateModal(true);
        }}
        icon={<Plus size={16} />}
        className="bg-blue-600 hover:bg-blue-700"
      >
        New Distribution
      </Button>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Distribution"
        size="md"
      >
        <form onSubmit={handleCreateDistribution} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Station ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={createForm.fuelStationId}
              onChange={(e) => handleInputChange('fuelStationId', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter station ID (e.g., 42)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the ID of the fuel station to receive the distribution
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Amount (Liters) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={createForm.fuelAmount}
              onChange={(e) => handleInputChange('fuelAmount', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter fuel amount (e.g., 500.00)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Amount of fuel to be distributed in liters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <select
              value={createForm.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="KEROSENE">Kerosene</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={createForm.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes or instructions..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional notes about this distribution (max 500 characters)
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Distribution'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateDistribution;
