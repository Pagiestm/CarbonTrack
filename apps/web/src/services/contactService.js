// src/services/contactService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendContactMessage = async (contactData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact`, contactData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send contact message');
  }
};