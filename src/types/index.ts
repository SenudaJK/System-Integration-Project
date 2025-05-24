// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  nic: string;
  address: string;
  contactNumber: string;
  vehicles: Vehicle[];
}

// Vehicle related types
export interface Vehicle {
  id: string;
  vehicleNumber: string;
  chassisNumber: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  quotaAmount: number;
  remainingQuota: number;
}

export enum VehicleType {
  CAR = "CAR",
  VAN = "VAN",
  MOTORCYCLE = "MOTORCYCLE",
  THREE_WHEELER = "THREE WHEELER",
  LORRY = "LORRY",
  BUS = "BUS",
  OTHER = "OTHER"
}

export enum FuelType {
  PETROL = "PETROL",
  DIESEL = "DIESEL",
  SUPER_DIESEL = "SUPER DIESEL",
  KEROSENE = "KEROSENE"
}

// Fuel transaction related types
export interface FuelTransaction {
  id: string;
  vehicleId: string;
  date: string;
  amount: number;
  stationName: string;
  stationLocation: string;
}

// Auth related types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Form states
export interface SignupFormState {
  email: string;
  otp: string;
  name: string;
  nic: string;
  address: string;
  contactNumber: string;
  vehicleNumber: string;
  chassisNumber: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
}