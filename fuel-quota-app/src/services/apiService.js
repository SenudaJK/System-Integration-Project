import axios from "axios";

const BASE_URL = "http://192.168.1.100:8080/api";

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                console.log(
                    `Making ${config.method?.toUpperCase()} request to: ${
                        config.url
                    }`
                );
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error(
                    "API Error:",
                    error.response?.data || error.message
                );
                return Promise.reject(error);
            }
        );
    }

    setAuthToken(token) {
        if (token) {
            this.api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
        } else {
            delete this.api.defaults.headers.common["Authorization"];
        }
    }

    // Auth endpoints
    async login(credentials) {
        return this.api.post("/auth/login", credentials);
    }

    async register(userData) {
        return this.api.post("/auth/register", userData);
    }

    // Vehicle/QR endpoints
    async getVehicleByQR(qrData) {
        return this.api.get(`/vehicles/qr/${encodeURIComponent(qrData)}`);
    }

    async getVehicleQuota(vehicleId) {
        return this.api.get(`/vehicles/${vehicleId}/quota`);
    }

    // Fuel transaction endpoints
    async recordFuelTransaction(transactionData) {
        return this.api.post("/fuel-transactions", transactionData);
    }

    async getTransactionHistory(operatorId, page = 0, size = 20) {
        return this.api.get(
            `/fuel-transactions/operator/${operatorId}?page=${page}&size=${size}`
        );
    }

    // Fuel station endpoints
    async getFuelStationInfo(stationId) {
        return this.api.get(`/fuel-stations/${stationId}`);
    }
}

export const apiService = new ApiService();
