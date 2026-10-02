import { http } from './http';

// Module catalog de l'API : /categories et /materials

export const getCategories = async () => (await http.get('/categories')).data;

export const getCategoriesWithMaterials = async () =>
  (await http.get('/categories/categories-with-materials')).data;

export const createCategory = async (data) => (await http.post('/categories', data)).data;

export const updateCategory = async (id, data) => (await http.put(`/categories/${id}`, data)).data;

export const deleteCategory = async (id) => (await http.delete(`/categories/${id}`)).data;

export const getMaterials = async () => (await http.get('/materials')).data;

export const getMaterialById = async (id) => (await http.get(`/materials/${id}`)).data;

export const createMaterial = async (data) => (await http.post('/materials', data)).data;

export const updateMaterial = async (id, data) => (await http.put(`/materials/${id}`, data)).data;

export const deleteMaterial = async (id) => {
  await http.delete(`/materials/${id}`);
};
