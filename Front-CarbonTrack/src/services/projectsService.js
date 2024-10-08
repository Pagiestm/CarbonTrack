// src/services/projectService.js
import axios from 'axios';
import { getToken, getHeaders } from '../helpers/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProjects = async () => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.get(`${API_BASE_URL}/projects`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch projects');
    }
};

export const getProjectById = async (id) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch project');
    }
};

export const getAllProjectsForAdmin = async () => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.get(`${API_BASE_URL}/projects/admin/projects`, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch projects for admin');
    }
};

export const createProject = async (projectData) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.post(`${API_BASE_URL}/projects`, projectData, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create project');
    }
};

export const updateProject = async (id, projectData) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        const response = await axios.put(`${API_BASE_URL}/projects/${id}`, projectData, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update project');
    }
};

export const deleteProject = async (id) => {
    const tokenData = getToken();
    if (!tokenData) throw new Error('Token not found');

    const { token } = tokenData;

    try {
        await axios.delete(`${API_BASE_URL}/projects/${id}`, {
            headers: getHeaders(token)
        });
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
};