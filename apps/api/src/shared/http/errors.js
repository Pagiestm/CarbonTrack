// Erreur métier portant son statut HTTP. Les services la lèvent, le
// gestionnaire d'erreurs la traduit en réponse { error, details? }.
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const unauthorized = (message = 'Authentification requise') => new HttpError(401, message);
export const forbidden = (message = 'Accès refusé') => new HttpError(403, message);
export const notFound = (message = 'Ressource introuvable') => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
