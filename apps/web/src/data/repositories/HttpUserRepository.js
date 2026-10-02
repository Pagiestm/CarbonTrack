import { UserRepository } from '@/domain/repositories/index.js';
import { toPage, toUser } from '@/data/models/index.js';

export class HttpUserRepository extends UserRepository {
  constructor({ http }) {
    super();
    this.http = http;
  }

  async profile() {
    const { data } = await this.http.get('/profile');
    return toUser(data.user ?? data);
  }

  async updateProfile(champs) {
    const { data } = await this.http.put('/profile', champs);
    return toUser(data.user ?? data);
  }

  async deleteAccount() {
    await this.http.delete('/profile');
  }

  async listAll(options = {}) {
    const { data } = await this.http.get('/profile/admin/users', { params: options });
    return toPage(data, toUser);
  }

  async changePassword(champs) {
    const { data } = await this.http.put('/profile/password', champs);
    return data.message;
  }

  async changeRole(id, role) {
    const { data } = await this.http.put(`/profile/admin/users/${id}/role`, { role });
    return toUser(data.user ?? data);
  }

  async removeUser(id) {
    await this.http.delete(`/profile/admin/users/${id}`);
  }
}
