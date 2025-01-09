import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './authContext';

const AuthForm = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      if (isLogin) {
        await login({ username, password });
        Alert.alert('Login Successful', `Welcome back, ${username}!`);
      } else {
        await register({ username, email, password });
        Alert.alert('Registration Successful', `Welcome, ${username}!`);
      }
    } catch (err: any) {
      const errorMessage = err?.non_field_errors?.[0] || 'An unexpected error occurred';
      setError(errorMessage);
      Alert.alert(
        isLogin ? 'Login Failed' : 'Registration Failed', 
        errorMessage
      );
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {!isLogin && (
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      )}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
      <TouchableOpacity onPress={toggleForm}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  toggleText: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center'
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray'
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  }
});

export default AuthForm;

