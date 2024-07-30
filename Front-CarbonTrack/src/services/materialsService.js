// src/services/materialsService.js
import axios from 'axios';
import { getToken, getHeaders } from '../helpers/token';

const API_BASE_URL = 'http://localhost:3000';

export const getMaterials = async () => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  try {
    const response = await axios.get(`${API_BASE_URL}/materials`, {
      headers: getHeaders(token)
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch materials');
  }
};

export const createMaterial = async (newData) => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  try {
    const response = await axios.post(`${API_BASE_URL}/materials`, newData, {
      headers: getHeaders(token)
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create material');
  }
};

export const updateMaterial = async (id, updatedData) => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  try {
    const response = await axios.put(`${API_BASE_URL}/materials/${id}`, updatedData, {
      headers: getHeaders(token)
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update material');
  }
};

export const deleteMaterial = async (id) => {
  const tokenData = getToken();
  if (!tokenData) throw new Error('Token not found');

  const { token } = tokenData;

  try {
    const response = await axios.delete(`${API_BASE_URL}/materials/${id}`, {
      headers: getHeaders(token)
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete material');
  }
};