import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Car, Cpu, Crown as Dropdown, Fuel } from 'lucide-react';
import { vehicleInfoSchema } from '../../utils/validation';
import { VehicleType, FuelType } from '../../types';

interface VehicleInfoFormProps {
  onSubmit: (values: {
    vehicleNumber: string;
    chassisNumber: string;
    vehicleType: VehicleType;
    fuelType: FuelType;
  }) => Promise<void>;
  isLoading: boolean;
}

const VehicleInfoForm: React.FC<VehicleInfoFormProps> = ({ 
  onSubmit,
  isLoading 
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Vehicle Information
      </h2>
      
      <p className="mb-6 text-neutral-600">
        Please provide your vehicle details to register for fuel quota.
      </p>
      
      <Formik
        initialValues={{
          vehicleNumber: '',
          chassisNumber: '',
          vehicleType: '' as VehicleType,
          fuelType: '' as FuelType,
        }}
        validationSchema={vehicleInfoSchema}
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
              <label htmlFor="vehicleNumber" className="form-label">
                Vehicle Registration Number
              </label>
              <div className="relative">
                <Field
                  id="vehicleNumber"
                  name="vehicleNumber"
                  type="text"
                  placeholder="e.g., KL-7896"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="vehicleNumber"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="chassisNumber" className="form-label">
                Chassis Number
              </label>
              <div className="relative">
                <Field
                  id="chassisNumber"
                  name="chassisNumber"
                  type="text"
                  placeholder="Enter chassis number"
                  className="input-field pl-10"
                  disabled={isSubmitting || isLoading}
                />
                <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
              <ErrorMessage
                name="chassisNumber"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="vehicleType" className="form-label">
                Vehicle Type
              </label>
              <div className="relative">
                <Field
                  as="select"
                  id="vehicleType"
                  name="vehicleType"
                  className="input-field pl-10 appearance-none"
                  disabled={isSubmitting || isLoading}
                >
                  <option value="">Select vehicle type</option>
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <Dropdown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <ErrorMessage
                name="vehicleType"
                component="div"
                className="text-error text-sm mt-1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fuelType" className="form-label">
                Fuel Type
              </label>
              <div className="relative">
                <Field
                  as="select"
                  id="fuelType"
                  name="fuelType"
                  className="input-field pl-10 appearance-none"
                  disabled={isSubmitting || isLoading}
                >
                  <option value="">Select fuel type</option>
                  {Object.values(FuelType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <ErrorMessage
                name="fuelType"
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
                <span>Complete Registration</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VehicleInfoForm;