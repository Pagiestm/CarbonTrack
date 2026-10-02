import { http } from './http';

// Module projects de l'API : /projects

export const getProjects = async () => (await http.get('/projects')).data;

export const getProjectById = async (id) => (await http.get(`/projects/${id}`)).data;

export const getAllProjectsForAdmin = async () => (await http.get('/projects/admin/projects')).data;

export const createProject = async (projectData) =>
  (await http.post('/projects', projectData)).data;

export const updateProject = async (id, projectData) =>
  (await http.put(`/projects/${id}`, projectData)).data;

export const deleteProject = async (id) => {
  await http.delete(`/projects/${id}`);
};
