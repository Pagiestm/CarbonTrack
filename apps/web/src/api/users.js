import { http } from './http';

// Module users de l'API : /profile

export const getUserProfile = async () => (await http.get('/profile')).data.user;

export const updateUserProfile = async (userData) =>
  (await http.put('/profile', userData)).data.user;

export const deleteUserAccount = async () => (await http.delete('/profile')).data.message;

export const getAllUsers = async () => (await http.get('/profile/admin/users')).data.users;
