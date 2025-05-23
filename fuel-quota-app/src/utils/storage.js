import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
    // Secure storage for sensitive data
    async setSecureItem(key, value) {
        try {
            await SecureStore.setItemAsync(key, value);
            return true;
        } catch (error) {
            console.error("Error setting secure item:", error);
            return false;
        }
    }

    async getSecureItem(key) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error("Error getting secure item:", error);
            return null;
        }
    }

    async deleteSecureItem(key) {
        try {
            await SecureStore.deleteItemAsync(key);
            return true;
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

    async clearCache() {
        const keys = ["cachedTransactions"];
        const promises = keys.map((key) => this.removeItem(key));
        const results = await Promise.all(promises);
        return results.every((result) => result === true);
    }
}

export const storageService = new StorageService();
