import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Mail } from 'lucide-react';
import { emailSchema } from '../../utils/validation';

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>;
  isSignup?: boolean;
  isLoading: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  onSubmit, 
  isSignup = false,
  isLoading 
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-700 mb-6">
        {isSignup ? 'Create Your Account' : 'Login to Your Account'}
      </h2>
      
      <p className="mb-6 text-neutral-600">
        {isSignup 
          ? 'Enter your email address to start the registration process.' 
          : 'Enter your email address to receive a one-time password (OTP).'}
      </p>
      
      <Formik
        initialValues={{ email: '' }}
        validationSchema={emailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values.email);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="email"
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
                  Processing...
                </span>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailForm;