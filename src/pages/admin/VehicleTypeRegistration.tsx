import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { adminApi } from '../../services/api';
import Swal from 'sweetalert2';

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
    
    // Show validation error with SweetAlert if there are errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join('\n');
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: errorMessages,
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Fix Issues'
      });
      return false;
    }
    
    return true;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weeklyQuota' ? parseFloat(value) || 0 : value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    if (!validateForm()) return;
    
    // Show confirmation dialog before submitting
    const result = await Swal.fire({
      title: 'Confirm Registration',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Vehicle Type:</strong> ${formData.name}</p>
          <p><strong>Fuel Type:</strong> ${formData.fuelType}</p>
          <p><strong>Weekly Quota:</strong> ${formData.weeklyQuota} Liters</p>
          ${formData.description ? `<p><strong>Description:</strong> ${formData.description}</p>` : ''}
        </div>
        <p style="margin-top: 15px;">Are you sure you want to register this vehicle type?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Register',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;
    
    setIsSubmitting(true);
    
    // Show loading alert
    Swal.fire({
      title: 'Registering Vehicle Type...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const now = new Date().toISOString();
      const response = await adminApi.createVehicleType({
        ...formData,
        createdAt: now,
        updatedAt: now
      });
      console.log('Vehicle type created:', response);

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p><strong>Vehicle Type:</strong> ${formData.name}</p>
            <p><strong>Fuel Type:</strong> ${formData.fuelType}</p>
            <p><strong>Weekly Quota:</strong> ${formData.weeklyQuota} Liters</p>
            <p><strong>Status:</strong> <span style="color: #10b981;">Active</span></p>
          </div>
          <p style="margin-top: 15px; color: #6b7280;">The vehicle type has been successfully registered in the system.</p>
        `,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Great!',
        timer: 6000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      }).then(() => {
        // Additional success actions can go here
        console.log('Success alert closed');
      });
      
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
      
      // Close loading alert if it's open
      Swal.close();
      
      const errorMsg = error instanceof Error ? error.message : 'Failed to register vehicle type. Please try again.';
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMsg,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Try Again',
        footer: '<small>Please check your connection and try again.</small>',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset with confirmation
  const handleReset = () => {
    const hasData = formData.name || formData.description || formData.weeklyQuota > 0;
    
    if (hasData) {
      Swal.fire({
        title: 'Reset Form?',
        text: 'This will clear all entered data. Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Reset',
        cancelButtonText: 'Keep Data'
      }).then((result) => {
        if (result.isConfirmed) {
          setFormData({
            name: '',
            description: '',
            weeklyQuota: 0,
            fuelType: 'PETROL'
          });
          setErrors({});
          setSuccessMessage(null);
          setErrorMessage(null);
          
          Swal.fire({
            icon: 'success',
            title: 'Form Reset',
            text: 'All fields have been cleared.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
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
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={18} />}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Vehicle Type'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VehicleTypeRegistration;
