import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { distributionApi, adminApi, FuelDistribution } from '../../services/api';

interface CreateDistributionProps {
  onDistributionCreated: (newDistribution: FuelDistribution) => void;
}

interface FuelStation {
  id: number;
  name: string;
  location: string;
  ownerName: string;
  contactNumber: string;
  active: boolean;
  createdAt: string;
}

const CreateDistribution: React.FC<CreateDistributionProps> = ({ onDistributionCreated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  const [createForm, setCreateForm] = useState({
    fuelStationId: '',
    fuelAmount: '',
    fuelType: 'PETROL',
    notes: ''
  });

  useEffect(() => {
    if (showCreateModal) {
      fetchFuelStations();
    }
  }, [showCreateModal]);

  const fetchFuelStations = async () => {
    try {
      setLoadingStations(true);
      console.log('Fetching fuel stations...');
      
      const stations = await adminApi.getFuelStations();
      console.log('Raw API response:', stations);

      // Ensure stations is an array before filtering
      const stationArray: FuelStation[] = Array.isArray(stations) ? stations : [];
      
      // Filter only active stations
      const activeStations = stationArray.filter((station: FuelStation) => station.active === true);
      console.log('Active stations:', activeStations);
      
      setFuelStations(activeStations);
    } catch (err) {
      console.error('Failed to fetch fuel stations:', err);
      setError('Failed to load fuel stations. Please try again.');
    } finally {
      setLoadingStations(false);
    }
  };

  const handleCreateDistribution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
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
    if (error) setError('');
  };

  const getSelectedStationName = () => {
    const selectedStation = fuelStations.find(station => station.id === Number(createForm.fuelStationId));
    return selectedStation ? `${selectedStation.name} - ${selectedStation.location}` : '';
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
              Fuel Station <span className="text-red-500">*</span>
            </label>
            {loadingStations ? (
              <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading stations...
              </div>
            ) : (
              <select
                required
                value={createForm.fuelStationId}
                onChange={(e) => handleInputChange('fuelStationId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select a fuel station</option>
                {fuelStations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name} - {station.location}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {createForm.fuelStationId 
                ? `Selected: ${getSelectedStationName()}` 
                : 'Choose the fuel station to receive the distribution'
              }
            </p>
            {fuelStations.length === 0 && !loadingStations && (
              <p className="text-xs text-red-500 mt-1">
                No active fuel stations available. Please contact administrator.
              </p>
            )}
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
              disabled={isSubmitting || fuelStations.length === 0}
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
