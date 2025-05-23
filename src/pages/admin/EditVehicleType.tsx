import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { adminApi } from '../../services/api';

interface VehicleTypeForm {
  name: string;
  description: string;
  weeklyQuota: number;
  fuelType: 'PETROL' | 'DIESEL' | 'KEROSENE' | 'ELECTRIC';
}

const EditVehicleType: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<VehicleTypeForm>({
    name: '',
    description: '',
    weeklyQuota: 0,
    fuelType: 'PETROL'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchVehicleType = async () => {
      if (id === 'new') return;
      
      setIsLoading(true);
      try {
        const data = await adminApi.getVehicleType(Number(id)) as {
          name: string;
          description?: string;
          weeklyQuota: number;
          fuelType: 'PETROL' | 'DIESEL' | 'KEROSENE' | 'ELECTRIC';
        };
        setFormData({
          name: data.name,
          description: data.description || '',
          weeklyQuota: data.weeklyQuota,
          fuelType: data.fuelType
        });
      } catch (error) {
        console.error('Failed to fetch vehicle type:', error);
        setErrorMessage('Failed to load vehicle type details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleType();
  }, [id]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle type name is required';
    }
    
    if (formData.weeklyQuota <= 0) {
      newErrors.weeklyQuota = 'Weekly quota must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weeklyQuota' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSuccessMessage(null);
    setErrorMessage(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (id === 'new') {
        await adminApi.createVehicleType(formData);
        setSuccessMessage('Vehicle type successfully created!');
      } else {
        await adminApi.updateVehicleType(Number(id), formData);
        setSuccessMessage('Vehicle type successfully updated!');
      }
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/admin/vehicle-types');
      }, 1500);
    } catch (error) {
      console.error('Failed to save vehicle type:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to save vehicle type. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id === 'new' ? 'Add New Vehicle Type' : 'Edit Vehicle Type'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id === 'new' 
              ? 'Register a new vehicle type and set its weekly fuel quota' 
              : 'Update the details and quota for this vehicle type'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/vehicle-types')}
          icon={<ArrowLeft size={16} />}
        >
          Back to List
        </Button>
      </div>
      
      <Card>
        {successMessage && (
          <Alert variant="success" title="Success" className="mb-4">
            <div className="flex items-center">
              <Check size={16} className="mr-2" />
              {successMessage}
            </div>
          </Alert>
        )}
        
        {errorMessage && (
          <Alert variant="error" title="Error" className="mb-4">
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              {errorMessage}
            </div>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type Name*
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Sedan, SUV, Motorcycle"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Provide a brief description of this vehicle type"
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type*
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className={`mt-1 block w-full py-2 px-3 border ${
                  errors.fuelType ? 'border-red-300' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="KEROSENE">Kerosene</option>
                <option value="ELECTRIC">Electric</option>
              </select>
              {errors.fuelType && (
                <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="weeklyQuota" className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Quota (Liters)*
              </label>
              <Input
                id="weeklyQuota"
                name="weeklyQuota"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter weekly fuel quota in liters"
                value={formData.weeklyQuota}
                onChange={handleChange}
                error={errors.weeklyQuota}
                fullWidth
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/vehicle-types')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={18} />}
              isLoading={isSubmitting}
            >
              {id === 'new' ? 'Create Vehicle Type' : 'Update Vehicle Type'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditVehicleType;