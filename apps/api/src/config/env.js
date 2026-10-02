import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, { error: 'JWT_SECRET doit faire au moins 32 caractères' }),

  FRONTEND_URL: z.url().optional(),
  DEV_FRONTEND_URL: z.url().optional(),
  PROD_FRONTEND_URL: z.url().optional(),

  EMAIL_USER: z.string().optional(),
  CONTACT_EMAIL: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.url().optional(),
});

const provided = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ''),
);

const parsed = schema.safeParse(provided);

if (!parsed.success) {
  const lines = parsed.error.issues.map(
    (issue) => `  - ${issue.path.join('.')} : ${issue.message}`,
  );
  throw new Error(`Configuration invalide :\n${lines.join('\n')}`);
}

const raw = parsed.data;

export const env = {
  ...raw,
  FRONTEND_URL:
    raw.FRONTEND_URL ??
    (raw.NODE_ENV === 'production' ? raw.PROD_FRONTEND_URL : raw.DEV_FRONTEND_URL) ??
    'http://localhost:5173',
  isProduction: raw.NODE_ENV === 'production',
};
