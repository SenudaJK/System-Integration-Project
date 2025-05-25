import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8082';

interface FuelStationForm {
    id?: number;
    name: string;
    location: string;
    ownerName: string;
    contactNumber: string;
    password: string;
    active: boolean;
}

interface LoginCredentials {
    contactNumber: string;
    password: string;
}

interface LoginResponse {
    message: string;
    token?: string;
}

export interface FuelInventoryDTO {
    id?: number;
    fuelStationId?: number;
    fuelType: string;
    amount: number;
    orderDate?: string;
}

export class FuelStationService {
    static getAuthHeaders(): { Authorization: string } | undefined {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : undefined;
    }

    static async registerFuelStation(formData: FuelStationForm): Promise<void> {
        await axios.post('/api/fuel-stations', formData);
    }

    static async ownerLogin(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post('/api/fuel-stations/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }

    static async getCurrentFuelStation(): Promise<FuelStationForm> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.get('/api/fuel-stations/me', { headers });
        return response.data;
    }

    static async getInventory(fuelStationId: number): Promise<FuelInventoryDTO[]> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.get(`/api/fuel-inventory/${fuelStationId}`, { headers });
        return response.data;
    }

    static async updateFuelAmount(fuelStationId: number, inventory: FuelInventoryDTO): Promise<FuelInventoryDTO> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.put(`/api/fuel-inventory/${fuelStationId}/update-amount`, inventory, { headers });
        return response.data;
    }

    static async updateFuelConsumed(fuelStationId: number, inventory: FuelInventoryDTO): Promise<FuelInventoryDTO> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.put(`/api/fuel-inventory/${fuelStationId}/update-consumed`, inventory, { headers });
        return response.data;
    }

    static async restockFuelAmount(fuelStationId: number, inventory: FuelInventoryDTO): Promise<FuelInventoryDTO> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.put(`/api/fuel-inventory/${fuelStationId}/restock`, inventory, { headers });
        return response.data;
    }

    static async getAllOrders(): Promise<any[]> {
        const headers = this.getAuthHeaders();
        if (!headers) throw new Error('No token available');
        const response = await axios.get('/api/orders', { headers });
        return response.data;
    }
}