import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Fuel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmailForm from '../components/auth/EmailForm';
import OTPVerification from '../components/auth/OTPVerification';
import { toast } from 'react-toastify';

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
      await login(email);
      setEmail(email);
      setCurrentStep(LoginStep.OTP);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };
  
  const handleOtpVerify = async (otp: string) => {
    try {
      const success = await verifyOtp(email, otp);
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
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