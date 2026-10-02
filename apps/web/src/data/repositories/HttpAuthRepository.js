import { AuthRepository } from '@/domain/repositories/index.js';
import { toSession, toUser } from '@/data/models/index.js';

export class HttpAuthRepository extends AuthRepository {
  constructor({ http, apiBaseUrl }) {
    super();
    this.http = http;
    this.apiBaseUrl = apiBaseUrl;
  }

  async login({ email, password }) {
    const { data } = await this.http.post('/auth/login', { email, password });
    return toSession(data.token);
  }

  async register({ name, email, password }) {
    const { data } = await this.http.post('/auth/register', { name, email, password });
    return toUser(data.user);
  }

  googleRedirectUrl() {
    return `${this.apiBaseUrl}/auth/google`;
  }

  async requestPasswordReset(email) {
    const { data } = await this.http.post('/password-reset/request-password-reset', { email });
    return data.message;
  }

  async checkResetToken(token) {
    const { data } = await this.http.post('/password-reset/check-token', { token });
    return data.message;
  }

  async resetPassword({ token, newPassword, confirmPassword }) {
    const { data } = await this.http.post('/password-reset/reset-password', {
      token,
      newPassword,
      confirmPassword,
    });
    return data.message;
  }
}
