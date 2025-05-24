import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Fuel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmailForm from '../components/auth/EmailForm';
import OTPVerification from '../components/auth/OTPVerification';
import { toast } from 'react-toastify';
import { Vehicle, VehicleType, FuelType } from '../types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

enum SignupStep {
  EMAIL,
  OTP,
  REGISTRATION,
}

// Combined validation schema for both personal and vehicle info
const registrationSchema = Yup.object().shape({
  // Personal Info
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  nic: Yup.string()
    .matches(/^(\d{9}[vVxX]|\d{12})$/, 'Invalid NIC format')
    .required('NIC is required'),
  address: Yup.string()
    .min(5, 'Address is too short')
    .max(100, 'Address is too long')
    .required('Address is required'),
  contactNumber: Yup.string()
    .matches(/^(\+94|0)[0-9]{9}$/, 'Invalid phone number format')
    .required('Contact number is required'),

  // Vehicle Info
  vehicleNumber: Yup.string()
    //.matches(/^[A-Z]{2,3}-\d{4}$/, 'Invalid vehicle number format (e.g., KL-7896)')
    .required('Vehicle number is required'),
  chassisNumber: Yup.string()
    .min(5, 'Chassis number is too short')
    .max(17, 'Chassis number is too long')
    .required('Chassis number is required'),
  vehicleType: Yup.mixed<VehicleType>()
    .oneOf(Object.values(VehicleType), 'Please select a valid vehicle type')
    .required('Vehicle type is required'),
  fuelType: Yup.mixed<FuelType>()
    .oneOf(Object.values(FuelType), 'Please select a valid fuel type')
    .required('Fuel type is required'),
});

const SignupPage: React.FC = () => {
  const { isAuthenticated, updateUserInfo, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.EMAIL);
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  // Move these states to the top level of the component
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    contactNumber: '',
    vehicleNumber: '',
    chassisNumber: '',
    vehicleType: '',
    fuelType: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      // Call the send OTP API with email as a query parameter
      await axios.post(`http://localhost:8080/api/register/send-otp?email=${encodeURIComponent(email)}`);
      setEmail(email);
      setCurrentStep(SignupStep.OTP);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(
        (axios.isAxiosError(error) && error.response?.data?.error) || 'Failed to send OTP. Please try again.'
      );
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      // Call the validate OTP API with email and otp as query parameters
      const response = await axios.post(
        `http://localhost:8080/api/register/validate-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
      if (response.data.message === 'Email verified successfully.') {
        setCurrentStep(SignupStep.REGISTRATION);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error(
        (axios.isAxiosError(error) && error.response?.data?.error) || 'Verification failed. Please try again.'
      );
    }
  };

  const handleVehicleValidation = async (values: any) => {
    try {
      // Call the vehicle validation API
      const response = await axios.get('http://localhost:8080/api/vehicle/validate-vehicle-by-chassis', {
        params: {
          chassisNumber: values.chassisNumber,
          vehicleNumber: values.vehicleNumber,
          nic: values.nic,
          fuelType: values.fuelType,
          vehicleType: values.vehicleType,
        },
      });

      if (response.data.message === 'Vehicle details validated successfully.') {
        toast.success('Vehicle details validated successfully.');
        return true; // Validation successful
      } else {
        toast.error('Vehicle validation failed. Please check your details.');
        return false; // Validation failed
      }
    } catch (error) {
      console.error('Vehicle validation error:', error);
      toast.error(
        (axios.isAxiosError(error) && error.response?.data?.error) || 'Vehicle validation failed. Please try again.'
      );
      return false; // Validation failed
    }
  };

  const handleRegistrationSubmit = async (values: any) => {
    try {
      // Step 1: Validate vehicle data
      const isValid = await handleVehicleValidation(values);

      if (!isValid) {
        return; // Stop submission if validation fails
      }

      // Step 2: Combine owner and vehicle details into a single payload
      const payload = {
        nic: values.nic,
        firstName: values.firstName,
        lastName: values.lastName,
        email: email,
        phone: values.contactNumber,
        address: values.address,
        vehicle: {
          vehicleNumber: values.vehicleNumber,
          chassisNumber: values.chassisNumber,
          vehicleType: values.vehicleType,
          fuelType: values.fuelType,
          ownerNic: values.nic, // Ensure owner NIC is included in the vehicle object
        },
      };

      console.log('Payload:', payload);

      // Step 3: Submit the registration data
      const response = await axios.post('http://localhost:8080/api/register/store-ownervehicle', payload);

      // Show success message and navigate to the dashboard
      toast.success(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.error || 'Validation failed. Please check your input.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === SignupStep.OTP) {
      setCurrentStep(SignupStep.EMAIL);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.nic.match(/^(\d{9}[vVxX]|\d{12})$/)) newErrors.nic = 'Invalid NIC format';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contactNumber.match(/^(\+94|0)[0-9]{9}$/)) newErrors.contactNumber = 'Invalid phone number format';
    if (!formData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.chassisNumber) newErrors.chassisNumber = 'Chassis number is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await handleRegistrationSubmit(formData);
    }
  };

  // Add handleChange function to update formData state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderRegistrationForm = () => {
    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-primary-700 mb-2">Complete Registration</h2>
        <p className="mb-6 text-neutral-600">
          Please provide your personal and vehicle details to complete the registration.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-primary-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              {/* <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
              </div> */}

              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input-field"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <div className="text-error text-sm mt-1">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input-field"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <div className="text-error text-sm mt-1">{errors.lastName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="nic" className="form-label">NIC Number</label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  className="input-field"
                  placeholder="Enter your NIC number"
                  value={formData.nic}
                  onChange={handleChange}
                />
                {errors.nic && <div className="text-error text-sm mt-1">{errors.nic}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Residential Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="input-field"
                  rows={3}
                  placeholder="Enter your residential address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-error text-sm mt-1">{errors.address}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  className="input-field"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
                {errors.contactNumber && <div className="text-error text-sm mt-1">{errors.contactNumber}</div>}
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-primary-700 mb-4">Vehicle Information</h3>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="vehicleNumber" className="form-label">Vehicle Registration Number</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  className="input-field"
                  placeholder="e.g., KL-7896"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />
                {errors.vehicleNumber && <div className="text-error text-sm mt-1">{errors.vehicleNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="chassisNumber" className="form-label">Chassis Number</label>
                <input
                  type="text"
                  id="chassisNumber"
                  name="chassisNumber"
                  className="input-field"
                  placeholder="Enter chassis number"
                  value={formData.chassisNumber}
                  onChange={handleChange}
                />
                {errors.chassisNumber && <div className="text-error text-sm mt-1">{errors.chassisNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  className="input-field"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="">Select vehicle type</option>
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && <div className="text-error text-sm mt-1">{errors.vehicleType}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="fuelType" className="form-label">Fuel Type</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  className="input-field"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  <option value="">Select fuel type</option>
                  {Object.values(FuelType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.fuelType && <div className="text-error text-sm mt-1">{errors.fuelType}</div>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    );
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case SignupStep.EMAIL:
        return (
          <EmailForm
            onSubmit={handleEmailSubmit}
            isSignup={true}
            isLoading={isLoading}
          />
        );
      case SignupStep.OTP:
        return (
          <OTPVerification
            email={email}
            onVerify={handleOtpVerify}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case SignupStep.REGISTRATION:
        return renderRegistrationForm();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Fuel className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-neutral-900">
            Fuel Quota System
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Ministry of Energy, Government of Sri Lanka
          </p>
        </div>

        <div className="mt-6">
          {getCurrentStepComponent()}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;