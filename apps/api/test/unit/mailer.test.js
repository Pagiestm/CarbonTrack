import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const transport = { sendMail: vi.fn() };
const createTransport = vi.fn(() => transport);

vi.mock('nodemailer', () => ({ default: { createTransport } }));
vi.mock('mjml', () => ({ default: vi.fn() }));

const charger = async (port) => {
  vi.resetModules();
  vi.stubEnv('SMTP_HOST', 'smtp.example.test');
  vi.stubEnv('SMTP_PORT', String(port));
  return import('../../src/shared/mail/mailer.js');
};

describe('sendMail', () => {
  beforeEach(() => {
    createTransport.mockClear();
    transport.sendMail.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('borne la connexion SMTP dans le temps', async () => {
    const { sendMail } = await charger(2525);
    transport.sendMail.mockResolvedValue({});

    await sendMail({ to: 'a@b.fr', subject: 'S', html: '<p>x</p>' });

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 2525,
        secure: false,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      }),
    );
  });

  it('passe en TLS direct sur le port 465', async () => {
    const { sendMail } = await charger(465);
    transport.sendMail.mockResolvedValue({});

    await sendMail({ to: 'a@b.fr', subject: 'S', html: '<p>x</p>' });

    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: true }));
  });

  it('transforme un échec d’envoi en erreur 503 lisible', async () => {
    const { sendMail } = await charger(2525);
    transport.sendMail.mockRejectedValue(new Error('Connection timeout'));

    await expect(sendMail({ to: 'a@b.fr', subject: 'S', html: '' })).rejects.toMatchObject({
      status: 503,
      message: "L'email n'a pas pu être envoyé, réessayez dans quelques minutes",
    });
  });
});
