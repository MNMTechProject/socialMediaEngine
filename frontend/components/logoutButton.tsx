import React from 'react';
import { Button, Alert } from 'react-native';
import { useAuth } from '../app/(auth)/authContext';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            Alert.alert("Logged Out", "You have been successfully logged out.");
        } catch (error) {
            Alert.alert("Logout Failed", "Failed to log out. Please try again.");
        }
    };

    return (
        <Button title="Logout" onPress={handleLogout} />
    );
};

export default LogoutButton;
