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
  CAR = "Car",
  VAN = "Van",
  MOTORCYCLE = "Motorcycle",
  THREE_WHEELER = "Three Wheeler",
  LORRY = "Lorry",
  BUS = "Bus",
  OTHER = "Other"
}

export enum FuelType {
  PETROL_92 = "Petrol 92",
  PETROL_95 = "Petrol 95",
  DIESEL = "Diesel",
  SUPER_DIESEL = "Super Diesel",
  KEROSENE = "Kerosene"
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