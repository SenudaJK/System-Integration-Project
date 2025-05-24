import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

interface FuelStationForm {
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

export class FuelStationService {
    static async registerFuelStation(formData: FuelStationForm): Promise<void> {
        await axios.post('/api/fuel-stations', formData);
    }

    static async ownerLogin(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post('/api/fuel-stations/login', credentials);
        return response.data;
    }
}