import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { otpSchema } from '../../utils/validation';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onVerify,
  onBack,
  isLoading 
}) => {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);
  
  const handleResendOTP = () => {
    // In a real app, this would call an API to resend the OTP
    setCountdown(30);
    setCanResend(false);
  };

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center text-primary-600 mb-4 hover:text-primary-700"
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Verify Your Email
      </h2>
      
      <p className="mb-6 text-neutral-600">
        We've sent a 6-digit verification code to <span className="font-medium">{email}</span>. 
        Enter the code below to continue.
      </p>
      
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={otpSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onVerify(values.otp);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="form-group">
              <label htmlFor="otp" className="form-label">
                Verification Code
              </label>
              <div className="relative">
                <Field
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="input-field pl-10"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isSubmitting || isLoading}
                />
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="otp"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
            
            <div className="text-center mt-4">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  Resend verification code
                </button>
              ) : (
                <p className="text-neutral-500 text-sm">
                  Resend code in {countdown} seconds
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OTPVerification;