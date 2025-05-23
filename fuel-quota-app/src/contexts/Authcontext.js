import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('authToken');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                apiService.setAuthToken(storedToken);
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            // For now, use mock login since backend might not be ready
            const mockResponse = {
                data: {
                    token: 'mock-jwt-token-12345',
                    user: {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: credentials.email,
                        stationName: 'Main Fuel Station',
                        stationId: 1,
                        role: 'OPERATOR'
                    }
                }
            };

            const { token: authToken, user: userData } = mockResponse.data;

            // Store token securely
            await SecureStore.setItemAsync('authToken', authToken);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);
            apiService.setAuthToken(authToken);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            await AsyncStorage.removeItem('user');

            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            apiService.setAuthToken(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};