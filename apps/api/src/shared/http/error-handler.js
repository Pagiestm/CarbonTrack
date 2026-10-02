import { HttpError } from './errors.js';

// Codes Prisma traduits en réponse HTTP plutôt qu'en erreur 500.
const prismaErrors = {
  P2002: [409, 'Cette valeur est déjà utilisée'],
  P2003: [409, 'Cette ressource est encore utilisée ailleurs'],
  P2025: [404, 'Ressource introuvable'],
};

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route introuvable' });
}

// eslint-disable-next-line no-unused-vars -- Express reconnaît un gestionnaire d'erreurs à ses quatre arguments
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ error: err.message, ...(err.details && { details: err.details }) });
  }

  if (err?.name === 'PrismaClientKnownRequestError' && prismaErrors[err.code]) {
    const [status, message] = prismaErrors[err.code];
    return res.status(status).json({ error: message });
  }

  // Corps JSON illisible, corps trop gros… : erreurs levées par express.json
  if (err?.expose && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: 'Requête invalide' });
  }

  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
}
