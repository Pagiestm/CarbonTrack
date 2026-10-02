import * as projectsService from './projects.service.js';

export const projectsController = {
  async list(req, res) {
    res.json(await projectsService.listProjects(req.user.id, req.valid.query));
  },

  async listAll(req, res) {
    res.json(await projectsService.listAllProjects(req.valid.query));
  },

  async get(req, res) {
    res.json(await projectsService.getProject(req.valid.params.id, req.user.id));
  },

  async create(req, res) {
    res.status(201).json(await projectsService.createProject(req.user.id, req.valid.body));
  },

  async update(req, res) {
    res.json(await projectsService.updateProject(req.valid.params.id, req.user.id, req.valid.body));
  },

  async remove(req, res) {
    await projectsService.deleteProject(req.valid.params.id, req.user.id);
    res.status(204).end();
  },
};
