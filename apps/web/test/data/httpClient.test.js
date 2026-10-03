import { describe, expect, it } from 'vitest';
import { createHttpClient, DELAI_MAX_MS } from '@/data/http/httpClient.js';

const clientQuiEchoue = (erreur) => {
  const client = createHttpClient({ baseURL: 'http://api.test', getToken: () => null });
  client.defaults.adapter = (config) => Promise.reject(Object.assign(erreur, { config }));
  return client;
};

describe('createHttpClient', () => {
  it('abandonne une requête au bout du délai maximum', () => {
    const client = createHttpClient({ baseURL: 'http://api.test', getToken: () => null });

    expect(client.defaults.timeout).toBe(DELAI_MAX_MS);
  });

  it('explique une requête expirée', async () => {
    const expiree = Object.assign(new Error('timeout of 60000ms exceeded'), {
      code: 'ECONNABORTED',
    });

    await expect(clientQuiEchoue(expiree).get('/contact')).rejects.toThrow(
      'Le serveur met trop de temps à répondre, veuillez réessayer',
    );
  });

  it("garde le message de l'API quand il y en a un", async () => {
    const refusee = Object.assign(new Error('Request failed'), {
      response: { status: 503, data: { error: "L'email n'a pas pu être envoyé" } },
    });

    await expect(clientQuiEchoue(refusee).post('/contact')).rejects.toMatchObject({
      message: "L'email n'a pas pu être envoyé",
      status: 503,
    });
  });
});
