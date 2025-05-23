import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { adminApi } from '../../services/api';

// Define the vehicle type interface based on the Java model
interface VehicleTypeForm {
  name: string;
  description: string;
  weeklyQuota: number;
  fuelType: 'PETROL' | 'DIESEL' | 'KEROSENE' | 'ELECTRIC';
}

const VehicleTypeRegistration: React.FC = () => {
  const [formData, setFormData] = useState<VehicleTypeForm>({
    name: '',
    description: '',
    weeklyQuota: 0,
    fuelType: 'PETROL'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle type name is required';
    }
    
    if (formData.weeklyQuota <= 0) {
      newErrors.weeklyQuota = 'Weekly quota must be greater than zero';
    }
    
    if (!formData.fuelType) {
      newErrors.fuelType = 'Fuel type is required';
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
    
    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await adminApi.createVehicleType(formData);
      console.log('Vehicle type created:', response);
      
      setSuccessMessage('Vehicle type successfully registered!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        weeklyQuota: 0,
        fuelType: 'PETROL'
      });
      
    } catch (error) {
      console.error('Failed to register vehicle type:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to register vehicle type. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Type Registration</h1>
        <p className="text-gray-600 mt-1">Register new vehicle types and set their weekly fuel quota</p>
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
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md`}
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
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={18} />}
              isLoading={isSubmitting}
            >
              Register Vehicle Type
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VehicleTypeRegistration;