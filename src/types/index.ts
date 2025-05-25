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
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_STATION_MANAGER';
  username?: string;
};

export type FuelStation = {
  id: string;
  name: string;
  address: string;
  city: string;
  contactNumber: string;
  status: 'PENDING' | 'APPROVED' | 'DEACTIVATED';
  capacity: number;
  fuelTypes: FuelType[];
  createdAt: string;
};

export type FuelType = {
  id: string;
  name: string;
  unitPrice: number;
};

export type Vehicle = {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  fuelType: string;
  owner: string;
  quotaAmount: number;
  remainingQuota: number;
};

export type Transaction = {
  id: string;
  stationId: string;
  stationName: string;
  vehicleId: string;
  vehicleRegistration: string;
  fuelType: string;
  amount: number;
  timestamp: string;
  userId: string;
  userName: string;
};

export type QuotaRequest = {
  id: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehicleRegistration: string;
  requestedAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};
