import * as usersService from './users.service.js';

export const usersController = {
  async getProfile(req, res) {
    res.json({ user: await usersService.getProfile(req.user.id) });
  },

  async list(req, res) {
    res.json({ users: await usersService.listUsers() });
  },

  async updateProfile(req, res) {
    res.json({ user: await usersService.updateProfile(req.user.id, req.valid.body) });
  },

  async deleteAccount(req, res) {
    await usersService.deleteAccount(req.user.id);
    res.json({ message: 'Compte et projets supprimés' });
  },
};
