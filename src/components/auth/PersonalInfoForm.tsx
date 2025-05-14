import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { User, CreditCard, MapPin, Phone } from 'lucide-react';
import { personalInfoSchema } from '../../utils/validation';

interface PersonalInfoFormProps {
  onSubmit: (values: {
    name: string;
    nic: string;
    address: string;
    contactNumber: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  onSubmit,
  isLoading 
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Personal Information
      </h2>
      
      <p className="mb-6 text-neutral-600">
        Please provide your personal details to complete your registration.
      </p>
      
      <Formik
        initialValues={{
          name: '',
          nic: '',
          address: '',
          contactNumber: '',
        }}
        validationSchema={personalInfoSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="name"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nic" className="form-label">
                NIC Number
              </label>
              <div className="relative">
                <Field
                  id="nic"
                  name="nic"
                  type="text"
                  placeholder="Enter your NIC number"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="nic"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <div className="relative">
                <Field
                  id="address"
                  name="address"
                  as="textarea"
                  rows={3}
                  placeholder="Enter your residential address"
                  className="input-field pl-10 pt-2 resize-none"
                  disabled={isSubmitting || isLoading}
                />
                <MapPin className="absolute left-3 top-3 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="address"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber" className="form-label">
                Contact Number
              </label>
              <div className="relative">
                <Field
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  placeholder="Enter your contact number"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="contactNumber"
                component="div"
                className="text-error text-sm mt-1"
              />
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
                <span>Continue</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PersonalInfoForm;