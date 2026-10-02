import * as usersService from './users.service.js';

export const usersController = {
  async getProfile(req, res) {
    res.json({ user: await usersService.getProfile(req.user.id) });
  },

  async list(req, res) {
    res.json(await usersService.listUsers(req.valid.query));
  },

  async updateProfile(req, res) {
    res.json({ user: await usersService.updateProfile(req.user.id, req.valid.body) });
  },

  async deleteAccount(req, res) {
    await usersService.deleteAccount(req.user.id);
    res.json({ message: 'Compte et projets supprimés' });
  },

  async changePassword(req, res) {
    res.json(await usersService.changePassword(req.user.id, req.valid.body));
  },

  async changeRole(req, res) {
    const user = await usersService.changeRole(
      req.user.id,
      req.valid.params.id,
      req.valid.body.role,
    );
    res.json({ user });
  },

  async deleteUser(req, res) {
    await usersService.deleteUser(req.user.id, req.valid.params.id);
    res.json({ message: 'Compte supprimé' });
  },
};
