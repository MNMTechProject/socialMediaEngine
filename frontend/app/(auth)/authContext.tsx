import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { loginUser, registerUser } from './api';

const API_URL = 'http://127.0.0.1:8000/api/user'; // Change this to your actual backend URL

// Define Type for User
interface User {
    username: string;
    email?: string;
    id?: string;
    // Add other user properties
}

// Define a type for the context's value
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => Promise<boolean>;
    login: (userData: { username: string; password: string }) => Promise<void>;
    register: (userData: { username: string; email: string; password: string }) => Promise<void>;
}

// Create Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const [token, username] = await Promise.all([
                    AsyncStorage.getItem('token'),
                    AsyncStorage.getItem('username')
                ]);
                
                console.log("Auth Init - Stored values:", { token, username });

                if (token && username) {
                    setIsAuthenticated(true);
                    setUser({ username });
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };

        checkToken();
    }, []);

    const login = async (userData: { username: string; password: string }) => {
        try {
            const result = await loginUser(userData);
            const { access: token, refresh: refreshToken } = result.tokens;
            const username = result.user.username;

            await AsyncStorage.multiSet([
                ['token', token],
                ['refreshToken', refreshToken],
                ['username', username]
            ]);

            setUser({ username });
            setIsAuthenticated(true);
            router.replace(`/(tabs)/${username}`, { username });
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: { username: string; email: string; password: string }) => {
        try {
            const result = await registerUser(userData);
            const { access: token, refresh: refreshToken } = result.tokens;
            const username = result.user.username;

            await AsyncStorage.multiSet([
                ['token', token],
                ['refreshToken', refreshToken],
                ['username', username]
            ]);

            setUser({ username });
            setIsAuthenticated(true);
            router.replace(`/(tabs)/${username}`, { username });
        } catch (error) {
            throw error;
        }
    };

    // Add this inside the AuthProvider component in AuthContext.js
    const logout = async () => {
        try {
            // Get the refresh token from storage
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const token = await AsyncStorage.getItem('token');

            // Make the logout request to the backend
            if (refreshToken && token) {
                await axios.post(`${API_URL}/logout/`, {
                    refresh_token: refreshToken
                }, {
                    headers: {
                        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
                    }
                });
            }
            
            // Clear tokens from storage
            await AsyncStorage.multiRemove([
                'token',
                'refreshToken', 
                'username'
            ]);
    
            // Additional cleanup if needed
            // For example, reset your authentication state if you're using a state management solution
            setIsAuthenticated(false);
            setUser(null);
            console.log("Successfully logged out");
            router.replace('/(auth)/login');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
             // Clear tokens from storage
            await AsyncStorage.multiRemove([
                'token',
                'refreshToken', 
                'username'
            ]);
    
            // Additional cleanup if needed
            // For example, reset your authentication state if you're using a state management solution
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/(auth)/login');

            throw error;
        }
    };

    // Provide the type here
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, login, logout, register }}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
