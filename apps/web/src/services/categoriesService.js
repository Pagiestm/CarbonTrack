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

export const createCategory = async (data) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.post(`${API_BASE_URL}/categories`, data, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create category');
    }
};

export const updateCategory = async (id, data) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.put(`${API_BASE_URL}/categories/${id}`, data, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update category');
    }
};

export const deleteCategory = async (id) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete category');
    }
};