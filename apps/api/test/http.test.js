import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { signAccessToken, signResetToken } from '../src/shared/auth/tokens.js';

// Ces requêtes s'arrêtent avant la base : authentification, droits,
// validation et routes inconnues.
const app = createApp();
const userToken = signAccessToken({ id: 1, role: 'USER' });
const adminToken = signAccessToken({ id: 2, role: 'ADMIN' });

describe('API', () => {
  it('GET /health répond', async () => {
    await request(app).get('/health').expect(200, { status: 'ok' });
  });

  it('une route inconnue renvoie 404 en JSON', async () => {
    const res = await request(app).get('/nope').expect(404);
    expect(res.body.error).toBeTypeOf('string');
  });

  it('un JSON mal formé renvoie 400', async () => {
    await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send('{bad')
      .expect(400);
  });

  describe('authentification', () => {
    it('sans jeton : 401', async () => {
      await request(app).get('/projects').expect(401);
    });

    it('jeton invalide : 401', async () => {
      await request(app).get('/projects').set('Authorization', 'Bearer abc').expect(401);
    });

    it('un jeton de réinitialisation ne donne pas accès à l’API', async () => {
      await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${signResetToken({ id: 1 })}`)
        .expect(401);
    });

    it('route admin avec un compte utilisateur : 403', async () => {
      for (const path of ['/profile/admin/users', '/projects/admin/projects']) {
        await request(app).get(path).set('Authorization', `Bearer ${userToken}`).expect(403);
      }
      await request(app)
        .post('/materials')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(403);
    });
  });

  describe('validation', () => {
    it('inscription avec un mot de passe faible : 400 avec le détail', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'a@b.fr', password: 'faible', name: 'A' })
        .expect(400);
      expect(res.body.details[0].field).toBe('password');
    });

    it('identifiant non numérique : 400', async () => {
      await request(app)
        .get('/materials/abc')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });

    it('matériau incomplet : 400', async () => {
      await request(app)
        .post('/materials')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'x' })
        .expect(400);
    });

    it('réinitialisation avec des mots de passe différents : 400', async () => {
      const res = await request(app)
        .post('/password-reset/reset-password')
        .send({ token: 't', newPassword: 'Azerty123*', confirmPassword: 'Azerty123+' })
        .expect(400);
      expect(res.body.details[0].field).toBe('confirmPassword');
    });

    it('contact sans message : 400', async () => {
      await request(app).post('/contact').send({ name: 'A', email: 'a@b.fr' }).expect(400);
    });
  });
});
