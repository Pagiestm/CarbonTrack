// src/services/userService.js
import axios from 'axios';
import { getToken, getHeaders } from '../helpers/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    
    const userProfile = response.data.user;
    localStorage.setItem('role', userProfile.role);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const getUserProfile = async () => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: getHeaders(token)
  });
  return response.data.user;
};

export const updateUserProfile = async (userData) => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  const response = await axios.put(`${API_BASE_URL}/profile`, userData, {
    headers: getHeaders(token)
  });
  return response.data.user;
};
