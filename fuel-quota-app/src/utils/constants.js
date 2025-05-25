export const API_BASE_URL = "http://192.168.1.100:8080/api";

export const FUEL_TYPES = {
    PETROL_92: "Petrol 92",
    PETROL_95: "Petrol 95",
    DIESEL: "Diesel",
    SUPER_DIESEL: "Super Diesel",
    KEROSENE: "Kerosene",
};

export const VEHICLE_TYPES = {
    MOTORCYCLE: "Motorcycle",
    THREE_WHEELER: "Three Wheeler",
    CAR: "Car",
    VAN: "Van",
    BUS: "Bus",
    LORRY: "Lorry",
    TRUCK: "Truck",
    HEAVY_VEHICLE: "Heavy Vehicle",
};

export const TRANSACTION_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
};

export const APP_CONFIG = {
    DEFAULT_TIMEOUT: 10000,
    MAX_RETRY_ATTEMPTS: 3,
    CACHE_DURATION: 300000, // 5 minutes
};
