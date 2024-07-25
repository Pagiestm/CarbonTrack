// src/services/userService.js
import axios from 'axios';
import { getToken, getHeaders } from '../helpers/token';

const API_BASE_URL = 'http://localhost:3000';

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
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const getUserProfile = async () => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token, decodedToken } = tokenData;
  const userId = decodedToken.userId;

  const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
    headers: getHeaders(token)
  });
  return response.data.user;
};

export const updateUserProfile = async (userData) => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token, decodedToken } = tokenData;
  const userId = decodedToken.userId;

  const response = await axios.put(`${API_BASE_URL}/profile/${userId}`, userData, {
    headers: getHeaders(token)
  });
  return response.data.user;
};
