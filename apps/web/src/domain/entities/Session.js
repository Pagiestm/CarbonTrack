/**
 * La session courante, telle que le client la connaît : un jeton et ce qu'il
 * contient. La vérification de signature appartient à l'API ; ici on ne lit
 * que de quoi afficher et router.
 */
export class Session {
  constructor({ token, userId, role, expiresAt }) {
    this.token = token;
    this.userId = userId;
    this.role = role;
    this.expiresAt = expiresAt;
  }

  get isExpired() {
    return this.expiresAt <= Date.now();
  }

  get isValid() {
    return Boolean(this.token) && !this.isExpired;
  }

  get isAdmin() {
    return this.role === 'ADMIN';
  }
}
