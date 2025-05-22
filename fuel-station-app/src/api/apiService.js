import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your Spring Boot API
const API_BASE_URL = 'http://10.0.2.2:8080/api'; // Use 10.0.2.2 for Android emulator

// Helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const token = await AsyncStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
};

// Authentication
export const login = async (username, password) => {
    return apiRequest('/auth/login', 'POST', { username, password });
};

// Vehicle Quota
export const getVehicleQuota = async (vehicleId) => {
    return apiRequest(`/vehicles/${vehicleId}/quota`);
};

// Update Fuel Amount
export const updateFuelAmount = async (vehicleId, fuelAmount) => {
    return apiRequest(`/quota/update`, 'POST', {
        vehicleId,
        fuelAmount
    });
};

// Get Fuel Station Details
export const getFuelStationDetails = async (stationId) => {
    return apiRequest(`/stations/${stationId}`);
};