import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const loadStoredUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const token = await AsyncStorage.getItem('token');

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load authentication state:', e);
            } finally {
                setLoading(false);
            }
        };

        loadStoredUser();
    }, []);

    const signIn = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await login(username, password);
            const { user, token } = response;

            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', token);

            setUser(user);
            return true;
        } catch (e) {
            setError(e.message || 'Failed to sign in');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (e) {
            console.error('Failed to sign out:', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};