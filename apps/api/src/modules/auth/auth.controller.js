import { env } from '../../config/env.js';
import * as authService from './auth.service.js';
import * as passwordResetService from './password-reset.service.js';
import { googleAuthUrl } from './google.client.js';

export const authController = {
  async register(req, res) {
    const user = await authService.register(req.valid.body);
    res.status(201).json({ user });
  },

  async login(req, res) {
    res.json(await authService.login(req.valid.body));
  },

  googleRedirect(req, res) {
    res.redirect(googleAuthUrl());
  },

  // Le client lit le jeton dans l'URL de retour ; en cas d'échec (refus de
  // l'utilisateur, code expiré…), il revient simplement sur l'accueil.
  async googleCallback(req, res) {
    const { code } = req.query;
    if (typeof code !== 'string' || !code) {
      return res.redirect(env.FRONTEND_URL);
    }
    try {
      const { token } = await authService.loginWithGoogle(code);
      res.redirect(`${env.FRONTEND_URL}?token=${token}`);
    } catch (error) {
      console.error('Connexion Google échouée :', error.message);
      res.redirect(env.FRONTEND_URL);
    }
  },
};

export const passwordResetController = {
  async request(req, res) {
    res.json(await passwordResetService.requestPasswordReset(req.valid.body.email));
  },

  async checkToken(req, res) {
    res.json(await passwordResetService.checkToken(req.valid.body.token));
  },

  async reset(req, res) {
    res.json(await passwordResetService.resetPassword(req.valid.body));
  },
};
