import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Fuel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmailForm from '../components/auth/EmailForm';
import OTPVerification from '../components/auth/OTPVerification';
import { toast } from 'react-toastify';
import axios from 'axios';

enum LoginStep {
  EMAIL,
  OTP,
}

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, verifyOtp, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.EMAIL);
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleEmailSubmit = async (email: string) => {
    try {
      // Call the backend API to send OTP
      const response = await axios.post('http://localhost:8080/api/register/send-otpForLogin', null, {
        params: { email },
      });

      // If successful, proceed to OTP verification step
      setEmail(email);
      setCurrentStep(LoginStep.OTP);
      toast.success(response.data.message || 'OTP sent to your email');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.error || 'Failed to send OTP. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const handleOtpVerify = async (otp: string) => {
    try {
      // Call the backend API to validate OTP
      const response = await axios.post('http://localhost:8080/api/register/validate-otpLogin', null, {
        params: { email, otp },
      });

      console.log('OTP Verification Response:', response.data);

      // If successful, navigate to the QR Code page with the email
      toast.success(response.data.message || 'Login successful!');
      navigate('/qr-code', { state: { email } });
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.error || 'Invalid OTP. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const handleBack = () => {
    setCurrentStep(LoginStep.EMAIL);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
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
        
        <div className="mt-8">
          {currentStep === LoginStep.EMAIL && (
            <EmailForm 
              onSubmit={handleEmailSubmit} 
              isSignup={false}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === LoginStep.OTP && (
            <OTPVerification 
              email={email}
              onVerify={handleOtpVerify}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;