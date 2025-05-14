export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'STATION_MANAGER';
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