import * as Yup from 'yup';
import { VehicleType, FuelType } from '../types';

// Email validation schema
export const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// OTP validation schema
export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .length(6, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
});

// Personal information validation schema
export const personalInfoSchema = Yup.object().shape({
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
});

// Vehicle information validation schema
export const vehicleInfoSchema = Yup.object().shape({
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