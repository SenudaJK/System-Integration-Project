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
    .matches(/^[A-Z]{2,3}-\d{4}$/, 'Invalid vehicle number format (e.g., KL-7896)')
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
  
  const handleRegistrationSubmit = async (values: any) => {
    try {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        vehicleNumber: values.vehicleNumber,
        chassisNumber: values.chassisNumber,
        vehicleType: values.vehicleType,
        fuelType: values.fuelType,
        quotaAmount: 20,
        remainingQuota: 20,
      };
      
      updateUserInfo({
        name: values.name,
        nic: values.nic,
        address: values.address,
        contactNumber: values.contactNumber,
        vehicles: [newVehicle],
      });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };
  
  const handleBack = () => {
    if (currentStep === SignupStep.OTP) {
      setCurrentStep(SignupStep.EMAIL);
    }
  };

  const renderRegistrationForm = () => (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Complete Registration
      </h2>
      
      <p className="mb-6 text-neutral-600">
        Please provide your personal and vehicle details to complete the registration.
      </p>
      
      <Formik
        initialValues={{
          name: '',
          nic: '',
          address: '',
          contactNumber: '',
          vehicleNumber: '',
          chassisNumber: '',
          vehicleType: '',
          fuelType: '',
        }}
        validationSchema={registrationSchema}
        onSubmit={handleRegistrationSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-primary-700 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="nic" className="form-label">NIC Number</label>
                  <Field
                    type="text"
                    id="nic"
                    name="nic"
                    className="input-field"
                    placeholder="Enter your NIC number"
                  />
                  <ErrorMessage name="nic" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">Residential Address</label>
                  <Field
                    as="textarea"
                    id="address"
                    name="address"
                    className="input-field"
                    rows={3}
                    placeholder="Enter your residential address"
                  />
                  <ErrorMessage name="address" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                  <Field
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    className="input-field"
                    placeholder="Enter your contact number"
                  />
                  <ErrorMessage name="contactNumber" component="div" className="text-error text-sm mt-1" />
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-700 mb-4">Vehicle Information</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="vehicleNumber" className="form-label">Vehicle Registration Number</label>
                  <Field
                    type="text"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    className="input-field"
                    placeholder="e.g., KL-7896"
                  />
                  <ErrorMessage name="vehicleNumber" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="chassisNumber" className="form-label">Chassis Number</label>
                  <Field
                    type="text"
                    id="chassisNumber"
                    name="chassisNumber"
                    className="input-field"
                    placeholder="Enter chassis number"
                  />
                  <ErrorMessage name="chassisNumber" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
                  <Field
                    as="select"
                    id="vehicleType"
                    name="vehicleType"
                    className="input-field"
                  >
                    <option value="">Select vehicle type</option>
                    {Object.values(VehicleType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="vehicleType" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-group">
                  <label htmlFor="fuelType" className="form-label">Fuel Type</label>
                  <Field
                    as="select"
                    id="fuelType"
                    name="fuelType"
                    className="input-field"
                  >
                    <option value="">Select fuel type</option>
                    {Object.values(FuelType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="fuelType" component="div" className="text-error text-sm mt-1" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Registration'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );

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