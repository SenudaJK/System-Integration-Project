const API_BASE_URL = 'https://2a9e-192-248-24-50.ngrok-free.app/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            console.log(`Making request to: ${url}`);
            console.log('Request config:', config);

            const response = await fetch(url, config);

            console.log(`Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Scan QR Code API
    async scanQRCode(qrCode) {
        return this.makeRequest('/scan', {
            method: 'POST',
            body: JSON.stringify({ qrCode }),
        });
    }

    // Dispense Fuel API
    async dispenseFuel(qrCode, amount) {
        console.log("=== DISPENSE REQUEST DEBUG ===");
        console.log("qrCode parameter:", qrCode);
        console.log("qrCode type:", typeof qrCode);
        console.log("qrCode length:", qrCode ? qrCode.length : 'null');
        console.log("amount parameter:", amount);
        console.log("amount type:", typeof amount);

        const requestBody = {
            qrCode: qrCode,
            amount: parseFloat(amount)
        };

        console.log("Request body:", JSON.stringify(requestBody, null, 2));
        console.log("=== END DEBUG ===");

        return this.makeRequest('/vehicles/dispense', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
        });
    }


    // Record fuel transaction (if you have this endpoint)
    async recordFuelTransaction(transactionData) {
        return this.makeRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });
    }
}

export const apiService = new ApiService();
