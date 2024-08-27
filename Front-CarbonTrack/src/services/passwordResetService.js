import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/password-reset/request-password-reset`, { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to request password reset');
    }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/password-reset/reset-password`, {
            token,
            newPassword,
            confirmPassword
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
};