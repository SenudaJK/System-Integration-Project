import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
    // Secure storage for sensitive data
    async setSecureItem(key, value) {
        try {
            if (Platform.OS === 'web') {
                // Use localStorage for web (less secure but functional)
                localStorage.setItem(`secure_${key}`, value);
                return true;
            } else {
                // Use SecureStore for mobile
                await SecureStore.setItemAsync(key, value);
                return true;
            }
        } catch (error) {
            console.error("Error setting secure item:", error);
            return false;
        }
    }

    async getSecureItem(key) {
        try {
            if (Platform.OS === 'web') {
                // Use localStorage for web
                return localStorage.getItem(`secure_${key}`);
            } else {
                // Use SecureStore for mobile
                return await SecureStore.getItemAsync(key);
            }
        } catch (error) {
            console.error("Error getting secure item:", error);
            return null;
        }
    }

    async deleteSecureItem(key) {
        try {
            if (Platform.OS === 'web') {
                // Use localStorage for web
                localStorage.removeItem(`secure_${key}`);
                return true;
            } else {
                // Use SecureStore for mobile
                await SecureStore.deleteItemAsync(key);
                return true;
            }
        } catch (error) {
            console.error("Error deleting secure item:", error);
            return false;
        }
    }

    // Regular storage for non-sensitive data
    async setItem(key, value) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (error) {
            console.error("Error setting item:", error);
            return false;
        }
    }

    async getItem(key) {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error("Error getting item:", error);
            return null;
        }
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error("Error removing item:", error);
            return false;
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
            if (Platform.OS === 'web') {
                // Clear localStorage items with secure_ prefix
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('secure_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            return true;
        } catch (error) {
            console.error("Error clearing storage:", error);
            return false;
        }
    }

    // Auth related storage
    async saveAuthData(token, user) {
        const tokenSaved = await this.setSecureItem("authToken", token);
        const userSaved = await this.setItem("userData", user);
        return tokenSaved && userSaved;
    }

    async getAuthData() {
        const token = await this.getSecureItem("authToken");
        const user = await this.getItem("userData");
        return { token, user };
    }

    async clearAuthData() {
        const tokenCleared = await this.deleteSecureItem("authToken");
        const userCleared = await this.removeItem("userData");
        return tokenCleared && userCleared;
    }

    // App settings
    async saveSettings(settings) {
        return await this.setItem("appSettings", settings);
    }

    async getSettings() {
        return await this.getItem("appSettings");
    }

    // Transaction cache
    async cacheTransactions(transactions) {
        return await this.setItem("cachedTransactions", transactions);
    }

    async getCachedTransactions() {
        return await this.getItem("cachedTransactions");
    }
}

export const storageService = new StorageService();