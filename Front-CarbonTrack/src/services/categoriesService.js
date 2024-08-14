// src/services/materialsService.js
import axios from 'axios';
import { getToken, getHeaders } from '../helpers/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async () => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.get(`${API_BASE_URL}/categories`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
};

export const getCategoriesWithMaterials = async () => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.get(`${API_BASE_URL}/categories/categories-with-materials`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch categories with materials');
    }
};