/**
 * API service for communicating with the backend
 */

// Make sure this matches exactly with your backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to append JWT token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `${tokenType} ${token}` } : {})
  };
};

// Generic fetch wrapper with error handling
async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Log the response for debugging
    console.log(`API Response (${endpoint}):`, response.status);
    
    if (!response.ok) {
      // Try to parse error message from response
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing fails, use the text directly
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if the response is empty
    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.indexOf('application/json') === -1) {
      // If response is not JSON, return text as success message
      const text = await response.text();
      return { message: text } as unknown as T;
    }
    
    // Otherwise, parse as JSON
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication API
export const authApi = {
  login: (username: string, password: string) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
    
  register: (userData: { username: string, fullName: string, email: string, password: string, roles: string[] }) => 
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
  getCurrentUser: () => fetchWithAuth('/auth/me'),
  
  validateToken: () => fetchWithAuth('/auth/validate')
};

// Admin API
export const adminApi = {
  getFuelStations: () => 
    fetchWithAuth('/admin/fuel-stations'),
    
  getTransactions: () => 
    fetchWithAuth('/admin/transactions'),
    
  approveStation: (stationId: string) => 
    fetchWithAuth(`/admin/fuel-stations/${stationId}/approve`, {
      method: 'POST'
    }),
    
  deactivateStation: (stationId: string) => 
    fetchWithAuth(`/admin/fuel-stations/${stationId}/deactivate`, {
      method: 'POST'
    }),
    
  addFuelStation: (stationData: Omit<FuelStation, 'id' | 'status' | 'createdAt'>) => 
    fetchWithAuth('/admin/fuel-stations', {
      method: 'POST',
      body: JSON.stringify(stationData)
    })
};

// Define the Vehicle type
type Vehicle = {
  id: string;
  remainingQuota: number;
  [key: string]: any; // Add other properties as needed
};

// Define the FuelStation type
type FuelStation = {
  id: string;
  name: string;
  location: string;
  status: string;
  createdAt: string;
  [key: string]: any; // Add other properties as needed
};

// User API
export const userApi = {
  getVehicles: () => 
    fetchWithAuth('/user/vehicles'),
    
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'remainingQuota'>) => 
    fetchWithAuth('/user/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    }),
    
  getQuota: (vehicleId: string) => 
    fetchWithAuth(`/user/vehicles/${vehicleId}/quota`),
    
  requestQuota: (vehicleId: string, amount: number) => 
    fetchWithAuth(`/user/vehicles/${vehicleId}/request-quota`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
};

// Station Manager API
export const stationApi = {
  getStationDetails: () => 
    fetchWithAuth('/station/details'),
    
  recordTransaction: (transaction: {
    vehicleId: string,
    amount: number,
    fuelType: string
  }) => 
    fetchWithAuth('/station/record-transaction', {
      method: 'POST',
      body: JSON.stringify(transaction)
    }),
    
  getDailyTransactions: () => 
    fetchWithAuth('/station/transactions/daily'),
    
  validateVehicle: (registrationNumber: string) => 
    fetchWithAuth(`/station/vehicle/validate?registrationNumber=${registrationNumber}`)
};