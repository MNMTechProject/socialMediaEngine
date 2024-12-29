import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/user'; // Change this to your actual backend URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response.data);
    throw error.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, userData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error.response.data;
  }
};