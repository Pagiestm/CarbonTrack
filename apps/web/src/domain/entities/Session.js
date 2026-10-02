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
